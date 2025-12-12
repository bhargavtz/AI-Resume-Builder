# Troubleshooting Guide

Common issues and solutions for AI Resume Builder.

## Installation Issues

### npm install fails

**Error**: `ERESOLVE could not resolve`

**Solution**:
```bash
npm install --legacy-peer-deps
```

**Reason**: React 19 compatibility with some packages

---

### MongoDB connection fails

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions**:

1. **Check MongoDB is running**:
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB (if local)
mongod
```

2. **Verify connection string**:
```env
# .env.local
MONGODB_URI=mongodb://localhost:27017/ai-resume-builder
```

3. **For MongoDB Atlas**:
   - Check IP whitelist includes your IP
   - Verify username and password
   - Ensure database user has permissions

---

### Clerk authentication not working

**Error**: `Clerk: Missing publishable key`

**Solutions**:

1. **Check environment variables**:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

2. **Restart development server**:
```bash
# Stop server (Ctrl+C)
npm run dev
```

3. **Clear browser cache and cookies**

---

## Development Issues

### Build fails with Turbopack error

**Error**: `This build is using Turbopack, with a webpack config`

**Solution**:
Already fixed in `next.config.ts`. If still occurring:
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

### TypeScript errors

**Error**: Type errors in IDE

**Solutions**:

1. **Restart TypeScript server** (VS Code):
   - `Ctrl/Cmd + Shift + P`
   - Type "TypeScript: Restart TS Server"

2. **Check tsconfig.json**:
```json
{
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true
  }
}
```

---

### Hot reload not working

**Solution**:
```bash
# Clear cache and restart
rm -rf .next
npm run dev
```

---

## Runtime Issues

### AI features not working

**Error**: `AI_SERVICE_ERROR`

**Solutions**:

1. **Check API key**:
```env
GEMINI_API_KEY=AIza...
```

2. **Verify API key is active**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Check key status

3. **Check rate limits**:
   - Wait 1 minute if exceeded
   - Limit: 10 requests/minute

---

### Resume not saving

**Symptoms**: Changes don't persist

**Solutions**:

1. **Check network connection**
2. **Check browser console** for errors
3. **Verify authentication** - sign out and sign in again
4. **Clear browser cache**

---

### PDF export fails

**Error**: Export button doesn't work

**Solutions**:

1. **Disable pop-up blocker**
2. **Try different browser**
3. **Check browser console** for errors
4. **Ensure resume has content**

---

### Dark mode PDF export issues

**Solution**: Already fixed - PDF export forces light mode

---

## Production Issues

### Deployment fails on Vercel

**Error**: Build fails

**Solutions**:

1. **Check environment variables** in Vercel dashboard
2. **Verify all required variables** are set
3. **Check build logs** for specific errors
4. **Test build locally**:
```bash
npm run build
```

---

### Database connection in production

**Error**: Cannot connect to MongoDB

**Solutions**:

1. **For MongoDB Atlas**:
   - Add `0.0.0.0/0` to IP whitelist
   - Or add Vercel's IP ranges

2. **Check connection string**:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

3. **Verify network access** in Atlas dashboard

---

### Clerk webhooks not working

**Error**: Webhook events not received

**Solutions**:

1. **Verify webhook URL**:
```
https://your-domain.com/api/webhooks/clerk
```

2. **Check webhook secret**:
```env
CLERK_WEBHOOK_SECRET=whsec_...
```

3. **Test webhook** in Clerk dashboard
4. **Check application logs**

---

## Performance Issues

### Slow page loads

**Solutions**:

1. **Enable caching** (Vercel automatic)
2. **Check database indexes**:
```javascript
db.resumes.createIndex({ userId: 1, updatedAt: -1 });
```

3. **Optimize images** - use Next.js Image component

---

### High memory usage

**Solutions**:

1. **Check for memory leaks** in components
2. **Limit resume list** - use pagination
3. **Clear cache** periodically

---

## Browser-Specific Issues

### Safari issues

**Issue**: Some features don't work

**Solution**:
- Update to latest Safari version
- Try Chrome or Firefox
- Check console for specific errors

---

### Mobile browser issues

**Issue**: Layout problems

**Solution**:
- Responsive design is implemented
- Report specific issues on GitHub

---

## Error Messages

### "Rate limit exceeded"

**Meaning**: Too many AI requests

**Solution**: Wait 60 seconds and try again

---

### "Unauthorized"

**Meaning**: Not logged in or session expired

**Solution**: Sign in again

---

### "Validation error"

**Meaning**: Invalid input data

**Solution**: Check form fields for errors

---

### "Internal Server Error"

**Meaning**: Server-side issue

**Solution**:
1. Try again
2. Check if issue persists
3. Report if continues

---

## Getting More Help

### Check Logs

**Development**:
```bash
# Check terminal output
npm run dev
```

**Production (Vercel)**:
- Go to Vercel Dashboard
- Select your project
- Click "Logs" tab

### Browser Console

1. Open DevTools (`F12`)
2. Go to Console tab
3. Look for errors (red text)
4. Copy error message

### Report Issues

When reporting issues, include:
- Error message
- Steps to reproduce
- Browser and version
- Screenshots (if applicable)

**GitHub Issues**: [Report here](https://github.com/bhargavtz/AI-Resume-Builder/issues)

---

## Still Need Help?

- **Documentation**: [docs/README.md](./README.md)
- **FAQ**: [faq.md](./faq.md)
- **Community**: [GitHub Discussions](https://github.com/bhargavtz/AI-Resume-Builder/discussions)
- **Email**: support@example.com
