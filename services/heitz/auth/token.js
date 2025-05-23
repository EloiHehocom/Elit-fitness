const axios = require('axios');
const config = require('../config');

/**
 * Récupère un token d'authentification Heitz
 * @returns {Promise<string>} Token d'authentification
 */
async function getToken() {
    try {
        const response = await axios.post(`${config.HEITZ_API_BASE_URL}/api/developer/getToken`, {
            id: config.HEITZ_API_ID,
            key: config.HEITZ_API_KEY,
        });
        
        console.log('Token Heitz obtenu avec succès');
        return response.data.token;
    } catch (error) {
        console.error('Erreur lors de l\'obtention du token Heitz:', error.response?.data || error.message);
        throw new Error('Impossible d\'obtenir le token Heitz');
    }
}

module.exports = {
    getToken
};