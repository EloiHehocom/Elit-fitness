require('dotenv').config();

const { getPlanning } = require('./heitz/planning');
const { normalizeHeitzSlot } = require('./heitz/utils/normalizer');
const {
    getAllAppointments,
    createAppointment,
    updateAppointment,
} = require('./highlevel/appointments');
const { cleanCalendar } = require('./highlevel/cleanup');

async function syncHeitzToHighLevel() {
    console.log('--- Début de la synchronisation Heitz -> HighLevel ---');
    try {
        // Calculer les timestamps pour les 30 prochains jours
        const startTime = Date.now();
        const endTime = startTime + (30 * 24 * 60 * 60 * 1000);

        // 1. Récupérer les créneaux Heitz
        console.log('\nPhase 1: Récupération des créneaux Heitz');
        const rawHeitzSlots = await getPlanning({
            startDate: new Date(startTime).toISOString().split('T')[0],
            endDate: new Date(endTime).toISOString().split('T')[0]
        });
        const heitzSlots = rawHeitzSlots.map(normalizeHeitzSlot);
        console.log(`${heitzSlots.length} créneaux récupérés de Heitz.`);

        // 2. Récupérer les événements existants dans HighLevel
        console.log('\nPhase 2: Récupération des événements HighLevel');
        const existingEvents = await getAllAppointments({ startTime, endTime });
        console.log(`${existingEvents.length} événements existants dans HighLevel.`);

        // 3. Synchroniser les créneaux
        console.log('\nPhase 3: Synchronisation des créneaux');
        let created = 0, updated = 0;

        for (const heitzSlot of heitzSlots) {
            try {
                // Chercher si l'événement existe déjà
                const existingEvent = existingEvents.find(event => {
                    const titleMatch = event.title?.includes(`[ID:${heitzSlot.id}]`);
                    const roomMatch = event.location === heitzSlot.room;
                    const timeMatch = event.startTime === heitzSlot.start && event.endTime === heitzSlot.end;
                    
                    return titleMatch || (roomMatch && timeMatch);
                });

                if (existingEvent) {
                    await updateAppointment(existingEvent.id, heitzSlot);
                    updated++;
                    console.log(`Créneau mis à jour: ${heitzSlot.activity}`);
                } else {
                    await createAppointment(heitzSlot);
                    created++;
                    console.log(`Nouveau créneau créé: ${heitzSlot.activity}`);
                }
            } catch (error) {
                console.error(`Erreur lors du traitement du créneau ${heitzSlot.id}:`, error.message);
            }
        }

        console.log('\n--- Synchronisation terminée ---');
        console.log(`Créneaux créés: ${created}`);
        console.log(`Créneaux mis à jour: ${updated}`);

    } catch (error) {
        console.error('Erreur générale lors de la synchronisation:', error.message);
        throw error;
    }
}

module.exports = syncHeitzToHighLevel;