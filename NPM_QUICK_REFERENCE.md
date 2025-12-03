# NPM Package Quick Reference Card

**Fast reference for creating & publishing Angular npm packages**

---

## 🚀 Quick Start (5 Commands)

```bash
# 1. Generate library
ng generate library my-lib --prefix=ml

# 2. Build
ng build my-lib --configuration production

# 3. Login to npm
npm login

# 4. Publish
cd dist/my-lib && npm publish --access public

# 5. Verify
npm view my-lib
```

---

## 📋 Pre-Publish Checklist

```bash
# Check name availability
npm view package-name  # Should return 404

# Verify build
ng build my-lib --configuration production

# Test locally
cd dist/my-lib && npm pack

# Check login
npm whoami

# Ready to publish!
npm publish --access public
```

---

## 📦 Essential package.json

```json
{
  "name": "my-package-name",
  "version": "1.0.0",
  "description": "Short description (max 2 lines)",
  "keywords": ["angular", "typescript", "your-domain"],
  "author": {
    "name": "Your Name",
    "email": "email@gmail.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/username/repo.git"
  },
  "homepage": "https://github.com/username/repo#readme",
  "license": "MIT",
  "peerDependencies": {
    "@angular/common": "^21.0.0",
    "@angular/core": "^21.0.0"
  },
  "dependencies": {
    "tslib": "^2.3.0"
  }
}
```

---

## 📝 Minimal README Template

```markdown
# Package Name

> One-line description

[![npm](https://img.shields.io/npm/v/package-name.svg)](https://www.npmjs.com/package/package-name)

## Installation

\`\`\`bash
npm install package-name
\`\`\`

## Usage

\`\`\`typescript
import { MyComponent } from 'package-name';
\`\`\`

## License

MIT
```

---

## 🔄 Version Updates

```bash
# Patch: Bug fixes (1.0.0 → 1.0.1)
cd projects/my-lib && npm version patch

# Minor: New features (1.0.0 → 1.1.0)
cd projects/my-lib && npm version minor

# Major: Breaking changes (1.0.0 → 2.0.0)
cd projects/my-lib && npm version major

# Then rebuild & republish
ng build my-lib --configuration production
cd dist/my-lib && npm publish
```

---

## 🎯 public-api.ts Template

```typescript
/*
 * Public API Surface of my-library
 */

// Components
export * from './lib/components/my-component.component';

// Models
export * from './lib/models/interfaces';

// Services
export * from './lib/services/my-service';

// Data/Config
export * from './lib/data/config';
```

---

## 🐛 Common Errors & Fixes

| Error | Solution |
|-------|----------|
| 404 name available | ✅ Good! Publish |
| 403 Forbidden | `npm login` |
| 402 Payment Required | Add `--access public` |
| "Cannot find module" | Fix import paths |
| "Already exported" | Remove duplicate exports |
| Peer dependency warning | Update peerDependencies versions |

---

## 📊 File Structure

```
projects/my-library/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   ├── models/
│   │   ├── services/
│   │   └── data/
│   └── public-api.ts     ← Exports
├── ng-package.json
├── package.json          ← Metadata
├── tsconfig.lib.json
└── README.md             ← Documentation
```

---

## 🔗 Essential URLs

- **npm Registry:** https://www.npmjs.com
- **Your Package:** https://www.npmjs.com/package/YOUR-PACKAGE-NAME
- **Check Size:** https://bundlephobia.com
- **Check Downloads:** https://npm-stat.com

---

## 💡 Tips

1. **Name:** Use lowercase, hyphens, no spaces
2. **Keywords:** Add 8-12 relevant search terms
3. **Version:** Follow semantic versioning (MAJOR.MINOR.PATCH)
4. **License:** MIT is most common for open source
5. **README:** Include installation & basic usage
6. **Test:** Always `npm pack` before publishing
7. **GitHub:** Create repo with same name
8. **Badges:** Add npm version badge to README

---

## ⚡ Speed Run (Experienced Users)

```bash
ng g lib my-lib --prefix=ml
# [Copy your components to projects/my-lib/src/lib/]
# [Edit package.json, public-api.ts]
ng build my-lib --configuration production
cd dist/my-lib
npm pack
npm login
npm publish --access public
```

---

## 📱 After Publishing

```bash
# View your package
npm view your-package-name

# Install it
npm install your-package-name

# Check stats
# https://www.npmjs.com/package/your-package-name
```

---

## 🎉 Success Example

**Package:** `konva-architecture-canvas`  
**Published:** December 4, 2025  
**Size:** 94.7 kB  
**Install:** `npm install konva-architecture-canvas`  

---

**Keep this card handy for future packages!** 🚀

**Full Guide:** See `COMPLETE_NPM_PACKAGE_GUIDE.md` for detailed explanations.
