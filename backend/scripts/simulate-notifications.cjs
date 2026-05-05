const axios = require('axios');
require('dotenv').config();

// Récupération des arguments (ex: --count 100 --interval 50)
const args = process.argv.slice(2);
const count = parseInt(args[args.indexOf('--count') + 1]) || 10;
const interval = parseInt(args[args.indexOf('--interval') + 1]) || 1000;
const TOKEN = process.env.TEST_TOKEN || ''; // À configurer dans .env
const API_URL = process.env.API_URL || 'http://localhost:3000/api/notifications';

console.log(`🚀 Démarrage de la simulation : ${count} notifications (Intervalle: ${interval}ms)`);

let sentCount = 0;

const sendNotification = async () => {
  if (sentCount >= count) {
    console.log('✅ Simulation terminée avec succès.');
    process.exit(0);
  }

  const payload = {
    title: `Alerte Système #${sentCount + 1}`,
    message: `Ceci est une notification de test générée automatiquement.`,
    channel: 'websocket',
    type: sentCount % 2 === 0 ? 'info' : 'warning',
    timestamp: new Date()
  };

  try {
    await axios.post(API_URL, payload, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    sentCount++;
    console.log(`[${sentCount}/${count}] Notification envoyée...`);
  } catch (error) {
    console.error(`❌ Erreur lors de l'envoi : ${error.message}`);
  }
};

// Lancement de la boucle
const timer = setInterval(() => {
  if (sentCount < count) {
    sendNotification();
  } else {
    clearInterval(timer);
  }
}, interval);