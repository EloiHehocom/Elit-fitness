require('dotenv').config();

const config = {
    API_KEY: process.env.HIGHLEVEL_API_KEY,
    BASE_URL: process.env.HIGHLEVEL_BASE_URL,
    LOCATION_ID: process.env.HIGHLEVEL_LOCATION_ID,
    CALENDAR_ID: process.env.HIGHLEVEL_CALENDAR_ID,
    CONTACT_ID: process.env.HIGHLEVEL_CONTACT_ID,
    USER_ID: process.env.HIGHLEVEL_USER_ID,
    headers: {
        'Authorization': `Bearer ${process.env.HIGHLEVEL_API_KEY}`,
        'Version': '2021-04-15',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

module.exports = config;

// require('dotenv').config();

// const config = {
//     // API_KEY et les headers sont supprimés. L'authentification est désormais dynamique.
//     BASE_URL: process.env.HIGHLEVEL_BASE_URL,
//     LOCATION_ID: process.env.HIGHLEVEL_LOCATION_ID,
//     CALENDAR_ID: process.env.HIGHLEVEL_CALENDAR_ID,
//     CONTACT_ID: process.env.HIGHLEVEL_CONTACT_ID,
//     USER_ID: process.env.HIGHLEVEL_USER_ID,
// };

// module.exports = config;