# 🎨 Architecture Builder

> **Professional Canvas-Based Architecture Diagram Builder** - Create stunning cloud infrastructure, AI/ML systems, and technical architecture diagrams with an intuitive drag-and-drop interface.

[![Angular](https://img.shields.io/badge/Angular-21.0-DD0031?style=for-the-badge&logo=angular)](https://angular.io/)
[![Konva](https://img.shields.io/badge/Konva-10.0-0D83CD?style=for-the-badge&logo=konva)](https://konvajs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![npm](https://img.shields.io/npm/v/konva-architecture-canvas?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/konva-architecture-canvas)

<div align="center">

### 🚀 **[Live Demo](https://samba425.github.io/konva-architecture-canvas/)** | 📦 **[npm Package](https://www.npmjs.com/package/konva-architecture-canvas)** | 📖 **[Documentation](./DEVELOPER_GUIDE.md)**

</div>

---

## 📸 Preview

![Architecture Builder Demo](https://via.placeholder.com/1200x600/1a1a2e/00d4ff?text=Architecture+Builder+Demo)

<div align="center">
<i>Professional architecture diagrams in minutes, not hours</i>
</div>

---

## ✨ Why Architecture Builder?

Stop switching between Draw.io and Lucidchart! Build architecture diagrams directly in your Angular applications with:

- ✅ **47+ Pre-built Components** - AWS, Azure, GCP, AI/ML tools ready to use
- ✅ **Drag-and-Drop Interface** - Intuitive canvas with smooth interactions
- ✅ **Smart Grouping** - Nested groups with automatic color coding (5 levels)
- ✅ **Export & Share** - PNG images and JSON for version control
- ✅ **Keyboard Shortcuts** - Power-user features for productivity
- ✅ **Auto-Save** - Never lose your work with LocalStorage
- ✅ **Two Canvas Modes** - Konva.js (primary) and Cytoscape.js options

---

## 🚀 Quick Start

### Installation

```bash
npm install konva-architecture-canvas konva
```

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { KonvaCanvasMainComponent } from 'konva-architecture-canvas';

@Component({
  selector: 'app-diagram',
  standalone: true,
  imports: [KonvaCanvasMainComponent],
  template: '<lib-konva-canvas-main></lib-konva-canvas-main>',
  styles: [`
    lib-konva-canvas-main {
      display: block;
      width: 100%;
      height: 100vh;
    }
  `]
})
export class DiagramComponent {}
```

That's it! You now have a full-featured architecture canvas. 🎉

---

## 🎯 Key Features

### 🧩 Component Library (47+ Components)

| Category | Components |
|----------|-----------|
| **AI Models** | GPT-4, Claude, Llama, Gemini, Mistral, Cohere, DeepSeek, Phi, Qwen |
| **Vector DBs** | Pinecone, Weaviate, Milvus, Chroma, pgVector, Neon |
| **Agent Frameworks** | LangChain, AutoGen, CrewAI, LlamaIndex, Semantic Kernel, LangGraph |
| **Observability** | Langfuse, Arize Phoenix, Helicone, Datadog, Comet Opik |
| **Cloud (AWS)** | EC2, Lambda, S3, RDS, API Gateway, CloudFront, SageMaker |
| **Cloud (Azure)** | VM, Functions, Blob Storage, SQL, AI Services |
| **Cloud (GCP)** | Compute Engine, Cloud Functions, Storage, BigQuery |
| **Databases** | PostgreSQL, MongoDB, Redis, DynamoDB, Firestore |
| **Tools** | Composio, Exa, NPI, Browserbase, LinkUp |
| **Memory** | Zep, Mem0, Cognee, VertexAI |

### 🎨 Drawing Tools

- **Shapes**: Rectangle, Circle, Line, Arrow
- **Freehand Pen**: Draw custom diagrams
- **Text Editor**: Double-click to edit text
- **Color Picker**: 12-color palette + custom colors
- **Styling**: Independent stroke and fill colors with opacity control

### 📦 Smart Grouping

- **5-Level Hierarchy** with automatic color coding:
  - Level 1: Purple
  - Level 2: Red
  - Level 3: Orange
  - Level 4: Green
  - Level 5: Blue
- **Drag groups** as single units
- **Nested grouping** - Groups within groups
- **Visual feedback** - Colored borders show nesting depth

### ⚡ Canvas Features

- **Infinite Canvas** with smooth pan and zoom
- **Grid System** for alignment
- **Multi-Selection** (Shift+Click or drag rectangle)
- **Transformer** with resize handles
- **Snap to Grid** (optional)
- **Dark/Light Theme** support

### ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |
| `Cmd/Ctrl + D` | Duplicate |
| `Cmd/Ctrl + G` | Group selected items |
| `Cmd/Ctrl + Shift + G` | Ungroup |
| `Cmd/Ctrl + A` | Select all |
| `Delete / Backspace` | Delete selected |
| `V` | Select tool |
| `R` | Rectangle tool |
| `C` | Circle tool |
| `L` | Line tool |
| `A` | Arrow tool |
| `Space + Drag` | Pan canvas |

### 💾 Import/Export

- **JSON Export**: Complete architecture with all data
- **PNG Export**: High-quality images (2x resolution)
- **Template System**: Save and reuse architectures
- **Sample Diagrams**: 8+ ready-to-use examples included

---

## 📚 Sample Architectures

The `/samples` folder includes:

1. **simple-rag-chatbot.json** - Basic RAG chatbot with vector DB
2. **multi-model-ai-platform.json** - Multi-model AI platform
3. **cloud-infrastructure.json** - AWS cloud infrastructure
4. **enterprise-ai-platform.json** - Enterprise AI/ML platform
5. **observability-stack.json** - Complete observability setup
6. **grouped-microservices.json** - Microservices with grouping
7. **nested-groups-cloud.json** - Complex nested architecture
8. **cisco-ai-stack-complete.json** - Comprehensive Cisco AI stack

---

## 🔧 Development

### Prerequisites

- Node.js >= 18.x
- npm >= 10.x
- Angular CLI 21.x

### Setup

```bash
# Clone repository
git clone https://github.com/samba425/konva-architecture-canvas.git
cd konva-architecture-canvas

# Install dependencies
npm install

# Start development server
npm start
```

Application runs at: **http://localhost:4200**

### Build

```bash
# Build for production
npm run build

# Build library
npm run build:lib

# Publish to npm
cd dist/konva-canvas-builder
npm publish
```

---

## 📖 Documentation

- **[Developer Guide](./DEVELOPER_GUIDE.md)** - Complete development documentation
- **[Cytoscape Canvas Guide](./CYTOSCAPE_DEVELOPER_GUIDE.md)** - Alternative canvas implementation
- **[GitHub Pages Deployment](./GITHUB_PAGES_DEPLOYMENT.md)** - Deployment instructions
- **[Premium Features](./PREMIUM_FEATURES.md)** - Advanced features roadmap

---

## 🎓 Learn More

### Articles & Tutorials

- 📝 [Building a Visual Architecture Tool with Angular](https://medium.com/@asiva325/building-a-visual-architecture-diagram-tool-with-angular-and-konva-js-a9391e85038a) - Full walkthrough on Medium
- 🎥 [Video Tutorial](https://samba425.github.io/konva-architecture-canvas/) - Interactive demo

### Use Cases

- **Cloud Architecture** - Design AWS, Azure, GCP infrastructures
- **AI/ML Systems** - Plan RAG pipelines, LLM applications
- **Microservices** - Visualize service dependencies
- **System Design** - Interview preparation and planning
- **Documentation** - Technical architecture documentation

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/samba425/konva-architecture-canvas?style=social)
![GitHub forks](https://img.shields.io/github/forks/samba425/konva-architecture-canvas?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/samba425/konva-architecture-canvas?style=social)

![npm downloads](https://img.shields.io/npm/dt/konva-architecture-canvas)
![npm version](https://img.shields.io/npm/v/konva-architecture-canvas)
![Bundle size](https://img.shields.io/bundlephobia/min/konva-architecture-canvas)

---

## 🗺️ Roadmap

### Upcoming Features

- [ ] **Real-time Collaboration** - Multiple users editing simultaneously
- [ ] **Custom Component Creator** - Upload your own icons and components
- [ ] **Cloud Sync** - Save diagrams to cloud storage
- [ ] **Export to IaC** - Generate Terraform/CDK from diagrams
- [ ] **AI-Powered Layout** - Auto-arrange for optimal readability
- [ ] **Templates Library** - Community-contributed templates
- [ ] **Version History** - Track changes over time
- [ ] **Comments & Annotations** - Team collaboration features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Samba Siva**

- GitHub: [@samba425](https://github.com/samba425)
- Email: asiva325@gmail.com
- Medium: [@asiva325](https://medium.com/@asiva325)
- LinkedIn: [Connect with me](www.linkedin.com/in/
asiva325)

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

[![Star on GitHub](https://img.shields.io/github/stars/samba425/konva-architecture-canvas?style=social)](https://github.com/samba425/konva-architecture-canvas)

---

## 🙏 Acknowledgments

- [Konva.js](https://konvajs.org/) - HTML5 Canvas JavaScript framework
- [Angular](https://angular.io/) - The modern web developer's platform
- [Cytoscape.js](https://js.cytoscape.org/) - Graph theory library
- [Font Awesome](https://fontawesome.com/) - Icon library
- [Iconify](https://iconify.design/) - Unified icon framework

---

<div align="center">

**Made with ❤️ by Samba Siva**

</div>
