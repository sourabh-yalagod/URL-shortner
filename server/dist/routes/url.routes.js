"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const url_controller_1 = require("../db/controllers/url.controller");
const router = (0, express_1.Router)();
router.post('/api/shorten', url_controller_1.handleShortenUrl);
router.get('/:shortCode', url_controller_1.redirectUrl);
router.get('/api/stats/:shortCode', url_controller_1.getStatisticsOfUrl);
exports.default = router;
//# sourceMappingURL=url.routes.js.map