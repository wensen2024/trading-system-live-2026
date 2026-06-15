const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');
c = c.replace(/\?,/g, "',");
fs.writeFileSync('src/App.tsx', c);
let s = fs.readFileSync('src/data/stockData.ts', 'utf8');
s = s.replace(/\?,/g, "',");
fs.writeFileSync('src/data/stockData.ts', s);
