# Dev.to Article: Show & Tell

---
title: "Show HN: Visual Architecture Diagram Builder in Angular with 47+ Components"
published: true
description: "Built an open-source architecture diagram tool with Angular & Konva.js. Features 47+ cloud/AI components, drag-and-drop, grouping, and export."
tags: angular, javascript, showdev, opensource
cover_image: https://via.placeholder.com/1000x420/1a1a2e/00ff00?text=Konva+Architecture+Canvas
---

# 🎨 I built a Visual Architecture Diagram Builder for Angular

![Demo](https://via.placeholder.com/800x400/1a1a2e/00ff00?text=Architecture+Canvas+Demo)

## TL;DR

Created an open-source Angular component for building architecture diagrams:
- ✅ 47+ pre-built components (AWS, Azure, AI/ML tools)
- ✅ Drag-and-drop interface
- ✅ Smart grouping and connections
- ✅ Export to PNG/JSON
- ✅ Keyboard shortcuts

**Try it**: [Live Demo](https://samba425.github.io/konva-architecture-canvas/)  
**Install**: `npm install konva-architecture-canvas`

---

## Why I Built This

I was tired of:
- Opening Draw.io for every architecture diagram
- Searching for cloud service icons
- Recreating the same components repeatedly
- Losing work when browser crashes

So I built a tool that:
- Integrates with Angular projects
- Has built-in cloud & AI/ML components
- Auto-saves everything
- Works offline

## Features

### 🎯 47+ Ready-to-Use Components

**AI Models**  
GPT-4, Claude, Llama, Gemini, Mistral, Cohere, etc.

**Vector Databases**  
Pinecone, Weaviate, Milvus, Chroma, pgVector, Neon

**Agent Frameworks**  
LangChain, AutoGen, CrewAI, LlamaIndex, Semantic Kernel

**Observability**  
Langfuse, Comet Opik, DataDog, Grafana, Arize Phoenix

**And more**: Tool execution, memory systems, cloud services

### 🎨 Professional Drawing Tools

- Basic shapes (rectangle, circle, arrow, line)
- Text annotations
- Free-hand pen tool
- Color customization (stroke & fill)
- Opacity controls

### 📦 Smart Grouping

- Multi-level nested groups
- Color-coded by hierarchy (purple → red → orange → green → blue)
- Drag groups as single units
- Perfect for organizing complex architectures

### 💾 Export & Save

- **PNG** - High-quality images for docs
- **JSON** - Version control your diagrams
- **Templates** - Save and reuse common patterns
- **Auto-save** - Never lose work

## Tech Stack

- **Angular 21** - Modern reactive framework
- **Konva.js** - High-performance canvas library
- **TypeScript** - Type-safe diagram structures
- **RxJS** - Reactive state management

## Quick Start

### Installation

```bash
npm install konva-architecture-canvas konva
```

### Usage

```typescript
import { Component } from '@angular/core';
import { KonvaCanvasMainComponent } from 'konva-architecture-canvas';

@Component({
  selector: 'app-diagram',
  standalone: true,
  imports: [KonvaCanvasMainComponent],
  template: `
    <lib-konva-canvas-main 
      style="display:block;width:100%;height:100vh">
    </lib-konva-canvas-main>
  `
})
export class DiagramComponent {}
```

That's it! You get:
- Left sidebar with 47+ components
- Drawing tools toolbar
- Color/style panel
- Zoom/pan controls
- Keyboard shortcuts

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+G` | Group selected items |
| `Cmd+Z` | Undo |
| `Cmd+Shift+Z` | Redo |
| `V`, `R`, `C`, `L`, `A` | Tool selection |
| `Space + Drag` | Pan canvas |
| `Delete` | Delete selected |

## Cool Implementation Details

### 1. Auto-Colored Groups

Groups automatically get colored borders based on nesting depth:

```typescript
function getGroupColor(level: number): string {
  const colors = ['#9b59b6', '#e74c3c', '#f39c12', '#27ae60', '#3498db'];
  return colors[level % colors.length];
}
```

### 2. High-Quality Exports

Export with 2x pixel ratio for retina displays:

```typescript
exportToPNG(scale: number = 2): void {
  const dataURL = this.stage.toDataURL({
    pixelRatio: scale,
    mimeType: 'image/png',
    quality: 1.0
  });
  this.downloadImage(dataURL);
}
```

### 3. Icon Caching

Dynamic icon loading with caching for performance:

```typescript
private iconCache = new Map<string, string>();

async loadIcon(name: string): Promise<string> {
  return this.iconCache.get(name) ?? 
         await this.fetchAndCache(name);
}
```

## Use Cases

### 1. RAG Architecture
Drag GPT-4, Pinecone, and API Gateway to visualize your RAG chatbot.

### 2. Microservices
Use grouping to organize services by domain.

### 3. Cloud Infrastructure
Build AWS/Azure/GCP architectures visually.

### 4. System Design Interviews
Quickly sketch solutions during technical interviews.

## What's Different from Draw.io?

| Feature | Konva Canvas | Draw.io |
|---------|-------------|---------|
| **Tech Stack** | Angular component | Standalone app |
| **Components** | 47+ built-in | Manual search |
| **Focus** | Cloud & AI/ML | General purpose |
| **Keyboard Shortcuts** | Developer-friendly | Limited |
| **Export** | PNG, JSON, SVG | Many formats |
| **License** | MIT (open source) | Apache 2.0 |
| **Integration** | npm package | iframe embed |

## Performance

- **Initial Load**: ~2-3 seconds (icon loading)
- **60 FPS** dragging/zooming with 50+ components
- **Bundle Size**: ~680KB (gzipped)
- **Memory**: ~50MB for typical diagram

## Roadmap

- [ ] Real-time collaboration
- [ ] Cloud sync
- [ ] VS Code extension
- [ ] Export to Terraform/CDK
- [ ] AI-powered auto-layout
- [ ] Custom component creator

## Try It!

🚀 **Live Demo**: [https://samba425.github.io/konva-architecture-canvas/](https://samba425.github.io/konva-architecture-canvas/)

📦 **npm**: `npm install konva-architecture-canvas`

⭐ **GitHub**: [samba425/konva-architecture-canvas](https://github.com/samba425/konva-architecture-canvas)

---

## Questions?

Drop them in the comments! I'd love to hear:
- What features would you like?
- What cloud services should I add?
- Any bugs or issues?

If you find this useful, a GitHub star would be awesome! ⭐

---

**Follow me for more dev tool content!**

#angular #javascript #typescript #canvas #devtools #opensource #cloudarchitecture #ai #ml
