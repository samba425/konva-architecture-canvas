# NPM Package Publishing Guide

## 📦 Package Information

**Package Name:** `konva-architecture-canvas` (Personal Account)  
**Version:** 1.0.0  
**License:** MIT  
**Repository:** Your Personal GitHub

---

## 🚀 Publishing Options

### Option 1: Public NPM Registry (Open Source)

Best for open-source community sharing.

#### Prerequisites
```bash
# Create npmjs.com account if you don't have one
# Visit: https://www.npmjs.com/signup

# Login to npm
npm login
```

#### Build & Publish
```bash
# Build the library
ng build konva-canvas-builder

# Navigate to dist
cd dist/konva-canvas-builder

# Publish to npm
npm publish --access public
```

#### Installation by Users
```bash
npm install konva-architecture-canvas
```

---

### Option 2: Cisco Private Registry

Best for internal Cisco use only.

#### Prerequisites
```bash
# Configure npm to use Cisco registry
npm config set registry https://engci-maven.cisco.com/artifactory/api/npm/npm-group/

# Authenticate
npm login --registry=https://engci-maven.cisco.com/artifactory/api/npm/npm-group/
```

#### Publish
```bash
# Build
ng build konva-canvas-builder

# Publish to Cisco registry
cd dist/konva-canvas-builder
npm publish --registry=https://engci-maven.cisco.com/artifactory/api/npm/npm-group/
```

---

### Option 3: GitHub Packages

Best for GitHub-integrated workflows.

#### Prerequisites
```bash
# Create .npmrc in project root
echo "@cisco:registry=https://npm.pkg.github.com" > .npmrc

# Authenticate with GitHub token
npm login --scope=@cisco --registry=https://npm.pkg.github.com
```

#### Update package.json
```json
{
  "name": "@cisco/konva-architecture-canvas",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

#### Publish
```bash
ng build konva-canvas-builder
cd dist/konva-canvas-builder
npm publish
```

---

## 📋 Pre-Publishing Checklist

- [ ] **Run tests**: `npm test`
- [ ] **Build successfully**: `ng build konva-canvas-builder`
- [ ] **Version updated**: Bump version in `projects/konva-canvas-builder/package.json`
- [ ] **README complete**: Comprehensive usage guide
- [ ] **LICENSE file**: MIT license added
- [ ] **Keywords added**: For discoverability
- [ ] **Repository URL**: Correct Git URL
- [ ] **Peer dependencies**: Angular 21+, Konva 10+
- [ ] **Test locally**: `npm pack` and test installation

---

## 🧪 Testing Locally Before Publishing

### Method 1: npm link
```bash
# In library project
cd dist/konva-canvas-builder
npm link

# In test project
npm link @cisco/konva-architecture-canvas
```

### Method 2: npm pack
```bash
# Build library
ng build konva-canvas-builder

# Create tarball
cd dist/konva-canvas-builder
npm pack

# Install in test project
cd /path/to/test-project
npm install /path/to/cisco-konva-architecture-canvas-1.0.0.tgz
```

### Method 3: Local path
```bash
# In test project package.json
{
  "dependencies": {
    "@cisco/konva-architecture-canvas": "file:../Architecture-Builder/dist/konva-canvas-builder"
  }
}
```

---

## 📖 Usage Documentation

### Installation
```bash
npm install @cisco/konva-architecture-canvas konva
```

### Import in Angular App
```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { KonvaCanvasMainComponent } from '@cisco/konva-architecture-canvas';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... your providers
  ]
};

// app.component.ts
import { Component } from '@angular/core';
import { KonvaCanvasMainComponent } from '@cisco/konva-architecture-canvas';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [KonvaCanvasMainComponent],
  template: `
    <kcb-konva-canvas-main></kcb-konva-canvas-main>
  `
})
export class AppComponent {}
```

### Basic Usage
```typescript
import { Component } from '@angular/core';
import { 
  KonvaCanvasMainComponent,
  ComponentDefinition,
  COMPONENTS 
} from '@cisco/konva-architecture-canvas';

@Component({
  selector: 'app-diagram',
  standalone: true,
  imports: [KonvaCanvasMainComponent],
  template: `
    <div class="diagram-container">
      <kcb-konva-canvas-main></kcb-konva-canvas-main>
    </div>
  `,
  styles: [`
    .diagram-container {
      width: 100vw;
      height: 100vh;
    }
  `]
})
export class DiagramComponent {
  // Component automatically loads with 47+ pre-built components
}
```

### Advanced: Custom Components
```typescript
import { 
  KonvaCanvasMainComponent,
  ComponentDefinition 
} from '@cisco/konva-architecture-canvas';

const myCustomComponent: ComponentDefinition = {
  id: 'my-service',
  name: 'My Service',
  icon: '🚀',
  faIcon: 'fa-rocket',
  color: '#FF6B6B',
  description: 'Custom service component',
  provider: 'My Company',
  category: 'custom'
};

// Add to components list
```

---

## 🔄 Version Management

### Semantic Versioning

- **MAJOR (1.x.x)**: Breaking changes
- **MINOR (x.1.x)**: New features (backward compatible)
- **PATCH (x.x.1)**: Bug fixes

### Updating Version
```bash
# In projects/konva-canvas-builder/
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0
```

### Publishing New Version
```bash
# Build
ng build konva-canvas-builder

# Publish
cd dist/konva-canvas-builder
npm publish
```

---

## 📊 Package Features

✅ **47+ Pre-built Components**
- Foundation Models (GPT-4, Claude, Llama, etc.)
- Data Storage (PostgreSQL, Redis, MongoDB, etc.)
- Agent Frameworks (LangChain, AutoGen, etc.)
- Observability (Grafana, Prometheus, etc.)
- Tool Execution (Tavily, Exa, etc.)
- Memory Management (Pinecone, Weaviate, etc.)

✅ **Advanced Features**
- Nested grouping with colored borders
- Stroke & fill color customization
- Drag & drop interface
- Export/import JSON architectures
- Multi-selection (Shift+Click)
- Keyboard shortcuts (Cmd+G, Cmd+Z, etc.)
- Responsive canvas with infinite grid
- Icon caching for performance

✅ **Developer Friendly**
- Standalone Angular component
- TypeScript with full type safety
- Comprehensive documentation
- Sample architectures included
- Easy to extend

---

## 🌐 Registry URLs

- **NPM Public**: https://www.npmjs.com/package/@cisco/konva-architecture-canvas
- **Cisco Internal**: https://engci-maven.cisco.com/artifactory/webapp/
- **GitHub Packages**: https://github.com/cisco/Architecture-Builder/packages

---

## 📞 Support

- **Issues**: https://wwwin-github.cisco.com/asambasi/Architecture-Builder/issues
- **Email**: asambasi@cisco.com
- **Documentation**: See README.md and DEVELOPER_GUIDE.md

---

## ⚖️ License

MIT License - See LICENSE file for details

Copyright (c) 2025 Cisco Systems, Inc.

---

## 🎯 Quick Start Commands

```bash
# 1. Build library
ng build konva-canvas-builder

# 2. Test locally
cd dist/konva-canvas-builder
npm pack

# 3. Publish to npm (after login)
npm publish --access public

# 4. Install in projects
npm install @cisco/konva-architecture-canvas
```

---

## 🔒 Security Notes

- Never commit `.npmrc` with auth tokens to Git
- Use environment variables for credentials
- Review package before publishing
- Keep dependencies updated

---

**Ready to publish? Follow the checklist above and choose your registry!** 🚀
