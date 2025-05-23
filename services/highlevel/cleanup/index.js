const { getAllAppointments } = require('../appointments/get');
const deleteAppointment = require('../appointments/delete');

/**
 * Nettoie tous les rendez-vous du planning HighLevel sur une période donnée
 * @param {Object} params - Paramètres de nettoyage
 * @param {number} [params.startTime] - Timestamp de début, par défaut maintenant
 * @param {number} [params.endTime] - Timestamp de fin, par défaut dans 30 jours
 * @param {number} [params.pauseInterval=5] - Nombre d'événements avant pause
 * @param {number} [params.pauseDuration=1000] - Durée de la pause en ms
 * @returns {Promise<Object>} Statistiques de nettoyage
 */
async function cleanCalendar(params = {}) {
    const {
        startTime = Date.now(),
        endTime = startTime + (30 * 24 * 60 * 60 * 1000),
        pauseInterval = 5,
        pauseDuration = 1000
    } = params;

    console.log('Début du nettoyage du calendrier...');
    const events = await getAllAppointments({ startTime, endTime });
    
    let stats = {
        total: events.length,
        deleted: 0,
        errors: 0
    };

    console.log(`${events.length} événements trouvés.`);

    for (const event of events) {
        try {
            await deleteAppointment(event.id);
            stats.deleted++;
            console.log(`Événement supprimé: ${event.title}`);

            // Pause pour éviter le rate limiting
            if (stats.deleted % pauseInterval === 0) {
                await new Promise(resolve => setTimeout(resolve, pauseDuration));
            }
        } catch (error) {
            console.error(`Erreur lors de la suppression de l'événement ${event.id}:`, error.message);
            stats.errors++;
        }
    }

    console.log('Rapport de nettoyage:', stats);
    return stats;
}

module.exports = {
    cleanCalendar
};

// Exemple d'utilisation
// const { cleanCalendar } = require('./services/highlevel/cleanup');

// // Nettoie tout sur les 30 prochains jours
// await cleanCalendar();

// // Ou avec des paramètres spécifiques
// await cleanCalendar({
//     startTime: Date.now(),
//     endTime: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 jours
//     pauseInterval: 10, // Pause tous les 10 événements
//     pauseDuration: 2000 // Pause de 2 secondes
// });