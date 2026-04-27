# Omni-Notify

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js)
![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=flat-square&logo=socket.io)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=flat-square&logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A real-time multi-channel notification platform built with Angular 17, Node.js, and Socket.io. Demonstrates scalable WebSocket architecture, JWT authentication, async Node.js patterns, and CI/CD pipelines via GitHub Actions.

**Professional Context:** This project serves as a technical synthesis of my decade-long journey as a Full Stack Developer and Tech Lead. It implements the asynchronous architecture patterns I've used to build B2B SaaS platforms, where I successfully achieved a **60% reduction in backend response times**.

---

## 💡 Engineering Design Decisions

- **Hybrid State Management:** I've coupled Angular Signals for granular UI updates with RxJS for complex WebSocket stream processing — a pattern I recommend for high-frequency data dashboards.
- **Modular Monolith Strategy:** The project structure follows a "Feature-First" modularity (e.g., `/features/dashboard`). This reflects my approach to team leadership: isolating concerns to simplify code reviews, testing, and junior developer onboarding.
- **Real-time Reliability:** Leveraging my experience with Socket.io and Web-IDEs, I've implemented heartbeat checks and reconnection logic to ensure a stable "Always-On" user experience.

---

## Features

- **Real-time dashboard** — live notifications via Socket.io, no page reload required
- **JWT authentication** — secured REST API and WebSocket tunnels
- **Event history** — search and filter archived notifications from MongoDB
- **Load simulator** — stress-test script to generate burst traffic and validate system resilience
- **Dockerized** — single `docker-compose up` to run the full stack
- **CI/CD pipeline** — GitHub Actions for linting, testing, and build validation

---

## Performance KPIs

| Metric | Target |
|--------|--------|
| End-to-end latency (API → dashboard) | < 200ms |
| Backend async architecture | Node.js non-blocking I/O |
| Availability | Nginx reverse proxy + PM2 process manager |
| TypeScript coverage | 100% |

> **Note on Performance:** The < 200ms latency target is modeled after strict production SLAs I managed for real-time SMS and POS platforms.

---

## Tech Stack

### Backend
- **Node.js 20** + **Express** — async REST API
- **TypeScript 5** — fully typed architecture
- **Socket.io 4** — bidirectional WebSocket communication
- **MongoDB 7** + **Mongoose** — document storage for notifications and users
- **JWT** — stateless authentication

### Frontend
- **Angular 17** — standalone components, signals-ready
- **RxJS** — reactive streams for real-time message handling
- **TypeScript** — end-to-end type safety

### Infrastructure & DevOps
- **Docker** + **Docker Compose** — containerized full stack
- **Nginx** — reverse proxy for high availability
- **PM2** — Node.js process manager
- **GitHub Actions** — CI/CD pipeline (lint, test, build)

---

## Project Structure

```
/omni-notify-saas
├── /backend
│   ├── /src
│   │   ├── /auth              # JWT middleware & strategy
│   │   ├── /notifications     # REST endpoints + Socket.io logic
│   │   ├── /database          # Mongoose connection & models
│   │   │   ├── models/
│   │   │   │   ├── User.ts
│   │   │   │   └── Notification.ts
│   │   │   └── connection.ts
│   │   └── server.ts          # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── /frontend
│   ├── /src
│   │   ├── /core              # Auth service, HTTP interceptors
│   │   ├── /features
│   │   │   ├── /dashboard     # Real-time notification view
│   │   │   └── /history       # Event log & search
│   │   └── /shared            # Reusable components
│   ├── Dockerfile
│   └── angular.json
│
├── /infrastructure
│   ├── docker-compose.yml
│   └── nginx.conf
│
├── /docs
│   ├── architecture.png       # System diagram
│   └── api-reference.md       # REST endpoints & payloads
│
├── .gitignore
└── README.md
```

---

## Architecture

**Enterprise Infrastructure Overview:**

1. **Ingress:** Nginx serves as a Reverse Proxy / Load Balancer — all traffic enters through port 80.
2. **Process Management:** Node.js instances are managed by PM2 for cluster-mode scalability and automatic restarts.
3. **Data Persistence:** MongoDB stores notification state, ensuring atomic updates for delivery status.

```
Angular client (port 4200)
  ├── REST  ──────→  Express API (port 3000)  ──→  MongoDB
  └── WS   ←──────→  Socket.io               ──→  notification rooms
                             ↓
                        Nginx (port 80)
                        reverse proxy
```

**Notification flow:**
1. Client or simulator sends a POST to `/api/notifications`
2. Express stores the event in MongoDB via Mongoose
3. Socket.io broadcasts to the relevant room
4. Angular dashboard receives the event via RxJS observable — renders instantly

---

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)

### Run with Docker

```bash
git clone https://github.com/nabilaDev/omni-notify-saas
cd omni-notify-saas
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Angular dashboard | http://localhost:4200 |
| Node.js API | http://localhost:3000 |
| MongoDB | mongodb://localhost:27017 |

### Run locally (development)

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (separate terminal)
cd frontend
npm install
ng serve
```

---

## API Reference

### Authentication

```
POST /api/auth/register    — create account
POST /api/auth/login       — returns JWT token
```

### Notifications

```
GET    /api/notifications          — paginated history
POST   /api/notifications          — send notification (triggers Socket.io broadcast)
GET    /api/notifications/:id      — single event detail
```

All routes except auth require `Authorization: Bearer <token>` header.

### WebSocket events

```
connect          — join user room after JWT handshake
notification:new — received on dashboard when new event is broadcast
```

---

## Load Simulator

Generate burst traffic to test system performance:

```bash
cd backend
npm run simulate -- --count 100 --interval 50
```

This sends 100 notifications at 50ms intervals, validating the < 200ms latency target.

---

## CI/CD Pipeline

GitHub Actions runs on every push to `main`:

```
lint → typecheck → test → docker build
```

See `.github/workflows/ci.yml` for configuration.

---

## MongoDB Schema

### User
```typescript
{
  _id: ObjectId,
  email: string,
  passwordHash: string,
  createdAt: Date,
  lastLogin: Date
}
```

### Notification
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  channel: 'websocket' | 'rest',
  message: string,
  status: 'pending' | 'delivered' | 'failed',
  createdAt: Date,
  deliveredAt: Date
}
```

---

## Roadmap

- [ ] Multi-room support (broadcast to user groups)
- [ ] Email channel via Nodemailer
- [ ] Notification retry queue
- [ ] Grafana dashboard for latency metrics

---

## License

MIT — free to use, fork, and adapt.

---

**Developed by [Nabila SALHI](https://www.linkedin.com/in/nabila-salhi-982582a2/)**
Senior Full Stack JavaScript Developer & Tech Lead | ENISO Applied Computer Science Engineer.
