import { Router } from "express";
import { getStatisticsOfUrl, handleShortenUrl, redirectUrl } from "../db/controllers/url.controller";

const router = Router()
router.post('/api/shorten', handleShortenUrl)
router.get('/:shortCode', redirectUrl)
router.get('/api/stats/:shortCode', getStatisticsOfUrl)

export default router;