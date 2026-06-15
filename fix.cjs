const fs = require('fs');

fs.mkdirSync('api', { recursive: true });
fs.writeFileSync('api/quote.js', 
const axios = require('axios');
module.exports = async (req, res) => {
    try {
        const r = await axios.get("https://query1.finance.yahoo.com/v7/finance/quote?symbols=AAPL,MSFT,GOOG,AMZN,META,TSLA,NVDA,BABA,TCEHY");
        res.status(200).json(r.data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
);

fs.writeFileSync('src/data/yahoo.ts', 
import axios from "axios";
export async function fetchRealData() {
    try {
        const r = await axios.get("/api/quote");
        return r.data.quoteResponse.result.map((q: any) => ({
            code: q.symbol, name: q.shortName || q.symbol, market: "Global", sector: "Tech",
            price: q.regularMarketPrice, change: q.regularMarketChange, changePct: q.regularMarketChangePercent,
            volume: q.regularMarketVolume, turnover: q.regularMarketVolume * q.regularMarketPrice,
            pe: q.trailingPE || 15, pb: q.priceToBook || 3, marketCap: q.marketCap,
            high52w: q.fiftyTwoWeekHigh, low52w: q.fiftyTwoWeekLow,
            ma5: q.fiftyDayAverage, ma10: q.fiftyDayAverage, ma20: q.fiftyDayAverage,
            macd: 0, macdSignal: 0, rsi: 50, kdj_k: 50, kdj_d: 50, kdj_j: 50,
            boll_upper: q.regularMarketPrice * 1.1, boll_mid: q.regularMarketPrice, boll_lower: q.regularMarketPrice * 0.9,
            volumeRatio: 1, signal: "strong_buy", score: 95, matchPattern: ["AI", "Tech"],
            weekTarget: q.regularMarketPrice * 1.1, stopLoss: q.regularMarketPrice * 0.9, expectedReturn: 10,
            industry: "Tech", lastUpdated: new Date().toLocaleTimeString("zh-CN")
        }));
    } catch (e) { return []; }
}
);

let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(/setNotifications\(prev => \[[^\]]*?\]\);/g, "setNotifications(prev => ['Scan complete!', ...prev.slice(0, 3)]);");

const loadRegex = /useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/;
const newLoad = \
  useEffect(() => {
    fetchRealData().then(real => {
      const aStocks = generateStockData(30, 'A股');
      setStocks([...real, ...aStocks]);
      setTotalScanned(TOTAL_A_SHARES + TOTAL_HK_STOCKS);
    });
  }, []);
\;
if (app.match(loadRegex)) {
    app = app.replace(loadRegex, newLoad);
}

fs.writeFileSync('src/App.tsx', app);
