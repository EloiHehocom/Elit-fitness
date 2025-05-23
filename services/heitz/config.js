require('dotenv').config();

const config = {
    HEITZ_API_ID: process.env.HEITZ_API_ID,
    HEITZ_API_KEY: process.env.HEITZ_API_KEY,
    HEITZ_API_BASE_URL: process.env.HEITZ_API_BASE_URL,
    HEITZ_CENTER_ID: process.env.HEITZ_CENTER_ID,
};

module.exports = config;