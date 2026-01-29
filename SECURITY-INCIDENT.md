# Security Incident: Exposed Credentials

## What Happened

Your repository accidentally exposed sensitive credentials in the Git history:

1. **Google Maps API Key** - Hardcoded in `public/index.html`
2. **MongoDB Atlas URI** - Exposed in `README.md` and `.env.example` with actual credentials

## Immediate Actions Required

You MUST rotate (regenerate) these credentials immediately because anyone with access to your GitHub repository can see them in the commit history, even after you remove them from the current files.

---

## Step 1: Rotate Google Maps API Key

### Delete the Exposed Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find the API key: `AIzaSyCvhiODJ48fy0abyyvj04hnUqzYSU8RQxU`
4. Click the **three dots** menu → **Delete**
5. Confirm deletion

### Create a New API Key

1. In the same Credentials page, click **"+ CREATE CREDENTIALS"** → **API key**
2. A new key will be generated
3. Click **"Restrict Key"** immediately
4. Under **API restrictions**:
   - Select **"Restrict key"**
   - Enable only: **Maps JavaScript API**
5. Under **Application restrictions** (optional but recommended):
   - Select **HTTP referrers (web sites)**
   - Add your domains:
     - `http://localhost:*/*`
     - `https://yourdomain.com/*`
     - `https://*.vercel.app/*` (if using Vercel)
6. Click **Save**
7. Copy the new API key

### Update Your Application

1. Open your `.env` file
2. Replace the old key with the new one:
   ```env
   GOOGLE_MAPS_API_KEY=your_new_api_key_here
   ```
3. Restart your server

---

## Step 2: Rotate MongoDB Atlas Credentials

### Change Database Password

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in to your account
3. Click on **Database Access** in the left sidebar
4. Find user: `hmacdermott_db_user`
5. Click **"Edit"** → **"Edit Password"**
6. Click **"Autogenerate Secure Password"** or create a strong one
7. **COPY THE NEW PASSWORD** (you won't see it again!)
8. Click **"Update User"**

### Update Connection String

1. Get your connection string from MongoDB Atlas:
   - Go to **Database** → **Connect** → **Connect your application**
   - Copy the connection string
   - Replace `<password>` with your new password

   Format example:
   ```
   mongodb+srv://username:new_password@your-cluster.mongodb.net/your-database
   ```
2. Open your `.env` file
3. Replace the `MONGODB_URI` with the new connection string
4. Restart your server

### Alternative: Create New Database User (More Secure)

1. In MongoDB Atlas → **Database Access**
2. Click **"+ ADD NEW DATABASE USER"**
3. Choose **Password** authentication
4. Create a strong username and password
5. Set privileges to **"Atlas admin"** or **"Read and write to any database"**
6. Click **"Add User"**
7. Get your new connection string from **Database** → **Connect** → **"Connect your application"**
8. Update `.env` file with new connection string
9. **Delete the old user** (`hmacdermott_db_user`) after confirming the new one works

---

## Step 3: Rotate JWT Secret (Recommended)

While your JWT secret wasn't explicitly exposed, it's good practice to change it:

1. Generate a new secure secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Update your `.env` file:
   ```env
   JWT_SECRET=your_new_64_character_secret_here
   ```
3. Restart your server

**Note**: Changing the JWT secret will log out all users. They'll need to log in again.

---

## Step 4: Verify .env is NOT in Git

Make absolutely sure your `.env` file is never committed:

```bash
# Check if .env is in .gitignore (should already be there)
grep ".env" .gitignore

# If .env was accidentally committed, remove it from Git history
git rm --cached .env

# Then commit the removal
git add .gitignore
git commit -m "Remove .env from repository"
```

---

## Step 5: Update Vercel Environment Variables (If Deployed)

If you've already deployed to Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update each variable with the new values:
   - `GOOGLE_MAPS_API_KEY` (new key)
   - `MONGODB_URI` (new connection string)
   - `JWT_SECRET` (new secret)
5. Click **Save**
6. **Redeploy** your application:
   - Go to **Deployments**
   - Click the three dots on the latest deployment
   - Select **Redeploy**

---

## Step 6: Monitor for Unauthorized Access

### MongoDB Atlas

1. Go to **Database** → **Metrics** in MongoDB Atlas
2. Check for unusual activity:
   - Unexpected connections
   - High operation counts
   - Data access from unknown IPs

### Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Dashboard**
3. Check **Maps JavaScript API** usage for unexpected spikes

### Watch for Abuse

- Monitor your Google Cloud billing for unexpected charges
- Check MongoDB Atlas metrics for unusual data access patterns
- Review your application logs for suspicious activity

---

## Step 7: Prevent Future Incidents

### Best Practices Implemented

✅ Google Maps API key now loaded server-side (not hardcoded in HTML)
✅ `.env` file in `.gitignore`
✅ `.env.example` contains only placeholders
✅ README.md no longer shows real credentials
✅ Security documentation created

### Going Forward

1. **Never commit `.env` files** to Git
2. **Never hardcode API keys** in client-side code
3. **Always use environment variables** for secrets
4. **Use `.env.example`** as a template with fake values only
5. **Review changes before committing**:
   ```bash
   git diff  # Review what's being committed
   ```
6. **Use git-secrets** (optional tool to prevent committing secrets):
   ```bash
   brew install git-secrets
   git secrets --install
   git secrets --register-aws  # And other patterns
   ```

---

## Timeline

1. ✅ **Immediately**: Remove credentials from current code
2. ⚠️ **Next**: Rotate Google Maps API key (15 minutes)
3. ⚠️ **Next**: Rotate MongoDB password/user (10 minutes)
4. ✅ **Then**: Commit fixes to GitHub
5. ⚠️ **Finally**: Update Vercel environment variables (if deployed)

---

## Questions?

If you're unsure about any step, it's better to ask than to make a mistake. The most important actions are:

1. **Delete the exposed Google Maps API key** - This can result in charges if abused
2. **Change the MongoDB password** - This protects your data from unauthorized access

These two actions should be done **within the next hour** to minimize risk.

---

## Verification Checklist

After completing all steps, verify:

- [ ] New Google Maps API key is working in your app
- [ ] Old Google Maps API key is deleted in Google Cloud Console
- [ ] MongoDB password has been changed
- [ ] Application connects successfully to MongoDB with new credentials
- [ ] `.env` file is NOT tracked by Git (`git status` should not show it)
- [ ] `.env.example` contains only placeholder values
- [ ] README.md contains no real credentials
- [ ] Changes are committed and pushed to GitHub
- [ ] Vercel environment variables updated (if deployed)
- [ ] Application is working in production (if deployed)

---

**Remember**: The exposed credentials are in your Git history. Rotating them ensures the old values are useless even if someone finds them in old commits.
