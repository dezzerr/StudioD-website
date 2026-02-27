# StudioD - Backend Documentation

Complete backend setup guide for image storage, CMS, hosting, and form handling.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [ImageKit Setup](#imagekit-setup)
3. [Netlify Hosting](#netlify-hosting)
4. [Decap CMS Configuration](#decap-cms-configuration)
5. [Environment Variables](#environment-variables)
6. [Form Handling](#form-handling)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        STUDIOD                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Frontend   │    │   Netlify    │    │   ImageKit   │      │
│  │   (React)    │◄──►│  (Hosting)   │◄──►│  (Images)    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                   │                                    │
│         │            ┌──────┴──────┐                          │
│         │            │   GitHub    │                          │
│         │            │   (Repo)    │                          │
│         │            └──────┬──────┘                          │
│         │                   │                                    │
│  ┌──────┴──────┐    ┌──────┴──────┐                          │
│  │  Decap CMS  │    │   Forms     │                          │
│  │  (Content)  │    │ (Netlify)   │                          │
│  └─────────────┘    └─────────────┘                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ImageKit Setup

ImageKit provides image hosting, optimization, and transformation.

### 1. Create Account

1. Go to [imagekit.io](https://imagekit.io/)
2. Sign up for a free account (25GB storage)
3. Verify your email

### 2. Get Credentials

1. Go to **Dashboard** → **Developer options**
2. Copy the following:
   - **URL Endpoint**: `https://ik.imagekit.io/YOUR_ENDPOINT`
   - **Public Key**: Your public API key
   - **Private Key**: Your private API key (keep secret!)

### 3. Configure ImageKit

Create an `.env` file in your project root:

```bash
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/YOUR_ENDPOINT
VITE_IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
```

### 4. Folder Structure

Create these folders in ImageKit dashboard:
- `/studio-d/uploads` - User uploads
- `/studio-d/collections` - Collection images
- `/studio-d/gallery` - Gallery images

### 5. Image Transformations

The app uses these transformations automatically:

```typescript
// Gallery images
{ width: 1200, height: 1600, quality: 90, format: 'auto' }

// Thumbnails
{ width: 400, height: 533, quality: 80, format: 'auto' }

// Collection cards
{ width: 800, height: 1000, quality: 85, format: 'auto' }
```

---

## Netlify Hosting

### 1. Create Account

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub

### 2. Connect Repository

1. Click **Add new site** → **Import an existing project**
2. Select GitHub
3. Choose your `studio-d` repository
4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### 3. Enable Identity (for CMS)

1. Go to **Site settings** → **Identity**
2. Click **Enable Identity**
3. Set registration to **Invite only** (recommended)

### 4. Enable Git Gateway

1. In Identity settings, go to **Services**
2. Click **Enable Git Gateway**
3. This allows CMS to commit to your repo

### 5. Environment Variables

Add these in **Site settings** → **Environment variables**:

```
VITE_IMAGEKIT_URL_ENDPOINT
VITE_IMAGEKIT_PUBLIC_KEY
IMAGEKIT_PRIVATE_KEY
CONTACT_EMAIL
```

---

## Decap CMS Configuration

### Access the CMS

Navigate to: `https://your-site.netlify.app/admin/`

### User Management

1. Invite users from **Identity** tab
2. Users will receive email invitation
3. They can log in with email/password or OAuth

### Content Structure

The CMS manages:

#### Collections
- Title
- Season/Date
- Description
- Thumbnail image
- Category (Studio, Location, Family, Editorial, Corporate)
- Featured flag
- Gallery images array

#### Pricing Packages
- Package name
- Price
- Duration
- Description
- Features list
- Popular flag

#### Site Settings
- Site title
- Contact email
- Phone number
- Instagram handle
- Studio address

---

## Environment Variables

### Required Variables

| Variable | Description | Source |
|----------|-------------|--------|
| `VITE_IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint | ImageKit Dashboard |
| `VITE_IMAGEKIT_PUBLIC_KEY` | ImageKit public API key | ImageKit Dashboard |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private API key | ImageKit Dashboard |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CONTACT_EMAIL` | Form submission recipient | hello@studiod.com |
| `SENDGRID_API_KEY` | SendGrid for email notifications | - |
| `RESEND_API_KEY` | Resend for email notifications | - |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 ID | - |

### Development vs Production

**Development** (`.env.local`):
```bash
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/dev-endpoint
```

**Production** (Netlify Environment Variables):
```bash
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/prod-endpoint
```

---

## Form Handling

### How It Works

1. User submits contact form
2. Frontend sends POST to `/.netlify/functions/form-submission`
3. Netlify Function processes the submission
4. Email notification sent (if configured)
5. Success response returned to user

### Email Notifications

#### Option 1: Netlify Forms (Default)
No configuration needed. Submissions appear in Netlify dashboard.

#### Option 2: SendGrid
1. Create account at [sendgrid.com](https://sendgrid.com)
2. Get API key
3. Add to environment variables:
   ```
   SENDGRID_API_KEY=your-api-key
   ```

#### Option 3: Resend
1. Create account at [resend.com](https://resend.com)
2. Get API key
3. Add to environment variables:
   ```
   RESEND_API_KEY=your-api-key
   ```

### Viewing Submissions

- **Netlify Dashboard**: Site → Forms
- **API Endpoint**: `/.netlify/functions/form-submission`

---

## Deployment

### Automatic Deployment

Netlify automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update content"
git push origin main
```

### Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link to site
netlify link

# Deploy
netlify deploy --prod
```

### Deploy Preview

Every pull request gets a preview URL:
```
https://deploy-preview-123--your-site.netlify.app
```

---

## Image Upload Workflow

### Via CMS

1. Log in to `/admin/`
2. Create/edit a collection
3. Click **Choose an image**
4. Upload or select existing image
5. Image is uploaded to ImageKit
6. URL is saved in the collection

### Via API

```typescript
import { uploadImage } from '@/services/imagekit';

const file = event.target.files[0];
const result = await uploadImage(file, 'collections');
console.log(result.url); // ImageKit URL
```

### Image Optimization

Images are automatically optimized with:
- WebP/AVIF format (when supported)
- Responsive sizing
- Quality compression
- Lazy loading

---

## Troubleshooting

### Images Not Loading

1. Check ImageKit credentials in environment variables
2. Verify image exists in ImageKit dashboard
3. Check browser console for 404 errors
4. Ensure CORS is configured in ImageKit

### CMS Not Working

1. Verify Git Gateway is enabled
2. Check Identity service is active
3. Ensure user has been invited
4. Check browser console for auth errors

### Forms Not Submitting

1. Check Netlify Functions logs
2. Verify environment variables are set
3. Test function locally: `netlify dev`

### Build Failures

1. Check build logs in Netlify dashboard
2. Ensure all dependencies are in package.json
3. Verify Node.js version (should be 18+)

---

## Local Development

### Start Dev Server

```bash
npm install
npm run dev
```

### Test Netlify Functions Locally

```bash
netlify dev
```

This starts:
- Frontend: `http://localhost:5173`
- Functions: `http://localhost:8888/.netlify/functions/`

### Test CMS Locally

1. Start dev server: `netlify dev`
2. Navigate to `http://localhost:8888/admin/`
3. Log in with CMS credentials

---

## Security Checklist

- [ ] ImageKit private key kept secret (server-side only)
- [ ] Netlify Identity set to invite-only
- [ ] Environment variables not committed to git
- [ ] `.env` added to `.gitignore`
- [ ] CORS configured in ImageKit
- [ ] Content Security Policy headers set

---

## Cost Estimates

### Free Tier Limits

| Service | Free Tier | Usage |
|---------|-----------|-------|
| **Netlify** | 100GB bandwidth/mo | ~10K visits |
| **ImageKit** | 25GB storage | ~2,500 images |
| **Decap CMS** | Unlimited | Free |

### Paid Upgrades

- **Netlify Pro**: $19/mo (1TB bandwidth)
- **ImageKit Premium**: $49/mo (100GB storage)

---

## Support

- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **ImageKit Docs**: [docs.imagekit.io](https://docs.imagekit.io)
- **Decap CMS Docs**: [decapcms.org/docs](https://decapcms.org/docs)
- **GitHub Issues**: Create an issue in your repo
