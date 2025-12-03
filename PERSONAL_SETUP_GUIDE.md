# Personal NPM Publishing Setup Guide

## 🎯 Quick Setup Steps

### Step 1: Create Personal GitHub Repository

```bash
# 1. Go to https://github.com/new
# 2. Create a new repository named: konva-architecture-canvas
# 3. Make it public (for open source)
# 4. Don't initialize with README (we already have one)
```

### Step 2: Update package.json with Your Info

Edit `projects/konva-canvas-builder/package.json`:

```json
{
  "author": {
    "name": "Your Name",
    "email": "your-email@gmail.com"  // ← Change this
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR-USERNAME/konva-architecture-canvas.git"  // ← Change this
  },
  "homepage": "https://github.com/YOUR-USERNAME/konva-architecture-canvas#readme",  // ← Change this
  "bugs": {
    "url": "https://github.com/YOUR-USERNAME/konva-architecture-canvas/issues"  // ← Change this
  }
}
```

### Step 3: Create NPM Account (if needed)

```bash
# Go to https://www.npmjs.com/signup
# Create your personal account
# Verify your email
```

### Step 4: Login to NPM

```bash
npm login

# Enter your credentials:
# Username: your-npm-username
# Password: your-npm-password
# Email: your-email@gmail.com
```

### Step 5: Build the Library

```bash
ng build konva-canvas-builder
```

### Step 6: Test Locally (Optional but Recommended)

```bash
cd dist/konva-canvas-builder
npm pack

# This creates: konva-architecture-canvas-1.0.0.tgz
# Test in another project:
# npm install /path/to/konva-architecture-canvas-1.0.0.tgz
```

### Step 7: Publish to NPM

```bash
cd dist/konva-canvas-builder

# For first time (public package)
npm publish --access public

# For updates (after version bump)
npm publish
```

### Step 8: Push to Personal GitHub

```bash
# Add your personal GitHub as remote
git remote add personal https://github.com/YOUR-USERNAME/konva-architecture-canvas.git

# Push to personal repo
git push personal master

# Or make it the default origin:
git remote set-url origin https://github.com/YOUR-USERNAME/konva-architecture-canvas.git
git push origin master
```

---

## 📝 Important Notes

### Package Name

✅ **Current**: `konva-architecture-canvas` (no scope, available to everyone)

Alternative names if taken:
- `ng-konva-architecture-canvas`
- `angular-konva-diagram-builder`
- `konva-arch-builder`
- `@YOUR-USERNAME/konva-architecture-canvas` (scoped to your npm username)

Check availability:
```bash
npm search konva-architecture-canvas
```

### Version Management

Before each publish, bump the version:

```bash
cd projects/konva-canvas-builder

# Patch (1.0.0 → 1.0.1) - bug fixes
npm version patch

# Minor (1.0.0 → 1.1.0) - new features
npm version minor

# Major (1.0.0 → 2.0.0) - breaking changes
npm version major
```

### License

MIT License allows anyone to:
- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Use privately
- ❌ Hold you liable
- ❌ Use your trademark

---

## 🚀 Quick Commands Reference

```bash
# 1. Update your details in package.json
code projects/konva-canvas-builder/package.json

# 2. Build
ng build konva-canvas-builder

# 3. Login to npm
npm login

# 4. Publish
cd dist/konva-canvas-builder
npm publish --access public

# 5. Verify
npm info konva-architecture-canvas

# 6. Install in other projects
npm install konva-architecture-canvas
```

---

## 🎨 Badge for Your README

Once published, add this badge:

```markdown
[![npm version](https://badge.fury.io/js/konva-architecture-canvas.svg)](https://www.npmjs.com/package/konva-architecture-canvas)
[![npm downloads](https://img.shields.io/npm/dm/konva-architecture-canvas.svg)](https://www.npmjs.com/package/konva-architecture-canvas)
```

---

## 🔗 Links After Publishing

- **NPM Page**: https://www.npmjs.com/package/konva-architecture-canvas
- **GitHub**: https://github.com/YOUR-USERNAME/konva-architecture-canvas
- **NPM Stats**: https://npm-stat.com/charts.html?package=konva-architecture-canvas

---

## ⚠️ Before First Publish

**Checklist:**
- [ ] Updated package.json with your email/username
- [ ] Created personal GitHub repo
- [ ] Logged into npm (`npm whoami` to verify)
- [ ] Built library successfully (`ng build konva-canvas-builder`)
- [ ] Tested locally with `npm pack`
- [ ] Ready to publish with `npm publish --access public`

---

## 💡 Tips

1. **Check package name availability** before publishing:
   ```bash
   npm view konva-architecture-canvas
   # If not found, it's available!
   ```

2. **Use semantic versioning**:
   - 1.0.0 - Initial release
   - 1.0.1 - Bug fixes
   - 1.1.0 - New features
   - 2.0.0 - Breaking changes

3. **Add .npmignore** to exclude unnecessary files:
   ```
   *.spec.ts
   **/*.map
   src/
   tsconfig.*.json
   ```

4. **Promote your package**:
   - Share on Twitter/LinkedIn
   - Post on Reddit r/Angular
   - Add to Angular community lists
   - Write a blog post

---

**Ready to publish? Follow the steps above!** 🚀

**Questions?** The package is yours to own and maintain! 🎉
