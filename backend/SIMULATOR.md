# OMNI-NOTIFY Backend - Simulator Guide

## Lancer le Simulator

Le simulator génère des notifications de test pour valider la performance du système.

### En développement local:

```bash
cd backend
npm install
node scripts/simulate-notifications.cjs --count 100 --interval 50
```

**Arguments:**
- `--count` : Nombre de notifications à générer (défaut: 10)
- `--interval` : Délai entre chaque notification en ms (défaut: 1000)

**Exemple:** Générer 100 notifications toutes les 50ms
```bash
node scripts/simulate-notifications.cjs --count 100 --interval 50
```

### Avec Docker:

```bash
# Lancer Docker Compose
docker-compose up -d

# Attendre que le backend soit prêt (~10 secondes)
sleep 10

# Lancer le simulator
docker-compose exec backend node scripts/simulate-notifications.cjs --count 50 --interval 100
```

## Configuration

Le simulator utilise vos variables d'environnement (`.env`):
- `TEST_TOKEN` : JWT token du test (obtenir via `/api/auth/login`)
- `API_URL` : URL de l'API (défaut: http://localhost:3000/api/notifications)

### Obtenir un TEST_TOKEN:

1. **Créer un compte de test:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

2. **Se connecter:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

3. **Copier le token retourné** dans `.env` comme `TEST_TOKEN`

## Performance KPI

- ✅ **Latence < 200ms** : API → Dashboard
- ✅ **Architecture async** : Node.js non-blocking I/O
- ✅ **Scalabilité** : Nginx + PM2 (production)

## Dépannage

**Problème:** "Cannot find module 'dotenv'"
```bash
npm install dotenv
```

**Problème:** Token expiré
```bash
# Générer un nouveau token via /api/auth/login et mettre à jour .env
```

**Problème:** Connexion refusée
```bash
# Vérifier que le backend est en cours d'exécution:
curl http://localhost:3000/health
```
