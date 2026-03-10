<div align="center">

```
██████╗ ███████╗██╗   ██╗ ██████╗ ██████╗ ██╗      ██╗      █████╗ ██████╗ 
██╔══██╗██╔════╝██║   ██║██╔════╝██╔═══██╗██║      ██║     ██╔══██╗██╔══██╗
██║  ██║█████╗  ██║   ██║██║     ██║   ██║██║      ██║     ███████║██████╔╝
██║  ██║██╔══╝  ╚██╗ ██╔╝██║     ██║   ██║██║      ██║     ██╔══██║██╔══██╗
██████╔╝███████╗ ╚████╔╝ ╚██████╗╚██████╔╝███████╗ ███████╗██║  ██║██████╔╝
╚═════╝ ╚══════╝  ╚═══╝   ╚═════╝ ╚═════╝ ╚══════╝ ╚══════╝╚═╝  ╚═╝╚═════╝ 
```

### 🌐 A full-stack developer collaboration platform — built with Next.js 14, TypeScript & MongoDB

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br/>

> *"Where developers meet, build, and grow — together."*

**[🚀 View Repository](https://github.com/AdityaDabgotra/DevCollab)** &nbsp;·&nbsp; **[🐛 Report a Bug](https://github.com/AdityaDabgotra/DevCollab/issues)** &nbsp;·&nbsp; **[💡 Request a Feature](https://github.com/AdityaDabgotra/DevCollab/issues)**

</div>

---

## 📖 Table of Contents

- [✨ Overview](#-overview)
- [🧠 Features](#-features)
- [🏗️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [⚙️ Getting Started](#️-getting-started)
- [🔐 Environment Variables](#-environment-variables)
- [🧪 Available Scripts](#-available-scripts)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [🧑‍💻 Author](#-author)
- [📄 License](#-license)

---

## ✨ Overview

**DevCollab** is a full-stack platform designed for developers who want to create, manage, and showcase their projects — and connect with others doing the same.

Whether you're looking for collaborators, sharing side projects, or exploring what other developers are building, DevCollab gives you a clean, fast, and focused space to do it.

```
Create a project  →  Invite collaborators  →  Track progress  →  Showcase your work
```

---

## 🧠 Features

### 👤 Developer Profiles
- Dedicated profile pages at `/profile/[username]`
- Display all your projects and contributions in one place
- Dynamic routing powered by the Next.js App Router

### 📁 Project Management
- Create, edit, and delete projects
- Tag your projects with tech stack labels
- Set project status: **Active**, **Completed**, or **Planned**

### 🤝 Collaboration System
- Invite other developers to collaborate on your projects
- Role-based participation per project
- Shared project workspace for team coordination

### 🔍 Discovery
- Browse developers and explore their work
- Search by username or tech stack
- Find projects that match your interests and skills

### ⚡ Performance
- Hybrid server + client component architecture
- Optimised routing with `useParams`
- Memoised data handling with `useMemo`
- TypeScript throughout for type safety and better developer experience

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 14+ (App Router) | Full-stack React framework |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Backend** | Next.js API Routes | Server-side route handlers |
| **Database** | MongoDB + Mongoose | Document-based data storage |
| **Auth** | JWT Authentication | Secure session management |
| **State** | React Hooks | Client-side state management |
| **Linting** | ESLint | Code quality enforcement |

---

## 📂 Project Structure

```
DevCollab/
│
├── src/                          # All application source code
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home / landing page
│   │   ├── profile/
│   │   │   └── [username]/       # Dynamic user profile pages
│   │   │       └── page.tsx
│   │   ├── projects/             # Project listing & detail pages
│   │   └── api/                  # API route handlers
│   │       ├── auth/             # Login / register endpoints
│   │       └── projects/         # Project CRUD endpoints
│   │
│   ├── components/               # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── ProjectCard.tsx
│   │   └── ProfileHeader.tsx
│   │
│   ├── models/                   # Mongoose schemas & models
│   │   ├── User.ts
│   │   └── Project.ts
│   │
│   └── lib/                      # Utilities & DB connection
│       ├── db.ts                 # MongoDB connection helper
│       └── auth.ts               # JWT helpers
│
├── public/                       # Static assets (images, icons)
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** `v18+`
- **npm** or **yarn**
- A **MongoDB** database — local or via [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier works great)

### 1 — Clone the repository

```bash
git clone https://github.com/AdityaDabgotra/DevCollab.git
cd DevCollab
```

### 2 — Install dependencies

```bash
npm install
```

### 3 — Set up environment variables

```bash
touch .env.local
```

Add your values inside — see [Environment Variables](#-environment-variables) below.

### 4 — Run the development server

```bash
npm run dev
```

Open your browser and visit:

```
http://localhost:3000
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root and populate it with the following:

```env
# ─── Database ───────────────────────────────────────────────────────────────
# MongoDB connection string (Atlas or local)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/devcollab

# ─── Authentication ──────────────────────────────────────────────────────────
# Secret key for signing JWT tokens — use a long random string
JWT_SECRET=your_super_secret_key_here

# ─── App ─────────────────────────────────────────────────────────────────────
# Base URL of your running app
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> ⚠️ **Never commit `.env.local` to version control.** It is already covered by `.gitignore`.

---

## 🧪 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server at `localhost:3000` with hot reload |
| `npm run build` | Create an optimised production build |
| `npm run start` | Start the production server (requires a prior `build`) |
| `npm run lint` | Run ESLint across the codebase |

---

## 🗺️ Roadmap

Tracking what's done and what's coming next:

- [x] Developer profiles with dynamic username routing
- [x] Project creation, editing, and deletion
- [x] Tech stack tagging and status tracking
- [x] JWT-based authentication
- [x] Collaborator invitations and role-based access
- [x] Discovery — search developers and projects
- [ ] Real-time notifications 🔔
- [ ] WebSocket-powered live collaboration 🔄
- [ ] GitHub OAuth sign-in 🐙
- [ ] Project comments and discussion threads 💬
- [ ] Activity feed and contribution history 📊
- [ ] Public API for third-party integrations 🔌

---

## 🤝 Contributing

Contributions are welcome! Here's the workflow:

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/DevCollab.git
cd DevCollab

# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes and commit
git add .
git commit -m "feat: describe what you added"

# 4. Push to your fork and open a Pull Request
git push origin feature/your-feature-name
```

### Commit message convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | When to use |
|---|---|
| `feat:` | Adding a new feature |
| `fix:` | Fixing a bug |
| `docs:` | Documentation only changes |
| `style:` | Formatting, whitespace, missing semicolons |
| `refactor:` | Code change that neither fixes a bug nor adds a feature |
| `chore:` | Build process or dependency updates |

---

## 🧑‍💻 Author

<div align="center">

**Aditya Dabgotra**

Full-stack Developer · Building developer tools and collaborative platforms

[![GitHub](https://img.shields.io/badge/GitHub-AdityaDabgotra-black?style=flat-square&logo=github)](https://github.com/AdityaDabgotra)

</div>

---

## 📄 License

This project is licensed under the **MIT License** — you're free to use, modify, and distribute it freely.

---

<div align="center">

If DevCollab is useful to you, a ⭐ on the repo goes a long way — thank you!

**Built with ❤️ using Next.js · TypeScript · MongoDB · Tailwind CSS**

</div>
