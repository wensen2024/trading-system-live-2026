import { useState } from 'react';
import { Plus, Trash2, DollarSign, Target } from 'lucide-react';

interface Position {
  id: string;
  code: string;
  name: string;
  market: string;
  buyPrice: number;
  currentPrice: number;
  shares: number;
  buyDate: string;
  targetPrice: number;
  stopLoss: number;
}

const defaultPositions: Position[] = [
  { id: '1', code: '300750', name: '宁德时代', market: 'A股', buyPrice: 218.50, currentPrice: 231.40, shares: 100, buyDate: '2025-01-06', targetPrice: 255.00, stopLoss: 208.00 },
  { id: '2', code: '00700', name: '腾讯控股', market: '港股', buyPrice: 398.20, currentPrice: 421.60, shares: 200, buyDate: '2025-01-07', targetPrice: 460.00, stopLoss: 378.00 },
  { id: '3', code: '688981', name: '中芯国际', market: 'A股', buyPrice: 82.30, currentPrice: 79.10, shares: 300, buyDate: '2025-01-08', targetPrice: 95.00, stopLoss: 76.00 },
];

export default function PortfolioTracker() {
  const [positions, setPositions] = useState<Position[]>(defaultPositions);
  const [showAdd, setShowAdd] = useState(false);
  const [newPos, setNewPos] = useState({
    code: '', name: '', market: 'A股',
    buyPrice: '', currentPrice: '', shares: '',
    targetPrice: '', stopLoss: ''
  });

  const totalCost = positions.reduce((sum, p) => sum + p.buyPrice * p.shares, 0);
  const totalValue = positions.reduce((sum, p) => sum + p.currentPrice * p.shares, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPct = (totalPnl / totalCost) * 100;

  const handleAdd = () => {
    if (!newPos.code || !newPos.name || !newPos.buyPrice) return;
    const pos: Position = {
      id: Date.now().toString(),
      code: newPos.code,
      name: newPos.name,
      market: newPos.market,
      buyPrice: parseFloat(newPos.buyPrice),
      currentPrice: parseFloat(newPos.currentPrice) || parseFloat(newPos.buyPrice),
      shares: parseInt(newPos.shares) || 100,
      buyDate: new Date().toISOString().split('T')[0],
      targetPrice: parseFloat(newPos.targetPrice) || parseFloat(newPos.buyPrice) * 1.1,
      stopLoss: parseFloat(newPos.stopLoss) || parseFloat(newPos.buyPrice) * 0.93,
    };
    setPositions(prev => [...prev, pos]);
    setNewPos({ code: '', name: '', market: 'A股', buyPrice: '', currentPrice: '', shares: '', targetPrice: '', stopLoss: '' });
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    setPositions(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-bold text-sm">持仓跟踪 & 盈亏统计</span>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg text-xs font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          添加持仓
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <div className="text-gray-400 text-xs mb-1">总持仓成本</div>
          <div className="text-white font-bold text-base">
            {totalCost.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <div className="text-gray-400 text-xs mb-1">当前市值</div>
          <div className="text-white font-bold text-base">
            {totalValue.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className={`rounded-xl p-3 text-center border ${totalPnl >= 0 ? 'bg-red-900/30 border-red-800/50' : 'bg-green-900/20 border-green-800/50'}`}>
          <div className="text-gray-400 text-xs mb-1">总盈亏</div>
          <div className={`font-bold text-base ${totalPnl >= 0 ? 'text-red-400' : 'text-green-400'}`}>
            {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(0)}
          </div>
          <div className={`text-xs ${totalPnl >= 0 ? 'text-red-400' : 'text-green-400'}`}>
            {totalPnlPct >= 0 ? '+' : ''}{totalPnlPct.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Add Position Form */}
      {showAdd && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 mb-4">
          <div className="text-white text-xs font-semibold mb-3">添加新持仓</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'code', label: '股票代码', placeholder: '如: 300750' },
              { key: 'name', label: '股票名称', placeholder: '如: 宁德时代' },
              { key: 'buyPrice', label: '买入价格', placeholder: '0.00' },
              { key: 'currentPrice', label: '当前价格', placeholder: '0.00' },
              { key: 'shares', label: '持股数量', placeholder: '100' },
              { key: 'targetPrice', label: '目标价格', placeholder: '0.00' },
              { key: 'stopLoss', label: '止损价格', placeholder: '0.00' },
            ].map(field => (
              <div key={field.key}>
                <label className="text-gray-400 text-xs block mb-1">{field.label}</label>
                <input
                  type="text"
                  value={(newPos as Record<string, string>)[field.key]}
                  onChange={e => setNewPos(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            ))}
            <div>
              <label className="text-gray-400 text-xs block mb-1">市场</label>
              <select
                value={newPos.market}
                onChange={e => setNewPos(prev => ({ ...prev, market: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="A股">A股</option>
                <option value="港股">港股</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-gray-400 text-xs hover:text-white">取消</button>
            <button onClick={handleAdd} className="px-4 py-1.5 bg-cyan-600 text-white rounded-lg text-xs font-semibold hover:bg-cyan-500">确认添加</button>
          </div>
        </div>
      )}

      {/* Positions Table */}
      <div className="space-y-2">
        {positions.map(pos => {
          const pnl = (pos.currentPrice - pos.buyPrice) * pos.shares;
          const pnlPct = ((pos.currentPrice - pos.buyPrice) / pos.buyPrice) * 100;
          const isUp = pnl >= 0;
          const progressToTarget = Math.min(100, ((pos.currentPrice - pos.buyPrice) / (pos.targetPrice - pos.buyPrice)) * 100);

          return (
            <div key={pos.id} className="bg-gray-800 rounded-xl p-3 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                    pos.market === 'A股' ? 'bg-red-900/50 text-red-400' : 'bg-blue-900/50 text-blue-400'
                  }`}>{pos.market}</div>
                  <span className="text-white font-bold text-sm">{pos.name}</span>
                  <span className="text-gray-500 text-xs">{pos.code}</span>
                </div>
                <button onClick={() => handleDelete(pos.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                <div>
                  <div className="text-gray-500">买入价</div>
                  <div className="text-white font-semibold">{pos.buyPrice.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-500">现价</div>
                  <div className={`font-semibold ${isUp ? 'text-red-400' : 'text-green-400'}`}>
                    {pos.currentPrice.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">盈亏</div>
                  <div className={`font-bold ${isUp ? 'text-red-400' : 'text-green-400'}`}>
                    {isUp ? '+' : ''}{pnl.toFixed(0)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">收益率</div>
                  <div className={`font-bold ${isUp ? 'text-red-400' : 'text-green-400'}`}>
                    {isUp ? '+' : ''}{pnlPct.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Progress to Target */}
              <div className="flex items-center gap-2">
                <Target className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${progressToTarget >= 0 ? 'bg-gradient-to-r from-yellow-600 to-orange-500' : 'bg-gray-600'}`}
                    style={{ width: `${Math.max(0, progressToTarget)}%` }}
                  />
                </div>
                <span className="text-gray-500 text-xs">→ {pos.targetPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mt-1 text-xs text-gray-600">
                <span>止损: {pos.stopLoss.toFixed(2)}</span>
                <span>持股: {pos.shares}股</span>
                <span>买入: {pos.buyDate}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
