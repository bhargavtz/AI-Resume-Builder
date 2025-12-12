# Deployment Guide

This guide covers deploying the AI Resume Builder to production environments.

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the recommended platform for deploying Next.js applications.

#### Prerequisites
- Vercel account ([Sign up](https://vercel.com/signup))
- GitHub repository
- Environment variables ready

#### Steps

**1. Connect Repository**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

**2. Configure Environment Variables**

In Vercel Dashboard → Project → Settings → Environment Variables:

```env
# Production Environment Variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
GEMINI_API_KEY=AIza...
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

**3. Configure Domains**

1. Go to Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**4. Deploy**

```bash
# Production deployment
vercel --prod
```

#### Automatic Deployments

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

---

### Option 2: Docker Deployment

Deploy using Docker containers.

#### Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/ai-resume-builder
      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${CLERK_PUB_KEY}
      - CLERK_SECRET_KEY=${CLERK_SECRET}
      - GEMINI_API_KEY=${GEMINI_KEY}
    depends_on:
      - mongo
    
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

#### Deploy

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f app
```

---

### Option 3: AWS Deployment

Deploy to AWS using Elastic Beanstalk or ECS.

#### AWS Elastic Beanstalk

**1. Install EB CLI**

```bash
pip install awsebcli
```

**2. Initialize**

```bash
eb init -p node.js ai-resume-builder
```

**3. Create Environment**

```bash
eb create production
```

**4. Set Environment Variables**

```bash
eb setenv \
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_... \
  CLERK_SECRET_KEY=sk_live_... \
  GEMINI_API_KEY=AIza... \
  MONGODB_URI=mongodb+srv://...
```

**5. Deploy**

```bash
eb deploy
```

---

## Database Setup

### MongoDB Atlas (Recommended)

**1. Create Cluster**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (M0 free tier available)
3. Choose a region close to your app

**2. Configure Network Access**

1. Go to Network Access
2. Add IP Address: `0.0.0.0/0` (allow from anywhere)
   - Or add specific IPs for better security

**3. Create Database User**

1. Go to Database Access
2. Add New Database User
3. Set username and password
4. Grant read/write permissions

**4. Get Connection String**

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your password

```
mongodb+srv://username:<password>@cluster.mongodb.net/ai-resume-builder
```

---

## Clerk Configuration

### Production Setup

**1. Create Production Instance**

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application (or use existing)
3. Go to API Keys
4. Copy production keys

**2. Configure Domains**

1. Go to Domains
2. Add your production domain
3. Update redirect URLs

**3. Configure Webhooks**

1. Go to Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`, `user.deleted`
4. Copy webhook secret

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | `pk_live_...` |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_live_...` |
| `CLERK_WEBHOOK_SECRET` | Webhook signature | `whsec_...` |
| `GEMINI_API_KEY` | Google AI key | `AIza...` |
| `MONGODB_URI` | MongoDB connection | `mongodb+srv://...` |
| `NEXT_PUBLIC_APP_URL` | App URL | `https://your-domain.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `3000` |

---

## SSL/TLS Configuration

### Vercel
- Automatic SSL certificates
- Auto-renewal
- No configuration needed

### Custom Server
Use Let's Encrypt with Certbot:

```bash
# Install Certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d your-domain.com

# Configure nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

---

## Performance Optimization

### 1. Enable Caching

**Vercel**: Automatic edge caching

**Custom**: Use CDN (Cloudflare, AWS CloudFront)

### 2. Database Indexing

Ensure indexes are created:

```javascript
// In MongoDB
db.resumes.createIndex({ userId: 1, updatedAt: -1 });
db.resumes.createIndex({ userId: 1, title: "text" });
```

### 3. Image Optimization

Next.js automatically optimizes images. Ensure:
- Use `next/image` component
- Configure image domains in `next.config.ts`

---

## Monitoring Setup

### Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Sentry Error Tracking

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## Backup Strategy

### Database Backups

**MongoDB Atlas**:
- Automatic backups enabled by default
- Point-in-time recovery available
- Configure backup schedule in Atlas

**Manual Backup**:
```bash
mongodump --uri="mongodb+srv://..." --out=/backup/$(date +%Y%m%d)
```

### Code Backups
- Git repository (GitHub)
- Regular commits
- Tag releases

---

## Rollback Procedure

### Vercel

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Docker

```bash
# Tag current version
docker tag app:latest app:v1.0.0

# Rollback
docker-compose down
docker-compose up -d app:v1.0.0
```

---

## Health Checks

### Create Health Endpoint

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
}
```

### Monitor

```bash
# Check health
curl https://your-domain.com/api/health
```

---

## Troubleshooting

### Build Failures

**Issue**: Build fails on Vercel

**Solution**:
1. Check build logs
2. Verify environment variables
3. Test build locally: `npm run build`

### Database Connection Issues

**Issue**: Cannot connect to MongoDB

**Solution**:
1. Verify connection string
2. Check network access whitelist
3. Verify database user credentials

### Clerk Authentication Issues

**Issue**: Authentication not working

**Solution**:
1. Verify API keys are correct
2. Check domain configuration
3. Ensure redirect URLs are set

---

## Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] Database access restricted
- [ ] API rate limiting enabled
- [ ] Webhook signatures verified
- [ ] CORS configured properly
- [ ] Security headers set
- [ ] Regular dependency updates
- [ ] Error messages don't leak sensitive info
- [ ] Logs don't contain secrets

---

## Post-Deployment

1. **Test all features**
   - User registration/login
   - Resume creation
   - AI features
   - Export functionality

2. **Monitor performance**
   - Check response times
   - Monitor error rates
   - Review logs

3. **Set up alerts**
   - Error rate threshold
   - Response time threshold
   - Database connection issues

---

**Need Help?** Check [Troubleshooting](./troubleshooting.md) or [open an issue](https://github.com/bhargavtz/AI-Resume-Builder/issues).
