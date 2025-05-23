/**
 * Formate un créneau Heitz pour HighLevel
 * @param {Object} heitzSlot - Le créneau Heitz à formater
 * @param {string} heitzSlot.activity - Nom de l'activité
 * @param {string} heitzSlot.room - Nom de la salle
 * @param {number} heitzSlot.placesMax - Nombre de places maximum
 * @param {number} heitzSlot.placesTaken - Nombre de places prises
 * @param {string} heitzSlot.start - Date de début
 * @param {string} heitzSlot.end - Date de fin
 * @param {string} heitzSlot.id - ID Heitz
 * @returns {Object} Données formatées pour HighLevel
 */
function formatHeitzSlotForHighLevel(heitzSlot) {
    const placesDisponibles = heitzSlot.placesMax - heitzSlot.placesTaken;
    
    return {
        title: `${heitzSlot.activity} [ID:${heitzSlot.id}]`,
        meetingLocationType: 'custom',
        meetingLocationId: 'default',
        overrideLocationConfig: true,
        appointmentStatus: 'confirmed',
        ignoreDateRange: false,
        toNotify: false,
        ignoreFreeSlotValidation: true,
        address: heitzSlot.room,
        startTime: heitzSlot.start,
        endTime: heitzSlot.end,
        notes: `Cours : ${heitzSlot.activity}\nSalle : ${heitzSlot.room}\nPlaces disponibles : ${placesDisponibles}/${heitzSlot.placesMax}\nID Heitz: ${heitzSlot.id}`
    };
}

module.exports = {
    formatHeitzSlotForHighLevel
};