import crypto from "crypto";

export const generateShortCode = () => {
    return crypto.randomBytes(4).toString('hex').substring(0, 8);
};

// Validate URL format
export const validateUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Validate short code format: 6-8 alphanumeric characters
export const validateShortCode = (code: string): boolean => {
    return /^[A-Za-z0-9]{6,8}$/.test(code);
};
