# Zyroo Codebase AI Agent Instructions

## Project Overview

**Zyroo** is a full-stack job portal platform with user authentication, job listings, forums, and admin capabilities. It consists of:

- **Backend**: Express.js + MongoDB API on port 5000
- **Frontend**: React 18 + Redux Toolkit + Vite on port 3000
- **DevOps**: Docker Compose orchestration for local development

## Architecture & Data Flows

### Backend Structure (MVC Pattern)

```
backend/src/
├── server.js          # Entry point, listens on PORT
├── app.js             # Express setup, middleware stack, route mounting
├── config/
│   └── database.js    # MongoDB connection (uses MONGODB_URI or localhost:27017/zyroo)
├── routes/
│   └── auth.js        # Route definitions (register, login, /me)
├── controllers/
│   └── authController.js  # Business logic (register, login, getMe)
├── middleware/
│   └── authMiddleware.js  # JWT protect & role-based authorize
└── models/
    └── User.js        # Mongoose schema with bcrypt hashing
```

**Key Patterns:**

- Controllers use **consistent response format**: `{ success: boolean, data?, message: string }`
- All async errors caught in try-catch; respond with 500 status
- JWT tokens embedded in Authorization header: `Bearer <token>`
- Password hashing via `bcryptjs` pre-save hook in User schema
- Database connection called in `app.js` (currently commented - UNCOMMENT INI marker)

### Frontend Structure (React + Redux)

```
frontend/src/
├── App.jsx              # Router setup with ProtectedRoute wrapper
├── store/
│   ├── index.js         # Redux store (auth, jobs, forum slices)
│   └── slices/          # Redux Toolkit slices
├── pages/               # Route components (Home, Jobs, Forum, Profile, Admin)
├── components/
│   ├── layout/          # Header, Footer, Layout wrapper
│   ├── common/          # Shared components
│   ├── jobs/            # JobCard, JobFilter, JobSearch
│   └── ProtectedRoute/  # Auth & admin-only route gating
├── services/api/        # (empty - should contain axios instances)
└── store/slices/        # Redux state management
```

**Key Patterns:**

- Routes use `<ProtectedRoute>` wrapper for auth/admin checks (see App.jsx)
- Redux `authSlice` persists token to `localStorage`
- Vite proxy forwards `/api/*` requests to `http://localhost:5000`
- `styled-components` used for component styling (CSS files in component dirs)

## Development Workflow

### Backend Setup & Run

```bash
cd backend
npm install
npm run dev                    # Runs nodemon on src/server.js
# Starts at http://localhost:5000
# Health check: http://localhost:5000/api/health
```

**Environment Setup**: Create `.env` in backend root:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/zyroo
JWT_SECRET=your-secret-key
```

### Frontend Setup & Run

```bash
cd frontend
npm install
npm run dev                    # Runs Vite dev server
# Starts at http://localhost:3000, proxies /api to backend
```

### Full Stack with Docker

```bash
docker-compose up              # Builds & runs both services
# Backend: port 5000, Frontend: port 3000 (served via nginx)
```

### Testing

⚠️ **No tests configured yet** (`npm test` exits with error in both)

## Environment Variables

### Backend `.env` Configuration

Located in `backend/.env` (create if missing):

| Variable | Default | Purpose | Example |
|----------|---------|---------|---------|
| `PORT` | `5000` | HTTP server port for API | `5000` |
| `MONGODB_URI` | `mongodb://localhost:27017/zyroo` | MongoDB connection string | `mongodb://localhost:27017/zyroo` |
| `JWT_SECRET` | `'your-secret-key'` | Secret key for signing JWT tokens (⚠️ change in production) | `my-super-secret-key-123` |
| `NODE_ENV` | `development` | Environment mode (development/production) | `development` |

**Setup Instructions:**
```bash
# Backend root directory
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/zyroo
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
EOF
```

**Notes:**
- `JWT_SECRET` is used by `authController.js` in `generateToken()` function
- If `MONGODB_URI` not set, defaults to local MongoDB on port 27017
- Token expiry is hardcoded to 30 days in `authController.js`

### Frontend Environment Variables

Frontend uses **Vite environment variables** (prefixed with `VITE_`). Currently no custom `.env` needed—Vite proxy is configured in `vite.config.js`:

| Configuration | Value | Purpose |
|----------------|-------|---------|
| Dev Server Port | `3000` | Vite dev server port |
| API Proxy | `http://localhost:5000` | Backend API target |
| Proxy Path | `/api/*` | Routes all `/api` requests to backend |

**If adding frontend env vars:** Create `frontend/.env`:
```bash
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Zyroo
```

Access in React: `import.meta.env.VITE_API_URL`

### Docker Environment Variables

In `docker-compose.yml`, backend service defines:
```yaml
environment:
  - NODE_ENV=development
```

To override at runtime:
```bash
docker-compose up -e NODE_ENV=production -e JWT_SECRET=prod-secret
```

## Critical Integration Points

### Auth Flow (Backend → Frontend)

1. **Registration** (POST `/api/auth/register`):

   - Request: `{ name, email, password }`
   - Response: `{ success, data: { _id, name, email, role, token }, message }`
   - Frontend stores token in `localStorage` & Redux state

2. **Login** (POST `/api/auth/login`):

   - Request: `{ email, password }`
   - Response includes `profile` object (phone, location, bio, skills, experience)
   - Token used in subsequent requests via `Authorization: Bearer <token>`

3. **Protected Routes**:

   - `/api/auth/me` requires `protect` middleware
   - `authMiddleware.protect` validates JWT, populates `req.user`
   - `authorize(...roles)` restricts by user.role (user vs admin)

4. **Frontend Protected Routes**:
   - `/profile` requires authentication (ProtectedRoute wrapper)
   - `/admin` requires `adminOnly={true}` + admin role
   - Redirects unauthenticated users to login

### User Model Schema

```javascript
{
  name, email, password (hashed), role ('user'|'admin'),
  profile: { phone, location, bio, skills: [String], experience: [{position, company, period, description}] },
  timestamps: true
}
```

## Project-Specific Conventions

### Response Format (ALL endpoints)

- Successful: `{ success: true, data: {...}, message: "..." }`
- Error: `{ success: false, message: "..." }` (status codes: 400, 401, 403, 404, 500)
- HTTP status codes: 201 (created), 200 (ok), 400 (bad request), 401 (auth), 403 (forbidden), 500 (server error)

### Error Handling

- Backend: Wrap route handlers in try-catch; always respond with { success, message }
- Frontend: Redux slices manage loading, error states (see authSlice pattern)

### Code Comments

- Mark incomplete sections with **UNCOMMENT INI** (e.g., database connection in app.js)
- Use JSDoc-style `@desc`, `@route`, `@access` in controllers (see authController.js)

### Naming Conventions

- Controllers: camelCase functions (register, login, getMe)
- Routes: lowercase with hyphens if multi-word
- Redux slices: camelCase state keys, UPPERCASE action creators
- Models: PascalCase (User, Product, etc.)

## Key Files to Reference When Adding Features

| Task                 | Reference File                                                             | Pattern                             |
| -------------------- | -------------------------------------------------------------------------- | ----------------------------------- |
| Add new API endpoint | `backend/src/routes/auth.js` + `backend/src/controllers/authController.js` | Route → Controller → Model          |
| Add protected route  | `frontend/src/components/ProtectedRoute/ProtectedRoute.jsx`                | Check token & user role             |
| Add Redux state      | `frontend/src/store/slices/authSlice.js`                                   | createSlice with reducers           |
| Add middleware       | `backend/src/middleware/authMiddleware.js`                                 | export handler functions            |
| Update User fields   | `backend/src/models/User.js`                                               | Mongoose schema with pre-save hooks |

## Common Issues & Fixes

- **Backend won't start**: Uncomment `connectDB()` in `app.js` and set `MONGODB_URI` env var
- **Frontend /api requests fail**: Check Vite proxy config in `vite.config.js` points to backend port
- **Auth token missing**: Ensure Redux persists token from login response & ProtectedRoute checks it
- **Password hashing fails**: Don't modify password field directly—let User model's pre-save hook handle it

## Docker Deployment Notes

- Backend Dockerfile commented out as `Dockerfile.txt`—rename to use Docker Compose
- Frontend served via nginx in container (port 80 → 3000 externally)
- Backend depends on MongoDB (currently uses local URI if `MONGODB_URI` not set)
