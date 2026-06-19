const fs = require('fs');
let c = fs.readFileSync('src/data/yahoo.ts', 'utf8');
c = c.replace(/fetch\(https:\/\/82\.push2.*?f3,f4/, 'fetch("https://82.push2.eastmoney.com/api/qt/clist/get?pn=1&pz=8000&po=1&np=1&fltt=2&invt=2&fid=f3&fs=m:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23,m:0+t:81+s:2048,m:116+t:3,m:116+t:4&fields=f12,f14,f2,f3,f4"');
fs.writeFileSync('src/data/yahoo.ts', c);