# 🇫🇷 Explore France - MySQL Edition

A full-stack interactive French culture quiz application with **Vue 3 frontend** and **Node.js Express backend** backed by **MySQL database**.

## ⚡ Quick Overview

| Component | Tech | Purpose |
|-----------|------|---------|
| **Frontend** | Vue 3 + Vite + TypeScript | Beautiful responsive SPA |
| **Backend** | Node.js + Express | REST API for CRUD operations |
| **Database** | MySQL | Persistent data storage |
| **Auth** | Supabase | User authentication |
| **Deployment** | Self-hosted | Full control over infrastructure |

## 🎯 Key Features

### For Students
✅ Browse French regions with rich descriptions  
✅ Take interactive quizzes with immediate feedback  
✅ Track quiz scores and progress  
✅ View leaderboard rankings  
✅ Access personal profile and history  

### For Admins
✅ Full CRUD for regions  
✅ Complete quiz management system  
✅ Question editor with multiple choice options  
✅ Analytics dashboard  
✅ Student score tracking  

### Technical
✅ Type-safe TypeScript throughout  
✅ RESTful API design  
✅ MySQL connection pooling  
✅ Responsive mobile/tablet/desktop design  
✅ Zero-setup database auto-initialization  

## 📋 System Architecture

```
┌─────────────────────┐
│   Vue 3 Frontend    │
│   (Port 5173)       │
├─────────────────────┤
│  Vite Dev Server    │
│  Vue Router         │
│  Pinia Store        │
└──────────┬──────────┘
           │ HTTP/REST
           ↓
┌─────────────────────┐
│  Express Backend    │
│   (Port 5000)       │
├─────────────────────┤
│  API Routes         │
│  MySQL Client       │
│  Connection Pool    │
└──────────┬──────────┘
           │ SQL
           ↓
┌─────────────────────┐
│   MySQL Database    │
│   (Port 3306)       │
├─────────────────────┤
│  regions            │
│  quizzes            │
│  questions          │
│  users              │
│  scores             │
└─────────────────────┘
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** v14+ ([Download](https://nodejs.org))
- **MySQL** v5.7+ ([Download](https://www.mysql.com/downloads/mysql/))

### Installation (3 Steps)

```bash
# 1. Clone and install
npm install

# 2. Create MySQL database
mysql -u root -p
CREATE DATABASE explore_france;

# 3. Configure .env
# Edit .env with your MySQL credentials
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=explore_france
```

### Running Locally

**Terminal 1 - Backend:**
```bash
npm run dev:server
# Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Frontend on http://localhost:5173
```

Visit **http://localhost:5173** in your browser!

## 📁 Project Structure

```
explore-france/
│
├── server.js                    # Express backend entry point
├── src/                         # Vue 3 frontend
│   ├── views/                  # Pages (Home, Quizzes, Admin, etc.)
│   ├── components/             # Reusable components
│   ├── stores/                 # Pinia state management
│   ├── lib/
│   │   ├── api.ts             # MySQL API client
│   │   └── supabase.ts        # Auth client
│   ├── router/                # Vue Router
│   ├── types/                 # TypeScript definitions
│   └── App.vue                # Root component
│
├── dist/                        # Production build
├── package.json                 # Dependencies
├── .env                         # Environment config
├── .env.example                 # Config template
│
├── Documentation/
│   ├── README.md               # This file
│   ├── QUICKSTART.md           # 5-minute setup
│   ├── SETUP.md                # Detailed configuration
│   ├── API.md                  # API endpoints reference
│   ├── MYSQL_SETUP.md          # MySQL installation guide
│   └── README_MYSQL.md         # MySQL edition guide
```

## 🔌 API Endpoints

### Regions
```
GET    /api/regions              # List all regions
GET    /api/regions/:id          # Get region details
POST   /api/regions              # Create region
PUT    /api/regions/:id          # Update region
DELETE /api/regions/:id          # Delete region
```

### Quizzes
```
GET    /api/quizzes              # List all quizzes
GET    /api/quizzes/:id          # Get quiz with questions
POST   /api/quizzes              # Create quiz
PUT    /api/quizzes/:id          # Update quiz
DELETE /api/quizzes/:id          # Delete quiz
```

### Health
```
GET    /api/health               # Server status check
```

Full API documentation: See [API.md](./API.md)

## 🗄️ Database Schema

### regions
- Stores French regions with images and attractions
- Linked to quizzes

### quizzes
- Quiz metadata and difficulty levels
- References regions and questions

### questions
- Individual quiz questions
- Stores options as JSON
- Multiple choice (A, B, C, D)

### users
- User accounts with roles
- Passwords hashed with bcrypt

### scores
- Quiz attempt records
- Links users to quizzes with scores

**Auto-created on first run!** No manual SQL needed.

## 👥 User Roles

### Student
- Browse and take quizzes
- View personal scores
- Check leaderboard
- Cannot edit content

### Admin
- Full CRUD on regions
- Full CRUD on quizzes
- Manage questions
- View analytics

## 🎮 Usage Examples

### Create a Region via API
```bash
curl -X POST http://localhost:5000/api/regions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Provence",
    "description": "Sun-soaked Mediterranean coast",
    "image_url": "https://...",
    "highlights": ["Lavender Fields", "Nice", "Monaco"]
  }'
```

### Create a Quiz via API
```bash
curl -X POST http://localhost:5000/api/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "French Landmarks",
    "description": "Test your knowledge",
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

## ⚙️ Configuration

### Environment Variables (.env)

```env
# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=explore_france

# Server
PORT=5000
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-key
```

See [.env.example](./.env.example) for all options.

## 🔧 Development Commands

```bash
npm run dev              # Start frontend dev server
npm run dev:server       # Start Express backend
npm run build            # Build for production
npm run preview          # Preview production build
npm run server           # Run backend (production)
```

## 📦 Production Deployment

### Frontend (Vite)
```bash
npm run build
# Deploy dist/ folder to web server (Nginx, Vercel, etc.)
```

### Backend (Express)
```bash
# Using PM2
npm install -g pm2
pm2 start server.js --name "explore-france"
pm2 save
pm2 startup
```

Or use Docker:
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY server.js .
EXPOSE 5000
CMD ["node", "server.js"]
```

## 🐛 Troubleshooting

### MySQL Won't Connect
```bash
# Check MySQL is running
sudo systemctl status mysql

# Verify credentials in .env
# Test connection
mysql -h localhost -u root -p explore_france
```

### Backend Port 5000 Already in Use
```bash
# Find process using port
lsof -i :5000

# Kill process or change PORT in .env
```

### Frontend Can't Reach Backend
```bash
# Check VITE_API_URL in .env
# Ensure backend is running on port 5000
# Check browser console for errors
```

See [MYSQL_SETUP.md](./MYSQL_SETUP.md) for detailed troubleshooting.

## 🔐 Security Notes

⚠️ **Development Only Settings:**
- No authentication on API endpoints
- MySQL user without password
- CORS allows all origins

**For Production:**
1. Implement JWT authentication
2. Use strong database passwords
3. Restrict CORS to your domain
4. Use HTTPS
5. Add rate limiting
6. Validate all inputs
7. Use environment-specific configs

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get running in 5 minutes
- **[SETUP.md](./SETUP.md)** - Detailed configuration guide
- **[API.md](./API.md)** - Complete API reference
- **[MYSQL_SETUP.md](./MYSQL_SETUP.md)** - MySQL installation

## 🎓 Learning Resources

- [Vue 3 Documentation](https://vuejs.org)
- [Express.js Guide](https://expressjs.com)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🎉 Features Roadmap

- [ ] Real-time quiz leaderboard updates
- [ ] Quiz attempt history with detailed reviews
- [ ] Certificate generation
- [ ] Email notifications
- [ ] Progress tracking charts
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Difficulty-based recommendations

## 💡 Tips

✅ **Best Practices**
- Keep terminals organized (separate for frontend/backend)
- Check logs frequently during development
- Use MySQL Workbench for easier database management
- Test API endpoints with curl or Postman

✅ **Performance**
- Use indexes on frequently queried columns
- Enable response compression (add `compression` middleware)
- Cache static assets
- Monitor database query performance

✅ **Debugging**
- Browser DevTools for frontend
- Node.js Inspector for backend (`node --inspect server.js`)
- MySQL query logs for database

## 📞 Support

**Getting Help:**
1. Check [SETUP.md](./SETUP.md) Troubleshooting section
2. Review [API.md](./API.md) for endpoint details
3. Check terminal logs for errors
4. Verify `.env` configuration

---

## 🇫🇷 Vive la France!

Explore the beauty of French culture through interactive learning. Happy quizzing!

**Built with ❤️ using Vue 3, Node.js, and MySQL**
