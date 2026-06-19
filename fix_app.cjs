const fs = require('fs');
let content = fs.readFileSync('C:\\Users\\wensen\\.openclaw\\workspace\\temp_trading_system\\src\\App.tsx', 'utf8');

content = content.replace(
    /const aStocks = generateStockData[\s\S]*?setStocks\(\[\.\.\.aStocks, \.\.\.hkStocks\]\);/,
    "fetchRealData().then(real => { if(real && real.length > 0) setStocks(real); });"
);

fs.writeFileSync('C:\\Users\\wensen\\.openclaw\\workspace\\temp_trading_system\\src\\App.tsx', content, 'utf8');
