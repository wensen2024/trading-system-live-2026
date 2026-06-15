import { Globe, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { DATA_SOURCES } from '../data/stockData';

interface Props {
  lastUpdate: string;
  isUpdating: boolean;
}

export default function DataSources({ lastUpdate, isUpdating }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          <span className="text-white font-bold text-sm">全球数据源监控</span>
          {isUpdating && (
            <RefreshCw className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          <span>更新: {lastUpdate}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
        {DATA_SOURCES.map(source => (
          <div key={source.name} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white text-xs font-semibold truncate">{source.name}</span>
              <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0 ml-1" />
            </div>
            <div className="text-gray-500 text-xs truncate mb-2">{source.url}</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-cyan-400">{source.latency}</span>
              <span className="text-green-400">{source.reliability}%</span>
            </div>
            <div className="mt-1.5 h-1 bg-gray-700 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-emerald-400 rounded-full"
                style={{ width: `${source.reliability}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-green-400 font-bold text-lg">8/8</div>
          <div className="text-gray-400 text-xs">数据源在线</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-cyan-400 font-bold text-lg">47ms</div>
          <div className="text-gray-400 text-xs">平均延迟</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-yellow-400 font-bold text-lg">99.1%</div>
          <div className="text-gray-400 text-xs">综合可靠性</div>
        </div>
      </div>
    </div>
  );
}
