# konva-architecture-canvas# konva-architecture-canvas# KonvaCanvasBuilder



> 🎨 **Build stunning architecture diagrams in minutes** - A powerful Angular component with 47+ pre-built tech components, drag-and-drop interface, and professional drawing tools.



[![Angular](https://img.shields.io/badge/Angular-21+-red)](https://angular.io/)> A powerful Angular component for creating interactive architecture diagrams with Konva.jsThis project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0.

[![Konva](https://img.shields.io/badge/Konva-10+-blue)](https://konvajs.org/)

[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)



---[![Angular](https://img.shields.io/badge/Angular-21.0-red)](https://angular.io/)## Code scaffolding



## ✨ Features[![Konva](https://img.shields.io/badge/Konva-10.0-blue)](https://konvajs.org/)



- **47+ Pre-built Components** (AI models, databases, cloud services, frameworks, etc.)[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

- **Complete Drawing Tools** (shapes, arrows, lines, text, pen tool)

- **Professional Styling** (colors, opacity, borders, fills)[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

- **Smart Grouping** (with nested support and colored borders)

- **Export/Import** (save and load as JSON)```bash

- **Full Keyboard Shortcuts** (Cmd+G for group, Cmd+Z for undo, etc.)

- **Multi-Selection** (Shift+Click or drag to select)## ✨ Featuresng generate component component-name



---```



## 📦 Installation- 🎨 **47+ Pre-built Components** across 6 categories (AI Models, Databases, Frameworks, etc.)



```bash- 🎯 **Drag & Drop Interface** for intuitive diagram creationFor a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

npm install konva-architecture-canvas konva

```- 🌈 **Advanced Color System** with separate stroke/fill controls and opacity



---- 📦 **Nested Grouping** with colored borders by hierarchy level```bash



## 🚀 Quick Start (3 Steps)- 💾 **Export/Import** architecture diagrams as JSONng generate --help



### 1️⃣ Import the Component- ⚡ **High Performance** with icon caching and optimized rendering```



```typescript- ⌨️ **Keyboard Shortcuts** (Cmd+G, Cmd+Z, Cmd+S, etc.)

import { Component } from '@angular/core';

import { KonvaCanvasMainComponent } from 'konva-architecture-canvas';- 🎪 **Multi-Selection** with Shift+Click and drag-rectangle## Building



@Component({- 📱 **Responsive Canvas** with infinite grid and zoom/pan

  selector: 'app-root',

  standalone: true,- 🔧 **Easy to Extend** with custom components and themesTo build the library, run:

  imports: [KonvaCanvasMainComponent],

  template: '<arch-canvas></arch-canvas>',

  styles: [`

    arch-canvas {---```bash

      display: block;

      width: 100%;ng build konva-canvas-builder

      height: 100vh;

    }## 📦 Installation```

  `]

})

export class AppComponent {}

``````bashThis command will compile your project, and the build artifacts will be placed in the `dist/` directory.



### 2️⃣ Update Your Styles (Important!)npm install konva-architecture-canvas konva



In your global `styles.css`:```### Publishing the Library



```css

* {

  margin: 0;### Peer DependenciesOnce the project is built, you can publish your library by following these steps:

  padding: 0;

  box-sizing: border-box;

}

```json1. Navigate to the `dist` directory:

html, body {

  width: 100%;{   ```bash

  height: 100%;

  overflow: hidden;  "@angular/common": "^21.0.0",   cd dist/konva-canvas-builder

}

```  "@angular/core": "^21.0.0",   ```



### 3️⃣ Run Your App  "@angular/forms": "^21.0.0",



```bash  "konva": "^10.0.12"2. Run the `npm publish` command to publish your library to the npm registry:

ng serve

```}   ```bash



Open `http://localhost:4200` - **That's it!** 🎉```   npm publish



---   ```



## 🎯 What You Get---



The component appears with:## Running unit tests

- **Left Sidebar**: 47+ components in 6 categories (AI Models, Databases, Frameworks, etc.)

- **Top Toolbar**: Drawing tools (select, shapes, lines, text, pen, etc.)## 🚀 Quick Start

- **Right Panel**: Color picker and styling controls

- **Canvas**: Drag components from sidebar, draw shapes, create diagramsTo execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:



---### 1. Import the Component



## 💡 How to Use```bash



### Add Components```typescriptng test

1. **Drag & Drop**: Drag any component from the left sidebar onto the canvas

2. **Icons appear automatically** with Font Awesome icons// app.component.ts```



### Draw Shapesimport { Component } from '@angular/core';

1. Click tool from top toolbar (rectangle, circle, arrow, line, text, etc.)

2. Click and drag on canvas to drawimport { KonvaCanvasMainComponent } from 'konva-architecture-canvas';## Running end-to-end tests

3. Use color panel on right to style



### Select & Edit

- **Single select**: Click any item@Component({For end-to-end (e2e) testing, run:

- **Multi-select**: Shift+Click or drag a selection box

- **Group**: Select multiple items → Cmd/Ctrl+G  selector: 'app-root',

- **Ungroup**: Select group → Cmd/Ctrl+Shift+G

- **Delete**: Select items → Delete key  standalone: true,```bash

- **Undo/Redo**: Cmd/Ctrl+Z / Cmd/Ctrl+Shift+Z

  imports: [KonvaCanvasMainComponent],ng e2e

### Change Colors

1. Select item(s)  template: ````

2. Use color panel on right

3. **Stroke** = border color    <div class="canvas-container">

4. **Fill** = inside color

5. Adjust opacity sliders      <kcb-konva-canvas-main></kcb-konva-canvas-main>Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.



---    </div>



## ⌨️ Keyboard Shortcuts  `,## Additional Resources



| Shortcut | Action |  styles: [`

|----------|--------|

| `V` | Select tool |    .canvas-container {For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

| `H` | Hand/Pan tool |

| `R` | Rectangle |      width: 100vw;

| `C` | Circle |      height: 100vh;

| `L` | Line |    }

| `A` | Arrow |  `]

| `T` | Text |})

| `P` | Pen tool |export class AppComponent {}

| `Cmd/Ctrl+G` | Group selected |```

| `Cmd/Ctrl+Shift+G` | Ungroup |

| `Cmd/Ctrl+Z` | Undo |### 2. That's It! 🎉

| `Cmd/Ctrl+Shift+Z` | Redo |

| `Cmd/Ctrl+A` | Select all |The component comes with 47+ pre-built components ready to use!

| `Cmd/Ctrl+D` | Duplicate |

| `Delete` | Delete selected |---



---## 📖 Full Documentation



## 📊 Available Components- **Installation & Setup**: See above

- **Usage Guide**: [Main README](../../README.md)

### 🤖 AI Models (11)- **Developer Guide**: [DEVELOPER_GUIDE.md](../../DEVELOPER_GUIDE.md)

GPT-4, Claude, Llama, Gemini, Mistral, Command, Jurassic, PaLM, BERT, T5, DALL-E- **Publishing Guide**: [NPM_PUBLISHING_GUIDE.md](../../NPM_PUBLISHING_GUIDE.md)



### 💾 Data Storage (12)---

PostgreSQL, MySQL, MongoDB, Redis, Cassandra, DynamoDB, Snowflake, BigQuery, Elasticsearch, Pinecone, etc.

## 📊 Component Categories

### 🔧 Agent Frameworks (7)

LangChain, AutoGen, CrewAI, AgentGPT, BabyAGI, SuperAGI, MetaGPT- 🔥 **Foundation Models**: GPT-4, Claude, Llama, Gemini, etc.

- 💾 **Data Storage**: PostgreSQL, Redis, MongoDB, Pinecone, etc.

### 📈 Observability (7)- 🤖 **Agent Frameworks**: LangChain, AutoGen, CrewAI, etc.

Grafana, Prometheus, DataDog, New Relic, Splunk, ELK Stack, Jaeger- 📊 **Observability**: Grafana, Prometheus, DataDog, etc.

- 🔧 **Tool Execution**: Tavily, Exa, Perplexity, etc.

### 🔨 Tool Execution (6)- 🧠 **Memory Management**: Weaviate, ChromaDB, Milvus, etc.

Tavily, Exa, Perplexity, Serper, SerpAPI, BrowserBase

---

### 🧠 Memory (4)

Weaviate, ChromaDB, Milvus, FAISS## ⌨️ Keyboard Shortcuts



---| Shortcut | Action |

|----------|--------|

## 🎨 Styling Options| `Cmd/Ctrl + G` | Group selected items |

| `Cmd/Ctrl + Shift + G` | Ungroup |

- **Colors**: 12 preset colors + custom hex colors| `Cmd/Ctrl + Z` | Undo |

- **Opacity**: Separate opacity for stroke and fill (0-100%)| `Cmd/Ctrl + A` | Select all |

- **Stroke Width**: 1-10px| `Cmd/Ctrl + S` | Export JSON |

- **Fill Styles**: Solid, hatch, cross-hatch, dotted, none| `Delete` | Delete selected |

- **Stroke Patterns**: Solid, dashed, dotted, none| `Shift + Click` | Multi-select |

- **Size Presets**: S, M, L, XL

---

---

## 📄 License

## 💾 Export/Import

MIT License - Copyright (c) 2025  Systems, Inc.

### Export

Click **Save JSON** button (top toolbar) → Downloads architecture as JSON file---



### Import## 📞 Support

Click **Load JSON** button (top toolbar) → Select saved JSON file

- **Issues**: https://github.com/samba425/konva-architecture-canvas/issues

---- **Email**: asiva325@gmail.com



## 🛠️ Advanced Usage---



### Full-Page Canvas (Recommended)**Made with ❤️ by SAMBA SIVA**


```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [KonvaCanvasMainComponent],
  template: '<arch-canvas></arch-canvas>',
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
    }
    arch-canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class AppComponent {}
```

### Embedded in Page

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [KonvaCanvasMainComponent],
  template: `
    <header>My App</header>
    <div class="canvas-wrapper">
      <arch-canvas></arch-canvas>
    </div>
  `,
  styles: [`
    .canvas-wrapper {
      width: 100%;
      height: 600px;
    }
    arch-canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class AppComponent {}
```

---

## ⚠️ Common Issues & Fixes

### Issue: Left sidebar icons not showing
**Fix**: Make sure you have internet connection (icons load from Iconify API) and wait 2-3 seconds for them to load

### Issue: Canvas not visible
**Fix**: Make sure parent elements have height set:
```css
arch-canvas {
  display: block;
  width: 100%;
  height: 100vh; /* or specific height */
}
```

### Issue: Selector not found
**Fix**: Use `<arch-canvas></arch-canvas>` (not `app-konva-canvas-main`)

---

## 📖 Examples

### Minimal Setup
```typescript
import { Component } from '@angular/core';
import { KonvaCanvasMainComponent } from 'konva-architecture-canvas';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [KonvaCanvasMainComponent],
  template: '<arch-canvas style="display:block;width:100%;height:100vh"></arch-canvas>'
})
export class AppComponent {}
```

### With Custom Styling
```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [KonvaCanvasMainComponent],
  template: `
    <div class="app-container">
      <arch-canvas></arch-canvas>
    </div>
  `,
  styles: [`
    .app-container {
      width: 100vw;
      height: 100vh;
      background: #f5f5f5;
    }
    arch-canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class AppComponent {}
```

---

## 📝 Requirements

- **Angular**: 21.0+ (works with Angular 15+)
- **Konva**: 10.0+
- **TypeScript**: 5.0+
- **Modern browsers** with ES2020+ support

---

## 🤝 Support

- **GitHub**: [github.com/samba425/konva-architecture-canvas](https://github.com/samba425/konva-architecture-canvas)
- **Issues**: [Report bugs](https://github.com/samba425/konva-architecture-canvas/issues)
- **NPM**: [npmjs.com/package/konva-architecture-canvas](https://www.npmjs.com/package/konva-architecture-canvas)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎉 Quick Tips

1. **Icons load from internet** - First load may take 2-3 seconds
2. **Use Shift+Click** for multi-select (not just drag selection)
3. **Right-click on canvas** to pan/zoom
4. **Use keyboard shortcuts** (Cmd+G, Cmd+Z, etc.) for speed
5. **Group items** before moving them together
6. **Export often** to save your work as JSON

---

**Made with ❤️ for developers who love beautiful diagrams**
