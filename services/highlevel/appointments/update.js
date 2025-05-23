const axios = require('axios');
const config = require('../config');
const { formatHeitzSlotForHighLevel } = require('./formatters');

/**
 * Met à jour un rendez-vous dans HighLevel
 * @param {string} appointmentId - ID du rendez-vous à mettre à jour
 * @param {Object} params - Paramètres de mise à jour ou créneau Heitz
 * @param {boolean} [isHeitzSlot=false] - Indique si les params sont un créneau Heitz
 * @returns {Promise<Object>} Le rendez-vous mis à jour
 */
async function updateAppointment(appointmentId, heitzSlot) {
    if (!appointmentId) {
        throw new Error('appointmentId est requis');
    }

    const defaultParams = {
        assignedUserId: config.USER_ID,
        calendarId: config.CALENDAR_ID,
        locationId: config.LOCATION_ID,
        contactId: config.CONTACT_ID
    };

    // Si c'est un créneau Heitz, on le formate d'abord
    const appointmentData = {
        ...defaultParams,
        ...formatHeitzSlotForHighLevel(heitzSlot)
    };

    const options = {
        method: 'PUT',
        url: `${config.BASE_URL}/calendars/events/appointments/${appointmentId}`,
        headers: config.headers,
        data: appointmentData
    };

    try {
        const { data } = await axios.request(options);
        console.log(`Rendez-vous mis à jour avec succès: ${appointmentData.title}`);
        return data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du rendez-vous:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = updateAppointment;