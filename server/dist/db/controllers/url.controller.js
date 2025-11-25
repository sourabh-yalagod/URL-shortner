"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatisticsOfUrl = exports.redirectUrl = exports.handleShortenUrl = void 0;
const __1 = require("..");
const common_utils_1 = require("../../utils/common.utils");
const handleShortenUrl = async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    try {
        let shortCode = (0, common_utils_1.generateShortCode)();
        let exists = true;
        // Ensure short code is unique
        while (exists) {
            const result = await (0, __1.findUrlByShortCode)(shortCode);
            exists = result.rows.length > 0;
            if (exists)
                shortCode = (0, common_utils_1.generateShortCode)();
        }
        const result = await (0, __1.insertNewShortCode)(shortCode, url);
        res.status(201).json({
            short_code: result.rows[0].short_code,
            original_url: result.rows[0].original_url,
            short_url: `http://localhost:3000/${result.rows[0].short_code}`
        });
    }
    catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.handleShortenUrl = handleShortenUrl;
const redirectUrl = async (req, res) => {
    const { shortCode } = req.params;
    try {
        const result = await (0, __1.checkUrlExist)(shortCode);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'URL not found' });
        }
        const originalUrl = result.rows[0].original_url;
        await (0, __1.updateClicks)(shortCode);
        res.redirect(originalUrl);
    }
    catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.redirectUrl = redirectUrl;
const getStatisticsOfUrl = async (req, res) => {
    const { shortCode } = req.params;
    try {
        const result = await (0, __1.findUrlByShortCode)(shortCode);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'URL not found' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getStatisticsOfUrl = getStatisticsOfUrl;
//# sourceMappingURL=url.controller.js.map