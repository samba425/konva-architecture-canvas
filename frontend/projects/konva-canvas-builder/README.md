<div align="center">

# 🎨 Konva Architecture Canvas

### Professional Architecture Diagram Builder for Angular

[![npm version](https://img.shields.io/npm/v/konva-architecture-canvas.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/konva-architecture-canvas)
[![npm downloads](https://img.shields.io/npm/dm/konva-architecture-canvas.svg?style=flat-square&color=brightgreen)](https://www.npmjs.com/package/konva-architecture-canvas)
[![GitHub stars](https://img.shields.io/github/stars/samba425/konva-architecture-canvas.svg?style=flat-square)](https://github.com/samba425/konva-architecture-canvas)
[![License](https://img.shields.io/badge/License-MIT-success.svg?style=flat-square)](LICENSE)

<p align="center">
  <strong>
    <a href="https://samba425.github.io/konva-architecture-canvas/">🚀 Live Demo</a> •
    <a href="#-installation">📦 Installation</a> •
    <a href="#-quick-start">⚡ Quick Start</a> •
    <a href="#-component-library">🧩 Components</a> •
    <a href="#-examples">💡 Examples</a>
  </strong>
</p>

<p align="center">
  Build stunning cloud infrastructure, AI/ML systems, and technical architecture diagrams<br/>
  with an intuitive drag-and-drop interface powered by Angular and Konva.js
</p>


</div>

---

## ✨ Features at a Glance

<table>
<tr>
<td width="50%" valign="top">

### 🎯 47+ Pre-Built Components
- Cloud providers (AWS, Azure, GCP)
- AI/ML services (GPT, Claude, Llama)
- Databases (PostgreSQL, MongoDB, Redis)
- Vector DBs (Pinecone, Weaviate, Milvus)
- Agent frameworks (LangChain, AutoGen)
- Observability tools (Grafana, DataDog)

### 🎨 Professional Drawing Tools
- Shapes: Rectangle, Circle, Arrow, Line
- Text with formatting
- Free-hand pen tool
- Color & opacity controls
- Stroke width customization

### 📦 Smart Grouping
- Nested groups with color-coding
- Drag groups as single units
- 5-level hierarchy (purple → red → orange → green → blue)
- Extract/reorganize items easily

</td>
<td width="50%" valign="top">

### 🔗 Smart Connections
- Auto-routing arrows
- Multiple connection styles
- Bezier curves
- Label support
- Connection color customization

### 💾 Save & Export
- Export to PNG, JSON, SVG
- Save custom templates
- Auto-save to localStorage
- Import/export full diagrams

### ⚡ Power User Features
- Multi-selection (Shift+Click or drag)
- Undo/Redo (Cmd+Z / Cmd+Shift+Z)
- Keyboard shortcuts
- Zoom & Pan
- Grid snapping
- Dark/Light themes

</td>
</tr>
</table>

---

## 📦 Installation

### Step 1: Install Package

```bash
npm install konva-architecture-canvas konva
```

### Step 2: Verify Peer Dependencies

Ensure you have:

```json
{
  "@angular/common": "^21.0.0",
  "@angular/core": "^21.0.0",
  "@angular/forms": "^21.0.0",
  "konva": "^10.0.12"
}
```

> **💡 Tip**: Works with Angular 15+ but optimized for Angular 21

---

## ⚡ Quick Start

### 1️⃣ Import the Component

```typescript
import { Component } from '@angular/core';
import { KonvaCanvasMainComponent } from 'konva-architecture-canvas';

@Component({
  selector: 'app-root',
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
export class AppComponent {}
```

### 2️⃣ Add Global Styles

In your `styles.css`:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
```

### 3️⃣ Run Your App

```bash
ng serve
```

Open `http://localhost:4200` - **That's it!** 🎉

---

## 🧩 Component Library

### 🤖 AI Foundation Models (12)
`GPT-4` `Claude` `Llama` `Gemini` `Mistral` `Cohere` `Phi` `Qwen` `Grok` `Nova` `DeepSeek` `Gemma`

### 🗄️ Vector Databases (6)
`Pinecone` `Weaviate` `Milvus` `Chroma` `pgVector` `Neon`

### 🔗 Agent Frameworks (10)
`LangChain` `LangGraph` `Semantic Kernel` `AutoGen` `CrewAI` `LlamaIndex` `Camel AI` `AWS Bedrock` `Replit` `OpenAI Operator`

### 📊 Observability (7)
`Langfuse` `Comet Opik` `Helicone` `Arize Phoenix` `DataDog` `Amplitude` `Sentry`

### 🛠️ Tool Execution (5)
`Composio` `NPI` `Exa` `LinkUp` `Browserbase`

### 💾 Memory Systems (6)
`Zep` `Cognee` `Mem0` `VertexAI` `NapthaAI` `MaestroAI`

> **✨ Total: 47+ components** with more being added regularly!

---

## 💡 Usage Guide

### Adding Components
1. **Search** for components in the left sidebar
2. **Drag & Drop** onto the canvas
3. Components automatically appear with icons

### Drawing Shapes
1. Click a tool from the top toolbar (Rectangle, Circle, Arrow, etc.)
2. Click and drag on the canvas
3. Use the right panel to customize colors

### Connecting Components
1. Click the **🔗 Connector** tool
2. Click on the **source** component
3. Click on the **target** component
4. A smart arrow appears automatically!

### Creating Groups
1. Select multiple items (Shift+Click or drag a box)
2. Press **Cmd+G** (Mac) or **Ctrl+G** (Windows)
3. The group gets a colored border based on nesting level
4. Drag the group to move all items together

### Saving & Exporting
- **Save as Template**: Click 💾 button → Save custom template
- **Export PNG**: Click Export button → Download image
- **Export JSON**: Click Save JSON → Download architecture data
- **Import**: Click Load JSON → Select saved file

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Shortcut | Action |
|----------|--------|----------|--------|
| `V` | Select tool | `R` | Rectangle |
| `C` | Circle | `L` | Line |
| `A` | Arrow | `T` | Text |
| `P` | Pen tool | `K` | Connector |
| `Cmd/Ctrl+G` | Group | `Cmd/Ctrl+Shift+G` | Ungroup |
| `Cmd/Ctrl+Z` | Undo | `Cmd/Ctrl+Shift+Z` | Redo |
| `Cmd/Ctrl+A` | Select all | `Delete` | Delete selected |
| `Cmd/Ctrl+D` | Duplicate | `Space+Drag` | Pan canvas |
| `Scroll` | Zoom | `Cmd/Ctrl+0` | Reset zoom |

Press `?` in the app to see all shortcuts!

---

## 📝 Examples

### Example 1: Minimal Setup

```typescript
import { Component } from '@angular/core';
import { KonvaCanvasMainComponent } from 'konva-architecture-canvas';

@Component({
  selector: 'app-diagram',
  standalone: true,
  imports: [KonvaCanvasMainComponent],
  template: '<lib-konva-canvas-main style="display:block;width:100%;height:100vh"></lib-konva-canvas-main>'
})
export class DiagramComponent {}
```

### Example 2: With Custom Container

```typescript
@Component({
  selector: 'app-diagram',
  standalone: true,
  imports: [KonvaCanvasMainComponent],
  template: `
    <div class="diagram-container">
      <lib-konva-canvas-main></lib-konva-canvas-main>
    </div>
  `,
  styles: [`
    .diagram-container {
      width: 100vw;
      height: 100vh;
      background: #1a1a2e;
    }
    lib-konva-canvas-main {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class DiagramComponent {}
```

### Example 3: Embedded in a Page

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [KonvaCanvasMainComponent],
  template: `
    <header class="app-header">My Application</header>
    <div class="canvas-wrapper">
      <lib-konva-canvas-main></lib-konva-canvas-main>
    </div>
    <footer class="app-footer">© 2025</footer>
  `,
  styles: [`
    .app-header {
      height: 60px;
      background: #333;
      color: white;
      display: flex;
      align-items: center;
      padding: 0 20px;
    }
    .canvas-wrapper {
      height: calc(100vh - 110px);
    }
    .app-footer {
      height: 50px;
      background: #222;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    lib-konva-canvas-main {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class AppComponent {}
```

---

## 🎨 Component Styling

### Stroke (Border)
- **12 preset colors** + custom color picker
- **Opacity**: 0-100%
- **Width**: 1-10px
- **Styles**: Solid, dashed, dotted

### Fill (Interior)
- **Independent color control** from stroke
- **Separate opacity** control
- **Patterns**: Solid, hatch, cross-hatch, dotted

### Groups
- **Auto-colored borders** by nesting level:
  - Level 1: Purple
  - Level 2: Red
  - Level 3: Orange
  - Level 4: Green
  - Level 5: Blue

---

## 🐛 Troubleshooting

### Canvas Not Showing?
**Fix**: Add to `styles.css`:
```css
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 100%; height: 100%; overflow: hidden; }
```

### Components Not Draggable?
**Fix**: Make sure you're in **Select mode** (↖️ icon) and not another tool mode.

### Icons Not Appearing?
**Fix**: Icons load from the internet. Wait 2-3 seconds on first load. Check your internet connection.

### Can't See the Sidebar?
**Fix**: Make sure the component has adequate width (min 800px recommended).

### Performance Issues?
**Fix**: 
- Group components to reduce individual objects
- Avoid excessive nesting (max 5 levels)
- Close unused panels when working

---

## 📚 More Resources

- **📖 Full Documentation**: [GitHub Repo](https://github.com/samba425/konva-architecture-canvas)
- **🚀 Live Demo**: [Try it now](https://samba425.github.io/konva-architecture-canvas/)
- **💬 Report Issues**: [GitHub Issues](https://github.com/samba425/konva-architecture-canvas/issues)
- **📦 npm Package**: [View on npm](https://www.npmjs.com/package/konva-architecture-canvas)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to:
- 🐛 [Report bugs](https://github.com/samba425/konva-architecture-canvas/issues)
- 💡 [Suggest features](https://github.com/samba425/konva-architecture-canvas/issues)
- 🔧 [Submit pull requests](https://github.com/samba425/konva-architecture-canvas/pulls)

---

## 📄 License

MIT License - Copyright (c) 2025

See [LICENSE](LICENSE) file for details.

---

## 🎯 Quick Tips

💡 **Use Shift+Click** for multi-selection  
💡 **Press Cmd+G** to group selected items  
💡 **Scroll to zoom** in and out  
💡 **Space+Drag** to pan the canvas  
💡 **Export often** to save your work  
💡 **Try keyboard shortcuts** for faster workflow

---

<div align="center">

### ⭐ Star us on GitHub if you find this useful!

**Made with ❤️ for developers who love beautiful diagrams**

[🚀 Try Live Demo](https://samba425.github.io/konva-architecture-canvas/) • 
[📦 View on npm](https://www.npmjs.com/package/konva-architecture-canvas) • 
[💬 Get Support](https://github.com/samba425/konva-architecture-canvas/issues)

</div>
