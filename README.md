# SkillForge

SkillForge is a modern full-stack developer portfolio and career intelligence platform. It allows software engineers to build their professional profiles, manage technical skills, academic milestones, and showcase projects with live demo and source code links. 

SkillForge features an **AI Portfolio Doctor** that performs deep role-aware diagnostic audits on developer profiles—scoring portfolio readiness, evaluating project impact using the STAR method, analyzing full-stack skill synergy, and generating actionable prescriptions for recruiters.

---

## 🌟 Key Features

* **User Authentication & Authorization**: Secure JWT-based registration and login with salted password hashing via `bcryptjs`.
* **Session Persistence**: Fast, persistent client sessions using Zustand with `localStorage` synchronization.
* **Profile Management**: Live editing for professional bios, technical skill chips, and academic history.
* **Project Showcase**: Full CRUD management for software projects, including GitHub repositories, live demo URLs, and technology stack tagging.
* **Public Portfolio Pages (`/user/:id`)**: Clean, publicly shareable developer portfolios accessible to recruiters without authentication.
* **🩺 AI Portfolio Doctor**:
  * **Role-Aware Health Scoring (0–100 & Letter Grades)**: Dynamically evaluates candidates against benchmarks for *Full-Stack Developer*, *Frontend Engineer*, *Backend Engineer*, *DevOps / Cloud Engineer*, and *Software Engineer (Generalist)*.
  * **4 Diagnostic Pillars**: Content Depth, Impact & STAR Metrics, Skill Synergy, and Recruiter Proof-of-Work.
  * **STAR-Method Project Audits**: Scans project descriptions for action verbs and quantified impact metrics with one-click **"Copy Rewrite"** recommendations.
  * **Skill Gap & Synergy Analysis**: Categorizes declared proficiencies across frontend, backend, databases, DevOps, and testing, recommending high-yield complementary skills.
  * **Dual-Mode Intelligence**: Powered by Google Gemini (`gemini-1.5-flash`) with a built-in deterministic heuristic fallback engine for 100% offline resilience and zero downtime.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
* **React 19** & **TypeScript**
* **Vite 8** (Lightning-fast build tooling)
* **Tailwind CSS v4** (`@tailwindcss/vite` unified engine)
* **React Router DOM v7** (Declarative routing & protected route guards)
* **Zustand 5** (Lightweight global state with `persist` middleware)
* **Axios** (Configured HTTP client with smart environment switching)
* **Lucide React** & **Framer Motion** (Modern UI icons and fluid animations)

### Backend (`/server`)
* **Node.js** & **Express 5**
* **MongoDB** & **Mongoose 8** (Document database with embedded subdocument schemas)
* **JWT Authentication** (`jsonwebtoken` with 7-day signed tokens)
* **`bcryptjs`** (10-round salted password hashing)
* **Google Gemini API** (Generative AI qualitative career reviews)
* **Security & Middleware**: `helmet`, `cors`, `cookie-parser`, `morgan`, and `express-rate-limit`

---

## 📁 Project Structure

```text
SkillForge
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.ts          # Axios client with local & production URL routing
│   │   │   ├── authApi.ts        # Authentication API endpoints
│   │   │   ├── userApi.ts        # Profile & user CRUD endpoints
│   │   │   └── aiApi.ts          # AI Portfolio Doctor diagnostic client
│   │   ├── components/
│   │   │   ├── Navbar.tsx        # Navigation header with session logout
│   │   │   ├── ProtectedRoute.tsx# Client route guard checking auth token
│   │   │   ├── Toast.tsx         # Notification alerts (success & error types)
│   │   │   └── PortfolioDoctor.tsx # Interactive AI Doctor dashboard widget
│   │   ├── pages/
│   │   │   ├── HomePage.tsx      # Landing page with demo portfolio link
│   │   │   ├── LoginPage.tsx     # Secure user login with error toasts
│   │   │   ├── RegisterPage.tsx  # User registration with input validation
│   │   │   ├── DashboardPage.tsx # Overview metrics, completion score & AI Doctor
│   │   │   ├── ProfilePage.tsx   # Comprehensive profile, skills, and project editor
│   │   │   └── PublicProfilePage.tsx # Publicly accessible read-only portfolio
│   │   ├── store/
│   │   │   └── authStore.ts      # Zustand auth state store with persistence
│   │   ├── utils/
│   │   │   └── aiDoctor.ts       # Resilient client-side diagnostic fallback engine
│   │   ├── routes/
│   │   │   └── AppRoutes.tsx     # Application route table
│   │   ├── index.css             # Tailwind v4 import and global typography
│   │   └── main.tsx              # Application entry point with QueryClientProvider
│   ├── vercel.json               # SPA routing rewrites for Vercel deployment
│   └── vite.config.ts            # Vite bundler configuration
│
└── server/
    ├── src/
    │   ├── config/
    │   │   └── db.js             # Mongoose MongoDB connection handler
    │   ├── controllers/
    │   │   ├── authController.js # Normalized registration & login handlers
    │   │   ├── userController.js # Profile retrieval & update operations
    │   │   └── aiController.js   # AI Portfolio Doctor engine & Gemini enrichment
    │   ├── middleware/
    │   │   └── authMiddleware.js # JWT Bearer token authentication guard
    │   ├── models/
    │   │   └── User.js           # Mongoose User schema with embedded projects & education
    │   ├── routes/
    │   │   ├── authRoutes.js     # /api/auth routes
    │   │   ├── userRoutes.js     # /api/users routes
    │   │   └── aiRoutes.js       # /api/ai diagnostic routes
    │   └── server.js             # Express application bootstrap & middleware pipeline
    └── package.json
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ashutosh-shahi/SkillForge.git
cd SkillForge
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# Optional: Add Google Gemini API Key for generative LLM feedback
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend development server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

The frontend will run locally on `http://localhost:5173` and automatically connect to your local backend on `http://localhost:5000/api`.

---

## 📡 API Endpoints

### Authentication
* `POST /api/auth/register` - Create a new developer account
* `POST /api/auth/login` - Authenticate and retrieve JWT token

### User & Profile
* `GET /api/users/profile` - Fetch current user's authenticated profile (Protected)
* `PUT /api/users/profile` - Update bio, skills, education, and projects (Protected)
* `GET /api/users/:id` - Fetch public portfolio by user ID (Public)

### AI Career Intelligence
* `POST /api/ai/diagnose` - Generate role-aware portfolio audit and prescriptions (Protected)

---

## 👨‍💻 Author

* **Ashutosh Shahi**
* B.Tech, Electrical Engineering
* MANIT Bhopal
* GitHub: [@ashutosh-shahi](https://github.com/ashutosh-shahi)
