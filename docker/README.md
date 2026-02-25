## 🐳 Backend (FastAPI)
- Dockerfile: `docker/Dockerfile.backend`
- Expose: `8000`
- Chạy bằng Uvicorn

## 🌐 Frontend (React + Vite)
- Dockerfile: `docker/Dockerfile.frontend`
- Expose: `5173`
- Chạy bằng Vite dev server (`npm run dev`)

---

## ▶️ Cách chạy

1. **Build và start containers**
   ```bash
   cd docker
   docker-compose up --build
