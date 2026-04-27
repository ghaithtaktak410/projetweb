# Explore France - Setup & Configuration Guide

## Project Overview

This is a full-stack Vue 3 + Node.js + MySQL application for interactive French culture quizzes. The frontend is a modern SPA using Vue Router and Pinia, while the backend provides REST APIs for CRUD operations on regions and quizzes.

## Prerequisites

- Node.js (v14+)
- MySQL Server (v5.7+)
- npm or yarn

## Installation

### 1. Clone & Install Dependencies

```bash
npm install
```

This installs both frontend (Vue) and backend (Express) dependencies.

### 2. Setup MySQL Database

Create a MySQL database:

```sql
CREATE DATABASE explore_france;
```

The application will automatically create all necessary tables on first run.

### 3. Environment Configuration

Copy `.env.example` to `.env` and configure:

```env
# MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=explore_france

# Server Port
PORT=5000

# API URL (frontend)
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

**Terminal 1 - Frontend (Vite dev server):**
```bash
npm run dev
```
Runs on: http://localhost:5173

**Terminal 2 - Backend (Express server):**
```bash
npm run dev:server
```
Runs on: http://localhost:5000

### Production Build

```bash
npm run build
```

This creates optimized frontend files in the `dist/` directory.

## Database Schema

### Tables

**regions**
- `id` (VARCHAR 36, PRIMARY KEY)
- `name` (VARCHAR 255)
- `description` (TEXT)
- `image_url` (VARCHAR 500)
- `highlights` (JSON)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**quizzes**
- `id` (VARCHAR 36, PRIMARY KEY)
- `title` (VARCHAR 255)
- `description` (TEXT)
- `region_id` (VARCHAR 36, FOREIGN KEY)
- `difficulty` (ENUM: easy, medium, hard)
- `created_by` (VARCHAR 36)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**questions**
- `id` (VARCHAR 36, PRIMARY KEY)
- `quiz_id` (VARCHAR 36, FOREIGN KEY)
- `question_text` (TEXT)
- `options` (JSON)
- `correct_answer` (VARCHAR 10)
- `order_index` (INT)
- `created_at` (TIMESTAMP)

**users**
- `id` (VARCHAR 36, PRIMARY KEY)
- `email` (VARCHAR 255, UNIQUE)
- `password_hash` (VARCHAR 255)
- `username` (VARCHAR 255, UNIQUE)
- `role` (ENUM: student, admin)
- `created_at` (TIMESTAMP)

**scores**
- `id` (VARCHAR 36, PRIMARY KEY)
- `user_id` (VARCHAR 36, FOREIGN KEY)
- `quiz_id` (VARCHAR 36, FOREIGN KEY)
- `score` (INT)
- `total_questions` (INT)
- `completed_at` (TIMESTAMP)

## API Endpoints

### Regions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/regions` | Fetch all regions |
| GET | `/api/regions/:id` | Fetch single region |
| POST | `/api/regions` | Create region |
| PUT | `/api/regions/:id` | Update region |
| DELETE | `/api/regions/:id` | Delete region |

**Example - Create Region:**
```bash
curl -X POST http://localhost:5000/api/regions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Provence",
    "description": "Sun-soaked Mediterranean region",
    "image_url": "https://...",
    "highlights": ["Lavender Fields", "Nice", "Monaco"]
  }'
```

### Quizzes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quizzes` | Fetch all quizzes |
| GET | `/api/quizzes/:id` | Fetch quiz with questions |
| POST | `/api/quizzes` | Create quiz |
| PUT | `/api/quizzes/:id` | Update quiz |
| DELETE | `/api/quizzes/:id` | Delete quiz |

**Example - Create Quiz:**
```bash
curl -X POST http://localhost:5000/api/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "French Landmarks",
    "description": "Test your knowledge",
    "region_id": "region-123",
    "difficulty": "medium",
    "questions": [
      {
        "question_text": "What is the capital of France?",
        "options": [
          {"id": "a", "text": "Paris"},
          {"id": "b", "text": "Lyon"}
        ],
        "correct_answer": "a"
      }
    ]
  }'
```

## Admin Dashboard

Access the admin panel by logging in with an admin account at `/admin`

### Features

**Regions Management**
- View all regions
- Create new regions with highlights
- Edit region information
- Delete regions
- Upload region images

**Quizzes Management**
- Create quizzes from scratch
- Add questions with multiple options
- Set correct answers
- Edit existing quizzes
- Delete quizzes
- Manage questions order

**Scores Analytics**
- View all student quiz attempts
- Filter scores by quiz
- See performance metrics
- Track student progress

## Frontend Architecture

```
src/
├── components/          # Reusable Vue components
│   ├── NavBar.vue
│   ├── QuizCard.vue
│   ├── RegionCard.vue
│   └── RegionManageForm.vue
├── views/              # Page components
│   ├── HomeView.vue
│   ├── RegionsView.vue
│   ├── QuizzesView.vue
│   ├── RegionDetailView.vue
│   ├── QuizDetailView.vue
│   ├── AdminDashboard.vue
│   ├── LeaderboardView.vue
│   ├── ProfileView.vue
│   ├── LoginView.vue
│   └── RegisterView.vue
├── stores/             # Pinia state management
│   ├── auth.ts
│   └── quiz.ts
├── lib/                # Utilities
│   ├── api.ts          # API client
│   └── supabase.ts     # Auth client
├── types/              # TypeScript types
│   └── index.ts
├── router/             # Vue Router
│   └── index.ts
└── App.vue             # Root component
```

## Backend Architecture

```
server.js              # Express server entry point
│
├── Database Setup     # MySQL table creation
├── Connection Pool    # MySQL connection pooling
│
├── Routes
│   ├── GET /api/regions
│   ├── POST /api/regions
│   ├── PUT /api/regions/:id
│   ├── DELETE /api/regions/:id
│   ├── GET /api/quizzes
│   ├── POST /api/quizzes
│   ├── PUT /api/quizzes/:id
│   └── DELETE /api/quizzes/:id
│
└── Health Check       # GET /api/health
```

## CRUD Operations

### Creating a Region

1. Navigate to Admin Dashboard
2. Click on "Regions" tab
3. Click "+ New Region"
4. Fill in:
   - Region Name
   - Description
   - Image URL
   - Highlights (attractions)
5. Click "Save Region"

### Creating a Quiz

1. Navigate to Admin Dashboard
2. Click on "Quizzes" tab
3. Click "+ New Quiz"
4. Fill in quiz details:
   - Title
   - Description
   - Select Region (optional)
   - Difficulty Level
5. Add Questions:
   - Click "+ Add Question"
   - Enter question text
   - Add 4 options (A, B, C, D)
   - Mark correct answer by clicking radio button
6. Click "Save Quiz"

### Editing

- Click "Edit" button on any region or quiz card
- Modify the details
- Click "Save" to update

### Deleting

- Click "Delete" button on any card
- Confirm the deletion

## Deployment

### Frontend (Vite)

```bash
npm run build
# Outputs to dist/ directory
# Deploy dist/ to CDN or web server
```

### Backend (Express + MySQL)

1. Set up MySQL on production server
2. Configure `.env` with production database credentials
3. Run: `node server.js`
4. Use process manager (PM2):
   ```bash
   npm install -g pm2
   pm2 start server.js --name "explore-france-api"
   ```

## Troubleshooting

### MySQL Connection Error

**Error:** `connect ECONNREFUSED 127.0.0.1:3306`

**Solution:**
1. Ensure MySQL is running
2. Check `DB_HOST`, `DB_USER`, `DB_PASSWORD` in `.env`
3. Verify database exists: `CREATE DATABASE explore_france;`

### API Not Connecting

**Error:** Frontend can't reach backend

**Solution:**
1. Ensure backend is running on port 5000
2. Check `VITE_API_URL` in `.env`
3. Check browser console for CORS errors
4. Verify firewall isn't blocking port 5000

### Build Errors

**Error:** TypeScript compilation fails

**Solution:**
```bash
npm run build --verbose
# Shows detailed error messages
```

## Performance Tips

- Use MySQL indexes on frequently queried columns
- Enable gzip compression on Express: `npm install compression`
- Use CDN for image hosting
- Implement pagination for large datasets
- Cache static assets

## Security Notes

- Never commit `.env` to git
- Use strong MySQL passwords in production
- Implement rate limiting on API endpoints
- Validate all user inputs on backend
- Use HTTPS in production
- Keep dependencies updated

## Support & Documentation

- Vue 3: https://vuejs.org
- Express.js: https://expressjs.com
- MySQL: https://www.mysql.com
- Pinia: https://pinia.vuejs.org
- Vue Router: https://router.vuejs.org
