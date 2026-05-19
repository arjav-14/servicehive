# GigFlow – Smart Leads Dashboard

Smart Leads Dashboard (GigFlow) is a production-grade, highly scalable, and exceptionally designed Full-Stack MERN CRM platform built **exclusively using TypeScript**. The application features dynamic multi-filtering, paginated lists, a 500ms debounced search, CSV streaming exporters, responsive Light/Dark theme mapping, and a strict Role-Based Access Control (RBAC) security paradigm.

---

## 📋 Submission Details

*   **GitHub Repository URL**: `[Insert your GitHub Repo URL here]`
*   **Updated Resume**: `[Insert link to your Resume here]`
*   **Deployment Link**: `[Insert your live Deployment URL here]`

---

## 🚀 Key Features

*   **100% Strict TypeScript Integration**: Strong typings, custom generic types, interfaces, and strict build validation for both client and API server.
*   **Security & Identity Control**: Secure password hashing via `bcryptjs`, JWT stateful sessions, and robust middleware checking roles (Admin vs. Sales).
*   **RBAC Permissions Paradigm**:
    *   **Admin**: Full access. Can create, read, update, and permanently delete leads.
    *   **Sales**: Pipeline management. Can create, read, and edit lead profiles. **Forbidden from deleting leads** (guarded in UI and enforced at database query level by controllers).
*   **Performance Analytics Portal**: Dynamic statistical widgets charting total counts, qualified prospects, funnel conversion percentages, and acquisition channel distributions (Website, Instagram, Referral).
*   **Debounced Smart Pipeline Grid**: Responsive table with status pills, pagination controllers, and a custom `useDebounce` hook that delays search query API triggers by **500ms** to prevent client keyboard input spam.
*   **Dynamic Database Multi-Filtering**: Multi-parameter MongoDB query compiler parsing custom statuses, sources, case-insensitive regex queries, page scopes, and sort criteria concurrently.
*   **On-the-Fly CSV Exporter**: Streams current filtered and searched pipeline leads into dynamic downloadable CSV sheets by querying `/api/leads/export` directly.
*   **Premium Visual Experience**: Custom styling palette containing deep dark mode selectors, glassmorphic card overlays, smooth animations, and high-fidelity typography (Inter font family) with full responsive layout grids.
*   **Containerized Orchestration**: Single-command multi-stage Docker configurations to deploy MongoDB, NodeJS, and Nginx.

---

## 📂 Project Architecture & Directory Structure

```text
smart-leads-dashboard/
├── docker-compose.yml       # Root orchestration script
├── backend/
│   ├── Dockerfile           # Multi-stage production NodeJS builder
│   ├── .env.example         # System variables template
│   ├── tsconfig.json        # TypeScript compiler configurations
│   ├── src/
│   │   ├── app.ts           # Express server bootstrap
│   │   ├── server.ts        # Database connection & startup entry
│   │   ├── config/          # Zod env checkers and MongoDB connectors
│   │   ├── controllers/     # Express route handlers
│   │   ├── middleware/      # Auth, RBAC, Zod, and Error interceptors
│   │   ├── models/          # MongoDB Mongoose collection definitions
│   │   ├── interfaces/      # Type interfaces
│   │   ├── routes/          # Express router sub-nodes
│   │   ├── services/        # Business logic services & CSV streams
│   │   └── validations/     # Zod request validators
└── frontend/
    ├── Dockerfile           # Optimized SPA compiler with Nginx
    ├── nginx.conf           # HTML5 routing redirection configs
    ├── tailwind.config.js   # Tailored theme color tokens
    ├── tsconfig.json        # Strict Vite compiler parameters
    ├── src/
    │   ├── main.tsx         # React bootstrap DOM connector
    │   ├── App.tsx          # Provider configurations (Redux & Router)
    │   ├── index.css        # Core custom styling classes
    │   ├── api/             # Axios client with session interceptors
    │   ├── components/      # Common inputs, modals, layout, and bars
    │   ├── hooks/           # useAuth, useTheme, and useDebounce
    │   ├── layouts/         # Centered Auth and Grid Dashboard frames
    │   ├── pages/           # Dashboard stats grid and Leads CRM
    │   ├── redux/           # Global state slices and Thunks
    │   ├── types/           # Strong client types
    │   └── validations/     # Client-side validation schemas
```

---

## 🛠️ Tech Stack & Dependencies

### Backend API
*   **Core**: Node.js, Express, TypeScript (v5.x+)
*   **Database**: MongoDB, Mongoose (v9.x+)
*   **Validations**: Zod (v3.x+)
*   **Cryptography & JWT**: jsonwebtoken, bcryptjs
*   **CSV Exporter**: csv-writer (with Stream buffers)

### Frontend Client
*   **Core**: React (v19.x), Vite, TypeScript
*   **Global State**: Redux Toolkit (RTK)
*   **Routing**: React Router DOM (v7.x)
*   **Form Management**: React Hook Form, @hookform/resolvers
*   **Styling**: Tailwind CSS (v3.x), Lucide Icons
*   **Notifications**: React Toastify (Custom toast containers)

---

## ⚡ Setup & Launch Instructions

### Method A: Single-Command Docker Deployment (Recommended)
Make sure you have Docker and Docker Compose installed:
1. From the project root, start all containers:
   ```bash
   docker-compose up --build
   ```
2. Once running, open your web browser:
   *   **Frontend SPA**: `http://localhost:3000`
   *   **Backend Server API**: `http://localhost:5000`
   *   **MongoDB Instance**: `mongodb://localhost:27017`

---

### Method B: Manual Local Development

#### 1. Start Database
Ensure MongoDB is running locally at `mongodb://localhost:27017/gigflow`.

#### 2. Configure & Run Backend
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Copy env template and set credentials:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server (via `nodemon` + `ts-node`):
   ```bash
   npm run dev
   ```
   *The server compiles TypeScript dynamically and starts on `http://localhost:5000`.*

#### 3. Configure & Run Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Start Vite development server:
   ```bash
   npm run dev
   ```
   *The SPA opens at `http://localhost:5173` (or the console outputted port).*

---

## 🔑 Demonstration & Testing Guide (RBAC Evaluation)

### 🧑‍💻 Test Accounts

If you don't wish to register new accounts, you can test the RBAC capabilities immediately using the following example credentials (if seeded):

**Admin User (Full Permissions)**
* **Email**: `admin@gigflow.com`
* **Password**: `password123`

**Sales User (Restricted Permissions)**
* **Email**: `sales@gigflow.com`
* **Password**: `password123`

---

### 🧪 How to test RBAC

1.  **Register or Login as a Sales Account**:
    *   Navigate to the registration screen.
    *   Create an account and select **Sales Representative** as the role.
    *   Log in and go to the Leads List. Add and edit some leads.
    *   **Observe**: The delete button (trash can) is disabled with a lock icon, displaying an "Admin Privilege Only" notice.
2.  **Register an Admin Account**:
    *   Create a second account selecting **Administrator** as the role.
    *   Log in. Go to the Leads List.
    *   **Observe**: The delete button is fully functional. Clicking it triggers a validation confirmation popup and deletes the record.
3.  **Evaluate Advanced Filters & CSV Export**:
    *   Input letters in search. Notice the 500ms delay (debounce) before a fetch request is triggered.
    *   Apply a status filter (e.g. "Qualified") and click "Export CSV".
    *   Open the downloaded file; it streams **only** the qualified leads matching your filters on the screen!

---

## 📡 REST API Documentation

### 🔓 Authentication (Public Endpoints)
*   `POST /api/auth/register` — Create user profile
    *   **Body**: `{ "name": "John", "email": "john@example.com", "password": "securepassword", "role": "sales" }`
*   `POST /api/auth/login` — Sign in user
    *   **Body**: `{ "email": "john@example.com", "password": "securepassword" }`

### 🔒 Workspace Profile (Protected Endpoints)
*   `GET /api/auth/profile` — Fetch active session details (Requires JWT Bearer Token)

### 📂 Leads Pipeline (Protected Endpoints)
*   `GET /api/leads` — Fetch leads collection (Supports query params: `page`, `limit`, `status`, `source`, `search`, `sort`)
*   `GET /api/leads/export` — Stream filtered leads CSV download (Supports query params matching grid filters)
*   `POST /api/leads` — Create pipeline lead
    *   **Body**: `{ "name": "Lead Target", "email": "lead@company.com", "status": "New", "source": "Website" }`
*   `PUT /api/leads/:id` — Update lead attributes
*   `DELETE /api/leads/:id` — Delete lead record (**Requires Admin Privilege**)

---

## 🛡️ Best Practices & Quality Standards
*   **Centralized Errors**: Custom `ApiError` class coupled with a global express catcher preventing server leaks.
*   **Mongoose Promisified Save Hooks**: Proper modern pre-save passwords encryption without legacy callback triggers.
*   **Vite Nginx multi-stage configuration**: Zero development footprints in runtime production containers, maintaining a microservice infrastructure.
