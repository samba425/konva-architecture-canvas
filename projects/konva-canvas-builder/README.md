# @cisco/konva-architecture-canvas# KonvaCanvasBuilder



> A powerful Angular component for creating interactive architecture diagrams with Konva.jsThis project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0.



[![Angular](https://img.shields.io/badge/Angular-21.0-red)](https://angular.io/)## Code scaffolding

[![Konva](https://img.shields.io/badge/Konva-10.0-blue)](https://konvajs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

```bash

## ✨ Featuresng generate component component-name

```

- 🎨 **47+ Pre-built Components** across 6 categories (AI Models, Databases, Frameworks, etc.)

- 🎯 **Drag & Drop Interface** for intuitive diagram creationFor a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

- 🌈 **Advanced Color System** with separate stroke/fill controls and opacity

- 📦 **Nested Grouping** with colored borders by hierarchy level```bash

- 💾 **Export/Import** architecture diagrams as JSONng generate --help

- ⚡ **High Performance** with icon caching and optimized rendering```

- ⌨️ **Keyboard Shortcuts** (Cmd+G, Cmd+Z, Cmd+S, etc.)

- 🎪 **Multi-Selection** with Shift+Click and drag-rectangle## Building

- 📱 **Responsive Canvas** with infinite grid and zoom/pan

- 🔧 **Easy to Extend** with custom components and themesTo build the library, run:



---```bash

ng build konva-canvas-builder

## 📦 Installation```



```bashThis command will compile your project, and the build artifacts will be placed in the `dist/` directory.

npm install @cisco/konva-architecture-canvas konva

```### Publishing the Library



### Peer DependenciesOnce the project is built, you can publish your library by following these steps:



```json1. Navigate to the `dist` directory:

{   ```bash

  "@angular/common": "^21.0.0",   cd dist/konva-canvas-builder

  "@angular/core": "^21.0.0",   ```

  "@angular/forms": "^21.0.0",

  "konva": "^10.0.12"2. Run the `npm publish` command to publish your library to the npm registry:

}   ```bash

```   npm publish

   ```

---

## Running unit tests

## 🚀 Quick Start

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

### 1. Import the Component

```bash

```typescriptng test

// app.component.ts```

import { Component } from '@angular/core';

import { KonvaCanvasMainComponent } from '@cisco/konva-architecture-canvas';## Running end-to-end tests



@Component({For end-to-end (e2e) testing, run:

  selector: 'app-root',

  standalone: true,```bash

  imports: [KonvaCanvasMainComponent],ng e2e

  template: ````

    <div class="canvas-container">

      <kcb-konva-canvas-main></kcb-konva-canvas-main>Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

    </div>

  `,## Additional Resources

  styles: [`

    .canvas-container {For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

      width: 100vw;
      height: 100vh;
    }
  `]
})
export class AppComponent {}
```

### 2. That's It! 🎉

The component comes with 47+ pre-built components ready to use!

---

## 📖 Full Documentation

- **Installation & Setup**: See above
- **Usage Guide**: [Main README](../../README.md)
- **Developer Guide**: [DEVELOPER_GUIDE.md](../../DEVELOPER_GUIDE.md)
- **Publishing Guide**: [NPM_PUBLISHING_GUIDE.md](../../NPM_PUBLISHING_GUIDE.md)

---

## 📊 Component Categories

- 🔥 **Foundation Models**: GPT-4, Claude, Llama, Gemini, etc.
- 💾 **Data Storage**: PostgreSQL, Redis, MongoDB, Pinecone, etc.
- 🤖 **Agent Frameworks**: LangChain, AutoGen, CrewAI, etc.
- 📊 **Observability**: Grafana, Prometheus, DataDog, etc.
- 🔧 **Tool Execution**: Tavily, Exa, Perplexity, etc.
- 🧠 **Memory Management**: Weaviate, ChromaDB, Milvus, etc.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + G` | Group selected items |
| `Cmd/Ctrl + Shift + G` | Ungroup |
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + A` | Select all |
| `Cmd/Ctrl + S` | Export JSON |
| `Delete` | Delete selected |
| `Shift + Click` | Multi-select |

---

## 📄 License

MIT License - Copyright (c) 2025 Cisco Systems, Inc.

---

## 📞 Support

- **Issues**: https://github.com/samba425/konva-architecture-canvas/issues
- **Email**: asiva325@gmail.com

---

**Made with ❤️ by Cisco**
