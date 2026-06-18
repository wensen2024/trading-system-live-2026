import { useState } from 'react';
import { Search, Zap, RefreshCw } from 'lucide-react';
import { Stock } from '../data/stockData';

interface Props {
  stocks: Stock[];
  onSelectStock: (stock: Stock) => void;
  scanProgress: number;
  isScanning: boolean;
  onScan: () => void;
  totalScanned: number;
}

const SIGNAL_CONFIG = {
  strong_buy: { label: '强烈买入', color: 'text-red-400', bg: 'bg-red-900/50', border: 'border-red-700', dot: 'bg-red-400' },
  buy: { label: '买入', color: 'text-orange-400', bg: 'bg-orange-900/50', border: 'border-orange-700', dot: 'bg-orange-400' },
  hold: { label: '持有', color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-700', dot: 'bg-yellow-400' },
  sell: { label: '卖出', color: 'text-cyan-400', bg: 'bg-cyan-900/30', border: 'border-cyan-700', dot: 'bg-cyan-400' },
  strong_sell: { label: '强烈卖出', color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-700', dot: 'bg-green-400' },
};

export default function StockScanner({ stocks, onSelectStock, scanProgress, isScanning, onScan, totalScanned }: Props) {
  const [filter, setFilter] = useState<'all' | 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell'>('all');
  const [marketFilter, setMarketFilter] = useState<'all' | 'A股' | '港股'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'changePct' | 'expectedReturn' | 'volumeRatio'>('score');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');

  const filtered = stocks
    .filter(s => {
      if (filter !== 'all' && s.signal !== filter) return false;
      if (marketFilter !== 'all' && s.market !== marketFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.code.includes(q) || s.sector.includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      const va = a[sortBy] as number;
      const vb = b[sortBy] as number;
      return sortDir === 'desc' ? vb - va : va - vb;
    });

  const strongBuyCount = stocks.filter(s => s.signal === 'strong_buy').length;
  const buyCount = stocks.filter(s => s.signal === 'buy').length;
  const sellCount = stocks.filter(s => s.signal === 'sell' || s.signal === 'strong_sell').length;

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-bold">AI智能扫股引擎</span>
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
              已扫 {totalScanned.toLocaleString()} / 7,983 只股票
            </span>
          </div>
          <button
            onClick={onScan}
            disabled={isScanning}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              isScanning
                ? 'bg-yellow-600 text-white cursor-not-allowed animate-pulse'
                : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? `扫描中 ${scanProgress}%` : '立即扫描'}
          </button>
        </div>

        {/* Progress Bar */}
        {isScanning && (
          <div className="mb-3">
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>正在扫描全市场 A股+港股...</span>
              <span>{scanProgress}%</span>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="bg-red-900/30 border border-red-800/50 rounded-lg p-2 text-center">
            <div className="text-red-400 font-bold text-lg">{strongBuyCount}</div>
            <div className="text-xs text-gray-400">强买信号</div>
          </div>
          <div className="bg-orange-900/30 border border-orange-800/50 rounded-lg p-2 text-center">
            <div className="text-orange-400 font-bold text-lg">{buyCount}</div>
            <div className="text-xs text-gray-400">买入信号</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-center">
            <div className="text-yellow-400 font-bold text-lg">{stocks.filter(s => s.signal === 'hold').length}</div>
            <div className="text-xs text-gray-400">持有观望</div>
          </div>
          <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-2 text-center">
            <div className="text-green-400 font-bold text-lg">{sellCount}</div>
            <div className="text-xs text-gray-400">卖出信号</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
            {(['all', 'A股', '港股'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMarketFilter(m)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  marketFilter === m
                    ? 'bg-cyan-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {m === 'all' ? '全市场' : m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
            {(['all', 'strong_buy', 'buy', 'hold', 'sell'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  filter === s
                    ? 'bg-cyan-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {s === 'all' ? '全部' : SIGNAL_CONFIG[s].label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索股票代码/名称..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Sort Headers */}
      <div className="grid grid-cols-12 gap-1 px-4 py-2 bg-gray-850 border-b border-gray-700 text-xs text-gray-500">
        <div className="col-span-3">股票</div>
        <div className="col-span-2 text-right cursor-pointer hover:text-white" onClick={() => toggleSort('score')}>
          AI评分 {sortBy === 'score' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
        </div>
        <div className="col-span-2 text-right cursor-pointer hover:text-white" onClick={() => toggleSort('changePct')}>
          涨跌幅 {sortBy === 'changePct' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
        </div>
        <div className="col-span-2 text-right cursor-pointer hover:text-white" onClick={() => toggleSort('expectedReturn')}>
          预期收益 {sortBy === 'expectedReturn' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
        </div>
        <div className="col-span-3 text-right">信号</div>
      </div>

      {/* Stock List */}
      <div className="overflow-y-auto max-h-[500px] divide-y divide-gray-800">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>无匹配股票</p>
          </div>
        ) : (
          filtered.slice(0, 300).map(stock => {
            const cfg = SIGNAL_CONFIG[stock.signal];
            const isUp = stock.changePct >= 0;
            return (
              <div
                key={`${stock.market}-${stock.code}`}
                onClick={() => onSelectStock(stock)}
                className="grid grid-cols-12 gap-1 px-4 py-2.5 hover:bg-gray-800 cursor-pointer transition-colors items-center"
              >
                {/* Stock Info */}
                <div className="col-span-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} flex-shrink-0`} />
                    <div>
                      <div className="text-white text-sm font-semibold">{stock.name}</div>
                      <div className="text-gray-500 text-xs">{stock.code} · {stock.market}</div>
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="col-span-2 text-right">
                  <div className={`inline-flex items-center justify-center w-10 h-6 rounded text-xs font-bold ${
                    stock.score >= 80 ? 'bg-red-900/60 text-red-400' :
                    stock.score >= 65 ? 'bg-orange-900/60 text-orange-400' :
                    stock.score >= 50 ? 'bg-yellow-900/60 text-yellow-400' :
                    'bg-gray-800 text-gray-400'
                  }`}>
                    {stock.score}
                  </div>
                </div>

                {/* Change */}
                <div className="col-span-2 text-right">
                  <div className={`text-sm font-semibold ${isUp ? 'text-red-400' : 'text-green-400'}`}>
                    {isUp ? '+' : ''}{stock.changePct.toFixed(2)}%
                  </div>
                  <div className="text-gray-500 text-xs">{stock.price.toFixed(2)}</div>
                </div>

                {/* Expected Return */}
                <div className="col-span-2 text-right">
                  <div className={`text-sm font-semibold ${stock.expectedReturn >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {stock.expectedReturn >= 0 ? '+' : ''}{stock.expectedReturn.toFixed(1)}%
                  </div>
                  <div className="text-gray-500 text-xs">本周目标</div>
                </div>

                {/* Signal */}
                <div className="col-span-3 text-right">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                    {cfg.label}
                  </span>
                  <div className="text-gray-600 text-xs mt-0.5">{stock.matchPattern[0]}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
