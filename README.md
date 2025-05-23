# Projet de Synchronisation Heitz vers HighLevel

Ce projet a pour but de synchroniser les plannings ou rendez-vous depuis un système "Heitz" (source de données) vers une plateforme "HighLevel" (destination). Il récupère les créneaux de Heitz, les compare aux événements existants dans HighLevel, puis crée ou met à jour les rendez-vous dans HighLevel en conséquence. Ce README est destiné à l'équipe interne.

## Fonctionnalités principales

*   Récupération des plannings depuis le système Heitz pour une période donnée (par défaut les 30 prochains jours).
*   Normalisation des données des créneaux Heitz (notamment le format des dates).
*   Récupération des rendez-vous existants depuis HighLevel.
*   Comparaison et synchronisation :
    *   Création de nouveaux rendez-vous dans HighLevel si le créneau Heitz n'existe pas.
    *   Mise à jour des rendez-vous existants dans HighLevel si le créneau Heitz correspondant a été modifié.
*   Gestion des erreurs lors du traitement des créneaux individuels.
*   Mécanisme de rafraîchissement du token d'accès HighLevel.
*   Option de nettoyage du calendrier HighLevel.

## Prérequis

*   [Node.js](https://nodejs.org/) (version LTS recommandée)
*   [npm](https://www.npmjs.com/) (généralement inclus avec Node.js)

## Installation

1.  Clonez ce dépôt (si ce n'est pas déjà fait) :
    ```bash
    git clone <URL_DU_DEPOT_GIT_INTERNE>
    cd <NOM_DU_REPERTOIRE_DU_PROJET>
    ```

2.  Installez les dépendances du projet :
    ```bash
    npm install
    ```

## Configuration de l'environnement

Ce projet utilise des variables d'environnement pour gérer les configurations sensibles et les clés API.

1.  Créez un fichier nommé `.env` à la racine du projet. Ce fichier est listé dans `.gitignore` et ne doit pas être versionné.
2.  Remplissez le fichier `.env` avec les variables nécessaires. Voici une liste des variables typiquement utilisées :

    ```env
    # === Configuration API HighLevel (pour la synchronisation) ===
    HL_BASE_URL=https://services.leadconnectorhq.com # URL de base de l'API HighLevel
    HL_API_KEY=votrecléAPIprincipaleoubearertoken # Clé d'autorisation pour l'API HighLevel (peut être un Bearer Token)
    HL_USER_ID=votreidutilisateurassignépar_défaut
    HL_CALENDAR_ID=votreidcalendriersourcepourhighlevel
    HL_LOCATION_ID=votreidlocationpourhighlevel
    HL_CONTACT_ID=votreidcontactpardéfaut (si utilisé)

    # === Configuration OAuth HighLevel (pour le rafraîchissement du token) ===
    # Utilisé par lib/refresh.js
    HIGHLEVEL_CLIENT_ID=votreclientid_oauth_highlevel
    HIGHLEVEL_CLIENT_SECRET=votreclientsecret_oauth_highlevel
    HIGHLEVEL_REFRESH_TOKEN=votretokenderafraichissement_oauth_highlevel

    # === Configuration API Heitz (si applicable) ===
    # HEITZ_API_URL=https://api.heitz.com/
    # HEITZ_API_KEY=votrecléapiheitz

    # === (Optionnel) Secret pour protéger l'endpoint de rafraîchissement en dev ===
    # DEV_REFRESH_ENDPOINT_SECRET=unsecretpourprotegerlendpointdevrefresh
    ```

    **Note importante :** Vérifiez les fichiers de configuration (ex: `services/highlevel/config.js` - s'il existe - ou l'utilisation directe de `process.env` dans les modules) pour la liste exacte et les noms des variables d'environnement requises.

## Processus de Rafraîchissement du Token HighLevel

L'accès à l'API HighLevel se fait généralement via un `access_token` qui a une durée de vie limitée (par exemple, 24 heures). Pour maintenir un accès continu sans intervention manuelle constante, un `refresh_token` est utilisé.

1.  **Logique de rafraîchissement** :
    *   Le fichier `lib/refresh.js` contient la logique pour échanger un `refresh_token` (stocké dans `process.env.HIGHLEVEL_REFRESH_TOKEN`) contre un nouvel `access_token` et potentiellement un *nouveau* `refresh_token`.
    *   Cet échange nécessite `HIGHLEVEL_CLIENT_ID` et `HIGHLEVEL_CLIENT_SECRET`.
    *   Si un endpoint est configuré dans `app.js` (par exemple, `/refresh-token`) pour appeler la fonction de `lib/refresh.js`, c'est par cet endpoint que le processus est initié.

2.  **Mise à jour MANUELLE du `HIGHLEVEL_REFRESH_TOKEN`** :
    *   Lorsque l'API HighLevel fournit un nouvel `access_token`, elle **peut également fournir un nouveau `refresh_token`**.
    *   Si un nouveau `refresh_token` est retourné dans la réponse de l'appel à `/oauth/token` (loggé par `lib/refresh.js`), il est **impératif de mettre à jour manuellement la variable `HIGHLEVEL_REFRESH_TOKEN` dans votre fichier `.env` avec cette nouvelle valeur.**
    *   Si vous ne mettez pas à jour le `refresh_token` et que l'ancien expire ou est invalidé (certaines API font tourner les refresh tokens à chaque utilisation), le processus de rafraîchissement échouera.
    *   Les `access_token` expirent (par exemple, après 24h), mais les `refresh_token` ont une durée de vie beaucoup plus longue ou peuvent être valides jusqu'à révocation ou rotation.

3.  **Déclenchement (Exemple)** :
    *   Pour déclencher le rafraîchissement, vous pourriez avoir un endpoint comme `/refresh-token` dans `app.js` qui appelle la fonction de `lib/refresh.js`. Un appel `GET` ou `POST` à cet endpoint initierait le processus.
    *   En développement, si vous avez implémenté le `DEV_REFRESH_ENDPOINT_SECRET`, n'oubliez pas d'inclure le header `X-Dev-Secret` dans votre requête.

    ```javascript
    // Exemple de ce que pourrait contenir app.js pour exposer le refresh
    // const express = require('express');
    // const app = express();
    // const refreshCallback = require('./lib/refresh');
    //
    // app.get('/refresh-token', refreshCallback); // ou app.post
    //
    // app.listen(3000, () => console.log('Serveur démarré'));
    ```

## Utilisation du script de synchronisation

Pour lancer le script principal de synchronisation (contenu dans `services/syncScheduler.js` et probablement appelé depuis `app.js` ou via un script npm) :

```bash
npm start
```
ou si un script spécifique est défini dans `package.json` :
```bash
npm run <NOM_DU_SCRIPT_DE_SYNC>
```
Le script affichera des logs dans la console indiquant sa progression.

## Structure détaillée du Projet

*   `app.js`:
    *   **Rôle** : Point d'entrée principal de l'application.
    *   **Fonctions typiques** : Initialisation du serveur Express (si c'est une application web), configuration des middlewares, montage des routes (comme l'endpoint de rafraîchissement de token), et potentiellement le démarrage programmé ou l'appel initial du `syncScheduler`.

*   `services/`: Contient la logique métier et les interactions avec les services externes.
    *   `heitz/`: Modules spécifiques à l'intégration avec le système Heitz.
        *   `planning/index.js` (ou nom similaire) : Responsable de la communication avec l'API Heitz pour récupérer les données brutes du planning.
        *   `utils/normalizer.js`: Contient la fonction `normalizeHeitzSlot`. Son rôle est crucial : transformer les données brutes des créneaux Heitz en une structure de données standardisée et propre, notamment en s'assurant que les dates (`start`, `end`) sont converties au format ISO 8601 UTC (`.toISOString()`). Ce format standard est ensuite utilisé par le reste de l'application.
    *   `highlevel/`: Modules spécifiques à l'intégration avec l'API HighLevel.
        *   `appointments/`: Regroupe toutes les opérations CRUD (Create, Read, Update, Delete) pour les rendez-vous HighLevel.
            *   `create.js`: Fonction `createAppointment(params, isHeitzSlot)`. Crée un rendez-vous. Le flag `isHeitzSlot` (qui devrait être `true` par défaut ou explicitement lors de la synchro) indique si les `params` proviennent d'un créneau Heitz et nécessitent donc un formatage via `formatHeitzSlotForHighLevel`.
            *   `get.js`: Fonctions `getAllAppointments` (pour récupérer tous les événements sur une période) et `getAppointment` (pour un événement spécifique par ID).
            *   `update.js`: Fonction `updateAppointment` pour modifier les détails d'un rendez-vous existant dans HighLevel.
            *   `delete.js`: Fonction `deleteAppointment` pour supprimer un rendez-vous de HighLevel.
            *   `formatters.js`: Contient `formatHeitzSlotForHighLevel(heitzSlot)`. Cette fonction prend un créneau Heitz normalisé (avec `start` et `end` déjà en ISO) et le transforme en l'objet attendu par l'API HighLevel pour la création/mise à jour, notamment en mappant `heitzSlot.start` vers `startTime` et `heitzSlot.end` vers `endTime`.
        *   `config.js` (ou variables d'environnement utilisées directement) : Pourrait contenir la configuration de base de l'API HighLevel (URL de base, ID utilisateur par défaut, ID calendrier par défaut, etc., souvent chargés depuis `process.env`). *Note : Dans votre projet, il semble que des variables `config.USER_ID`, etc. soient importées, suggérant l'existence d'un tel fichier ou d'un objet config initialisé quelque part.*
        *   `cleanup/index.js`: Contient la fonction `cleanCalendar`. Utile pour vider complètement le calendrier HighLevel des événements sur une période donnée (par exemple, avant une resynchronisation complète ou pour des tests).
    *   `syncScheduler.js`: Fichier central (`syncHeitzToHighLevel` function) qui orchestre le processus de synchronisation de bout en bout :
        1.  Calcule la période de synchronisation (par exemple, les 30 prochains jours).
        2.  Appelle les modules Heitz pour récupérer et normaliser les créneaux (`getPlanning`, `normalizeHeitzSlot`).
        3.  Appelle les modules HighLevel pour récupérer les rendez-vous déjà existants (`getAllAppointments`).
        4.  Compare les créneaux Heitz avec les rendez-vous HighLevel existants (basé sur un ID unique ou une combinaison de titre/date/salle).
        5.  Pour chaque créneau Heitz, décide s'il faut créer un nouveau rendez-vous (`createAppointment`) ou mettre à jour un existant (`updateAppointment`) dans HighLevel.
        6.  Loggue les actions effectuées et les erreurs rencontrées.

*   `lib/`: Contient des bibliothèques ou des utilitaires plus génériques, non directement liés à la logique métier principale de Heitz ou HighLevel.
    *   `refresh.js`: Logique pour le rafraîchissement du token d'accès OAuth2 de HighLevel. Expose une fonction `callback` destinée à être utilisée comme gestionnaire de route Express. Elle prend en charge l'appel à l'endpoint `/oauth/token` de HighLevel avec les `client_id`, `client_secret`, et `refresh_token`.

*   `.env`: **Fichier critique et sensible, NON versionné (doit être dans `.gitignore`)**. Contient toutes les clés API, les secrets, les identifiants de connexion, et toute autre configuration qui varie entre les environnements ou qui ne doit pas être exposée dans le code.

*   `.gitignore`: Fichier standard de Git spécifiant les fichiers et dossiers que Git doit ignorer lors du versionnement. Essentiel pour exclure `node_modules/`, `.env`, les fichiers de logs locaux, etc.

*   `package.json`: Fichier de manifeste de Node.js. Définit le nom du projet, la version, les scripts exécutables (comme `npm start`, `npm run dev`), et surtout les dépendances du projet (bibliothèques externes utilisées) et les `devDependencies`.

*   `package-lock.json`: Généré automatiquement par npm. Enregistre les versions exactes de chaque dépendance installée, y compris les dépendances transitives. Assure que les installations sont reproductibles sur différentes machines ou à différents moments.

*   `utils/` (dossier à la racine, si présent) : Peut contenir des fonctions utilitaires globales utilisées à travers plusieurs parties du projet, qui ne sont pas spécifiques à Heitz ou HighLevel (par exemple, des formateurs de date génériques, des fonctions d'aide pour les logs, etc.).

*   `README.md`: Ce document, fournissant une vue d'ensemble du projet, des instructions d'installation, de configuration, et des détails sur la structure pour l'équipe.

## Dépannage courant

*   **Erreur `startTime must be a valid ISO 8601 date string` (HighLevel)**:
    *   Vérifiez que `normalizeHeitzSlot` dans `services/heitz/utils/normalizer.js` convertit bien `start` et `end` en utilisant `.toISOString()`.
    *   Assurez-vous que `formatHeitzSlotForHighLevel` dans `services/highlevel/appointments/formatters.js` utilise directement `heitzSlot.start` (déjà formaté) pour `startTime` et `heitzSlot.end` pour `endTime`, SANS les reconvertir avec `new Date(...).toISOString()`.
    *   Confirmez que l'appel à `createAppointment` dans `services/syncScheduler.js` se fait bien avec le second argument `isHeitzSlot` à `true` (ou que la valeur par défaut de ce paramètre est `true` dans la définition de `createAppointment` dans `services/highlevel/appointments/create.js`).
*   **Échec du rafraîchissement du token** :
    *   Vérifiez que `HIGHLEVEL_CLIENT_ID`, `HIGHLEVEL_CLIENT_SECRET`, et `HIGHLEVEL_REFRESH_TOKEN` dans `.env` sont corrects et à jour.
    *   Si un nouveau `refresh_token` a été fourni lors d'un précédent rafraîchissement, assurez-vous que `HIGHLEVEL_REFRESH_TOKEN` a été mis à jour avec cette nouvelle valeur.
    *   Examinez les logs de `lib/refresh.js` pour le message d'erreur exact de l'API HighLevel.
*   **Autres erreurs API** : Examinez les logs de la console pour des messages d'erreur détaillés. Souvent, l'API HighLevel (ou Heitz) retourne des informations utiles dans le corps de la réponse d'erreur.