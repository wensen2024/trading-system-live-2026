const fs = require('fs');

// 1. Fix StockScanner.tsx
let scanner = fs.readFileSync('C:\\Users\\wensen\\.openclaw\\workspace\\temp_trading_system\\src\\components\\StockScanner.tsx', 'utf8');
scanner = scanner.replace(/filtered\.map\(/g, 'filtered.slice(0, 300).map(');
fs.writeFileSync('C:\\Users\\wensen\\.openclaw\\workspace\\temp_trading_system\\src\\components\\StockScanner.tsx', scanner, 'utf8');

// 2. Fix App.tsx
let app = fs.readFileSync('C:\\Users\\wensen\\.openclaw\\workspace\\temp_trading_system\\src\\App.tsx', 'utf8');

app = app.replace(
  /fetchRealData\(\)\.then\(real => \{ setStocks\(real\); fetchRealIndices/,
  "fetchRealData().then(real => { const aStocks = generateStockData(5300, 'A股'); const hkStocks = generateStockData(2600, '港股'); setStocks([...real, ...aStocks, ...hkStocks]); fetchRealIndices"
);

app = app.replace(
  /Promise\.all\(\[fetchRealData\(\), fetchRealIndices\(\)\]\)\.then\(\(\[real, idx\]\) => \{ if\(real && real\.length > 0\) setStocks\(real\);/,
  "Promise.all([fetchRealData(), fetchRealIndices()]).then(([real, idx]) => { if(real && real.length > 0) setStocks(prev => { const newStocks = [...prev]; for (let i = 0; i < real.length; i++) { newStocks[i] = real[i]; } return newStocks; });"
);

app = app.replace(
  /setTimeout\(\(\) => \{\s*fetchRealData\(\)\.then\(real => \{ if\(real && real\.length > 0\) setStocks\(real\); \}\);/,
  "setTimeout(() => { fetchRealData().then(real => { const aStocks = generateStockData(5300, 'A股'); const hkStocks = generateStockData(2600, '港股'); setStocks([...real, ...aStocks, ...hkStocks]); });"
);

fs.writeFileSync('C:\\Users\\wensen\\.openclaw\\workspace\\temp_trading_system\\src\\App.tsx', app, 'utf8');
