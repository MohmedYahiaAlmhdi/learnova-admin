# Learnova Admin Panel

Enterprise-grade learning management system administration dashboard built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **State Management:** Zustand
- **Database:** SQLite (Prisma ORM)
- **Charts:** Recharts
- **Animations:** Framer Motion

## 📦 Getting Started

### 1. Install dependencies
```bash
npm install
# or
bun install
```

### 2. Setup database
```bash
npx prisma db push
# or
bun run db:push
```

### 3. Run development server
```bash
npm run dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Demo Login
- **Email:** admin@learnova.com
- **Password:** any password

## 🏗️ Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
src/
├── app/            # Next.js app (layout, page, providers, store)
├── components/ui/  # shadcn/ui components
├── features/       # Feature modules (auth, permissions)
├── hooks/          # Custom React hooks
├── lib/            # Utilities and database client
├── pages/          # Application pages
│   ├── Auth/       # Login
│   ├── Dashboard/  # Main dashboard
│   ├── Users/      # User management
│   ├── Courses/    # Course management
│   ├── Instructors/# Instructor management
│   ├── Agents/     # Agent & POS management
│   ├── Categories/ # Category management
│   ├── Finance/    # Financial overview
│   ├── AuditLogs/  # Audit trail
│   └── Settings/   # System settings
├── shared/         # Shared API, types, mocks, hooks
└── widgets/        # Layout widgets (Sidebar, TopBar)
```

## 🌍 Deployment

### Railway.app (Recommended - works in Syria)
1. Push to GitHub
2. Go to [railway.app](https://railway.app) → New Project
3. Connect GitHub repo
4. Railway auto-detects Next.js
5. Set environment variables
6. Deploy!

### Render.com (Free tier available)
1. Push to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect GitHub repo
4. Build: `npm install && npm run build`
5. Start: `npm start`
6. Deploy!

### Netlify (with adapter)
Works but requires Next.js adapter configuration.

## 📄 License

Private - All rights reserved.
