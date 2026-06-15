import { X, Target, Shield, TrendingUp, TrendingDown, BarChart2, Zap, AlertCircle } from 'lucide-react';
import { Stock } from '../data/stockData';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

interface Props {
  stock: Stock;
  onClose: () => void;
}

function generateKlineData(stock: Stock) {
  const data = [];
  let price = stock.price * 0.88;
  for (let i = 20; i >= 0; i--) {
    const change = (Math.random() - 0.45) * price * 0.025;
    price = Math.max(price + change, 1);
    const open = price;
    const close = price + (Math.random() - 0.45) * price * 0.02;
    const high = Math.max(open, close) * (1 + Math.random() * 0.015);
    const low = Math.min(open, close) * (1 - Math.random() * 0.015);
    const d = new Date();
    d.setDate(d.getDate() - i);
    data.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      open: parseFloat(open.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000 + 500000),
      ma5: parseFloat((price * 0.99).toFixed(2)),
      ma10: parseFloat((price * 0.97).toFixed(2)),
      ma20: parseFloat((price * 0.95).toFixed(2)),
    });
  }
  // Last data point is current price
  data[data.length - 1].close = stock.price;
  data[data.length - 1].ma5 = stock.ma5;
  data[data.length - 1].ma10 = stock.ma10;
  data[data.length - 1].ma20 = stock.ma20;
  return data;
}

const SIGNAL_LABELS: Record<Stock['signal'], { label: string; color: string }> = {
  strong_buy: { label: '强烈买入', color: 'text-red-400' },
  buy: { label: '买入', color: 'text-orange-400' },
  hold: { label: '持有', color: 'text-yellow-400' },
  sell: { label: '卖出', color: 'text-cyan-400' },
  strong_sell: { label: '强烈卖出', color: 'text-green-400' },
};

export default function StockDetail({ stock, onClose }: Props) {
  const klineData = generateKlineData(stock);
  const signalCfg = SIGNAL_LABELS[stock.signal];
  const isUp = stock.changePct >= 0;
  const isBuy = stock.signal === 'strong_buy' || stock.signal === 'buy';

  const formatLargeNum = (n: number) => {
    if (n >= 10000) return (n / 10000).toFixed(2) + '万亿';
    if (n >= 1) return n.toFixed(2) + '亿';
    return (n * 100).toFixed(0) + '百万';
  };

  const indicators = [
    { name: 'MACD', value: stock.macd.toFixed(3), sub: `Signal: ${stock.macdSignal.toFixed(3)}`, status: stock.macd > stock.macdSignal ? 'bull' : 'bear' },
    { name: 'RSI(14)', value: stock.rsi.toFixed(1), sub: stock.rsi < 30 ? '超卖区间' : stock.rsi > 70 ? '超买区间' : '中性', status: stock.rsi < 40 ? 'bull' : stock.rsi > 65 ? 'bear' : 'neutral' },
    { name: 'KDJ-K', value: stock.kdj_k.toFixed(1), sub: `D:${stock.kdj_d.toFixed(1)} J:${stock.kdj_j.toFixed(1)}`, status: stock.kdj_k > stock.kdj_d ? 'bull' : 'bear' },
    { name: '量比', value: stock.volumeRatio.toFixed(2), sub: stock.volumeRatio > 2 ? '放量' : stock.volumeRatio < 0.7 ? '缩量' : '正常', status: stock.volumeRatio > 1.5 ? 'bull' : 'neutral' },
    { name: 'MA5', value: stock.ma5.toFixed(2), sub: `价格${stock.price > stock.ma5 ? '>' : '<'}均线`, status: stock.price > stock.ma5 ? 'bull' : 'bear' },
    { name: '布林上轨', value: stock.boll_upper.toFixed(2), sub: `中轨:${stock.boll_mid.toFixed(2)}`, status: stock.price > stock.boll_mid ? 'bull' : 'bear' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
              isBuy ? 'bg-gradient-to-br from-red-600 to-orange-600' : 'bg-gradient-to-br from-green-700 to-cyan-700'
            }`}>
              {stock.name.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-lg">{stock.name}</span>
                <span className="text-gray-400 text-sm">{stock.code}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                  stock.market === 'A股'
                    ? 'border-red-700 text-red-400 bg-red-900/30'
                    : 'border-blue-700 text-blue-400 bg-blue-900/30'
                }`}>{stock.market}</span>
              </div>
              <div className="text-gray-400 text-sm">{stock.sector} · {stock.industry}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Price & Signal Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-800 rounded-xl p-4 col-span-2">
              <div className={`text-4xl font-black ${isUp ? 'text-red-400' : 'text-green-400'}`}>
                {stock.price.toFixed(2)}
              </div>
              <div className={`flex items-center gap-2 mt-1 ${isUp ? 'text-red-400' : 'text-green-400'}`}>
                {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-lg font-bold">{isUp ? '+' : ''}{stock.change.toFixed(2)}</span>
                <span className="text-lg font-bold">({isUp ? '+' : ''}{stock.changePct.toFixed(2)}%)</span>
              </div>
              <div className="text-gray-500 text-xs mt-1">最后更新: {stock.lastUpdated}</div>
            </div>
            <div className={`rounded-xl p-4 border ${
              isBuy ? 'bg-red-900/40 border-red-700' : 'bg-green-900/30 border-green-700'
            }`}>
              <div className="text-gray-400 text-xs mb-1">AI 综合评分</div>
              <div className={`text-3xl font-black ${signalCfg.color}`}>{stock.score}</div>
              <div className={`text-sm font-bold ${signalCfg.color}`}>{signalCfg.label}</div>
              <div className="mt-2 h-1.5 bg-gray-700 rounded-full">
                <div
                  className={`h-full rounded-full ${isBuy ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-cyan-500 to-green-500'}`}
                  style={{ width: `${stock.score}%` }}
                />
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-xs mb-2">本周交易计划</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                  <span className="text-xs text-gray-400">目标价</span>
                  <span className="text-yellow-400 font-bold text-sm ml-auto">{stock.weekTarget.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="text-xs text-gray-400">止损价</span>
                  <span className="text-cyan-400 font-bold text-sm ml-auto">{stock.stopLoss.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <span className="text-xs text-gray-400">预期收益</span>
                  <span className={`font-bold text-sm ml-auto ${stock.expectedReturn >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {stock.expectedReturn >= 0 ? '+' : ''}{stock.expectedReturn.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span className="text-white text-sm font-semibold">K线走势 (20日)</span>
              <div className="flex items-center gap-3 ml-auto text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-yellow-400 inline-block" /> MA5</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-400 inline-block" /> MA10</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-purple-400 inline-block" /> MA20</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={klineData}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <YAxis domain={['auto', 'auto']} tick={{ fill: '#6b7280', fontSize: 10 }} width={50} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af' }}
                  itemStyle={{ color: '#f3f4f6' }}
                />
                <Area type="monotone" dataKey="close" stroke="#ef4444" fill="url(#priceGrad)" strokeWidth={2} name="收盘价" />
                <ReferenceLine y={stock.weekTarget} stroke="#fbbf24" strokeDasharray="5 5" label={{ value: '目标', fill: '#fbbf24', fontSize: 10 }} />
                <ReferenceLine y={stock.stopLoss} stroke="#22d3ee" strokeDasharray="5 5" label={{ value: '止损', fill: '#22d3ee', fontSize: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
            {/* Volume */}
            <ResponsiveContainer width="100%" height={60}>
              <BarChart data={klineData}>
                <Bar dataKey="volume" fill="#374151" name="成交量" />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Technical Indicators */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm font-semibold">技术指标分析</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {indicators.map(ind => (
                <div key={ind.name} className="bg-gray-900 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400 text-xs">{ind.name}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      ind.status === 'bull' ? 'bg-red-400' :
                      ind.status === 'bear' ? 'bg-green-400' : 'bg-yellow-400'
                    }`} />
                  </div>
                  <div className={`text-base font-bold ${
                    ind.status === 'bull' ? 'text-red-400' :
                    ind.status === 'bear' ? 'text-green-400' : 'text-yellow-400'
                  }`}>{ind.value}</div>
                  <div className="text-gray-600 text-xs">{ind.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Pattern Matching */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-cyan-400" />
              <span className="text-white text-sm font-semibold">AI智能匹配信号</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {stock.matchPattern.map((p, i) => (
                <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                  isBuy
                    ? 'bg-red-900/40 border-red-700 text-red-300'
                    : 'bg-cyan-900/30 border-cyan-700 text-cyan-300'
                }`}>
                  ✓ {p}
                </span>
              ))}
            </div>
            <div className="mt-3 p-3 bg-gray-900 rounded-lg">
              <p className="text-gray-300 text-xs leading-relaxed">
                <span className="text-yellow-400 font-bold">AI分析：</span>
                {stock.name}当前{stock.signal === 'strong_buy' ? '出现强烈买入信号，' : stock.signal === 'buy' ? '出现买入机会，' : stock.signal === 'hold' ? '建议持有观望，' : '建议减仓卖出，'}
                技术面{stock.price > stock.ma20 ? '强于' : '弱于'}20日均线，量比{stock.volumeRatio.toFixed(2)}倍
                {stock.volumeRatio > 1.5 ? '（放量）' : '（正常）'}，
                RSI={stock.rsi.toFixed(1)}{stock.rsi < 35 ? '处于超卖区间，反弹概率较高' : stock.rsi > 70 ? '处于超买区间，注意风险' : '处于中性区域'}。
                本周目标价 <span className="text-yellow-400 font-bold">{stock.weekTarget.toFixed(2)}</span>，
                止损价 <span className="text-cyan-400 font-bold">{stock.stopLoss.toFixed(2)}</span>，
                预期收益 <span className={stock.expectedReturn >= 0 ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>
                  {stock.expectedReturn >= 0 ? '+' : ''}{stock.expectedReturn.toFixed(2)}%
                </span>。
              </p>
            </div>
          </div>

          {/* Fundamental Data */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'PE市盈率', value: stock.pe.toFixed(1) + 'x' },
              { label: 'PB市净率', value: stock.pb.toFixed(2) + 'x' },
              { label: '市值', value: formatLargeNum(stock.marketCap) },
              { label: '52W高/低', value: `${stock.high52w.toFixed(2)}/${stock.low52w.toFixed(2)}` },
            ].map(item => (
              <div key={item.label} className="bg-gray-800 rounded-xl p-3">
                <div className="text-gray-500 text-xs mb-1">{item.label}</div>
                <div className="text-sm font-bold text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
