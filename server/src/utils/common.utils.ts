import crypto from "crypto";

export const generateShortCode = () => {
    return crypto.randomBytes(4).toString('hex').substring(0, 8);
};
