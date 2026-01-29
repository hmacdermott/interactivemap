# Deploying to Vercel

This guide will walk you through deploying your Interactive China Map application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free tier available)
2. A [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas) (already configured)
3. A [Cloudinary account](https://cloudinary.com/users/register/free) (free tier available)
4. [Vercel CLI](https://vercel.com/docs/cli) installed (optional, but recommended)

```bash
npm install -g vercel
```

## Step 1: Set Up Cloudinary

Vercel's serverless functions have read-only filesystems, so we need to use cloud storage for image uploads.

1. Go to [Cloudinary](https://cloudinary.com/users/register/free) and create a free account
2. After signing in, go to your Dashboard
3. Note down these three values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## Step 2: Install Dependencies

Install the Cloudinary package:

```bash
npm install
```

## Step 3: Prepare Environment Variables

You'll need to set these environment variables in Vercel:

- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Your JWT secret key
- `GOOGLE_MAPS_API_KEY` - Your Google Maps API key
- `CLOUDINARY_CLOUD_NAME` - From Cloudinary dashboard
- `CLOUDINARY_API_KEY` - From Cloudinary dashboard
- `CLOUDINARY_API_SECRET` - From Cloudinary dashboard

## Step 4: Deploy to Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Vercel will automatically detect the configuration from `vercel.json`
5. Add environment variables:
   - Go to "Environment Variables" section
   - Add each variable from Step 3
   - Make sure to add them for all environments (Production, Preview, Development)
6. Click "Deploy"
7. Wait for the deployment to complete (usually 1-2 minutes)
8. Your app will be live at `https://your-project-name.vercel.app`

### Option B: Using Vercel CLI

1. Login to Vercel CLI:
```bash
vercel login
```

2. Deploy from your project directory:
```bash
vercel
```

3. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? (Select your account)
   - Link to existing project? **N**
   - Project name? (Accept default or enter custom name)
   - In which directory is your code located? **.**

4. Add environment variables:
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add GOOGLE_MAPS_API_KEY
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
```

For each command, paste the value and select which environments to apply it to (Production, Preview, Development).

5. Deploy to production:
```bash
vercel --prod
```

## Step 5: Configure MongoDB Atlas

Make sure your MongoDB Atlas database allows connections from Vercel:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click on your cluster → "Network Access"
3. Add IP Address → "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, you may want to restrict this to Vercel's IP ranges
4. Save changes

## Step 6: Configure Google Maps API

Update your Google Maps API key restrictions:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Credentials"
3. Click on your API key
4. Under "Application restrictions":
   - Select "HTTP referrers"
   - Add your Vercel domain: `https://your-project-name.vercel.app/*`
   - Add Vercel preview domains: `https://*.vercel.app/*`
5. Save changes

## Step 7: Test Your Deployment

1. Visit your Vercel URL: `https://your-project-name.vercel.app`
2. Test the following:
   - User registration and login
   - Creating a new pin with image upload
   - Viewing pins on the map
   - Editing and deleting your own pins
   - Logout functionality

## Common Issues and Solutions

### Issue: "Cannot read property of undefined"

**Solution**: Make sure all environment variables are set correctly in Vercel dashboard.

Go to: Project → Settings → Environment Variables

### Issue: MongoDB connection fails

**Solution**:
- Verify your MongoDB Atlas connection string is correct
- Ensure IP whitelist includes 0.0.0.0/0 in MongoDB Atlas
- Check that your database user has correct permissions

### Issue: Google Maps not loading

**Solution**:
- Verify your Google Maps API key is correct
- Check API key restrictions allow your Vercel domain
- Ensure "Maps JavaScript API" is enabled in Google Cloud Console

### Issue: Image upload fails

**Solution**:
- Verify all three Cloudinary credentials are set correctly
- Check Cloudinary dashboard for error logs
- Ensure image file size is under 5MB

### Issue: 404 errors on API routes

**Solution**: This is usually a routing issue. The `vercel.json` configuration should handle this, but if you encounter issues:
- Make sure `vercel.json` is in the root directory
- Try redeploying with `vercel --prod --force`

## Development vs Production

The app now supports two modes:

- **Development** (local): Uses local file storage in `server/uploads/`
- **Production** (Vercel): Uses Cloudinary for image storage

To run locally without Cloudinary, simply don't set the Cloudinary environment variables in your `.env` file.

## Updating Your Deployment

After making changes to your code:

1. Commit and push to your Git repository
2. Vercel will automatically deploy the changes
3. Or use: `vercel --prod` to manually deploy

## Custom Domain (Optional)

To use your own domain:

1. Go to your Project → Settings → Domains
2. Add your custom domain
3. Follow Vercel's instructions to update your DNS records
4. Update Google Maps API key restrictions to include your custom domain

## Monitoring and Logs

View logs and monitor your deployment:

1. Go to your Project in Vercel Dashboard
2. Click on "Deployments" to see deployment history
3. Click on any deployment → "View Function Logs"
4. Use this to debug any runtime issues

## Cost Considerations

- **Vercel**: Free tier includes 100GB bandwidth, unlimited personal projects
- **MongoDB Atlas**: Free tier includes 512MB storage, enough for thousands of pins
- **Cloudinary**: Free tier includes 25GB storage, 25GB bandwidth/month
- **Google Maps**: $200 free credit per month (more than enough for small apps)

All services have generous free tiers that should be sufficient for personal projects and small-scale applications.

## Support

If you encounter issues:
1. Check Vercel Function Logs for error messages
2. Verify all environment variables are set correctly
3. Test each service (MongoDB, Cloudinary, Google Maps) independently
4. Open an issue on GitHub with detailed error messages

---

**Congratulations!** Your Interactive China Map is now deployed and accessible worldwide! 🎉
