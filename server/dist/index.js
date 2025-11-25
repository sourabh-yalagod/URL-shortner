"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: [process.env.CLIENT_URL] }));
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
const url_routes_1 = __importDefault(require("./routes/url.routes"));
const db_1 = require("./db");
app.use("/", url_routes_1.default);
app.listen(PORT, () => {
    (0, db_1.createTable)();
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map