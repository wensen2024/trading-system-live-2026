
const axios = require('axios');
module.exports = async (req, res) => {
    try {
        const r = await axios.get("https://query1.finance.yahoo.com/v7/finance/quote?symbols=AAPL,MSFT,GOOG,AMZN,META,TSLA,NVDA,BABA,TCEHY");
        res.status(200).json(r.data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
