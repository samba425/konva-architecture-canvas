# Building a Visual Architecture Diagram Tool with Angular and Konva.js

## How I Created a Professional Drag-and-Drop Canvas with 47+ Pre-Built Components

![Architecture Canvas Banner](https://via.placeholder.com/1200x600/1a1a2e/00ff00?text=Architecture+Canvas)

*Published on December 5, 2025*

---

## The Problem I Wanted to Solve

As a developer working with cloud architectures and AI/ML systems, I found myself constantly needing to create architecture diagrams for:

- **Documentation** - Explaining system designs to team members
- **Presentations** - Pitching technical solutions to stakeholders
- **Design reviews** - Planning new features and infrastructure
- **System design interviews** - Visualizing solutions quickly

Tools like Draw.io and Lucidchart are great, but I wanted something:
- ✅ **Integrated with my Angular stack**
- ✅ **Focused on cloud and AI/ML components**
- ✅ **Fast and keyboard-driven**
- ✅ **Free and open-source**

So I built **Konva Architecture Canvas**.

## What It Does

Konva Architecture Canvas is an Angular component that provides a professional diagram builder with:

### 🎯 47+ Pre-Built Components
Instead of searching for cloud service icons, you get ready-made components for:
- **AI Models**: GPT-4, Claude, Llama, Gemini, Mistral
- **Vector Databases**: Pinecone, Weaviate, Milvus, Chroma
- **Agent Frameworks**: LangChain, AutoGen, CrewAI, LlamaIndex
- **Cloud Services**: AWS, Azure, GCP infrastructure
- **Observability**: Grafana, DataDog, Langfuse, Arize Phoenix

### 🎨 Professional Drawing Tools
- Shapes (rectangles, circles, arrows, lines)
- Text annotations
- Free-hand pen tool
- Color and styling controls
- Multi-selection and grouping

### 🔗 Smart Connections
- Auto-routing arrows between components
- Bezier curves
- Multiple connection styles
- Label support

### 💾 Save & Export
- Export to PNG for documentation
- Save as JSON to version control
- Import/export full architectures
- Custom template system

## The Tech Stack

I chose these technologies for specific reasons:

### Angular 21
- **Why?** Modern framework with great TypeScript support
- **Benefit**: Reactive updates and component-based architecture
- **Trade-off**: Could have used React, but I wanted standalone components

### Konva.js
- **Why?** High-performance canvas library
- **Benefit**: Smooth drag-and-drop, zoom, and pan
- **Trade-off**: Larger bundle size than pure Canvas API, but worth it for the DX

### TypeScript
- **Why?** Type safety for complex diagram structures
- **Benefit**: Catch errors at compile time
- **Trade-off**: Slightly more verbose, but saves debugging time

## Key Implementation Decisions

### 1. Component System Architecture

I built a plugin-based component system where each component is defined by:

```typescript
interface ComponentItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  color?: string;
  metadata?: Record<string, any>;
}
```

This makes it easy to add new components without changing core code.

### 2. Grouping System

One of the trickiest features was nested grouping. I implemented a 5-level hierarchy with automatic color coding:

- **Level 1**: Purple border
- **Level 2**: Red border
- **Level 3**: Orange border
- **Level 4**: Green border
- **Level 5**: Blue border

This gives instant visual feedback about architecture depth.

```typescript
function getGroupBorderColor(level: number): string {
  const colors = ['#9b59b6', '#e74c3c', '#f39c12', '#27ae60', '#3498db'];
  return colors[level % colors.length];
}
```

### 3. Auto-Save with LocalStorage

Lost work is frustrating, so I implemented auto-save:

```typescript
private autoSave(): void {
  const diagram = this.exportToJSON();
  localStorage.setItem('architecture-autosave', JSON.stringify(diagram));
}

// Called on every change with debouncing
private debouncedAutoSave = debounce(this.autoSave.bind(this), 2000);
```

### 4. Keyboard Shortcuts

Power users need keyboard shortcuts. I implemented:
- `Cmd+G` - Group selected items
- `Cmd+Z` / `Cmd+Shift+Z` - Undo/Redo
- `V`, `R`, `C`, `L`, `A` - Tool selection
- `Space + Drag` - Pan canvas
- `Delete` - Delete selected

## Challenges I Faced

### Challenge 1: Icon Loading Performance
**Problem**: Loading 47+ component icons was slow.

**Solution**: 
- Used Iconify for dynamic icon loading
- Implemented icon caching
- Lazy-loaded categories

```typescript
private iconCache = new Map<string, string>();

async loadIcon(name: string): Promise<string> {
  if (this.iconCache.has(name)) {
    return this.iconCache.get(name)!;
  }
  const icon = await fetchIcon(name);
  this.iconCache.set(name, icon);
  return icon;
}
```

### Challenge 2: Export Quality
**Problem**: Exported PNGs were low quality.

**Solution**: 
- Set pixelRatio to 2 for retina displays
- Allow custom export dimensions
- Support transparent backgrounds

```typescript
exportToPNG(scale: number = 2): void {
  const dataURL = this.stage.toDataURL({
    pixelRatio: scale,
    mimeType: 'image/png',
    quality: 1.0
  });
  this.downloadImage(dataURL, 'architecture.png');
}
```

### Challenge 3: Undo/Redo Implementation
**Problem**: Managing state history was complex.

**Solution**: 
- Implemented a command pattern
- Created a history stack
- Serialized state as JSON for each action

```typescript
private history: DiagramState[] = [];
private historyIndex: number = -1;

saveState(): void {
  const state = this.serializeState();
  this.history = this.history.slice(0, this.historyIndex + 1);
  this.history.push(state);
  this.historyIndex++;
}

undo(): void {
  if (this.historyIndex > 0) {
    this.historyIndex--;
    this.restoreState(this.history[this.historyIndex]);
  }
}
```

## Publishing as an NPM Package

To make it reusable, I published it as an npm package:

```bash
npm install konva-architecture-canvas konva
```

### Using It in Your Project

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

That's it! You get a full-featured architecture canvas.

## Performance Optimizations

### 1. Virtual Scrolling for Components
With 47+ components, scrolling the sidebar needed optimization:

```typescript
// Use CDK Virtual Scroll
<cdk-virtual-scroll-viewport itemSize="80">
  <div *cdkVirtualFor="let component of filteredComponents">
    <component-card [component]="component"></component-card>
  </div>
</cdk-virtual-scroll-viewport>
```

### 2. Canvas Layer Management
Separated static and dynamic layers:
- **Background Layer**: Grid (rarely changes)
- **Component Layer**: Shapes and components
- **Interaction Layer**: Selection boxes, drag indicators

### 3. Event Debouncing
Debounced expensive operations:

```typescript
@HostListener('mousemove', ['$event'])
onMouseMove = debounce((event: MouseEvent) => {
  this.updateTooltip(event);
}, 16); // ~60fps
```

## What I Learned

### 1. Canvas Performance Matters
- Minimize layer redraws
- Use object pooling for temporary shapes
- Cache expensive calculations

### 2. Developer Experience is Key
- Good defaults reduce friction
- Keyboard shortcuts increase productivity
- Visual feedback builds confidence

### 3. Documentation Sells
- A great README gets more downloads
- Live demos are crucial
- Examples beat descriptions

## Try It Yourself

🚀 **Live Demo**: [https://samba425.github.io/konva-architecture-canvas/](https://samba425.github.io/konva-architecture-canvas/)

📦 **npm Package**: `npm install konva-architecture-canvas`

⭐ **GitHub**: [https://github.com/samba425/konva-architecture-canvas](https://github.com/samba425/konva-architecture-canvas)

## What's Next?

I'm working on:
- [ ] **Real-time collaboration** - Multiple users editing the same diagram
- [ ] **Custom component creator** - Upload your own icons and components
- [ ] **Cloud sync** - Save diagrams to the cloud
- [ ] **Export to Terraform/CDK** - Generate infrastructure code from diagrams
- [ ] **AI-powered layout** - Auto-arrange components for optimal readability

## Conclusion

Building Konva Architecture Canvas taught me that:
1. **Solve your own problems** - Build tools you actually need
2. **Open source wins** - Sharing creates opportunities
3. **Polish matters** - Small details make big differences

If you're building architecture diagrams for cloud or AI/ML systems, give it a try! And if you find it useful, a GitHub star would mean the world! ⭐

---

## About the Author

I'm a full-stack developer passionate about cloud architecture, AI/ML systems, and developer tools. Follow me for more articles on building developer productivity tools!

**Connect with me:**
- GitHub: [@samba425](https://github.com/samba425)
- Email: asiva325@gmail.com

---

*Have questions? Drop them in the comments! I'd love to hear how you're using architecture diagrams in your work.*

**Tags**: #Angular #TypeScript #Canvas #DeveloperTools #OpenSource #CloudArchitecture #AI #MachineLearning #Konva #WebDev
