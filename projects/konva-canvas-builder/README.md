# 🎨 Konva Architecture Canvas# konva-architecture-canvas# konva-architecture-canvas# KonvaCanvasBuilder



> **Professional Architecture Diagram Builder** - Create stunning cloud infrastructure, AI/ML systems, and technical architecture diagrams with an intuitive drag-and-drop interface.



[![npm version](https://img.shields.io/npm/v/konva-architecture-canvas.svg)](https://www.npmjs.com/package/konva-architecture-canvas)> 🎨 **Build stunning architecture diagrams in minutes** - A powerful Angular component with 47+ pre-built tech components, drag-and-drop interface, and professional drawing tools.

[![Angular](https://img.shields.io/badge/Angular-21+-DD0031?logo=angular)](https://angular.io/)

[![Konva](https://img.shields.io/badge/Konva-10+-0D83CD?logo=konva)](https://konvajs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6?logo=typescript)](https://www.typescriptlang.org/)

[![License](https://img.shields.io/badge/License-MIT-success.svg)](LICENSE)[![Angular](https://img.shields.io/badge/Angular-21+-red)](https://angular.io/)> A powerful Angular component for creating interactive architecture diagrams with Konva.jsThis project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0.



---[![Konva](https://img.shields.io/badge/Konva-10+-blue)](https://konvajs.org/)



## 📖 Table of Contents[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)



- [Features](#-features)

- [Installation](#-installation)

- [Quick Start](#-quick-start)---[![Angular](https://img.shields.io/badge/Angular-21.0-red)](https://angular.io/)## Code scaffolding

- [Component Library](#-component-library)

- [Usage Guide](#-usage-guide)

- [Keyboard Shortcuts](#%EF%B8%8F-keyboard-shortcuts)

- [API Reference](#-api-reference)## ✨ Features[![Konva](https://img.shields.io/badge/Konva-10.0-blue)](https://konvajs.org/)

- [Examples](#-examples)

- [Troubleshooting](#-troubleshooting)



---- **47+ Pre-built Components** (AI models, databases, cloud services, frameworks, etc.)[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)Angular CLI includes powerful code scaffolding tools. To generate a new component, run:



## ✨ Features- **Complete Drawing Tools** (shapes, arrows, lines, text, pen tool)



### 🎯 **Rich Component Library**- **Professional Styling** (colors, opacity, borders, fills)[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

- **47+ Pre-built Components** across 6 categories:

  - 🤖 **AI Models**: Mistral, Llama, Gemma, GPT, Claude, Gemini, DeepSeek, Phi, Qwen, Grok, Nova, Cohere- **Smart Grouping** (with nested support and colored borders)

  - 🗄️ **Vector Databases**: Weaviate, Milvus, Pinecone, Chroma, pgVector, Neon

  - 🔗 **Agent Frameworks**: LangChain, LangGraph, Semantic Kernel, AutoGen, CrewAI, LlamaIndex- **Export/Import** (save and load as JSON)```bash

  - 📊 **Observability**: Langfuse, Comet Opik, Helicone, Arize Phoenix, Datadog, Amplitude

  - 🛠️ **Tool Execution**: Composio, NPI, Exa, LinkUp, Browserbase- **Full Keyboard Shortcuts** (Cmd+G for group, Cmd+Z for undo, etc.)

  - 💾 **Memory Systems**: Zep, Cognee, Mem0, VertexAI, NapthaAI, MaestroAI

- **Multi-Selection** (Shift+Click or drag to select)## ✨ Featuresng generate component component-name

### 🎨 **Professional Drawing Tools**

- **Basic Shapes**: Rectangle, Circle, Line, Arrow, Triangle, Diamond, Pentagon, Hexagon, Star

- **Freehand Drawing**: Pen tool for custom paths and annotations

- **Text Labels**: Rich text editor with customizable fonts and colors---```

- **Image Upload**: Add custom icons and logos to your diagrams



### 🎨 **Advanced Styling System**

- **Dual Color Control**: Separate stroke (border) and fill (interior) colors## 📦 Installation- 🎨 **47+ Pre-built Components** across 6 categories (AI Models, Databases, Frameworks, etc.)

- **Independent Opacity**: Adjust stroke and fill transparency separately

- **12-Color Palette**: Quick color selection with custom color picker

- **Stroke Width**: Adjustable border thickness (1-10px)

```bash- 🎯 **Drag & Drop Interface** for intuitive diagram creationFor a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

### 📦 **Smart Grouping System**

- **Hierarchical Groups**: Create nested groups with automatic color codingnpm install konva-architecture-canvas konva

- **Visual Borders**: Color-coded borders (purple, red, orange, green, blue) by nesting level

- **Drag & Move**: Move entire groups as single units```- 🌈 **Advanced Color System** with separate stroke/fill controls and opacity

- **Extract Items**: Remove items from groups or create new groups



### 💾 **Save & Restore**

- **Auto-Save**: Automatic localStorage backup of your work---- 📦 **Nested Grouping** with colored borders by hierarchy level```bash

- **My Templates**: Save custom diagrams as reusable templates

- **Export Formats**: JSON, PNG, and SVG export options

- **Import**: Load saved JSON diagrams

## 🚀 Quick Start (3 Steps)- 💾 **Export/Import** architecture diagrams as JSONng generate --help

### ⚡ **High Performance**

- **Canvas Rendering**: Powered by Konva.js for smooth interactions

- **Icon Caching**: Optimized component rendering

- **Infinite Canvas**: Pan and zoom without limits### 1️⃣ Import the Component- ⚡ **High Performance** with icon caching and optimized rendering```

- **Grid System**: Optional alignment grid



### 🎯 **User-Friendly Interface**

- **Multi-Selection**: Shift+Click or drag-rectangle to select multiple items```typescript- ⌨️ **Keyboard Shortcuts** (Cmd+G, Cmd+Z, Cmd+S, etc.)

- **Keyboard Shortcuts**: Full keyboard support for power users

- **Dark/Light Themes**: Switch between themes for comfortable viewingimport { Component } from '@angular/core';

- **Responsive**: Works on various screen sizes

import { KonvaCanvasMainComponent } from 'konva-architecture-canvas';- 🎪 **Multi-Selection** with Shift+Click and drag-rectangle## Building

---



## 📦 Installation

@Component({- 📱 **Responsive Canvas** with infinite grid and zoom/pan

Install the package and its peer dependency:

  selector: 'app-root',

```bash

npm install konva-architecture-canvas konva  standalone: true,- 🔧 **Easy to Extend** with custom components and themesTo build the library, run:

```

  imports: [KonvaCanvasMainComponent],

### Peer Dependencies

  template: '<arch-canvas></arch-canvas>',

This library requires:

  styles: [`

```json

{    arch-canvas {---```bash

  "@angular/common": "^21.0.0",

  "@angular/core": "^21.0.0",      display: block;

  "@angular/forms": "^21.0.0",

  "konva": "^10.0.12"      width: 100%;ng build konva-canvas-builder

}

```      height: 100vh;



---    }## 📦 Installation```



## 🚀 Quick Start  `]



### Step 1: Import the Component})



```typescriptexport class AppComponent {}

import { Component } from '@angular/core';

import { KonvaCanvasMainComponent } from 'konva-architecture-canvas';``````bashThis command will compile your project, and the build artifacts will be placed in the `dist/` directory.



@Component({

  selector: 'app-root',

  standalone: true,### 2️⃣ Update Your Styles (Important!)npm install konva-architecture-canvas konva

  imports: [KonvaCanvasMainComponent],

  template: '<arch-canvas></arch-canvas>',

  styles: [`

    arch-canvas {In your global `styles.css`:```### Publishing the Library

      display: block;

      width: 100%;

      height: 100vh;

    }```css

  `]

})* {

export class AppComponent {}

```  margin: 0;### Peer DependenciesOnce the project is built, you can publish your library by following these steps:



### Step 2: Configure Global Styles  padding: 0;



Add to your `styles.css` or `styles.scss`:  box-sizing: border-box;



```css}

* {

  margin: 0;```json1. Navigate to the `dist` directory:

  padding: 0;

  box-sizing: border-box;html, body {

}

  width: 100%;{   ```bash

html, body {

  width: 100%;  height: 100%;

  height: 100%;

  overflow: hidden;  overflow: hidden;  "@angular/common": "^21.0.0",   cd dist/konva-canvas-builder

}

```}



### Step 3: Run Your Application```  "@angular/core": "^21.0.0",   ```



```bash

ng serve

```### 3️⃣ Run Your App  "@angular/forms": "^21.0.0",



Open your browser to `http://localhost:4200` and start creating diagrams!



---```bash  "konva": "^10.0.12"2. Run the `npm publish` command to publish your library to the npm registry:



## 🧩 Component Libraryng serve



### 🤖 AI Foundation Models (12)```}   ```bash

- Mistral, Llama, Gemma, GPT, Claude, Gemini

- DeepSeek, Phi, Qwen, Grok, Nova, Cohere



### 🗄️ Vector Databases (6)Open `http://localhost:4200` - **That's it!** 🎉```   npm publish

- Weaviate, Milvus, Pinecone

- Chroma, pgVector, Neon



### 🔗 Agent Frameworks (10)---   ```

- LangChain, LangGraph, Semantic Kernel

- AutoGen, Camel AI, LlamaIndex

- CrewAI, AWS Bedrock, Replit, OpenAI Operator

## 🎯 What You Get---

### 📊 Observability Tools (7)

- Langfuse, Comet Opik, Helicone

- Arize Phoenix, Datadog, Amplitude, Sentry

The component appears with:## Running unit tests

### 🛠️ Tool Execution (5)

- Composio, NPI, Exa, LinkUp, Browserbase- **Left Sidebar**: 47+ components in 6 categories (AI Models, Databases, Frameworks, etc.)



### 💾 Memory Systems (6)- **Top Toolbar**: Drawing tools (select, shapes, lines, text, pen, etc.)## 🚀 Quick Start

- Zep, Cognee, Mem0

- VertexAI, NapthaAI, MaestroAI- **Right Panel**: Color picker and styling controls



---- **Canvas**: Drag components from sidebar, draw shapes, create diagramsTo execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:



## 📚 Usage Guide



### Creating Your First Diagram---### 1. Import the Component



1. **Select a Tool**: Click the ↖️ (Select), ✋ (Hand), or drawing tool from the toolbar

2. **Add Components**: Search for components in the left panel and drag them to the canvas

3. **Connect Components**: Use the 🔗 Connector tool to draw lines between components## 💡 How to Use```bash

4. **Style Your Diagram**: Select items and use the color/opacity controls

5. **Save Your Work**: Click 💾 to save as a template or export to JSON/PNG



### Drawing Tools### Add Components```typescriptng test



| Tool | Icon | Shortcut | Description |1. **Drag & Drop**: Drag any component from the left sidebar onto the canvas

|------|------|----------|-------------|

| Select | ↖️ | V | Select and move shapes |2. **Icons appear automatically** with Font Awesome icons// app.component.ts```

| Hand | ✋ | H | Pan the canvas |

| Connector | 🔗 | K | Draw connections between shapes |

| Pen | ✏️ | P | Freehand drawing |

| Rectangle | ▭ | R | Draw rectangles |### Draw Shapesimport { Component } from '@angular/core';

| Circle | ○ | C | Draw circles |

| Arrow | → | A | Draw directional arrows |1. Click tool from top toolbar (rectangle, circle, arrow, line, text, etc.)

| Line | ─ | L | Draw straight lines |

| Text | T | T | Add text labels |2. Click and drag on canvas to drawimport { KonvaCanvasMainComponent } from 'konva-architecture-canvas';## Running end-to-end tests



### Using Connectors3. Use color panel on right to style



1. Click the **🔗 Connector** tool

2. Click on the **source component**

3. Click on the **target component**### Select & Edit

4. A curved line will be drawn automatically

5. Toggle between curved/straight lines with the **〰️** button- **Single select**: Click any item@Component({For end-to-end (e2e) testing, run:



### Grouping Components- **Multi-select**: Shift+Click or drag a selection box



1. Select multiple components (Shift+Click or drag-rectangle)- **Group**: Select multiple items → Cmd/Ctrl+G  selector: 'app-root',

2. Press **Cmd+G** (Mac) or **Ctrl+G** (Windows/Linux)

3. The group will have a colored border based on nesting level- **Ungroup**: Select group → Cmd/Ctrl+Shift+G

4. Drag the group to move all items together

- **Delete**: Select items → Delete key  standalone: true,```bash

**Group Border Colors by Nesting Level:**

- Level 1: Purple- **Undo/Redo**: Cmd/Ctrl+Z / Cmd/Ctrl+Shift+Z

- Level 2: Red  

- Level 3: Orange  imports: [KonvaCanvasMainComponent],ng e2e

- Level 4: Green

- Level 5: Blue### Change Colors



### Styling Components1. Select item(s)  template: ````



**Stroke Mode (Border):**2. Use color panel on right

- Click any component to select it

- Use the color palette or custom color picker3. **Stroke** = border color    <div class="canvas-container">

- Adjust stroke opacity (0-100%)

- Change stroke width (1-10px)4. **Fill** = inside color



**Fill Mode (Interior):**5. Adjust opacity sliders      <kcb-konva-canvas-main></kcb-konva-canvas-main>Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

- Switch to "Fill" mode

- Select color independently from stroke

- Adjust fill opacity separately

---    </div>

### My Templates



**Save a Custom Template:**

1. Create your diagram## ⌨️ Keyboard Shortcuts  `,## Additional Resources

2. Click the **💾 Save as Template** button in the Templates panel

3. Enter a name and description

4. Your template is saved to browser localStorage

| Shortcut | Action |  styles: [`

**Load a Template:**

1. Click **📋 Templates** button|----------|--------|

2. Switch to **💾 My Templates** tab

3. Click on any template to load it| `V` | Select tool |    .canvas-container {For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.



**Create New Canvas:**| `H` | Hand/Pan tool |

- Click the **📄 New Canvas** button to start fresh

| `R` | Rectangle |      width: 100vw;

---

| `C` | Circle |      height: 100vh;

## ⌨️ Keyboard Shortcuts

| `L` | Line |    }

### Selection & Navigation

| Shortcut | Action || `A` | Arrow |  `]

|----------|--------|

| `V` | Select Tool || `T` | Text |})

| `H` | Hand Tool (Pan) |

| `Space + Drag` | Temporary Hand Tool || `P` | Pen tool |export class AppComponent {}

| `Shift + Click` | Multi-select |

| `Cmd/Ctrl + A` | Select All || `Cmd/Ctrl+G` | Group selected |```



### Drawing Tools| `Cmd/Ctrl+Shift+G` | Ungroup |

| Shortcut | Action |

|----------|--------|| `Cmd/Ctrl+Z` | Undo |### 2. That's It! 🎉

| `K` | Connector Tool |

| `P` | Pen Tool || `Cmd/Ctrl+Shift+Z` | Redo |

| `R` | Rectangle Tool |

| `C` | Circle Tool || `Cmd/Ctrl+A` | Select all |The component comes with 47+ pre-built components ready to use!

| `A` | Arrow Tool |

| `L` | Line Tool || `Cmd/Ctrl+D` | Duplicate |

| `T` | Text Tool |

| `Delete` | Delete selected |---

### Editing

| Shortcut | Action |

|----------|--------|

| `Cmd/Ctrl + G` | Group Selected |---## 📖 Full Documentation

| `Cmd/Ctrl + Z` | Undo |

| `Cmd/Ctrl + Y` | Redo |

| `Delete/Backspace` | Delete Selected |

| `Cmd/Ctrl + D` | Duplicate Selected |## 📊 Available Components- **Installation & Setup**: See above



### View- **Usage Guide**: [Main README](../../README.md)

| Shortcut | Action |

|----------|--------|### 🤖 AI Models (11)- **Developer Guide**: [DEVELOPER_GUIDE.md](../../DEVELOPER_GUIDE.md)

| `+` / `Scroll Up` | Zoom In |

| `-` / `Scroll Down` | Zoom Out |GPT-4, Claude, Llama, Gemini, Mistral, Command, Jurassic, PaLM, BERT, T5, DALL-E- **Publishing Guide**: [NPM_PUBLISHING_GUIDE.md](../../NPM_PUBLISHING_GUIDE.md)

| `0` | Reset Zoom (100%) |

| `?` | Show Keyboard Shortcuts |



### Export### 💾 Data Storage (12)---

| Shortcut | Action |

|----------|--------|PostgreSQL, MySQL, MongoDB, Redis, Cassandra, DynamoDB, Snowflake, BigQuery, Elasticsearch, Pinecone, etc.

| `Cmd/Ctrl + S` | Save as JSON |

| `Cmd/Ctrl + E` | Export as PNG |## 📊 Component Categories



---### 🔧 Agent Frameworks (7)



## 🔧 API ReferenceLangChain, AutoGen, CrewAI, AgentGPT, BabyAGI, SuperAGI, MetaGPT- 🔥 **Foundation Models**: GPT-4, Claude, Llama, Gemini, etc.



### Component Selector- 💾 **Data Storage**: PostgreSQL, Redis, MongoDB, Pinecone, etc.



```html### 📈 Observability (7)- 🤖 **Agent Frameworks**: LangChain, AutoGen, CrewAI, etc.

<arch-canvas></arch-canvas>

```Grafana, Prometheus, DataDog, New Relic, Splunk, ELK Stack, Jaeger- 📊 **Observability**: Grafana, Prometheus, DataDog, etc.



### Input Properties- 🔧 **Tool Execution**: Tavily, Exa, Perplexity, etc.



Currently, the component works standalone without required inputs. Future versions will support:### 🔨 Tool Execution (6)- 🧠 **Memory Management**: Weaviate, ChromaDB, Milvus, etc.



```typescriptTavily, Exa, Perplexity, Serper, SerpAPI, BrowserBase

@Input() initialData?: ArchitectureDiagram;

@Input() theme?: 'light' | 'dark';---

@Input() readOnly?: boolean;

```### 🧠 Memory (4)



### Output EventsWeaviate, ChromaDB, Milvus, FAISS## ⌨️ Keyboard Shortcuts



```typescript

@Output() diagramChange = new EventEmitter<ArchitectureDiagram>();

@Output() selectionChange = new EventEmitter<any[]>();---| Shortcut | Action |

```

|----------|--------|

### Methods (via ViewChild)

## 🎨 Styling Options| `Cmd/Ctrl + G` | Group selected items |

```typescript

@ViewChild(KonvaCanvasMainComponent) canvas!: KonvaCanvasMainComponent;| `Cmd/Ctrl + Shift + G` | Ungroup |



// Export diagram- **Colors**: 12 preset colors + custom hex colors| `Cmd/Ctrl + Z` | Undo |

this.canvas.exportToJSON();

this.canvas.exportToPNG();- **Opacity**: Separate opacity for stroke and fill (0-100%)| `Cmd/Ctrl + A` | Select all |

this.canvas.exportToSVG();

- **Stroke Width**: 1-10px| `Cmd/Ctrl + S` | Export JSON |

// Canvas control

this.canvas.zoomIn();- **Fill Styles**: Solid, hatch, cross-hatch, dotted, none| `Delete` | Delete selected |

this.canvas.zoomOut();

this.canvas.zoomToFit();- **Stroke Patterns**: Solid, dashed, dotted, none| `Shift + Click` | Multi-select |

this.canvas.resetZoom();

- **Size Presets**: S, M, L, XL

// Clear canvas

this.canvas.clearCanvas();---

```

---

---

## 📄 License

## 💡 Examples

## 💾 Export/Import

### Example 1: Simple Integration

MIT License - Copyright (c) 2025  Systems, Inc.

```typescript

import { Component } from '@angular/core';### Export

import { KonvaCanvasMainComponent } from 'konva-architecture-canvas';

Click **Save JSON** button (top toolbar) → Downloads architecture as JSON file---

@Component({

  selector: 'app-diagram',

  standalone: true,

  imports: [KonvaCanvasMainComponent],### Import## 📞 Support

  template: `

    <div class="diagram-container">Click **Load JSON** button (top toolbar) → Select saved JSON file

      <arch-canvas></arch-canvas>

    </div>- **Issues**: https://github.com/samba425/konva-architecture-canvas/issues

  `,

  styles: [`---- **Email**: asiva325@gmail.com

    .diagram-container {

      width: 100vw;

      height: 100vh;

      background: #1a1a2e;## 🛠️ Advanced Usage---

    }

  `]

})

export class DiagramComponent {}### Full-Page Canvas (Recommended)**Made with ❤️ by SAMBA SIVA**

```



### Example 2: With Custom Actions```typescript

@Component({

```typescript  selector: 'app-root',

import { Component, ViewChild } from '@angular/core';  standalone: true,

import { KonvaCanvasMainComponent } from 'konva-architecture-canvas';  imports: [KonvaCanvasMainComponent],

  template: '<arch-canvas></arch-canvas>',

@Component({  styles: [`

  selector: 'app-advanced-diagram',    :host {

  standalone: true,      display: block;

  imports: [KonvaCanvasMainComponent],      width: 100%;

  template: `      height: 100vh;

    <div class="toolbar">    }

      <button (click)="saveToJSON()">Save</button>    arch-canvas {

      <button (click)="exportImage()">Export PNG</button>      display: block;

      <button (click)="clearAll()">Clear</button>      width: 100%;

    </div>      height: 100%;

    <arch-canvas></arch-canvas>    }

  `  `]

})})

export class AdvancedDiagramComponent {export class AppComponent {}

  @ViewChild(KonvaCanvasMainComponent) canvas!: KonvaCanvasMainComponent;```



  saveToJSON() {### Embedded in Page

    this.canvas.exportToJSON();

  }```typescript

@Component({

  exportImage() {  selector: 'app-root',

    this.canvas.exportToPNG();  standalone: true,

  }  imports: [KonvaCanvasMainComponent],

  template: `

  clearAll() {    <header>My App</header>

    if (confirm('Clear entire canvas?')) {    <div class="canvas-wrapper">

      this.canvas.clearCanvas();      <arch-canvas></arch-canvas>

    }    </div>

  }  `,

}  styles: [`

```    .canvas-wrapper {

      width: 100%;

---      height: 600px;

    }

## 🐛 Troubleshooting    arch-canvas {

      display: block;

### Canvas Not Displaying      width: 100%;

      height: 100%;

**Problem**: Component shows but canvas is blank.    }

  `]

**Solution**: Ensure global styles include:})

```cssexport class AppComponent {}

* { margin: 0; padding: 0; box-sizing: border-box; }```

html, body { width: 100%; height: 100%; overflow: hidden; }

```---



### Components Not Draggable## ⚠️ Common Issues & Fixes



**Problem**: Can't drag components from sidebar.### Issue: Left sidebar icons not showing

**Fix**: Make sure you have internet connection (icons load from Iconify API) and wait 2-3 seconds for them to load

**Solution**: Make sure you're in Select mode (↖️) and not another tool mode.

### Issue: Canvas not visible

### Auto-Save Not Working**Fix**: Make sure parent elements have height set:

```css

**Problem**: Changes lost after page refresh.arch-canvas {

  display: block;

**Solution**:   width: 100%;

- Check browser console for localStorage errors  height: 100vh; /* or specific height */

- Ensure localStorage is enabled in your browser}

- Check if browser is in private/incognito mode (localStorage may be restricted)```



### Tooltips Not Showing### Issue: Selector not found

**Fix**: Use `<arch-canvas></arch-canvas>` (not `app-konva-canvas-main`)

**Problem**: Hover tooltips don't appear on toolbar buttons.

---

**Solution**: The component uses custom CSS tooltips with `data-tooltip` attributes. Ensure styles are loaded correctly.

## 📖 Examples

### Performance Issues

### Minimal Setup

**Problem**: Canvas is slow with many components.```typescript

import { Component } from '@angular/core';

**Solution**:import { KonvaCanvasMainComponent } from 'konva-architecture-canvas';

- Use grouping to organize components

- Avoid excessive nesting (max 5 levels recommended)@Component({

- Close unused panels when not in use  selector: 'app-root',

  standalone: true,

---  imports: [KonvaCanvasMainComponent],

  template: '<arch-canvas style="display:block;width:100%;height:100vh"></arch-canvas>'

## 📄 License})

export class AppComponent {}

MIT © [Your Name/Organization]```



---### With Custom Styling

```typescript

## 🤝 Contributing@Component({

  selector: 'app-root',

Contributions are welcome! Please feel free to submit a Pull Request.  standalone: true,

  imports: [KonvaCanvasMainComponent],

---  template: `

    <div class="app-container">

## 📞 Support      <arch-canvas></arch-canvas>

    </div>

- **Issues**: [GitHub Issues](https://github.com/samba425/konva-architecture-canvas/issues)  `,

- **Discussions**: [GitHub Discussions](https://github.com/samba425/konva-architecture-canvas/discussions)  styles: [`

    .app-container {

---      width: 100vw;

      height: 100vh;

## 🎯 Roadmap      background: #f5f5f5;

    }

- [ ] Custom component creation API    arch-canvas {

- [ ] Real-time collaboration      display: block;

- [ ] More export formats (PDF, SVG with metadata)      width: 100%;

- [ ] Component search and filtering      height: 100%;

- [ ] Undo/Redo stack management    }

- [ ] Snap-to-grid functionality  `]

- [ ] Custom themes support})

export class AppComponent {}

---```



**Made with ❤️ using Angular and Konva.js**---


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
