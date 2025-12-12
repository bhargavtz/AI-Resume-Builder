# Configuration Guide

Complete guide to configuring AI Resume Builder.

## Environment Variables

### Required Variables

#### Clerk Authentication

```env
# Get from: https://dashboard.clerk.com/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Setup**:
1. Create Clerk account
2. Create new application
3. Copy keys from API Keys section

---

#### Google Gemini AI

```env
# Get from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=AIza...
```

**Setup**:
1. Go to Google AI Studio
2. Create API key
3. Enable Gemini API

---

#### MongoDB Database

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-resume-builder

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-resume-builder?retryWrites=true&w=majority
```

**Setup**:
- **Local**: Install MongoDB locally
- **Atlas**: Create free cluster at mongodb.com/cloud/atlas

---

#### Application URL

```env
# Development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

### Optional Variables

#### Clerk Webhooks

```env
# Get from: Clerk Dashboard → Webhooks
CLERK_WEBHOOK_SECRET=whsec_...
```

**When needed**: Production deployments

---

#### Node Environment

```env
NODE_ENV=development  # or production
```

**Auto-set** by Next.js

---

#### Server Port

```env
PORT=3000
```

**Default**: 3000

---

## Next.js Configuration

### next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Compiler
  reactCompiler: true,

  // Turbopack configuration
  turbopack: {},

  // Package optimization
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      '@radix-ui/react-dialog'
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          // ... more headers
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## Clerk Configuration

### Sign-In/Sign-Up Settings

**Dashboard → User & Authentication → Email, Phone, Username**

Recommended settings:
- ✅ Email address (required)
- ✅ Password
- ✅ Google OAuth
- ✅ GitHub OAuth

### Session Settings

**Dashboard → Sessions**

- Session lifetime: 7 days
- Inactivity timeout: 30 minutes

### Webhooks

**Dashboard → Webhooks**

1. Add endpoint: `https://your-domain.com/api/webhooks/clerk`
2. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
3. Copy webhook secret to `.env.local`

---

## MongoDB Configuration

### Indexes

Create these indexes for optimal performance:

```javascript
// User resumes index
db.resumes.createIndex({ userId: 1, updatedAt: -1 });

// Search index
db.resumes.createIndex({ userId: 1, title: "text" });

// Share token index
db.resumes.createIndex({ shareToken: 1 });

// Cleanup index
db.resumes.createIndex({ isDeleted: 1, deletedAt: 1 });
```

### Connection Pooling

```typescript
// lib/db.ts
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
};
```

---

## Rate Limiting Configuration

### Current Settings

```typescript
// lib/rate-limit.ts
export const LIMITS = {
  RATE_LIMIT_AI: 10,           // 10 requests
  RATE_LIMIT_WINDOW_MS: 60000, // per minute
};
```

### Recommended Production Settings

Use Redis for distributed rate limiting:

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
});
```

---

## AI Service Configuration

### Gemini Settings

```typescript
// lib/gemini.ts
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

const model = genAI.getGenerativeModel({
  model: "gemini-flash",
  generationConfig: {
    temperature: 0.7,
    topP: 0.9,
    maxOutputTokens: 1024,
  },
});
```

### Retry Configuration

```typescript
// lib/retry.ts
const retryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};
```

---

## Tailwind CSS Configuration

### tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

---

## TypeScript Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Security Configuration

### CORS Settings

```typescript
// next.config.ts
headers: [
  {
    source: '/api/:path*',
    headers: [
      {
        key: 'Access-Control-Allow-Origin',
        value: process.env.NEXT_PUBLIC_APP_URL || '*'
      },
      {
        key: 'Access-Control-Allow-Methods',
        value: 'GET,POST,PUT,DELETE,OPTIONS'
      },
    ],
  },
]
```

### Content Security Policy

```typescript
// middleware.ts
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  connect-src 'self' https://api.clerk.com;
`;
```

---

## Logging Configuration

### Development

```typescript
// lib/logger.ts
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  info: (message: string, meta?: any) => {
    if (isDev) console.log(message, meta);
  },
  error: (message: string, error?: any) => {
    console.error(message, error);
  },
};
```

### Production

Recommended: Use structured logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

---

## Performance Configuration

### Image Optimization

```typescript
// next.config.ts
images: {
  domains: ['your-cdn.com'],
  formats: ['image/avif', 'image/webp'],
}
```

### Bundle Analysis

```bash
# Install analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze bundle
ANALYZE=true npm run build
```

---

## Environment-Specific Configs

### Development (.env.local)

```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/ai-resume-builder
```

### Production (.env.production)

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
MONGODB_URI=mongodb+srv://...
```

---

## Validation

### Verify Configuration

```bash
# Check environment variables
npm run dev

# Should see:
# ✓ Clerk configured
# ✓ MongoDB connected
# ✓ Gemini AI ready
```

### Test Endpoints

```bash
# Health check
curl http://localhost:3000/api/health

# Should return:
# {"status":"healthy","timestamp":"..."}
```

---

## Troubleshooting

### Missing Environment Variables

**Error**: `Missing required environment variable`

**Solution**: Check `.env.local` has all required variables

### Invalid Configuration

**Error**: Build fails

**Solution**: Validate JSON syntax in config files

---

**Need Help?** Check [Troubleshooting Guide](./troubleshooting.md)
