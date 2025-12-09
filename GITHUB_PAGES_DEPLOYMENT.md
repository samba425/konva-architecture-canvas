# GitHub Pages Deployment Guide

This guide explains how to deploy the Architecture Builder application to GitHub Pages.

## Prerequisites

- Node.js and npm installed
- Angular CLI installed globally
- Git repository access
- GitHub Pages enabled on your repository

## Deployment Steps

### 1. Update Budget Limits (One-time setup)

The default Angular budget limits are too small for this application. Update `angular.json`:

```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "1MB",
    "maximumError": "2MB"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "50kB",
    "maximumError": "100kB"
  }
]
```

### 2. Build for Production

Build the application with the correct base-href for your GitHub Pages URL:

**For Public GitHub (username.github.io/repo-name):**
```bash
ng build --configuration production --base-href "/konva-architecture-canvas/"
```

**For Public GitHub (custom domain):**
```bash
ng build --configuration production --base-href "/"
```

### 3. Deploy to GitHub Pages

#### Option A: Using angular-cli-ghpages (Recommended)

**For Public GitHub:**
```bash
npx angular-cli-ghpages --dir=dist/architecture-builder/browser \
  --repo=https://github.com/samba425/konva-architecture-canvas.git \
  --branch=gh-pages \
  --no-silent
```

#### Option B: Manual Deployment

1. Create a `gh-pages` branch:
```bash
git checkout --orphan gh-pages
```

2. Remove all files:
```bash
git rm -rf .
```

3. Copy build files:
```bash
cp -r dist/architecture-builder/browser/* .
```

4. Create `.nojekyll` file (important):
```bash
touch .nojekyll
```

5. Add 404.html for SPA routing:
```bash
cp index.html 404.html
```

6. Commit and push:
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages --force
```

### 4. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click **Save**

Wait a few minutes for GitHub to build and deploy your site.

## Access Your Deployed Application

```

### Public GitHub
```
https://samba425.github.io/konva-architecture-canvas/
```

## Troubleshooting

### Issue: 404 errors for assets (CSS, JS files)

**Problem:** Files not loading, MIME type errors

**Solution:** Check your `base-href` matches your GitHub Pages URL structure:

- Public: `/repo-name/` or `/` for custom domain

**Rebuild with correct base-href:**
```bash
ng build --configuration production --base-href "/pages/asambasi/Architecture-Builder/"
```

### Issue: Blank page after deployment

**Causes:**
1. Wrong `base-href`
2. Missing `.nojekyll` file
3. Build errors

**Solution:**
1. Check browser console for errors
2. Verify `.nojekyll` exists in gh-pages branch
3. Rebuild and redeploy

### Issue: Routing not working (404 on refresh)

**Solution:** The `404.html` file should be a copy of `index.html`. This is automatically created by `angular-cli-ghpages`.

Manual fix:
```bash
cp dist/architecture-builder/browser/index.html dist/architecture-builder/browser/404.html
```

## Quick Deployment Script

Create a file `deploy.sh` in your project root:

```bash
#!/bin/bash

# Build the application
echo "🏗️  Building application..."
ng build --configuration production --base-href "/pages/asambasi/Architecture-Builder/"

# Deploy to GitHub Pages
echo "🚀 Deploying to GitHub Pages..."
npx angular-cli-ghpages --dir=dist/architecture-builder/browser \
  --repo=https://github.com/samba425/konva-architecture-canvas.git \
  --branch=gh-pages \
  --no-silent

echo "✅ Deployment complete!"
echo "🌐 Your app is live at: https://samba425.github.io/konva-architecture-canvas/"
```

Make it executable:
```bash
chmod +x deploy.sh
```

Run it:
```bash
./deploy.sh
```

## Updating the Deployed Application

To update your deployed app after making changes:

1. Make your code changes
2. Commit to master/main branch
3. Run the deployment script again:
```bash
./deploy.sh
```

The new version will be live in a few minutes.

## Important Notes

1. **Always use `--no-silent`** flag with angular-cli-ghpages to see deployment progress
2. **Create `.nojekyll` file** to prevent Jekyll processing
3. **Use correct base-href** matching your GitHub Pages URL
4. **Wait 2-5 minutes** after deployment for changes to appear
5. **Clear browser cache** if you don't see updates immediately
6. **Check gh-pages branch** to verify files are pushed correctly

## Verify Deployment

After deployment, check:

1. Navigate to your GitHub Pages URL
2. Open browser DevTools (F12)
3. Check Console tab for errors
4. Check Network tab - all files should return 200 status
5. Test all features:
   - ⭐ Add Custom Component button
   - Drag and drop components
   - Undo/redo
   - Export/Import
   - Style panel

## GitHub Pages URL Structure

### Public GitHub - User Site
```
https://{username}.github.io/
```

### Public GitHub - Project Site
```
https://{username}.github.io/{repo-name}/
```

### Custom Domain
```
https://yourdomain.com/
```

## Continuous Deployment (Optional)

For automatic deployment on every push, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ master ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build -- --configuration production --base-href "/pages/asambasi/Architecture-Builder/"
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/architecture-builder/browser
```

## Summary

✅ **One-time setup:** Update budgets in angular.json  
✅ **Build:** `ng build --configuration production --base-href "/konva-architecture-canvas/"`  
✅ **Deploy:** `npx angular-cli-ghpages --dir=dist/architecture-builder/browser --repo=<repo-url> --branch=gh-pages --no-silent`  
✅ **Access:** https://samba425.github.io/konva-architecture-canvas/  

Your application is now live and accessible to anyone with access to your GitHub repository! 🎉
