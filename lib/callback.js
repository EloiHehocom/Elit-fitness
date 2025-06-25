const axios = require('axios');
const qs = require('qs');


async function callback(req, res) {
    const data = qs.stringify({
        'client_id': process.env.HIGHLEVEL_CLIENT_ID,
        'client_secret': process.env.HIGHLEVEL_CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': req.query.code,
        'user_type': 'Location',
        'redirect_uri': 'http://localhost:3000/oauth/callback' 
    });
      
    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://services.leadconnectorhq.com/oauth/token',
        headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
    };
      
    const response = await axios.request(config).catch(err => {});
      
    return res.json({ data: response?.data });
    console.log(response?.data);
}

module.exports = callback;

// const axios = require('axios');
// const qs = require('qs');
// const { updateEnvFile } = require('./tokenManager');

// async function callback(req, res) {
//     const data = qs.stringify({
//         'client_id': process.env.HIGHLEVEL_CLIENT_ID,
//         'client_secret': process.env.HIGHLEVEL_CLIENT_SECRET,
//         'grant_type': 'authorization_code',
//         'code': req.query.code,
//         'user_type': 'Location',
//         'redirect_uri': process.env.REDIRECT_URI
//     });
      
//     const config = {
//         method: 'post',
//         maxBodyLength: Infinity,
//         url: 'https://services.leadconnectorhq.com/oauth/token',
//         headers: { 
//           'Accept': 'application/json', 
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         data : data
//     };
      
//     try {
//         const response = await axios.request(config);
//         const { access_token, refresh_token, expires_in, locationId } = response.data;

//         if (!access_token || !refresh_token || !expires_in) {
//             throw new Error('Réponse de token invalide depuis HighLevel.');
//         }

//         const expirationTime = Date.now() + (expires_in - 300) * 1000;

//         await updateEnvFile({
//             HIGHLEVEL_ACCESS_TOKEN: access_token,
//             HIGHLEVEL_REFRESH_TOKEN: refresh_token,
//             HIGHLEVEL_TOKEN_EXPIRATION: expirationTime,
//             HIGHLEVEL_LOCATION_ID: locationId
//         });

//         return res.json({ 
//             message: 'Tokens reçus et sauvegardés avec succès !',
//             data: response.data
//         });

//     } catch (error) {
//         console.error("Erreur lors de l'échange du code d'autorisation:", error.response ? JSON.stringify(error.response.data) : error.message);
//         return res.status(500).json({ error: "Échec de l'obtention des tokens initiaux." });
//     }
// }

// module.exports = callback;