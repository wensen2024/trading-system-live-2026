import { TrendingUp, TrendingDown, BarChart2, Wifi } from 'lucide-react';
import { MarketIndex } from '../data/stockData';

interface Props {
  indices: MarketIndex[];
  isLive: boolean;
}

export default function MarketOverview({ indices, isLive }: Props) {
  const formatNum = (n: number, d = 2) =>
    n.toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formatBillion = (n: number) => {
    if (n >= 1e12) return (n / 1e12).toFixed(2) + '万亿';
    if (n >= 1e8) return (n / 1e8).toFixed(2) + '亿';
    return (n / 1e4).toFixed(2) + '万';
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-cyan-400" />
          <span className="text-white font-bold text-sm">实时大盘行情</span>
          {isLive && (
            <span className="flex items-center gap-1 text-xs text-green-400">
              <Wifi className="w-3 h-3 animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        <span className="text-gray-400 text-xs">数据源：东方财富/新浪/同花顺</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2">
        {indices.map((idx) => {
          const isUp = idx.changePct >= 0;
          return (
            <div
              key={idx.code}
              className={`rounded-lg p-3 border ${
                isUp
                  ? 'bg-red-950/40 border-red-800/50'
                  : 'bg-green-950/40 border-green-800/50'
              }`}
            >
              <div className="text-gray-300 text-xs mb-1 truncate">{idx.name}</div>
              <div className={`text-lg font-bold ${isUp ? 'text-red-400' : 'text-green-400'}`}>
                {formatNum(idx.value, idx.value > 1000 ? 2 : 3)}
              </div>
              <div className={`flex items-center gap-1 text-xs ${isUp ? 'text-red-400' : 'text-green-400'}`}>
                {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{isUp ? '+' : ''}{idx.changePct.toFixed(2)}%</span>
              </div>
              <div className="text-gray-500 text-xs mt-1">
                成交: {formatBillion(idx.turnover)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
