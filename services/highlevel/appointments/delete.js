const axios = require('axios');
const config = require('../config');

/**
 * Supprime un rendez-vous dans HighLevel
 * @param {string} eventId - ID du rendez-vous à supprimer
 * @returns {Promise<Object>} Résultat de la suppression
 */
async function deleteAppointment(eventId) {
    if (!eventId) {
        throw new Error('eventId est requis');
    }

    const options = {
        method: 'DELETE',
        url: `${config.BASE_URL}/calendars/events/${eventId}`,
        headers: config.headers
    };


    try {
        const { data } = await axios.request(options);
        console.log(`Rendez-vous supprimé avec succès: ${eventId}`);
        return data;
    } catch (error) {
        console.error('Erreur lors de la suppression du rendez-vous:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = deleteAppointment;