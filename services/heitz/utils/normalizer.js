/**
 * Normalise un créneau Heitz pour la synchronisation
 * @param {Object} heitzSlot - Le créneau complet de Heitz
 * @returns {Object} Données normalisées
 */
function normalizeHeitzSlot(heitzSlot) {
    return {
        id: heitzSlot.id.toString(),
        activity: heitzSlot.activity,
        room: heitzSlot.room,
        start: new Date(heitzSlot.start).toISOString(),
        end: new Date(heitzSlot.end).toISOString(),
        placesMax: heitzSlot.placesMax,
        placesTaken: heitzSlot.placesTaken,
        coach: heitzSlot.employee
    };
}

module.exports = {
    normalizeHeitzSlot
};