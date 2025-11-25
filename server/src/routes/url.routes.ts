import { Router } from "express";
import { createLink, deleteLink, getAllLinks, getStatisticsOfUrl,redirectUrl } from "../controllers/url.controller";

const router = Router()
router.post('/api/links', createLink);
router.get('/api/links', getAllLinks);
router.get('/api/links/:code', getStatisticsOfUrl);
router.delete('/api/links/:code', deleteLink);

// Public redirect
router.get('/:code', redirectUrl);

export default router;