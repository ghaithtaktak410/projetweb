# Quick Start Guide - Explore France

## Get Running in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup MySQL Database

Create a database named `explore_france`:

```sql
CREATE DATABASE explore_france;
```

### Step 3: Configure Environment

Edit `.env` file with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=explore_france
PORT=5000
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Start Backend Server

```bash
npm run dev:server
```

You should see:
```
✓ Database tables initialized
🚀 Server running on http://localhost:5000
📊 API endpoints available at http://localhost:5000/api
```

### Step 5: Start Frontend (New Terminal)

```bash
npm run dev
```

Frontend opens at: http://localhost:5173

## What's Next?

### First Time Setup

1. **Create a Region**
   - Go to Admin Dashboard (`/admin`)
   - Click "Regions" tab
   - Click "+ New Region"
   - Fill in details and save

2. **Create a Quiz**
   - Click "Quizzes" tab in Admin Dashboard
   - Click "+ New Quiz"
   - Add questions and save

3. **Take a Quiz**
   - Go to "Quizzes" page
   - Click "Start Quiz"
   - Answer questions
   - See your score!

### API Testing

Test endpoints with curl:

```bash
# Fetch all regions
curl http://localhost:5000/api/regions

# Fetch all quizzes
curl http://localhost:5000/api/quizzes

# Check server health
curl http://localhost:5000/api/health
```

## Project Structure

```
project/
├── server.js              # Express backend
├── src/                   # Vue frontend
│   ├── views/            # Pages
│   ├── components/       # Components
│   ├── stores/           # Pinia state
│   ├── lib/              # Utilities & API client
│   └── App.vue           # Root component
├── dist/                 # Production build
├── .env                  # Configuration
├── package.json          # Dependencies
└── SETUP.md              # Full documentation
```

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start frontend dev server |
| `npm run dev:server` | Start backend server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Features

✅ **Regions Management**
- Create, edit, delete regions
- Add attractions/highlights
- Upload images

✅ **Quizzes CRUD**
- Create quizzes with questions
- Edit questions and options
- Delete quizzes
- Manage difficulty levels

✅ **Student Features**
- Browse regions
- Take quizzes
- View scores
- Check leaderboard

✅ **Admin Features**
- Manage all content
- View analytics
- Track student progress

## MySQL Tables Auto-Created

The server automatically creates these tables on startup:
- `regions`
- `quizzes`
- `questions`
- `users`
- `scores`

No manual SQL setup required!

## Troubleshooting

**Backend won't start:**
```bash
# Check if MySQL is running
# Windows: services look for MySQL
# Mac: brew services list
# Linux: sudo systemctl status mysql
```

**Frontend won't connect to backend:**
```bash
# Check VITE_API_URL in .env
# Ensure backend is running on port 5000
# Check browser console for errors
```

**Database tables not created:**
```bash
# Check database exists
mysql -u root -p explore_france
# Should connect successfully
```

## Next Steps

1. Read full [SETUP.md](./SETUP.md) for detailed configuration
2. Check API endpoints documentation
3. Explore `/admin` dashboard
4. Start adding regions and quizzes!

## Need Help?

- Check logs in terminal
- Review console errors in browser
- See SETUP.md for troubleshooting
- Check API responses with curl

---

**Happy exploring! 🇫🇷**
