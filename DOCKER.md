# 🚀 OMNI-NOTIFY - Docker Setup Guide

## ⚡ Quick Start

```bash
# Démarrer la stack complète
docker-compose up --build

# Dans un nouveau terminal, lancer le simulator
docker-compose exec backend node scripts/simulate-notifications.cjs --count 50 --interval 100
```

**Accès:**
- 🖥️ Frontend → http://localhost:4200
- 🔌 Backend API → http://localhost:3000
- 🗄️ MongoDB → mongodb://localhost:27017

---

## 📋 Configuration Initiale

### 1. Copier les fichiers d'environnement

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend  
cp frontend/omni-notify-frontend/.env.example frontend/omni-notify-frontend/.env
```

### 2. Obtenir un token de test (pour le simulator)

```bash
# 1. Créer un compte de test
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# 2. Se connecter et récupérer le token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# 3. Copier le token retourné dans backend/.env comme TEST_TOKEN
```

### 3. Démarrer les services

```bash
# Build et démarrage
docker-compose up --build -d

# Vérifier le statut
docker-compose ps

# Logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 🧪 Simulator - Test de Charge

```bash
# 100 notifications en 5 secondes (50ms intervalle)
docker-compose exec backend node scripts/simulate-notifications.cjs --count 100 --interval 50

# 1000 notifications pour stress test
docker-compose exec backend node scripts/simulate-notifications.cjs --count 1000 --interval 10
```

**Voir le guide complet:** [backend/SIMULATOR.md](backend/SIMULATOR.md)

---

## 🛑 Arrêter les services

```bash
# Arrêter sans supprimer les données
docker-compose stop

# Redémarrer
docker-compose start

# Arrêter et supprimer tout (données incluses)
docker-compose down -v
```

---

## 🐛 Dépannage

**Port déjà utilisé:**
```bash
# Changer le port dans docker-compose.yml
# Exemple: "4201:4200" pour Angular sur port 4201
```

**Réinitialiser MongoDB:**
```bash
docker-compose down -v
docker-compose up --build
```

**Vérifier la santé des services:**
```bash
# Backend
curl http://localhost:3000/health

# Frontend (devrait retourner HTML)
curl http://localhost:4200
```

**Voir les logs détaillés:**
```bash
docker-compose logs backend -f --tail=100
```

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Docker Compose (Orchestration des services)            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐    ┌─────────────┐  ┌─────────────┐  │
│  │  Frontend   │    │   Backend   │  │   MongoDB   │  │
│  │ Angular 17  │◄──►│  Express    │◄─┤   (7.0)     │  │
│  │  Port 4200  │    │  Port 3000  │  │ Port 27017  │  │
│  └─────────────┘    └─────────────┘  └─────────────┘  │
│                            │                            │
│                     ┌──────┴──────┐                     │
│                     │  Socket.io  │                     │
│                     │  Real-time  │                     │
│                     └─────────────┘                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist de déploiement

- [ ] Docker & Docker Compose installés
- [ ] Fichiers `.env` configurés
- [ ] `docker-compose up --build` réussit
- [ ] Accès à http://localhost:4200
- [ ] Token de test généré et configuré
- [ ] Simulator lancé et fonctionnel
- [ ] Pas d'erreurs dans les logs

---

**Pour plus d'infos:** Voir le [README.md](README.md)
