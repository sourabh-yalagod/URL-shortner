import {
    checkUrlExist,
    findUrlByShortCode,
    insertNewShortCode,
    updateClicks,
    deleteShortCode,
    getAllShortCodes
} from "../db";
import { generateShortCode, validateShortCode, validateUrl } from "../utils/common.utils";
import { config } from "dotenv";

config();

export const createLink = async (req: any, res: any) => {
    const { original_url, short_code } = req.body;

    if (!original_url) {
        return res.status(400).json({ error: 'original_url is required' });
    }

    if (!validateUrl(original_url)) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    try {
        let code = short_code;

        if (!code) {
            code = generateShortCode();
            let exists = true;
            while (exists) {
                const result = await findUrlByShortCode(code);
                exists = result.rows.length > 0;
                if (exists) code = generateShortCode();
            }
        } else {
            if (!validateShortCode(code)) {
                return res.status(400).json({
                    error: 'Short code must be 6-8 alphanumeric characters'
                });
            }

            const existing = await findUrlByShortCode(code);
            if (existing.rows.length > 0) {
                return res.status(409).json({
                    error: 'Short code already exists'
                });
            }
        }

        const result = await insertNewShortCode(code, original_url);
        const baseUrl = process.env.BACKEND_URL;

        res.status(201).json({
            short_code: result.rows[0].short_code,
            original_url: result.rows[0].original_url,
            short_url: `${baseUrl}/${result.rows[0].short_code}`,
            total_clicks: result.rows[0].total_clicks || 0,
            created_at: result.rows[0].created_at,
            last_clicked: result.rows[0].last_clicked
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getAllLinks = async (req: any, res: any) => {
    try {
        const result = await getAllShortCodes();
        res.json(result.rows);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const redirectUrl = async (req: any, res: any) => {
    const { code } = req.params;

    try {
        const result = await checkUrlExist(code);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'URL not found' });
        }

        const originalUrl = result.rows[0].original_url;
        await updateClicks(code);

        // 302 redirect
        res.redirect(302, originalUrl);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getStatisticsOfUrl = async (req: any, res: any) => {
    const { code } = req.params;

    try {
        const result = await findUrlByShortCode(code);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Link not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteLink = async (req: any, res: any) => {
    const { code } = req.params;

    try {
        // Check if link exists
        const existing = await findUrlByShortCode(code);
        if (existing.rows.length === 0) {
            return res.status(404).json({ error: 'Link not found' });
        }

        // Delete the link
        await deleteShortCode(code);
        res.status(200).json({ message: 'Link deleted successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};