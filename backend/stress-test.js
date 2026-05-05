import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3000/api/notifications';
const AUTH_TOKEN = process.env.TEST_TOKEN || ''; // À configurer dans .env.test
const TOTAL_NOTIFICATIONS = 100; // Nombre de notifications par rafale
const BURST_INTERVAL = 500; // Intervalle entre les rafales en ms

const sendNotification = async (index) => {
  try {
    const payload = {
      message: `Test de charge #${index} - Simulation de trafic intense`,
      channel: 'websocket'
    };

    const response = await axios.post(API_URL, payload, {
      headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
    });
    
    console.log(`✅ [${index}] Notification créée : ${response.status}`);
  } catch (error) {
    console.error(`❌ [${index}] Erreur : ${error.response?.status || error.message}`);
  }
};

const runStressTest = async () => {
  console.log(`🚀 Démarrage du stress-test : ${TOTAL_NOTIFICATIONS} messages...`);
  
  const startTime = Date.now();
  const promises = [];

  for (let i = 1; i <= TOTAL_NOTIFICATIONS; i++) {
    promises.push(sendNotification(i));
  }

  await Promise.all(promises);
  
  const duration = (Date.now() - startTime) / 1000;
  console.log(`\n🏁 Test terminé en ${duration}s.`);
  console.log(`📊 Moyenne : ${Math.round(TOTAL_NOTIFICATIONS / duration)} req/sec`);
};

runStressTest();