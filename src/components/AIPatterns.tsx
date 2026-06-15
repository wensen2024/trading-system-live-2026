import { Brain, Award, Activity } from 'lucide-react';
import { TRADING_PATTERNS } from '../data/stockData';

interface Props {
  activePattern: string;
  onSelectPattern: (id: string) => void;
  iterationCount: number;
  winRate: number;
}

export default function AIPatterns({ activePattern, onSelectPattern, iterationCount, winRate }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <span className="text-white font-bold text-sm">AI智能模式匹配</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-xs text-gray-400">迭代次数</div>
            <div className="text-yellow-400 font-bold text-sm">{iterationCount.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">综合胜率</div>
            <div className="text-green-400 font-bold text-sm">{winRate.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-xl p-3 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="text-purple-300 text-xs font-semibold">数据自动迭代引擎 — 运行中</span>
          <span className="ml-auto text-xs text-green-400 bg-green-900/40 px-2 py-0.5 rounded-full">● ACTIVE</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-white text-sm font-bold">A股</div>
            <div className="text-gray-400 text-xs">5,383只</div>
          </div>
          <div>
            <div className="text-white text-sm font-bold">港股</div>
            <div className="text-gray-400 text-xs">2,600只</div>
          </div>
          <div>
            <div className="text-white text-sm font-bold">全覆盖</div>
            <div className="text-gray-400 text-xs">7,983只</div>
          </div>
        </div>
      </div>

      {/* Pattern Cards */}
      <div className="grid grid-cols-2 gap-2">
        {TRADING_PATTERNS.map(pattern => (
          <button
            key={pattern.id}
            onClick={() => onSelectPattern(pattern.id)}
            className={`p-3 rounded-xl border text-left transition-all ${
              activePattern === pattern.id
                ? 'bg-gradient-to-br from-purple-900/60 to-blue-900/60 border-purple-500 shadow-lg shadow-purple-900/30'
                : 'bg-gray-800 border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-white text-xs font-bold">{pattern.name}</span>
              {activePattern === pattern.id && (
                <Award className="w-3.5 h-3.5 text-yellow-400" />
              )}
            </div>
            <div className="text-gray-400 text-xs mb-2 leading-relaxed">{pattern.desc}</div>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className={`text-sm font-bold ${pattern.winRate >= 72 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {pattern.winRate}%
                </div>
                <div className="text-gray-600 text-xs">胜率</div>
              </div>
              <div className="text-center">
                <div className="text-red-400 text-sm font-bold">+{pattern.avgReturn}%</div>
                <div className="text-gray-600 text-xs">平均收益</div>
              </div>
            </div>
            {activePattern === pattern.id && (
              <div className="mt-2 h-1 bg-purple-900 rounded-full">
                <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-full animate-pulse" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
