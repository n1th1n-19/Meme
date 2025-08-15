# Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Docker and Docker Compose installed
- Domain name configured
- Google OAuth credentials
- SSL certificates (for HTTPS)

### Step 1: Environment Configuration

1. **Copy production environment template:**
   ```bash
   cp .env.production .env
   ```

2. **Configure your production values:**
   ```env
   # Generate secure secrets (32+ characters)
   JWT_SECRET=generate-random-32-char-string
   NEXTAUTH_SECRET=generate-another-32-char-string
   
   # Your production domains
   NEXTAUTH_URL=https://your-domain.com
   NEXT_PUBLIC_SERVER_URL=https://api.your-domain.com
   
   # Google OAuth credentials
   GOOGLE_CLIENT_ID=your-production-client-id
   GOOGLE_CLIENT_SECRET=your-production-client-secret
   ```

### Step 2: Google OAuth Setup

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Select your project**
3. **Navigate to APIs & Services → Credentials**
4. **Update OAuth 2.0 Client:**
   - Authorized JavaScript origins: `https://your-domain.com`
   - Authorized redirect URIs: `https://your-domain.com/api/auth/callback/google`

### Step 3: Deploy with Docker

```bash
# Build and start production containers
docker-compose up -d --build

# Verify containers are running
docker-compose ps

# Check logs
docker-compose logs -f
```

### Step 4: Reverse Proxy (Nginx Example)

Create `/etc/nginx/sites-available/meme-app`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/meme-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔧 Alternative Deployment Options

### Vercel (Frontend Only)

1. **Connect your GitHub repository**
2. **Configure environment variables:**
   ```
   NEXTAUTH_URL=https://your-vercel-app.vercel.app
   NEXTAUTH_SECRET=your-secret
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   NEXT_PUBLIC_SERVER_URL=https://your-backend-url.com
   ```
3. **Deploy automatically**

### Railway/Render (Backend)

1. **Connect your GitHub repository**
2. **Configure environment variables**
3. **Set build command:** `npm run build`
4. **Set start command:** `npm start`

### DigitalOcean App Platform

1. **Create new app from GitHub**
2. **Configure build settings:**
   - Build command: `npm run build`
   - Run command: `npm start`
3. **Set environment variables**
4. **Deploy**

## 📊 Monitoring & Logging

### Docker Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs frontend -f
docker-compose logs backend -f

# Export logs to file
docker-compose logs > app-logs.txt
```

### Health Checks
- Backend: `https://api.your-domain.com/api/health`
- Frontend: `https://your-domain.com`

### Production Monitoring

Consider adding:
- **Error tracking:** Sentry
- **Performance monitoring:** DataDog, New Relic
- **Uptime monitoring:** Pingdom, UptimeRobot
- **Log aggregation:** ELK Stack, Papertrail

## 🔒 Security Hardening

### Environment Security
- Use strong secrets (32+ characters)
- Never commit `.env` files
- Rotate secrets regularly
- Use environment-specific configurations

### Network Security
- Enable HTTPS/SSL
- Configure proper CORS origins
- Use secure headers
- Implement rate limiting

### Docker Security
- Use non-root users in containers
- Scan images for vulnerabilities
- Keep base images updated
- Use multi-stage builds

## 🚨 Backup & Recovery

### Database Backup
```bash
# If using database, backup regularly
docker-compose exec db pg_dump -U user database > backup.sql
```

### Container Backup
```bash
# Export container configurations
docker-compose config > docker-compose-backup.yml

# Backup volumes
docker run --rm -v project_data:/data -v $(pwd):/backup alpine tar czf /backup/data-backup.tar.gz -C /data .
```

## 🔄 Updates & Maintenance

### Update Dependencies
```bash
# Update backend dependencies
cd backend && npm update

# Update frontend dependencies  
cd frontend && npm update

# Rebuild containers
docker-compose up -d --build
```

### Rolling Updates
```bash
# Update one service at a time
docker-compose up -d --no-deps backend
docker-compose up -d --no-deps frontend
```

### Rollback Strategy
```bash
# Rollback to previous version
docker-compose down
git checkout previous-version
docker-compose up -d --build
```

## ⚡ Performance Optimization

### Frontend Optimization
- Enable Next.js image optimization
- Use CDN for static assets
- Enable compression
- Cache static resources

### Backend Optimization
- Enable gzip compression
- Use connection pooling
- Implement caching (Redis)
- Optimize database queries

### Infrastructure Optimization
- Use load balancers
- Implement auto-scaling
- Use container orchestration (Kubernetes)
- Monitor resource usage

## 📞 Support & Troubleshooting

### Common Production Issues

1. **Environment Variable Mismatch:**
   ```bash
   # Check environment variables
   docker-compose exec backend env | grep NEXTAUTH_SECRET
   docker-compose exec frontend env | grep NEXTAUTH_SECRET
   ```

2. **Google OAuth Issues:**
   - Verify redirect URIs match exactly
   - Check domain configuration
   - Ensure HTTPS is enabled

3. **CORS Problems:**
   - Update backend CORS configuration
   - Verify domain names match

4. **Container Issues:**
   ```bash
   # Restart specific service
   docker-compose restart backend
   
   # Rebuild and restart
   docker-compose up -d --build backend
   
   # Check container health
   docker-compose exec backend curl -f http://localhost:4000/api/health
   ```

### Debug Commands
```bash
# Check container status
docker-compose ps

# View container resource usage
docker stats

# Access container shell
docker-compose exec backend sh
docker-compose exec frontend sh

# View container logs with timestamps
docker-compose logs -f -t backend
```