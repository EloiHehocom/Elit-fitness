const axios = require('axios');
const config = require('../config');

/**
 * Récupère tous les rendez-vous HighLevel sur une période
 * @param {Object} params - Paramètres de la requête
 * @param {number} [params.startTime] - Timestamp de début, par défaut maintenant
 * @param {number} [params.endTime] - Timestamp de fin, par défaut dans 30 jours
 * @param {string} [params.calendarId] - ID du calendrier, par défaut depuis la config
 * @param {string} [params.locationId] - ID de la location, par défaut depuis la config
 * @returns {Promise<Array>} Liste des rendez-vous
 */
async function getAllAppointments(params = {}) {
    const startTime = Date.now();
    const endTime = startTime + (30 * 24 * 60 * 60 * 1000);

    const defaultParams = {
        startTime: startTime,
        endTime: endTime,
        calendarId: config.CALENDAR_ID,
        locationId: config.LOCATION_ID
    };

    const finalParams = { ...defaultParams, ...params };

    const options = {
        method: 'GET',
        url: `${config.BASE_URL}/calendars/events`,
        params: finalParams,
        headers: config.headers
    };

    // const accessToken = await getValidAccessToken();

    // const options = {
    //     method: 'GET',
    //     url: `${config.BASE_URL}/calendars/events`,
    //     params: finalParams,
    //     headers: {
    //         'Authorization': `Bearer ${accessToken}`,
    //         'Version': '2021-04-15',
    //         'Accept': 'application/json'
    //     }
    // };

    try {
        const { data } = await axios.request(options);
        return data.events || [];
    } catch (error) {
        console.error('Erreur lors de la récupération des événements HighLevel:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Récupère un rendez-vous spécifique par son ID
 * @param {string} eventId - ID du rendez-vous à récupérer
 * @returns {Promise<Object>} Détails du rendez-vous
 */
async function getAppointment(eventId) {
    if (!eventId) {
        throw new Error('eventId est requis');
    }

    const options = {
        method: 'GET',
        url: `${config.BASE_URL}/calendars/events/appointments/${eventId}`,
        headers: config.headers
    };

    try {
        const { data } = await axios.request(options);
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération du rendez-vous:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = {
    getAllAppointments,
    getAppointment
};