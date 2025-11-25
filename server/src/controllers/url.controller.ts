import { checkUrlExist, findUrlByShortCode, insertNewShortCode, updateClicks } from "../db";
import { generateShortCode } from "../utils/common.utils";
import { config } from "dotenv";
config()
export const handleShortenUrl = async (req: any, res: any) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        let shortCode = generateShortCode();
        let exists = true;

        // Ensure short code is unique
        while (exists) {
            const result = await findUrlByShortCode(shortCode);

            exists = result.rows.length > 0;

            if (exists) shortCode = generateShortCode();
        }

        const result = await insertNewShortCode(shortCode, url);
        const baseUrl = process.env.BACKEND_URL;

        res.status(201).json({
            short_code: result.rows[0].short_code,
            original_url: result.rows[0].original_url,
            short_url: `${baseUrl}/${result.rows[0].short_code}`
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

export const redirectUrl = async (req: any, res: any) => {
    const { shortCode } = req.params;

    try {
        const result = await checkUrlExist(shortCode);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'URL not found' });
        }

        const originalUrl = result.rows[0].original_url;

        await updateClicks(shortCode);

        res.redirect(originalUrl);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}
export const getStatisticsOfUrl = async (req: any, res: any) => {
    const { shortCode } = req.params;

    try {
        const result = await findUrlByShortCode(shortCode)

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'URL not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}