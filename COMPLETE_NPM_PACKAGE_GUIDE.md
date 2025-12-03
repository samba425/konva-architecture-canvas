# Complete Guide: Creating & Publishing Angular NPM Packages

**A step-by-step guide based on creating and publishing `konva-architecture-canvas`**

---

## 📚 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Library Generation](#library-generation)
4. [Component Development](#component-development)
5. [Package Configuration](#package-configuration)
6. [Building & Testing](#building--testing)
7. [Publishing to NPM](#publishing-to-npm)
8. [Maintenance & Updates](#maintenance--updates)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

```bash
# Check versions
node --version    # >= 18.0.0
npm --version     # >= 10.0.0
ng version        # Angular CLI >= 21.0.0
```

### Install Angular CLI (if needed)

```bash
npm install -g @angular/cli@latest
```

### NPM Account Setup

1. Go to https://www.npmjs.com/signup
2. Create account
3. Verify email
4. Enable 2FA (recommended)

---

## Project Setup

### Step 1: Create Angular Workspace

```bash
# Create new Angular project
ng new my-awesome-library-workspace

# Or use existing project
cd my-existing-project
```

### Step 2: Project Structure

Your workspace should look like:
```
my-workspace/
├── src/                    # Main application (demo/test)
├── projects/               # Libraries folder (will be created)
├── angular.json            # Workspace config
├── package.json            # Workspace dependencies
└── tsconfig.json           # TypeScript config
```

---

## Library Generation

### Step 3: Generate Library

```bash
# Generate library with prefix
ng generate library my-library --prefix=ml

# This creates:
# projects/my-library/
#   ├── src/
#   │   ├── lib/
#   │   │   ├── my-library.component.ts
#   │   │   └── my-library.service.ts
#   │   └── public-api.ts
#   ├── ng-package.json
#   ├── package.json
#   ├── tsconfig.lib.json
#   └── README.md
```

### What Gets Created:

| File | Purpose |
|------|---------|
| `public-api.ts` | Defines what gets exported from your library |
| `ng-package.json` | Angular Package Format config |
| `package.json` | Library metadata (name, version, dependencies) |
| `tsconfig.lib.json` | TypeScript config for library |

---

## Component Development

### Step 4: Create Library Structure

```bash
# Create organized folders
mkdir -p projects/my-library/src/lib/components
mkdir -p projects/my-library/src/lib/models
mkdir -p projects/my-library/src/lib/services
mkdir -p projects/my-library/src/lib/data
```

### Step 5: Move/Create Components

```bash
# Copy existing components
cp src/app/components/my-component.ts projects/my-library/src/lib/components/
cp src/app/components/my-component.html projects/my-library/src/lib/components/
cp src/app/components/my-component.css projects/my-library/src/lib/components/

# Copy models
cp src/app/models/interfaces.ts projects/my-library/src/lib/models/

# Copy services
cp src/app/services/my-service.ts projects/my-library/src/lib/services/

# Copy data/config
cp src/app/data/config.ts projects/my-library/src/lib/data/
```

### Step 6: Fix Import Paths

After moving files, update import paths:

**Before (in main app):**
```typescript
import { MyComponent } from '../../../components/my-component';
```

**After (in library):**
```typescript
import { MyComponent } from '../components/my-component';
```

**Common fixes:**
- `../../data/config` → `../data/config`
- `../../../models/interfaces` → `../models/interfaces`
- `@app/services` → `../services/my-service`

### Step 7: Update public-api.ts

Define what users can import:

```typescript
/*
 * Public API Surface of my-library
 */

// Main components
export * from './lib/components/my-component.component';
export * from './lib/components/another-component.component';

// Models and interfaces
export * from './lib/models/interfaces';

// Services
export * from './lib/services/my-service';

// Data/Configuration
export * from './lib/data/config';
```

**Important:** Avoid duplicate exports! If `config.ts` re-exports from `data.ts`, only export one.

---

## Package Configuration

### Step 8: Configure package.json

Edit `projects/my-library/package.json`:

```json
{
  "name": "my-awesome-library",
  "version": "1.0.0",
  "description": "A powerful library that does amazing things. Include key features here.",
  "keywords": [
    "angular",
    "typescript",
    "library",
    "component",
    "your-domain",
    "feature-name"
  ],
  "author": {
    "name": "Your Name",
    "email": "your-email@gmail.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/my-awesome-library.git"
  },
  "homepage": "https://github.com/your-username/my-awesome-library#readme",
  "bugs": {
    "url": "https://github.com/your-username/my-awesome-library/issues"
  },
  "license": "MIT",
  "peerDependencies": {
    "@angular/common": "^21.0.0",
    "@angular/core": "^21.0.0",
    "other-peer-deps": "^x.x.x"
  },
  "dependencies": {
    "tslib": "^2.3.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=10.0.0"
  },
  "sideEffects": false
}
```

### Key Fields Explained:

| Field | Purpose | Example |
|-------|---------|---------|
| `name` | Package name on npm (must be unique) | `my-awesome-library` |
| `version` | Semantic version (MAJOR.MINOR.PATCH) | `1.0.0` |
| `description` | Short description (shows in npm search) | Max 2 lines |
| `keywords` | Search terms for npm | 8-12 relevant keywords |
| `author` | Your info | Name + email |
| `repository` | GitHub URL | Full HTTPS URL |
| `license` | License type | `MIT`, `Apache-2.0`, etc. |
| `peerDependencies` | Required by users | Angular, other libs |
| `dependencies` | Bundled with package | Runtime deps only |

### Step 9: Create LICENSE File

```bash
# Create MIT License
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
```

### Step 10: Create Library README

Edit `projects/my-library/README.md`:

```markdown
# My Awesome Library

> One-line description of what your library does

[![npm version](https://badge.fury.io/js/my-awesome-library.svg)](https://www.npmjs.com/package/my-awesome-library)
[![npm downloads](https://img.shields.io/npm/dm/my-awesome-library.svg)](https://www.npmjs.com/package/my-awesome-library)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## Features

- ✨ Feature 1
- 🚀 Feature 2
- 💡 Feature 3

## Installation

\`\`\`bash
npm install my-awesome-library
\`\`\`

## Usage

\`\`\`typescript
import { Component } from '@angular/core';
import { MyComponent } from 'my-awesome-library';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MyComponent],
  template: '<ml-my-component></ml-my-component>'
})
export class AppComponent {}
\`\`\`

## API

### Components

#### MyComponent

Description of component.

**Inputs:**
- `input1: string` - Description
- `input2: number` - Description

**Outputs:**
- `output1: EventEmitter<any>` - Description

**Example:**
\`\`\`html
<ml-my-component 
  [input1]="value"
  (output1)="handler($event)">
</ml-my-component>
\`\`\`

## Documentation

Full documentation: [Link to docs]

## License

MIT © [Your Name]
```

---

## Building & Testing

### Step 11: Build the Library

```bash
# Development build
ng build my-library

# Production build
ng build my-library --configuration production

# Output location
# dist/my-library/
```

### Common Build Errors:

#### Error: "Cannot find module"
**Solution:** Check import paths in component files

#### Error: "Module has already exported a member"
**Solution:** Remove duplicate exports from `public-api.ts`

#### Error: "This import is not defined"
**Solution:** Add missing dependencies to `peerDependencies`

### Step 12: Test Locally with npm pack

```bash
# Create tarball
cd dist/my-library
npm pack

# This creates: my-awesome-library-1.0.0.tgz
```

### Step 13: Test Installation

```bash
# In another test project
npm install /path/to/my-awesome-library-1.0.0.tgz

# Or use npm link
cd dist/my-library
npm link

cd /path/to/test-project
npm link my-awesome-library
```

### Step 14: Verify Package Contents

```bash
# View files in package
tar -tzf my-awesome-library-1.0.0.tgz

# Should contain:
# - package.json
# - README.md
# - *.mjs (ES modules)
# - *.d.ts (TypeScript definitions)
# - *.mjs.map (source maps)
```

---

## Publishing to NPM

### Step 15: Check Package Name Availability

```bash
npm view my-awesome-library

# If 404 error: Name is available! ✅
# If data shows: Name is taken ❌
```

### Step 16: Login to NPM

```bash
npm login

# Enter:
# - Username
# - Password
# - Email
# - OTP (if 2FA enabled)

# Verify login
npm whoami
```

### Step 17: Publish Package

```bash
cd dist/my-library

# First time publish (public package)
npm publish --access public

# Subsequent publishes (after version bump)
npm publish
```

### Step 18: Verify Publication

```bash
# View on npm
npm view my-awesome-library

# Install in test project
npm install my-awesome-library
```

### Step 19: View on NPM Website

Visit: `https://www.npmjs.com/package/my-awesome-library`

---

## Maintenance & Updates

### Step 20: Version Management

Use semantic versioning: `MAJOR.MINOR.PATCH`

```bash
cd projects/my-library

# Patch: Bug fixes (1.0.0 → 1.0.1)
npm version patch

# Minor: New features, backward compatible (1.0.0 → 1.1.0)
npm version minor

# Major: Breaking changes (1.0.0 → 2.0.0)
npm version major
```

### Step 21: Publishing Updates

```bash
# 1. Update version
cd projects/my-library
npm version patch  # or minor/major

# 2. Rebuild
cd ../..
ng build my-library --configuration production

# 3. Publish
cd dist/my-library
npm publish
```

### Step 22: Create GitHub Repository

```bash
# Create repo on GitHub first, then:
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/my-awesome-library.git
git push -u origin master
```

---

## Best Practices

### Package Naming

✅ **Good Names:**
- `my-library`
- `ng-my-library`
- `angular-my-library`
- `@username/my-library` (scoped)

❌ **Avoid:**
- Too generic: `library`, `components`
- Too long: `my-super-awesome-angular-library-for-everything`
- Special characters: `my_library`, `my.library`

### Keywords

Choose 8-12 relevant keywords:
```json
{
  "keywords": [
    "angular",           // Framework
    "typescript",        // Language
    "component",         // Type
    "ui",                // Category
    "your-domain",       // Domain
    "feature-name",      // Feature
    "visualization",     // Use case
    "drag-drop"          // Capability
  ]
}
```

### Dependencies

**peerDependencies:** Required by users (Angular, etc.)
```json
{
  "peerDependencies": {
    "@angular/common": "^21.0.0",
    "@angular/core": "^21.0.0"
  }
}
```

**dependencies:** Bundled with package (runtime deps)
```json
{
  "dependencies": {
    "tslib": "^2.3.0",
    "third-party-lib": "^1.0.0"
  }
}
```

**devDependencies:** Only for development (not in library package.json)

### File Size

Keep package small:
- ✅ Only include necessary files
- ✅ Use `.npmignore` to exclude:
  ```
  *.spec.ts
  *.map
  src/
  tsconfig.*.json
  ```
- ✅ Tree-shakeable code
- ❌ Don't bundle large assets

### Documentation

**Minimum required:**
- ✅ README.md with installation & usage
- ✅ LICENSE file
- ✅ package.json with description & keywords
- ✅ TypeScript definitions (.d.ts files)

**Recommended:**
- ✅ API documentation
- ✅ Examples
- ✅ Changelog
- ✅ Contributing guide

---

## Troubleshooting

### Build Issues

**Problem:** "Cannot find module '../data/config'"
```bash
# Solution: Fix import path
import { CONFIG } from '../data/config';  # Correct
import { CONFIG } from '../../data/config';  # Wrong
```

**Problem:** "Module has already exported a member"
```typescript
// Solution: Remove duplicate exports from public-api.ts
export * from './lib/data/config';     // Keep this
// export * from './lib/data/other';   // Remove if 'other' re-exports 'config'
```

### Publish Issues

**Problem:** "You do not have permission to publish"
```bash
# Solution: Check package name isn't taken or scoped
npm view your-package-name  # Check if exists
# Use scoped package: @username/package-name
```

**Problem:** "ENEEDAUTH"
```bash
# Solution: Login to npm
npm login
npm whoami  # Verify
```

**Problem:** "402 Payment Required"
```bash
# Solution: Trying to publish scoped package without paid account
# Either:
# 1. Use --access public flag
npm publish --access public
# 2. Or use unscoped name
```

### Installation Issues

**Problem:** Peer dependency warnings
```bash
# Solution: Update peerDependencies in package.json
{
  "peerDependencies": {
    "@angular/core": "^21.0.0"  // Match Angular version
  }
}
```

**Problem:** "Module not found" after installing
```typescript
// Solution: Check public-api.ts exports
export * from './lib/components/my-component';  // Must export
```

---

## Quick Reference

### Essential Commands

```bash
# Generate library
ng generate library my-lib --prefix=ml

# Build
ng build my-lib --configuration production

# Create package
cd dist/my-lib && npm pack

# Check name availability
npm view package-name

# Login
npm login

# Publish
npm publish --access public

# Update version
npm version patch|minor|major

# View published package
npm view package-name
```

### Checklist Before Publishing

- [ ] Unique package name (checked with `npm view`)
- [ ] package.json complete (name, version, description, keywords, author, repository, license)
- [ ] LICENSE file created
- [ ] README.md with installation & usage instructions
- [ ] public-api.ts exports all necessary components/services
- [ ] Build successful (`ng build --configuration production`)
- [ ] Tested locally (`npm pack` and install in test project)
- [ ] Git repository created (GitHub, GitLab, etc.)
- [ ] npm account created and verified
- [ ] Logged into npm (`npm whoami` works)

---

## Real Example: konva-architecture-canvas

### What We Created

**Package:** `konva-architecture-canvas`  
**NPM:** https://www.npmjs.com/package/konva-architecture-canvas  
**GitHub:** https://github.com/samba425/konva-architecture-canvas

### Step-by-Step Execution

```bash
# 1. Generated library
ng generate library konva-canvas-builder --prefix=kcb

# 2. Copied components
cp -r src/app/components/konva-canvas-main/* \
  projects/konva-canvas-builder/src/lib/components/
cp -r src/app/models/* \
  projects/konva-canvas-builder/src/lib/models/
cp -r src/app/data/* \
  projects/konva-canvas-builder/src/lib/data/

# 3. Fixed import paths
# Changed: '../../data/config' → '../data/config'

# 4. Updated package.json
{
  "name": "konva-architecture-canvas",
  "version": "1.0.0",
  "author": {
    "name": "Sambasiva Rao",
    "email": "asiva325@gmail.com"
  },
  "repository": {
    "url": "https://github.com/samba425/konva-architecture-canvas.git"
  }
}

# 5. Created LICENSE (MIT)

# 6. Updated public-api.ts
export * from './lib/components/konva-canvas-main.component';
export * from './lib/models/interfaces';
export * from './lib/data/components-config';

# 7. Built library
ng build konva-canvas-builder --configuration production

# 8. Tested locally
cd dist/konva-canvas-builder
npm pack

# 9. Published
npm login
npm publish --access public

# ✅ Success! Package live at npmjs.com
```

### Results

- **Package Size:** 94.7 kB (packed), 603 kB (unpacked)
- **Files:** 5 (README, .mjs bundle, .d.ts, package.json, source map)
- **Published:** December 4, 2025
- **Version:** 1.0.0
- **Downloads:** Available globally via `npm install konva-architecture-canvas`

---

## Additional Resources

### Official Documentation

- **Angular Package Format:** https://angular.io/guide/creating-libraries
- **npm Documentation:** https://docs.npmjs.com/
- **Semantic Versioning:** https://semver.org/

### Tools

- **npm Trends:** https://npmtrends.com/
- **npm Package Size:** https://bundlephobia.com/
- **npm Statistics:** https://npm-stat.com/

### Community

- **Angular Discord:** https://discord.gg/angular
- **Reddit:** r/Angular
- **Stack Overflow:** Tag `angular`

---

## Summary

Creating an npm package involves:

1. ✅ **Generate** library with Angular CLI
2. ✅ **Organize** code into lib structure
3. ✅ **Configure** package.json with metadata
4. ✅ **Export** public API via public-api.ts
5. ✅ **Build** with production configuration
6. ✅ **Test** locally with npm pack
7. ✅ **Publish** to npm registry
8. ✅ **Maintain** with semantic versioning

**Total Time:** 2-4 hours for first package  
**Difficulty:** Intermediate  
**Result:** Reusable library available to millions of developers! 🚀

---

**Created by:** Sambasiva Rao  
**Date:** December 4, 2025  
**Example Package:** konva-architecture-canvas  
**Status:** Successfully published to npm ✅

---

**Happy Publishing! 🎉**
