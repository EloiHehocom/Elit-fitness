const axios = require('axios');
const config = require('../config');

/**
 * Récupère le planning Heinz
 * @param {Object} params - Paramètres de la requête
 * @param {string} [params.startDate] - Date de début (format YYYY-MM-DD), par défaut aujourd'hui
 * @param {string} [params.endDate] - Date de fin (format YYYY-MM-DD), par défaut dans 30 jours
 * @param {string} [params.idCenter] - ID du centre, par défaut depuis la config
 * @returns {Promise<Array>} Liste des créneaux de planning
 */
async function getHeitzPlanning(params = {}) {
    const startTime = Date.now();
    const endTime = startTime + (30 * 24 * 60 * 60 * 1000);

    const defaultParams = {
        startDate: new Date(startTime).toISOString().split('T')[0],
        endDate: new Date(endTime).toISOString().split('T')[0],
        idCenter: config.HEITZ_CENTER_ID,
    };

    // Fusion des paramètres par défaut avec ceux fournis
    const finalParams = { ...defaultParams, ...params };

    try {
        const response = await axios.get(`${config.HEITZ_API_BASE_URL}/api/planning/browse`, {
            headers: { 'Content-Type': 'application/json' },
            params: finalParams
        });

        return response.data;
    } catch (error) {
        console.error('Erreur détaillée:', {
            message: error.message,
            url: `${config.HEITZ_API_BASE_URL}/api/planning/browse`,
            params: error.config?.params,
            response: error.response?.data
        });
        throw error;
    }
}

module.exports = getHeitzPlanning;

// Exemple d'utilisation
// const startTime = Date.now();
// const endTime = startTime + (30 * 24 * 60 * 60 * 1000);

// const params = {
//     startDate: new Date(startTime).toISOString().split('T')[0],
//     endDate: new Date(endTime).toISOString().split('T')[0],
//     idCenter: config.heinz.CENTER_ID
// };

// const heinzSlots = await getHeinzPlanning(params);


