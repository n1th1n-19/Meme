# Meme App - Production Ready

A full-stack TypeScript application with Google OAuth authentication, JWT tokens, and meme fetching functionality.

## 🚀 Features

- **Google OAuth Authentication** with NextAuth.js
- **JWT Token Management** with Zod validation
- **TypeScript** full-stack with strict typing
- **Docker containerization** for easy deployment
- **Production-ready** configuration
- **Responsive UI** with Google-style authentication

## 🏗️ Architecture

### Frontend (Next.js 15)
- Next.js App Router
- NextAuth.js for Google OAuth
- TypeScript with strict mode
- Component-based architecture
- JWT token handling

### Backend (Express.js)
- Express.js with TypeScript
- JWT authentication middleware
- Zod schema validation
- CORS configuration
- Health check endpoint

## 📦 Deployment Options

### Option 1: Docker Compose (Recommended)

1. **Configure environment variables:**
   ```bash
   cp .env.production .env
   # Edit .env with your production values
   ```

2. **Build and run:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:4000

### Option 2: Individual Docker Containers

**Backend:**
```bash
cd backend
npm run docker:build
npm run docker:run
```

**Frontend:**
```bash
cd frontend  
npm run docker:build
npm run docker:run
```

### Option 3: Manual Deployment

**Backend:**
```bash
cd backend
npm install --production
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run build  
npm start
```

## 🔧 Environment Configuration

### Required Environment Variables

**Backend (.env):**
```env
NODE_ENV=production
PORT=4000
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d
NEXTAUTH_SECRET=your-nextauth-secret-minimum-32-characters-long
```

**Frontend (.env.local):**
```env
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret-minimum-32-characters-long
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
NEXT_PUBLIC_SERVER_URL=https://api.your-domain.com
```

### Google OAuth Setup

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project or select existing**
3. **Enable Google+ API**
4. **Create OAuth 2.0 credentials:**
   - Application type: Web application
   - Authorized redirect URIs: `https://your-domain.com/api/auth/callback/google`
5. **Copy Client ID and Client Secret to environment variables**

## 🔒 Security Features

- **JWT token validation** with dual-layer authentication
- **CORS protection** with specific origins
- **Environment-based secrets** management
- **Production security headers**
- **Input validation** with Zod schemas

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Custom login (legacy)
- `GET /api/auth/session` - NextAuth session
- `GET /api/auth/jwt` - Get JWT token

### Application
- `GET /api/health` - Health check
- `GET /api/meme` - Get random meme (requires auth)

## 🛠️ Development

**Start development servers:**
```bash
# Backend
cd backend && npm run dev

# Frontend  
cd frontend && npm run dev
```

**Build for production:**
```bash
# Backend
cd backend && npm run prod

# Frontend
cd frontend && npm run prod
```

## 📝 Production Checklist

- [ ] Configure all environment variables
- [ ] Set up Google OAuth credentials
- [ ] Generate secure JWT secrets (min 32 characters)
- [ ] Configure production domain URLs
- [ ] Set up SSL certificates
- [ ] Configure reverse proxy (Nginx/Apache)
- [ ] Set up monitoring and logging
- [ ] Configure database (if needed)
- [ ] Set up CI/CD pipeline

## 🐳 Docker Commands

```bash
# Build all containers
docker-compose build

# Start in production
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## 🚦 Health Checks

- **Backend Health:** `GET /api/health`
- **Frontend:** Accessible at configured domain
- **Docker:** Built-in health checks in docker-compose

## 📋 Troubleshooting

### Common Issues

1. **JWT Authentication Failures:**
   - Ensure `NEXTAUTH_SECRET` matches between frontend and backend
   - Check Google OAuth configuration
   - Verify token expiration settings

2. **CORS Errors:**
   - Update CORS origins in backend configuration
   - Verify `NEXT_PUBLIC_SERVER_URL` points to correct backend

3. **Docker Build Issues:**
   - Clear Docker cache: `docker system prune -a`
   - Rebuild without cache: `docker-compose build --no-cache`

### Log Monitoring

```bash
# Backend logs
docker-compose logs backend -f

# Frontend logs  
docker-compose logs frontend -f

# All logs
docker-compose logs -f
```

## 📄 License

ISC License - See LICENSE file for details.