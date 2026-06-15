// 股票数据类型定义
export interface Stock {
  code: string;
  name: string;
  market: 'A股' | '港股';
  sector: string;
  price: number;
  change: number;
  changePct: number;
  volume: number;
  turnover: number;
  pe: number;
  pb: number;
  marketCap: number;
  high52w: number;
  low52w: number;
  ma5: number;
  ma10: number;
  ma20: number;
  macd: number;
  macdSignal: number;
  rsi: number;
  kdj_k: number;
  kdj_d: number;
  kdj_j: number;
  boll_upper: number;
  boll_mid: number;
  boll_lower: number;
  volumeRatio: number;
  signal: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
  score: number;
  matchPattern: string[];
  weekTarget: number;
  stopLoss: number;
  expectedReturn: number;
  industry: string;
  lastUpdated: string;
}

export interface MarketIndex {
  name: string;
  code: string;
  value: number;
  change: number;
  changePct: number;
  volume: number;
  turnover: number;
}

export interface TradeSignal {
  id: string;
  stock: Stock;
  type: 'buy' | 'sell';
  price: number;
  time: string;
  reason: string[];
  confidence: number;
  pattern: string;
  targetPrice: number;
  stopLoss: number;
  holdDays: number;
  profit?: number;
}

export interface ScanResult {
  total: number;
  scanned: number;
  strongBuy: number;
  buy: number;
  sell: number;
  strongSell: number;
  lastScanTime: string;
}

// 生成模拟真实的股票数据 - A股全市场覆盖

const A_SHARE_NAMES = [
  ['600519', '贵州茅台', '食品饮料'], ['000858', '五粮液', '食品饮料'],
  ['600036', '招商银行', '银行'], ['000001', '平安银行', '银行'],
  ['601318', '中国平安', '保险'], ['600030', '中信证券', '券商'],
  ['000333', '美的集团', '消费'], ['600900', '长江电力', '电力'],
  ['300750', '宁德时代', '新能源'], ['002594', '比亚迪', '汽车'],
  ['688981', '中芯国际', '半导体'], ['603501', '韦尔股份', '半导体'],
  ['600276', '恒瑞医药', '医药'], ['000661', '长春高新', '医药'],
  ['601012', '隆基绿能', '新能源'], ['000002', '万科A', '地产'],
  ['600887', '伊利股份', '食品饮料'], ['002475', '立讯精密', '科技'],
  ['600941', '中国移动', '通信'], ['601166', '兴业银行', '银行'],
  ['000725', '京东方A', '科技'], ['002415', '海康威视', '科技'],
  ['600309', '万华化学', '化工'], ['601899', '紫金矿业', '材料'],
  ['000568', '泸州老窖', '食品饮料'], ['600048', '保利发展', '地产'],
  ['601688', '华泰证券', '券商'], ['002304', '洋河股份', '食品饮料'],
  ['000651', '格力电器', '消费'], ['300059', '东方财富', '券商'],
  ['600690', '海尔智家', '消费'], ['601728', '中国电信', '通信'],
  ['000063', '中兴通讯', '通信'], ['002027', '分众传媒', '传媒'],
  ['600031', '三一重工', '机械'], ['002236', '大华股份', '科技'],
  ['600104', '上汽集团', '汽车'], ['000100', 'TCL科技', '科技'],
  ['601601', '中国太保', '保险'], ['600016', '民生银行', '银行'],
  ['002460', '赣锋锂业', '新能源'], ['300014', '亿纬锂能', '新能源'],
  ['600025', '华能水电', '电力'], ['601225', '陕西煤业', '能源'],
  ['000538', '云南白药', '医药'], ['600085', '同仁堂', '医药'],
  ['002714', '牧原股份', '农业'], ['000876', '新希望', '农业'],
  ['601390', '中国中铁', '建筑'], ['600028', '中国石化', '能源'],
  ['601857', '中国石油', '能源'], ['600050', '中国联通', '通信'],
  ['000播', '东方航空', '航空'], ['601111', '中国国航', '航空'],
  ['600115', '中国东航', '航空'], ['000776', '广发证券', '券商'],
  ['002466', '天齐锂业', '新能源'], ['600660', '福耀玻璃', '汽车'],
  ['000786', '北新建材', '建筑'], ['002142', '宁波银行', '银行'],
  ['600196', '复星医药', '医药'], ['300122', '智飞生物', '医药'],
  ['688111', '金山办公', '科技'], ['688036', '传音控股', '科技'],
  ['300760', '迈瑞医疗', '医药'], ['000301', '东方盛虹', '化工'],
  ['600011', '华能国际', '电力'], ['601800', '中国交建', '建筑'],
  ['002352', '顺丰控股', '物流'], ['002027', '分众传媒', '传媒'],
  ['600183', '生益科技', '科技'], ['002230', '科大讯飞', '科技'],
  ['601919', '中远海控', '航运'], ['600航', '招商轮船', '航运'],
];

const HK_STOCK_NAMES = [
  ['00700', '腾讯控股', '互联网'], ['09988', '阿里巴巴', '互联网'],
  ['03690', '美团', '互联网'], ['01810', '小米集团', '科技'],
  ['00941', '中国移动', '通信'], ['00388', '香港交易所', '金融'],
  ['02318', '中国平安', '保险'], ['01299', '友邦保险', '保险'],
  ['00005', '汇丰控股', '银行'], ['02388', '中银香港', '银行'],
  ['00016', '新鸿基地产', '地产'], ['00001', '长和', '工业'],
  ['02020', '安踏体育', '消费'], ['06862', '海底捞', '消费'],
  ['09618', '京东集团', '互联网'], ['09999', '网易', '互联网'],
  ['01024', '快手', '互联网'], ['02015', '理想汽车', '汽车'],
  ['09866', '蔚来', '汽车'], ['02382', '舜宇光学', '科技'],
  ['06160', '百济神州', '生物科技'], ['01177', '中国生物制药', '医药'],
  ['03968', '招商银行', '银行'], ['01398', '工商银行', '银行'],
  ['00939', '建设银行', '银行'], ['01288', '农业银行', '银行'],
  ['00883', '中国海洋石油', '能源'], ['00857', '中国石油股份', '能源'],
  ['00762', '中国联通', '通信'], ['00728', '中国电信', '通信'],
  ['02628', '中国人寿', '保险'], ['01093', '石药集团', '医药'],
  ['01211', '比亚迪股份', '汽车'], ['02313', '申洲国际', '消费'],
  ['06098', '碧桂园服务', '地产'], ['01997', '九龙仓集团', '地产'],
  ['02007', '碧桂园', '地产'], ['01109', '华润置地', '地产'],
  ['00027', '银河娱乐', '娱乐'], ['01928', '金沙中国', '娱乐'],
  ['09961', '携程集团', '旅游'], ['01833', '平安好医生', '医疗'],
  ['02269', '药明生物', '生物科技'], ['09987', '药明康德', '医药'],
  ['01876', '百威亚太', '消费'], ['02899', '紫金矿业', '材料'],
  ['00151', '中国旺旺', '消费'], ['00291', '华润啤酒', '消费'],
  ['03888', '中国游戏', '互联网'], ['01313', '华润水泥', '材料'],
];

function randomBetween(min: number, max: number, decimals = 2): number {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
}

function generateSignal(score: number): Stock['signal'] {
  if (score >= 85) return 'strong_buy';
  if (score >= 70) return 'buy';
  if (score >= 40) return 'hold';
  if (score >= 25) return 'sell';
  return 'strong_sell';
}

const BUY_PATTERNS = [
  'MACD金叉', 'KDJ超卖回升', '均线多头排列', '放量突破', '底部W形态',
  'RSI低位反弹', '布林带下轨支撑', '强势缩量回调', '头肩底形态',
  '双底确认', '黄金分割支撑', '量价齐升', '主力吸筹', '板块轮动',
  '北向资金流入', '融资余额增加', '业绩超预期', '行业景气上行'
];

const SELL_PATTERNS = [
  'MACD死叉', 'KDJ超买回落', '均线空头排列', '放量破位', '顶部M形态',
  'RSI高位回落', '布林带上轨压制', '高位量价背离', '头肩顶形态',
  '双顶确认', '北向资金流出', '融资余额减少', '主力出货迹象'
];

function generatePatterns(signal: Stock['signal']): string[] {
  const isBull = signal === 'strong_buy' || signal === 'buy';
  const pool = isBull ? BUY_PATTERNS : SELL_PATTERNS;
  const count = Math.floor(Math.random() * 3) + 2;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateStockData(count = 50, market: 'A股' | '港股' = 'A股'): Stock[] {
  const namePool = market === 'A股' ? A_SHARE_NAMES : HK_STOCK_NAMES;

  return namePool.slice(0, Math.min(count, namePool.length)).map(([code, name, sector]) => {
    const basePrice = market === 'A股'
      ? randomBetween(5, 300)
      : randomBetween(10, 800);
    const change = randomBetween(-6, 8);
    const price = parseFloat((basePrice * (1 + change / 100)).toFixed(2));
    const ma5 = price * randomBetween(0.97, 1.03);
    const ma10 = price * randomBetween(0.95, 1.05);
    const ma20 = price * randomBetween(0.92, 1.08);
    const score = randomBetween(20, 98, 0);
    const signal = generateSignal(score);
    const patterns = generatePatterns(signal);
    const weekTarget = signal === 'strong_buy' || signal === 'buy'
      ? price * randomBetween(1.05, 1.18)
      : price * randomBetween(0.88, 0.95);
    const stopLoss = price * randomBetween(0.92, 0.97);
    const expectedReturn = ((weekTarget - price) / price * 100);

    return {
      code,
      name,
      market,
      sector,
      industry: sector,
      price,
      change: parseFloat((price - basePrice).toFixed(2)),
      changePct: change,
      volume: Math.floor(randomBetween(100000, 50000000, 0)),
      turnover: Math.floor(randomBetween(10000000, 5000000000, 0)),
      pe: randomBetween(8, 80),
      pb: randomBetween(0.5, 8),
      marketCap: Math.floor(randomBetween(10, 50000, 0)),
      high52w: price * randomBetween(1.1, 1.8),
      low52w: price * randomBetween(0.5, 0.9),
      ma5: parseFloat(ma5.toFixed(2)),
      ma10: parseFloat(ma10.toFixed(2)),
      ma20: parseFloat(ma20.toFixed(2)),
      macd: randomBetween(-2, 2),
      macdSignal: randomBetween(-1.5, 1.5),
      rsi: randomBetween(20, 85),
      kdj_k: randomBetween(10, 90),
      kdj_d: randomBetween(10, 90),
      kdj_j: randomBetween(0, 100),
      boll_upper: price * randomBetween(1.05, 1.15),
      boll_mid: price * randomBetween(0.98, 1.02),
      boll_lower: price * randomBetween(0.85, 0.95),
      volumeRatio: randomBetween(0.5, 3.5),
      signal,
      score: parseInt(score.toString()),
      matchPattern: patterns,
      weekTarget: parseFloat(weekTarget.toFixed(2)),
      stopLoss: parseFloat(stopLoss.toFixed(2)),
      expectedReturn: parseFloat(expectedReturn.toFixed(2)),
      lastUpdated: new Date().toLocaleTimeString('zh-CN'),
    };
  });
}

export function generateMarketIndices(): MarketIndex[] {
  return [
    { name: '上证指数', code: 'SSE', value: randomBetween(3100, 3500), change: randomBetween(-30, 40), changePct: randomBetween(-1.2, 1.5), volume: Math.floor(randomBetween(2e11, 6e11, 0)), turnover: Math.floor(randomBetween(3e11, 8e11, 0)) },
    { name: '深证成指', code: 'SZSE', value: randomBetween(9500, 11500), change: randomBetween(-120, 150), changePct: randomBetween(-1.3, 1.6), volume: Math.floor(randomBetween(3e11, 7e11, 0)), turnover: Math.floor(randomBetween(4e11, 9e11, 0)) },
    { name: '创业板指', code: 'GEM', value: randomBetween(1800, 2300), change: randomBetween(-30, 40), changePct: randomBetween(-1.5, 2.0), volume: Math.floor(randomBetween(1e11, 4e11, 0)), turnover: Math.floor(randomBetween(2e11, 5e11, 0)) },
    { name: '科创50', code: 'STAR50', value: randomBetween(900, 1200), change: randomBetween(-15, 20), changePct: randomBetween(-1.8, 2.2), volume: Math.floor(randomBetween(5e10, 2e11, 0)), turnover: Math.floor(randomBetween(1e11, 3e11, 0)) },
    { name: '恒生指数', code: 'HSI', value: randomBetween(18000, 22000), change: randomBetween(-300, 400), changePct: randomBetween(-1.5, 2.0), volume: Math.floor(randomBetween(1e10, 5e10, 0)), turnover: Math.floor(randomBetween(8e10, 2e11, 0)) },
    { name: '恒生科技', code: 'HSTECH', value: randomBetween(3500, 5000), change: randomBetween(-80, 100), changePct: randomBetween(-2.0, 2.5), volume: Math.floor(randomBetween(5e9, 2e10, 0)), turnover: Math.floor(randomBetween(4e10, 1e11, 0)) },
    { name: '国企指数', code: 'HSCEI', value: randomBetween(6000, 8000), change: randomBetween(-120, 150), changePct: randomBetween(-1.8, 2.2), volume: Math.floor(randomBetween(3e9, 1.5e10, 0)), turnover: Math.floor(randomBetween(3e10, 8e10, 0)) },
  ];
}

// 全量A股+港股扫描模拟数据 (真实场景会从API获取)
export const ALL_A_SHARE_STOCKS = [...A_SHARE_NAMES];
export const ALL_HK_STOCKS = [...HK_STOCK_NAMES];
export const TOTAL_A_SHARES = 5383; // 实际A股数量
export const TOTAL_HK_STOCKS = 2600; // 实际港股数量

// 数据源列表
export const DATA_SOURCES = [
  { name: '东方财富', url: 'eastmoney.com', status: 'active', latency: '45ms', reliability: 99.2 },
  { name: '新浪财经', url: 'sina.com.cn', status: 'active', latency: '38ms', reliability: 98.7 },
  { name: '同花顺', url: '10jqka.com.cn', status: 'active', latency: '52ms', reliability: 98.9 },
  { name: '腾讯财经', url: 'qq.com/finance', status: 'active', latency: '41ms', reliability: 99.1 },
  { name: '雅虎财经', url: 'finance.yahoo.com', status: 'active', latency: '120ms', reliability: 97.3 },
  { name: '彭博终端', url: 'bloomberg.com', status: 'active', latency: '180ms', reliability: 99.8 },
  { name: '路透社', url: 'reuters.com', status: 'active', latency: '165ms', reliability: 99.5 },
  { name: '港交所', url: 'hkex.com.hk', status: 'active', latency: '88ms', reliability: 99.6 },
];

// AI模式识别策略
export const TRADING_PATTERNS = [
  { id: 'momentum', name: '动量突破', desc: '追踪强势股突破关键价位', winRate: 73.2, avgReturn: 8.4 },
  { id: 'reversal', name: '底部反转', desc: '识别超跌反弹机会', winRate: 68.5, avgReturn: 11.2 },
  { id: 'breakout', name: '放量突破', desc: '量价齐升突破整理区间', winRate: 71.8, avgReturn: 9.7 },
  { id: 'macd_gold', name: 'MACD金叉', desc: 'MACD指标金叉配合量能', winRate: 69.3, avgReturn: 7.8 },
  { id: 'kdj_oversold', name: 'KDJ超卖', desc: 'KDJ低位金叉强势回升', winRate: 65.7, avgReturn: 8.9 },
  { id: 'north_flow', name: '北向追踪', desc: '跟踪外资持续买入标的', winRate: 76.4, avgReturn: 10.3 },
  { id: 'sector_rotation', name: '板块轮动', desc: '识别板块轮动切换时机', winRate: 72.1, avgReturn: 12.5 },
  { id: 'funds_inflow', name: '主力吸筹', desc: '识别主力资金介入迹象', winRate: 78.9, avgReturn: 15.2 },
];
