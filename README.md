# 🌍 RapAid — Disaster Relief & Emergency Coordination Platform



**RapAid** is a fast, mobile-first disaster relief web app that helps report incidents, visualize affected areas, and coordinate resources between citizens, NGOs, and emergency responders.

---

## 🚀 Features

- 📍 **Incident Reporting** — submit location, severity, and notes in real time  
- 🗺 **Interactive Map View** — visualize incidents, shelters, hospitals & supply points  
- 🔎 **Filters & Search** — filter incidents by type, severity, and date  
- 🔄 **Live Updates** — track the lifecycle (reported → verified → resolved)  
- 🤝 **Resource Matching** — connect requests with available resources/volunteers  
- 📱 **Responsive UI** — optimized for mobile and low-connectivity scenarios  
- ⚡ **Production-ready Setup** — TypeScript, ESLint, Prettier, Vercel deployment  

---

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite  
- **Styling**: TailwindCSS, PostCSS  
- **Tooling**: ESLint (flat config), Prettier, Type-safe envs  
- **Deployment**: Vercel (via `vercel.json`)  
- **Hosting Alternatives**: Netlify, Cloudflare, S3+CloudFront  

---

## 📂 Project Structure

RapAid/
└─ client/
├─ public/ # Static assets (images, icons, robots.txt)
├─ src/
│ ├─ components/ # Reusable UI components
│ ├─ pages/ # Route-level pages (Dashboard, Incident, etc.)
│ ├─ hooks/ # Custom React hooks
│ ├─ lib/ # API clients / config
│ ├─ types/ # Shared TypeScript types
│ ├─ utils/ # Utility functions
│ ├─ App.tsx # Main router & layout shell
│ └─ main.tsx # Entry point
├─ tailwind.config.ts
├─ vite.config.ts
├─ tsconfig.json
└─ vercel.json

yaml
Copy code

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js** ≥ 18  
- **npm** ≥ 9 (or pnpm/bun)

### Setup
```bash
# 1. Clone the repo
git clone https://github.com/WisKeyOp/RapAid.git
cd RapAid/client

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local

# 4. Start development server
npm run dev
Your app should now be running at http://localhost:5173.

🔑 Environment Variables
Create a .env.local file inside /client:

bash
Copy code
VITE_API_URL=http://localhost:4000

# Optional integrations
# VITE_MAPBOX_TOKEN=pk.XXXX
# VITE_GOOGLE_MAPS_API_KEY=AIzaXXXX
# VITE_SENTRY_DSN=https://xxxx
# VITE_ANALYTICS_ID=G-XXXX
📜 Available Scripts
Inside /client:

bash
Copy code
npm run dev        # start dev server
npm run build      # build for production
npm run preview    # preview production build
npm run lint       # run ESLint
npm run format     # format with Prettier
npm run typecheck  # type-check with TS
🖼 Demo & Screenshots
Add screenshots of your app here (dashboard, report flow, map view).

Example placeholders:



🗺 Roadmap
 Authentication (Volunteer, NGO, Admin roles)

 Multilingual support (i18n)

 Offline-first (PWA + push notifications)

 AI-assisted resource allocation

 Accessibility audit (WCAG AA)

🤝 Contributing
Fork this repo

Create a branch git checkout -b feat/my-feature

Commit with Conventional Commits

Push and open a PR

📄 License
Licensed under the MIT License — see LICENSE for details.

🙌 Acknowledgements
Map providers: Mapbox / Google Maps

Tailwind ecosystem for UI inspiration

Vercel for fast deployment
