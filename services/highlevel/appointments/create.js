const axios = require('axios');
const config = require('../config');
const { formatHeitzSlotForHighLevel } = require('./formatters');

/**
 * Crée un rendez-vous dans HighLevel
 * @param {Object} params - Paramètres du rendez-vous ou créneau Heitz
 * @param {boolean} [isHeitzSlot=true] - Indique si les params sont un créneau Heitz
 * @returns {Promise<Object>} Le rendez-vous créé
 */
async function createAppointment(params = {}, isHeitzSlot = true) {
    const defaultParams = {
        assignedUserId: config.USER_ID,
        calendarId: config.CALENDAR_ID,
        locationId: config.LOCATION_ID,
        contactId: config.CONTACT_ID
    };

    // Si c'est un créneau Heitz, on le formate d'abord
    const appointmentData = isHeitzSlot 
        ? { ...defaultParams, ...formatHeitzSlotForHighLevel(params) }
        : { ...defaultParams, ...params };

    const options = {
        method: 'POST',
        url: `${config.BASE_URL}/calendars/events/appointments`,
        headers: config.headers,
        data: appointmentData
    };

    try {
        const { data } = await axios.request(options);
        console.log(`Rendez-vous créé avec succès: ${appointmentData.title}`);
        return data;
    } catch (error) {
        console.error('Erreur lors de la création du rendez-vous:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = createAppointment;

// Example usage:
// 1. Création à partir d'un créneau Heitz
// const heitzSlot = {
//     activity: "Yoga",
//     room: "Salle 1",
//     placesMax: 20,
//     placesTaken: 5,
//     start: "2024-03-20T10:00:00Z",
//     end: "2024-03-20T11:00:00Z",
//     id: "123"
// };
// const appointmentFromHeitz = await createAppointment(heitzSlot, true);

// // 2. Création directe avec des paramètres HighLevel (si besoin)
// const appointment = await createAppointment({
//     title: "Cours de Yoga",
//     startTime: "2024-03-20T10:00:00Z",
//     endTime: "2024-03-20T11:00:00Z",
//     meetingLocationType: 'custom',
//     meetingLocationId: 'default',
//     overrideLocationConfig: true,
//     appointmentStatus: 'confirmed',
//     address: "Salle 1",
//     notes: "Notes personnalisées"
// });