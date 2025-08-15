# Vercel Monorepo Deployment Guide

## 🚀 Deploy Full-Stack App to Vercel (Single Domain)

This guide shows how to deploy both frontend and backend together on Vercel using a monorepo structure with serverless functions.

### Project Structure
```
meme-app/
├── frontend/          # Next.js app
├── backend/           # Express.js API
│   ├── api/          # Vercel serverless functions
│   │   └── index.ts  # Main API entry point
│   └── src/          # Original backend code
├── vercel.json       # Vercel configuration
├── package.json      # Root package.json
└── README.md
```

## Step 1: Prepare Repository

1. **Initialize root package.json (already done):**
   ```bash
   # Already created with workspaces configuration
   ```

2. **Install dependencies:**
   ```bash
   npm run install:all
   ```

3. **Test local build:**
   ```bash
   npm run build
   ```

## Step 2: Configure Environment Variables

Create `.env` file at the root level:

```env
# NextAuth Configuration
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-production-secret-32-chars-long

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret

# Backend API (same domain as frontend)
NEXT_PUBLIC_SERVER_URL=https://your-app-name.vercel.app

# JWT Configuration
JWT_SECRET=your-jwt-secret-32-chars-long
JWT_EXPIRES_IN=7d

# Production
NODE_ENV=production
```

## Step 3: Deploy to Vercel

### Option A: Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from root directory:**
   ```bash
   vercel
   ```

4. **Configure deployment:**
   - Project name: `meme-app` (or your choice)
   - Directory: `./` (root directory)
   - Override settings? `Y`
   - Build Command: `npm run vercel:build`
   - Output Directory: `frontend/.next`
   - Development Command: `npm run dev`

### Option B: GitHub Integration

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Vercel monorepo deployment ready"
   git push origin main
   ```

2. **Import in Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - **Important Settings:**
     - Framework Preset: `Other`
     - Root Directory: `./` (leave empty)
     - Build Command: `npm run vercel:build`
     - Output Directory: `frontend/.next`
     - Install Command: `npm run install:all`

## Step 4: Environment Variables in Vercel

In Vercel Dashboard → Project → Settings → Environment Variables:

```env
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-production-secret-32-chars-long
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
NEXT_PUBLIC_SERVER_URL=https://your-app-name.vercel.app
JWT_SECRET=your-jwt-secret-32-chars-long
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

**Important:** Set all variables for `Production`, `Preview`, and `Development` environments.

## Step 5: Update Google OAuth Settings

1. **Google Cloud Console:**
   - Navigate to APIs & Services → Credentials
   - Edit your OAuth 2.0 Client
   - **Authorized JavaScript Origins:**
     ```
     https://your-app-name.vercel.app
     ```
   - **Authorized Redirect URIs:**
     ```
     https://your-app-name.vercel.app/api/auth/callback/google
     ```

## How It Works

### URL Routing
- **Frontend:** `https://your-app.vercel.app/` → Next.js app
- **Backend API:** `https://your-app.vercel.app/api/` → Express serverless functions

### API Endpoints
- `GET /api/health` → Health check
- `POST /api/auth/login` → Custom authentication
- `GET /api/meme` → Fetch memes (requires auth)
- `GET /api/auth/session` → NextAuth session
- `GET /api/auth/jwt` → JWT token

### Serverless Functions
- Backend runs as Vercel serverless functions
- Auto-scaling and zero cold starts
- 30-second timeout limit
- Optimized for Edge Runtime

## Architecture Benefits

### ✅ **Single Domain:**
- No CORS issues
- Simplified authentication
- Single SSL certificate
- Unified deployment

### ✅ **Cost Effective:**
- One Vercel project
- Shared resources
- Efficient scaling
- No separate backend hosting

### ✅ **Performance:**
- Global Edge Network
- Automatic CDN
- Optimized routing
- Fast API responses

### ✅ **Security:**
- HTTPS by default
- Environment isolation
- Secure headers
- No cross-origin requests

## Development Workflow

### Local Development
```bash
# Start both frontend and backend
npm run dev

# Frontend only (port 3000)
npm run dev:frontend

# Backend only (port 4000)
npm run dev:backend
```

### Testing
```bash
# Build and test locally
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

### Deployment
```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel

# View deployment logs
vercel logs https://your-app-name.vercel.app
```

## Monitoring & Debugging

### Vercel Dashboard
- **Function Logs:** Monitor API performance
- **Analytics:** Track usage and performance
- **Deployments:** View build logs and status

### Debug Commands
```bash
# Local production build
npm run build && npm start

# Check Vercel logs
vercel logs

# Inspect functions
vercel dev
```

## Troubleshooting

### Common Issues

1. **Build Failures:**
   ```bash
   # Check root package.json scripts
   npm run build
   
   # Verify workspaces
   npm run install:all
   ```

2. **API Routes Not Working:**
   - Check `vercel.json` routing configuration
   - Verify environment variables
   - Check function logs in Vercel dashboard

3. **CORS Errors:**
   - Update CORS origins in `backend/api/index.ts`
   - Ensure same domain for frontend/backend

4. **Authentication Issues:**
   - Verify `NEXTAUTH_URL` matches deployed URL
   - Check Google OAuth redirect URLs
   - Ensure `NEXTAUTH_SECRET` is set

### Performance Optimization

- **Function Cold Starts:** Minimized with optimized imports
- **Bundle Size:** Tree-shaking and code splitting
- **Caching:** Automatic edge caching
- **Image Optimization:** Next.js image optimization

## Scaling Considerations

- **Vercel Pro:** For higher limits and team features
- **Database:** Add PlanetScale, Supabase, or MongoDB Atlas
- **Redis:** Use Upstash for caching
- **File Storage:** Vercel Blob or AWS S3
- **Monitoring:** Sentry, LogRocket, or DataDog

Your full-stack meme app is now deployed on a single Vercel domain with optimal performance and zero configuration! 🚀

## Example URLs
- **App:** `https://your-app-name.vercel.app`
- **Health Check:** `https://your-app-name.vercel.app/api/health`
- **Meme API:** `https://your-app-name.vercel.app/api/meme`