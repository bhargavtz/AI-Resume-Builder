# Installation Guide

This guide will help you set up the AI Resume Builder project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20.18.1 or higher ([Download](https://nodejs.org/))
- **npm**: Version 10.x or higher (comes with Node.js)
- **Git**: For cloning the repository ([Download](https://git-scm.com/))
- **MongoDB**: Local instance or MongoDB Atlas account ([Setup Guide](https://www.mongodb.com/docs/manual/installation/))

## Step 1: Clone the Repository

```bash
git clone https://github.com/bhargavtz/AI-Resume-Builder.git
cd AI-Resume-Builder
```

## Step 2: Install Dependencies

```bash
npm install --legacy-peer-deps
```

> **Note**: We use `--legacy-peer-deps` due to React 19 compatibility with some packages.

## Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Google Gemini AI
GEMINI_API_KEY=AIza...

# MongoDB Database
MONGODB_URI=mongodb://localhost:27017/ai-resume-builder
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-resume-builder

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Clerk Webhook (for production)
CLERK_WEBHOOK_SECRET=whsec_...
```

### Getting API Keys

#### Clerk Authentication
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy the publishable key and secret key
4. Configure sign-in/sign-up settings

#### Google Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env.local`

#### MongoDB
- **Local**: Install MongoDB locally or use Docker
- **Atlas**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## Step 4: Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Step 5: Verify Installation

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. Click "Sign In" to test Clerk authentication
3. Create a new resume to test the application
4. Try AI features to verify Gemini API connection

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Use a different port
PORT=3001 npm run dev
```

### MongoDB Connection Issues

**Error**: `MongooseServerSelectionError`

**Solution**:
- Verify MongoDB is running: `mongod --version`
- Check connection string in `.env.local`
- For Atlas, ensure IP whitelist includes your IP

### Clerk Authentication Issues

**Error**: `Clerk: Missing publishable key`

**Solution**:
- Verify `.env.local` has correct Clerk keys
- Restart the development server
- Clear browser cache and cookies

### Gemini API Issues

**Error**: `API key not valid`

**Solution**:
- Verify API key is correct in `.env.local`
- Check API key has Gemini API enabled
- Ensure no extra spaces in the key

## Next Steps

- Read the [Quick Start Guide](./quick-start.md) to learn basic usage
- Explore [Configuration Options](./configuration.md) for advanced setup
- Check [Architecture Overview](./architecture.md) to understand the codebase

## Development Tools (Optional)

### Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

### Database GUI Tools

- **MongoDB Compass** - Official MongoDB GUI
- **Studio 3T** - Advanced MongoDB client
- **Robo 3T** - Lightweight MongoDB client

---

**Need Help?** Check the [Troubleshooting Guide](./troubleshooting.md) or [open an issue](https://github.com/bhargavtz/AI-Resume-Builder/issues).
