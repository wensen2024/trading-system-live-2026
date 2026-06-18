export function fetchRealData(): Promise<any[]> {
    return new Promise(async (resolve) => {
        const codes = '1.600519,1.601398,1.601288,1.600900,1.601988,1.601857,1.600036,1.601088,1.600028,1.601628,0.000858,0.000333,0.002594,0.000001,0.000002,0.002415,116.00700,116.03690,116.09988,116.00941,0.300750';
        
        const qCodes = codes.split(',').map(c => {
            if (c.startsWith('1.')) return 'sh' + c.substring(2);
            if (c.startsWith('0.')) return 'sz' + c.substring(2);
            if (c.startsWith('116.')) return 'hk' + c.substring(4);
            return c;
        }).join(',');

        try {
            const res = await fetch(`https://qt.gtimg.cn/q=${qCodes}`);
            const buffer = await res.arrayBuffer();
            const text = new TextDecoder('gbk').decode(buffer);
            
            const lines = text.split(';').filter(l => l.trim().length > 0);
            const stocks = lines.map(line => {
                const parts = line.split('=');
                if (parts.length < 2) return null;
                const dataStr = parts[1].replace(/^"/, '').replace(/"$/, '');
                const q = dataStr.split('~');
                if (q.length < 32) return null;
                
                const code = q[2];
                const name = q[1];
                const price = parseFloat(q[3]);
                const change = parseFloat(q[31]);
                const changePct = parseFloat(q[32]);
                const volume = parseFloat(q[36]);
                const turnover = parseFloat(q[37]);
                
                return {
                    code: code, 
                    name: name, 
                    market: code.startsWith('0') || code.startsWith('3') ? 'SZ' : (code.length===5 ? 'HK' : 'SH'), 
                    sector: 'Tech/Finance',
                    price: price, 
                    change: change, 
                    changePct: changePct,
                    volume: volume || 0,
                    turnover: turnover || 0,
                    pe: 15, pb: 3, marketCap: 0,
                    high52w: 0, low52w: 0, ma5: 0, ma10: 0, ma20: 0,
                    macd: 0, macdSignal: 0, rsi: 50, kdj_k: 50, kdj_d: 50, kdj_j: 50,
                    boll_upper: 0, boll_mid: 0, boll_lower: 0,
                    volumeRatio: 1, 
                    signal: changePct > 2 ? 'strong_buy' : (changePct > 0 ? 'buy' : (changePct < -2 ? 'strong_sell' : 'sell')), 
                    score: Math.floor(Math.random()*40 + 50), 
                    matchPattern: ['Realtime'],
                    weekTarget: price * 1.05, 
                    stopLoss: price * 0.95, 
                    expectedReturn: 5,
                    industry: 'Tech', 
                    lastUpdated: new Date().toLocaleTimeString('zh-CN')
                };
            }).filter(Boolean);
            resolve(stocks);
        } catch (e) {
            console.error(e);
            resolve([]);
        }
    });
}

export function fetchRealIndices(): Promise<any[]> {
    return new Promise(async (resolve) => {
        const codes = '1.000001,0.399001,0.399006,1.000688,116.HSI,124.HSTECH,124.HSCEI';
        
        const qCodes = codes.split(',').map(c => {
            if (c.startsWith('1.')) return 'sh' + c.substring(2);
            if (c.startsWith('0.')) return 'sz' + c.substring(2);
            if (c.startsWith('116.') || c.startsWith('124.')) return 'hk' + c.substring(4);
            return c;
        }).join(',');

        try {
            const res = await fetch(`https://qt.gtimg.cn/q=${qCodes}`);
            const buffer = await res.arrayBuffer();
            const text = new TextDecoder('gbk').decode(buffer);
            
            const lines = text.split(';').filter(l => l.trim().length > 0);
            const indices = lines.map(line => {
                const parts = line.split('=');
                if (parts.length < 2) return null;
                const dataStr = parts[1].replace(/^"/, '').replace(/"$/, '');
                const q = dataStr.split('~');
                if (q.length < 32) return null;
                
                let codeName = q[2];
                if (codeName === '000001') codeName = 'SSE';
                else if (codeName === '399001') codeName = 'SZSE';
                else if (codeName === '399006') codeName = 'GEM';
                else if (codeName === '000688') codeName = 'STAR50';
                else if (codeName === 'HSI') codeName = 'HSI';
                else if (codeName === 'HSTECH') codeName = 'HSTECH';
                else if (codeName === 'HSCEI') codeName = 'HSCEI';
                
                return {
                    name: q[1],
                    code: codeName,
                    value: parseFloat(q[3]),
                    change: parseFloat(q[31]),
                    changePct: parseFloat(q[32]),
                    volume: parseFloat(q[36]) || 0,
                    turnover: parseFloat(q[37]) || 0
                };
            }).filter(Boolean);
            resolve(indices);
        } catch (e) {
            console.error(e);
            resolve([]);
        }
    });
}
