# Deployment Fixes Applied

## Issues Fixed

### ✅ Issue 1: MongoDB Driver Warnings (FIXED)

**Problem:**
```
Warning: useNewUrlParser is a deprecated option
Warning: useUnifiedTopology is a deprecated option
```

**Solution:**
Removed deprecated options from MongoDB connection. Modern MongoDB driver (v4.0.0+) doesn't need these options.

**Changed in:**
- `src/config/database.js`
- `seeds/demoData.js`

**Before:**
```javascript
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

**After:**
```javascript
mongoose.connect(process.env.MONGODB_URI);
```

---

### ✅ Issue 2: Express Rate Limit Error (FIXED)

**Problem:**
```
ValidationError: The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false
ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
```

**Cause:**
When deploying on platforms like Render, Heroku, Railway, or behind any reverse proxy (nginx, CloudFlare, etc.), the platform sets `X-Forwarded-For` headers to track the real client IP. Express needs to be told to trust these headers.

**Solution:**
Added `app.set('trust proxy', 1);` to the Express app configuration.

**Changed in:**
- `src/server.js`

**Added:**
```javascript
// Trust proxy - IMPORTANT for deployment on Render, Heroku, etc.
// This allows Express to trust the X-Forwarded-* headers
app.set('trust proxy', 1);
```

**Why this matters:**
- ✅ Fixes rate limiting (can now identify real user IPs)
- ✅ Enables accurate IP logging
- ✅ Required for production deployments
- ✅ Essential for proxy/load balancer setups

---

## Trust Proxy Options Explained

| Value | Description | Use Case |
|-------|-------------|----------|
| `false` | Don't trust any proxy (default) | Local development only |
| `true` | Trust all proxies | Simple deployments |
| `1` | Trust first proxy | **Recommended** - Render, Heroku |
| `2` | Trust first 2 proxies | Behind multiple proxies |
| `'loopback'` | Trust only loopback IPs | Specific scenarios |

**We use `1`** because platforms like Render use a single reverse proxy.

---

## Deployment Checklist for Production

### Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI` - Atlas connection string
- [ ] `JWT_SECRET` - Strong random string (32+ chars)
- [ ] `JWT_REFRESH_SECRET` - Different random string
- [ ] `CORS_ORIGIN` - Your frontend URL
- [ ] `BASE_URL` - Your API domain

### Server Configuration
- [x] ✅ Trust proxy enabled
- [x] ✅ MongoDB deprecated options removed
- [x] ✅ Rate limiting configured
- [x] ✅ CORS configured
- [x] ✅ Helmet security headers
- [x] ✅ Error handling

### Before Deployment
```bash
# Test locally
npm run dev

# Check for linter errors
npm run lint  # (if you have ESLint configured)

# Run seed data (optional)
node seeds/demoData.js
```

### On Render / Heroku / Railway
1. Connect your GitHub repo
2. Set environment variables in dashboard
3. Deploy!

---

## Additional Production Recommendations

### 1. Use MongoDB Atlas (Cloud)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/natura?retryWrites=true&w=majority
```

### 2. Enable CORS for Your Frontend Only
```env
CORS_ORIGIN=https://your-frontend-domain.com
```

### 3. Use Strong JWT Secrets
```bash
# Generate strong secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Consider Adding These Features
- [ ] Request logging to file (winston, morgan)
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (New Relic, DataDog)
- [ ] Database backups
- [ ] SSL/TLS certificates (automatic on Render/Heroku)

---

## Testing After Fixes

### Local Testing
```bash
# Start server
npm run dev

# Should see (no warnings):
Server running in development mode on port 3000
MongoDB Connected: cluster.mongodb.net
```

### Production Testing
```bash
# Test login endpoint
curl -X POST https://your-api.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@natura.com","password":"password123"}'
```

---

## Common Deployment Platforms

### Render.com
- ✅ Automatic SSL
- ✅ Free tier available
- ✅ Easy MongoDB Atlas integration
- Build Command: `npm install`
- Start Command: `npm start`

### Heroku
- ✅ Easy deployment
- ✅ Add-ons available
- Build Command: automatic
- Start Command: `npm start` (from package.json)

### Railway.app
- ✅ Simple setup
- ✅ Good free tier
- Automatically detects Node.js

### AWS / DigitalOcean
- More control, more configuration needed
- Use PM2 for process management
- Setup nginx as reverse proxy

---

## Need Help?

If you're still seeing errors:

1. **Check server logs** for detailed error messages
2. **Verify environment variables** are set correctly
3. **Test MongoDB connection** separately
4. **Check CORS settings** if frontend can't connect
5. **Verify JWT secrets** are set

---

## Summary

✅ **All fixes applied successfully!**

Your app is now ready for production deployment on platforms like Render, Heroku, Railway, or behind any reverse proxy.

**What was fixed:**
1. ✅ Removed MongoDB deprecated options
2. ✅ Added `trust proxy` for production deployments
3. ✅ Rate limiting now works correctly
4. ✅ Real client IPs are tracked accurately

**You can now deploy without these errors!** 🚀

