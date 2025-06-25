
// Charge les variables d'environnement depuis le fichier .env
require('dotenv').config();

const express = require('express');
const app = express();
// Le port sur lequel le serveur va écouter. Prend la valeur de .env si définie, sinon 3000.
const port = process.env.PORT || 3000; 

const syncHeinzToHighLevel = require('./services/syncScheduler'); 
// app.js
const appointmentRoutes = require('./routes/appointments');

// Middleware Express pour analyser les corps de requêtes JSON (très important pour les webhooks)
app.use(express.json());


app.use('/appointments', appointmentRoutes);

// --- Endpoint de Vérification de Santé (Health Check) ---
// Une simple route GET pour vérifier que le serveur est bien démarré.
// Vous pouvez y accéder dans votre navigateur : http://localhost:3000/ (ou votre IP/domaine)
app.get('/', (req, res) => {
  res.status(200).send('Middleware HighLevel-Heinz est en cours d\'exécution !');
});

app.get('/initiate', require('./lib/initiate'));

app.get('/refresh', require('./lib/refresh'));

app.get('/oauth/callback', require('./lib/callback'));


// --- Endpoint Webhook HighLevel ---
// C'est l'URL que votre workflow HighLevel appellera quand un nouveau rendez-vous est pris.
// L'URL sera : http://localhost:3000/webhook/highlevel-booking (ou votre IP/domaine)
app.post('/webhook/highlevel-booking', (req, res) => {
  console.log('--- Webhook reçu de HighLevel ---');
  console.log('Headers:', req.headers); // Utile pour le débogage (voir les en-têtes envoyés par HL)
  console.log('Corps (Body) :', JSON.stringify(req.body, null, 2)); // Affiche le contenu JSON du webhook

  // --- IMPORTANT ---
  // Répondez immédiatement au webhook HighLevel avec un statut 200 OK.
  // HighLevel attend une réponse rapide pour ne pas considérer l'envoi comme un échec.
  res.status(200).send('Webhook bien reçu par le middleware.');

  // --- La logique d'intégration avec l'API Heinz ira ici ---
  // Nous ajouterons ici le code pour obtenir le token Heinz, créer l'utilisateur, créer la réservation.
  // Pour l'instant, ça log juste ce qui est reçu.
});

// Démarre le serveur Express.js et le fait écouter sur le port défini
app.listen(port, () => {
  console.log(`Middleware HighLevel-Heinz écoute sur http://localhost:${port}`);
  console.log(`Endpoint Webhook : http://localhost:${port}/webhook/highlevel-booking`);
  console.log(`N'oubliez pas de configurer ce webhook dans votre workflow HighLevel !`);
  // syncHeinzToHighLevel();
});