const axios = require('axios');
const qs = require('qs');

async function callback(req, res) {

    const expectedDevSecret = process.env.DEV_REFRESH_ENDPOINT_SECRET;
        // Récupérer le secret fourni dans les headers de la requête
        const providedDevSecret = req.headers['x-dev-secret']; // Nom de header arbitraire

        // Si un secret est attendu et qu'il ne correspond pas (ou n'est pas fourni)
        if (expectedDevSecret && providedDevSecret !== expectedDevSecret) {
            console.warn('Tentative d\'accès non autorisé à l\'endpoint de rafraîchissement (secret de dev incorrect).');
            return res.status(403).json({ error: 'Accès interdit. Secret de développement incorrect.' });
        }

    const data = qs.stringify({
        'client_id': process.env.HIGHLEVEL_CLIENT_ID,
        'client_secret': process.env.HIGHLEVEL_CLIENT_SECRET,
        'grant_type': 'refresh_token',
        'refresh_token': process.env.HIGHLEVEL_REFRESH_TOKEN,
        'user_type': 'Location',
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
    console.log(response?.data);
      
    return res.json({ data: response?.data });
}

module.exports = callback;

// const { refreshAccessToken } = require('./tokenManager');

// async function manualRefresh(req, res) {
//     const expectedDevSecret = process.env.DEV_REFRESH_ENDPOINT_SECRET;
//     const providedDevSecret = req.headers['x-dev-secret'];

//     if (expectedDevSecret && providedDevSecret !== expectedDevSecret) {
//         console.warn('Tentative d\'accès non autorisé à l\'endpoint de rafraîchissement.');
//         return res.status(403).json({ error: 'Accès interdit.' });
//     }

//     try {
//         const newAccessToken = await refreshAccessToken();
//         res.json({ 
//             message: 'Token rafraîchi manuellement avec succès.',
//             accessToken: newAccessToken 
//         });
//     } catch (error) {
//         console.error('Erreur lors du rafraîchissement manuel :', error);
//         res.status(500).json({ error: 'Échec du rafraîchissement manuel du token.' });
//     }
// }

// module.exports = manualRefresh;