const axios = require('axios');
module.exports = async (req, res) => {
    const { codes } = req.query;
    try {
        const r = await axios.get(`http://push2.eastmoney.com/api/qt/ulist/get?secids=${codes}&fields=f12,f14,f2,f3,f4`, {
            headers: { 'Referer': 'http://quote.eastmoney.com/' }
        });
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.status(200).json(r.data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};