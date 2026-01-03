# UM Quiz Platform 🧠

**A simple quiz platform** with a Node/Express backend and a React + Vite frontend. This README explains how to set up and run the project locally.

---

## ✅ Quick Start

Prerequisites:
- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- Git (to clone the repo)

1. Clone the repository:

```bash
git clone <repository-url>
cd UM_Quiz
```

2. Backend: install dependencies and create env file

```bash
cd quiz-app-backend
npm install
# Create a .env file (see .env.example)
# PowerShell: cp .env.example .env
# CMD: copy .env.example .env
```

3. Start the backend:

```bash
# Development (auto-restart):
npm run dev
# Production:
npm start
```

4. Frontend: install and run

```bash
cd ../quiz-platform
npm install
npm run dev
```

Open the frontend at http://localhost:5173 and the backend runs on http://localhost:5000 by default.

---

## 🔧 Environment variables (backend)

Create `quiz-app-backend/.env` with these values (you can copy `.env.example`):

```
MONGO_URI=<your-mongo-connection-string>
JWT_SECRET=<a-strong-secret>
PORT=5000  # optional
```

> Note: Keep `JWT_SECRET` secure in production.

---

## 🗂️ Project Structure (top-level)

- `quiz-app-backend/` - Node/Express backend (MongoDB, JWT-based auth)
- `quiz-platform/` - React + Vite frontend
- `dashboard.css` - some shared styles

---

## 🔁 Typical Workflow

- Edit frontend in `quiz-platform/src/` and backend in `quiz-app-backend/`.
- Backend API base: `http://localhost:5000/api/...` (used by frontend axios calls)

If you run the backend on a different port, update frontend calls (they are hardcoded to `http://localhost:5000` in several components like `src/components/*.jsx`).

---

## 🐞 Troubleshooting

- MongoDB connection errors: verify `MONGO_URI` and that MongoDB is reachable (try connecting with MongoDB Compass or `mongosh`).
- CORS / network errors: ensure backend is running and port matches frontend API URLs.
- Port conflicts: change `PORT` in backend `.env` and update frontend URLs if needed.

---

## 💡 Tips & Next Steps

- Add an `.env.example` file (already included for backend) — do not commit secrets.
- Consider adding a frontend configuration for API base URL (e.g., use `.env` or a `src/config.js`).
- Add tests and CI for improved reliability.

---

## 👩‍💻 Contributing

Feel free to open issues or PRs. Keep changes focused and include a short description of what you changed and why.

---

## 📜 License

This project currently has no license file. Add a license as needed.
