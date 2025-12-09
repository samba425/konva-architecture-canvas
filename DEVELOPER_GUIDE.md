# Developer Guide 🛠️

**Complete guide for developing, extending, and maintaining the Architecture Builder application.**

---

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [Architecture Overview](#architecture-overview)
3. [Core Concepts](#core-concepts)
4. [Component Development](#component-development)
5. [Adding Features](#adding-features)
6. [Styling Guide](#styling-guide)
7. [Performance Optimization](#performance-optimization)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)
11. [Best Practices](#best-practices)
12. [API Reference](#api-reference)

---

## Environment Setup

### Prerequisites

```bash
# Required versions
Node.js: >= 18.x (LTS recommended)
npm: >= 10.x
Git: Latest
IDE: VS Code (recommended)
```

### Initial Setup

```bash
# Clone repository
git clone https://github.com/demo/architecture-builder.git
cd architecture-builder

# Install dependencies
npm install

# Start dev server
npm start

# Open browser
# http://localhost:4200
```

### VS Code Extensions

Recommended extensions for optimal development:

```json
{
  "recommendations": [
    "angular.ng-template",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "johnpapa.angular2"
  ]
}
```

### Environment Variables

Create `.env` file (optional):

```env
PORT=4200
NODE_ENV=development
```

---

## Architecture Overview

### Technology Stack

```
┌─────────────────────────────────────┐
│         User Interface (Browser)     │
├─────────────────────────────────────┤
│   Angular 21 (Signals, Standalone)  │
├─────────────────────────────────────┤
│   Konva.js 10 (Canvas Rendering)    │
├─────────────────────────────────────┤
│   TypeScript 5.9 (Type Safety)      │
├─────────────────────────────────────┤
│   RxJS 7.8 (Reactive Programming)   │
└─────────────────────────────────────┘
```

### Application Architecture

```
┌───────────────────────────────────────────────────┐
│                   App Component                    │
│                  (Root Container)                  │
└───────────────────────────────────────────────────┘
                        │
┌───────────────────────┴───────────────────────────┐
│                                                    │
│           Konva Canvas Main Component              │
│                                                    │
├──────────┬────────────┬────────────┬──────────────┤
│          │            │            │              │
│ Left     │  Canvas    │   Top      │    Right     │
│ Sidebar  │   Area     │  Toolbar   │    Panel     │
│          │            │            │              │
│ ┌──────┐ │ ┌────────┐ │ ┌────────┐ │ ┌──────────┐│
│ │Search│ │ │ Stage  │ │ │ Tools  │ │ │  Color   ││
│ ├──────┤ │ ├────────┤ │ ├────────┤ │ ├──────────┤│
│ │Categ.│ │ │ Layers │ │ │Shapes  │ │ │ Opacity  ││
│ ├──────┤ │ │  ├Grid │ │ │  ├Rect │ │ ├──────────┤│
│ │Comps.│ │ │  ├Main │ │ │  ├Circ │ │ │  Width   ││
│ └──────┘ │ │  └Trans│ │ │  └Line │ │ └──────────┘│
└──────────┴─┴────────┴─┴────────┴─┴──────────────┘
```

### Data Flow

```
User Interaction
    ↓
Event Handler (Angular)
    ↓
Signal Update (Reactive State)
    ↓
Konva API Call
    ↓
Layer Update
    ↓
Canvas Re-render
    ↓
Visual Feedback
```

---

## Core Concepts

### 1. Konva.js Basics

**Stage**: Root container
```typescript
this.stage = new Konva.Stage({
  container: 'container',
  width: window.innerWidth,
  height: window.innerHeight,
  draggable: true  // For panning
});
```

**Layer**: Drawing surface
```typescript
this.layer = new Konva.Layer();
this.stage.add(this.layer);
```

**Shapes**: Visual elements
```typescript
const rect = new Konva.Rect({
  x: 100,
  y: 100,
  width: 200,
  height: 100,
  fill: 'blue',
  stroke: 'black',
  strokeWidth: 2,
  draggable: true
});
this.layer.add(rect);
```

**Groups**: Container for multiple shapes
```typescript
const group = new Konva.Group({
  x: 50,
  y: 50,
  draggable: true,
  name: 'user-group'
});
group.add(rect);
group.add(text);
```

**Transformer**: Selection/resize handles
```typescript
this.transformer = new Konva.Transformer({
  borderStroke: '#3b82f6',
  borderStrokeWidth: 3,
  anchorSize: 14
});
this.layer.add(this.transformer);

// Attach to shape
this.transformer.nodes([shape]);
```

### 2. Angular Signals

**Creating Signals:**
```typescript
// Read-write signal
currentTool = signal<Tool>('select');

// Read-only computed signal
selectedCount = computed(() => 
  this.transformer.nodes().length
);
```

**Using Signals:**
```typescript
// Get value
const tool = this.currentTool();

// Set value
this.currentTool.set('rect');

// Update based on current
this.currentTool.update(tool => 
  tool === 'select' ? 'rect' : 'select'
);
```

**In Templates:**
```html
<div>Current tool: {{ currentTool() }}</div>
<button (click)="currentTool.set('rect')">Rectangle</button>
```

### 3. Component Library System

**Component Definition:**
```typescript
interface ComponentDefinition {
  id: string;
  name: string;
  icon: string;          // Emoji
  faIcon?: string;       // Font Awesome class
  color: string;         // Hex color
  description: string;
  provider: string;
  category: string;
}
```

**Component Categories:**
```typescript
interface Category {
  id: string;
  name: string;
  icon: string;
  collapsed: boolean;
  components: ComponentDefinition[];
}
```

**Loading Components:**
```typescript
private loadComponentsFromConfig(): void {
  const categories = COMPONENT_CATEGORIES.map(cat => ({
    ...cat,
    collapsed: false,
    components: COMPONENTS.filter(c => c.category === cat.id)
  }));
  this.categories.set(categories);
}
```

### 4. Grouping System

**Creating Groups:**
```typescript
groupSelected(): void {
  const selectedNodes = this.transformer.nodes();
  
  // Create group
  const newGroup = new Konva.Group({
    draggable: true,
    name: 'user-group'
  });
  
  // Move nodes into group
  selectedNodes.forEach(node => {
    const absPos = node.getAbsolutePosition();
    node.remove();
    node.x(absPos.x - minX);
    node.y(absPos.y - minY);
    node.draggable(false);
    node.listening(false);
    newGroup.add(node);
  });
  
  // Add visual border
  const border = new Konva.Rect({
    stroke: '#9333ea',
    strokeWidth: 2,
    dash: [8, 4],
    listening: false,
    name: 'group-border'
  });
  newGroup.add(border);
  border.moveToBottom();
  
  this.layer.add(newGroup);
}
```

**Nested Groups:**
- Each level gets different border color
- Colors cycle: Purple → Red → Orange → Green → Blue → Violet

### 5. Export/Import System

**Export Format:**
```json
{
  "version": "1.0",
  "created": "2025-12-04T00:00:00.000Z",
  "canvas": {
    "width": 1200,
    "height": 800,
    "scale": 1,
    "position": { "x": 0, "y": 0 }
  },
  "shapes": [
    {
      "id": "node-1",
      "type": "Group",
      "x": 100,
      "y": 100,
      "rotation": 0,
      "groupType": "component-group",
      "componentIcon": "🔥",
      "componentName": "AWS EC2"
    }
  ]
}
```

**Export Method:**
```typescript
exportToJSON(): void {
  const shapes = this.layer.children
    .filter(child => child.getClassName() !== 'Transformer')
    .map(shape => this.exportNodeRecursive(shape));
  
  const data = {
    version: '1.0',
    created: new Date().toISOString(),
    canvas: {
      width: this.stage.width(),
      height: this.stage.height(),
      scale: this.stage.scaleX(),
      position: this.stage.position()
    },
    shapes
  };
  
  // Download JSON
  const blob = new Blob([JSON.stringify(data, null, 2)], 
    { type: 'application/json' });
  // ... download logic
}
```

---

## Component Development

### Creating a New Drawing Tool

**Step 1: Add Tool Type**

```typescript
// In konva-canvas-main.component.ts
type Tool = 'select' | 'rect' | 'circle' | 'line' | 
            'arrow' | 'pen' | 'text' | 'triangle'; // Add new
```

**Step 2: Create Tool Methods**

```typescript
private startDrawingTriangle(pos: { x: number; y: number }): void {
  this.currentShape = new Konva.Line({
    points: [pos.x, pos.y, pos.x, pos.y, pos.x, pos.y],
    closed: true,
    stroke: this.hexToRgba(this.strokeColor(), this.strokeOpacity() / 100),
    strokeWidth: this.strokeWidth(),
    fill: this.fillStyle() !== 'none' 
      ? this.hexToRgba(this.fillColor(), this.fillOpacity() / 100) 
      : undefined,
    draggable: true
  });
  this.layer.add(this.currentShape);
}

private updateTriangle(pos: { x: number; y: number }): void {
  if (!this.currentShape) return;
  
  const points = this.currentShape.points();
  const startX = points[0];
  const startY = points[1];
  
  // Calculate triangle points
  const newPoints = [
    startX, startY,                    // Top
    pos.x, pos.y,                      // Bottom right
    startX - (pos.x - startX), pos.y   // Bottom left
  ];
  
  this.currentShape.points(newPoints);
}
```

**Step 3: Add Event Handlers**

```typescript
private setupEventHandlers(): void {
  this.stage.on('mousedown touchstart', (e) => {
    if (this.currentTool() === 'triangle') {
      this.startDrawingTriangle(pos);
    }
  });
  
  this.stage.on('mousemove touchmove', (e) => {
    if (this.currentTool() === 'triangle') {
      this.updateTriangle(pos);
    }
  });
}
```

**Step 4: Add UI Button**

```html
<!-- In template -->
<button 
  class="tool-btn"
  [class.active]="currentTool() === 'triangle'"
  (click)="setTool('triangle')"
  title="Triangle"
>
  <i class="fa fa-triangle"></i>
</button>
```

### Adding a New Component Category

**Step 1: Define Category**

```typescript
// In components-data.ts
export const DATABASES_CATEGORY = {
  id: 'databases',
  name: 'Databases',
  icon: 'fa-database',
  collapsed: false
};
```

**Step 2: Add Components**

```typescript
// In components-config.ts
export const MONGODB: ComponentDefinition = {
  id: 'mongodb',
  name: 'MongoDB',
  icon: '🍃',
  faIcon: 'fa-leaf',
  color: '#47A248',
  description: 'NoSQL document database',
  provider: 'MongoDB Inc.',
  category: 'databases'
};

export const POSTGRESQL: ComponentDefinition = {
  id: 'postgresql',
  name: 'PostgreSQL',
  icon: '🐘',
  faIcon: 'fa-database',
  color: '#336791',
  description: 'Relational database',
  provider: 'PostgreSQL',
  category: 'databases'
};
```

**Step 3: Register Category & Components**

```typescript
// In components-data.ts
export const COMPONENT_CATEGORIES = [
  // ...existing categories
  DATABASES_CATEGORY
];

// In components-config.ts
export const COMPONENTS: ComponentItem[] = [
  // ...existing components
  MONGODB,
  POSTGRESQL
];
```

Components appear automatically in sidebar!

---

## Adding Features

### Feature: Snap to Grid

**Step 1: Add Configuration**

```typescript
private readonly GRID_SIZE = 20;
private readonly SNAP_THRESHOLD = 10;
```

**Step 2: Implement Snap Function**

```typescript
private snapToGrid(pos: { x: number; y: number }): { x: number; y: number } {
  return {
    x: Math.round(pos.x / this.GRID_SIZE) * this.GRID_SIZE,
    y: Math.round(pos.y / this.GRID_SIZE) * this.GRID_SIZE
  };
}
```

**Step 3: Apply on Drag**

```typescript
shape.on('dragmove', () => {
  const pos = shape.position();
  const snapped = this.snapToGrid(pos);
  shape.position(snapped);
});
```

**Step 4: Add Toggle UI**

```typescript
snapToGrid = signal<boolean>(false);
```

```html
<button (click)="snapToGrid.set(!snapToGrid())">
  <i [class.active]="snapToGrid()">Snap to Grid</i>
</button>
```

### Feature: Alignment Tools

**Implementation:**

```typescript
alignLeft(): void {
  const nodes = this.transformer.nodes();
  if (nodes.length < 2) return;
  
  // Find leftmost x position
  const minX = Math.min(...nodes.map(n => n.x()));
  
  // Align all nodes to that x
  nodes.forEach(node => node.x(minX));
  
  this.layer.batchDraw();
  this.saveHistory();
}

alignTop(): void {
  const nodes = this.transformer.nodes();
  if (nodes.length < 2) return;
  
  const minY = Math.min(...nodes.map(n => n.y()));
  nodes.forEach(node => node.y(minY));
  
  this.layer.batchDraw();
  this.saveHistory();
}

distributeHorizontally(): void {
  const nodes = this.transformer.nodes();
  if (nodes.length < 3) return;
  
  // Sort by x position
  const sorted = [...nodes].sort((a, b) => a.x() - b.x());
  
  const first = sorted[0].x();
  const last = sorted[sorted.length - 1].x();
  const gap = (last - first) / (sorted.length - 1);
  
  sorted.forEach((node, i) => {
    node.x(first + (gap * i));
  });
  
  this.layer.batchDraw();
  this.saveHistory();
}
```

---

## Styling Guide

### CSS Architecture

```
styles.css (Global)
    ↓
component.css (Scoped)
    ↓
Inline Styles (Dynamic)
```

### Theme System

**CSS Variables:**

```css
:root {
  /* Dark Theme */
  --primary-dark: #1a1d29;
  --secondary-dark: #252936;
  --accent-blue: #4a9eff;
  --text-light: #e4e6eb;
  --text-muted: #8b92a8;
  --border-color: #3a3f51;
  
  /* Light Theme */
  --primary-light: #ffffff;
  --secondary-light: #f5f5f5;
  --accent-blue-light: #2196f3;
  --text-dark: #1a1a1a;
  --text-muted-light: #666666;
  --border-color-light: #e0e0e0;
}
```

**Theme Toggle:**

```typescript
isDarkTheme = signal<boolean>(true);

toggleTheme(): void {
  this.isDarkTheme.update(v => !v);
  this.drawInfiniteGrid(); // Update grid color
  this.updateCanvasBackground();
}
```

**Theme-Aware Styles:**

```css
.panel {
  background: var(--secondary-dark);
  color: var(--text-light);
}

.light-theme .panel {
  background: var(--secondary-light);
  color: var(--text-dark);
}
```

### Component Styling Best Practices

1. **Use CSS Variables** for theming
2. **Scope Styles** to component
3. **Avoid !important** unless absolutely necessary
4. **Use BEM Naming**: `.block__element--modifier`
5. **Mobile First**: Start with mobile, add desktop

**Example:**

```css
/* Component: sidebar */
.sidebar {
  /* Block */
  width: 280px;
  background: var(--secondary-dark);
}

.sidebar__header {
  /* Element */
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.sidebar__item--active {
  /* Modifier */
  background: var(--accent-blue);
  color: white;
}
```

---

## Performance Optimization

### 1. Canvas Performance

**Use Layer Caching:**

```typescript
// Cache expensive renders
this.layer.cache();
this.layer.batchDraw();
```

**Limit Transformer Nodes:**

```typescript
// Don't select too many at once
if (this.transformer.nodes().length > 50) {
  alert('Too many items selected. Max 50.');
  return;
}
```

**Optimize Grid Drawing:**

```typescript
// Only draw visible grid lines
private drawInfiniteGrid(): void {
  const scale = this.stage.scaleX();
  const step = this.GRID_SIZE * scale;
  
  // Calculate visible area only
  const startX = -this.stage.x() / scale;
  const startY = -this.stage.y() / scale;
  const endX = startX + (this.stage.width() / scale);
  const endY = startY + (this.stage.height() / scale);
  
  // Draw only visible lines
  // ...
}
```

### 2. Icon Caching

**localStorage Cache:**

```typescript
private iconCache: Map<string, string> = new Map();

private loadIconCacheFromStorage(): void {
  try {
    const cached = localStorage.getItem('iconCache');
    if (cached) {
      this.iconCache = new Map(JSON.parse(cached));
    }
  } catch (error) {
    console.error('Failed to load icon cache:', error);
  }
}

private saveIconCacheToStorage(): void {
  try {
    const data = JSON.stringify(Array.from(this.iconCache.entries()));
    localStorage.setItem('iconCache', data);
  } catch (error) {
    console.error('Failed to save icon cache:', error);
  }
}
```

### 3. Event Handler Optimization

**Debounce Expensive Operations:**

```typescript
import { debounceTime } from 'rxjs';

// Debounce search
this.searchQuery$
  .pipe(debounceTime(300))
  .subscribe(query => {
    this.filterComponents(query);
  });
```

**Use Event Delegation:**

```typescript
// Instead of adding handler to each item
// Add one handler to parent
this.stage.on('click', (e) => {
  const target = e.target;
  if (target.hasName('component-group')) {
    this.handleComponentClick(target);
  }
});
```

---

## Testing

### Unit Testing with Vitest

**Test Component Method:**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { KonvaCanvasMainComponent } from './konva-canvas-main.component';

describe('KonvaCanvasMainComponent', () => {
  let component: KonvaCanvasMainComponent;
  
  beforeEach(() => {
    component = new KonvaCanvasMainComponent();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should initialize with select tool', () => {
    expect(component.currentTool()).toBe('select');
  });
  
  it('should group selected nodes', () => {
    // Setup
    const rect1 = new Konva.Rect({ x: 0, y: 0 });
    const rect2 = new Konva.Rect({ x: 100, y: 100 });
    component.transformer.nodes([rect1, rect2]);
    
    // Execute
    component.groupSelected();
    
    // Assert
    expect(component.layer.children.length).toBe(1);
    expect(component.layer.children[0].getClassName()).toBe('Group');
  });
});
```

### E2E Testing

```typescript
// cypress/e2e/canvas.cy.ts
describe('Canvas Operations', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  
  it('should add component to canvas', () => {
    cy.get('.service-item').first().trigger('dragstart');
    cy.get('.canvas-wrapper').trigger('drop');
    cy.get('.konva-content').should('exist');
  });
  
  it('should group items', () => {
    // Add two items
    cy.get('.service-item').eq(0).drag('.canvas-wrapper');
    cy.get('.service-item').eq(1).drag('.canvas-wrapper');
    
    // Select both
    cy.get('canvas').click({ shiftKey: true, x: 100, y: 100 });
    cy.get('canvas').click({ shiftKey: true, x: 200, y: 200 });
    
    // Group
    cy.get('body').type('{cmd}g');
    
    // Verify border exists
    cy.get('.group-border').should('exist');
  });
});
```

---

## Deployment

### Production Build

```bash
# Build for production
npm run build

# Output: dist/architecture-builder/browser/
# - main.js (bundled app)
# - styles.css (bundled styles)
# - index.html (entry point)
```

### Docker Deployment

**Dockerfile:**

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist/architecture-builder/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build & Run:**

```bash
docker build -t architecture-builder .
docker run -p 8080:80 architecture-builder
```

### Nginx Configuration

```nginx
server {
  listen 80;
  server_name localhost;
  root /usr/share/nginx/html;
  index index.html;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
  
  # Cache static assets
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

---

## Troubleshooting

### Common Issues

**Issue: Canvas not rendering**

Solution:
```typescript
// Ensure container exists
ngAfterViewInit(): void {
  if (!this.containerRef) {
    console.error('Container not found');
    return;
  }
  this.initKonva();
}
```

**Issue: Performance slow**

Solutions:
1. Reduce transformer nodes (max 50)
2. Use layer caching
3. Optimize grid drawing
4. Debounce events

**Issue: Export fails**

Solution:
```typescript
exportToJSON(): void {
  try {
    const data = this.generateExportData();
    const json = JSON.stringify(data, null, 2);
    this.downloadJSON(json);
  } catch (error) {
    console.error('Export failed:', error);
    alert('Export failed. Check console for details.');
  }
}
```

---

## Best Practices

### Code Organization

1. **Group Related Functions**
2. **Use Private Methods**
3. **Document Complex Logic**
4. **Keep Methods Small** (< 50 lines)
5. **Use Meaningful Names**

### State Management

1. **Use Signals** for reactive state
2. **Avoid Direct DOM Manipulation**
3. **Batch Updates** with `batchDraw()`
4. **Save History** after operations

### Error Handling

```typescript
try {
  this.performOperation();
} catch (error) {
  console.error('Operation failed:', error);
  this.showErrorMessage('Operation failed. Please try again.');
}
```

---

## API Reference

### Main Component Methods

#### Selection
- `addSelectionHighlight(node)` - Add blue glow
- `removeSelectionHighlight(node)` - Remove glow
- `selectAll()` - Select all items

#### Drawing
- `startDrawingRect(pos)` - Begin rectangle
- `startDrawingCircle(pos)` - Begin circle
- `startDrawingLine(pos, isArrow)` - Begin line/arrow
- `startDrawingPen(pos)` - Begin freehand

#### Grouping
- `groupSelected()` - Create group from selection
- `ungroupSelected()` - Break apart group

#### History
- `saveHistory()` - Save current state
- `undo()` - Undo last operation
- `redo()` - Redo last undo

#### Export/Import
- `exportToJSON()` - Download JSON
- `importFromJSON()` - Load JSON

---

## Changelog

### Version 1.0.0 (2025-12-04)

**Added:**
- Complete canvas system with Konva.js
- 47+ pre-built components
- Hierarchical grouping
- Stroke/fill color system
- Export/import functionality
- Keyboard shortcuts
- Sample architectures

**Changed:**
- Removed unused packages (Bootstrap, React types, etc.)
- Optimized build size
- Improved performance

**Fixed:**
- Group selection issues
- Transformer visibility
- Color application to groups
- Export/import for nested groups

---

**Need Help?** Open an issue or contact asambasi@demo.com

**Contributing?** See [CONTRIBUTING.md](CONTRIBUTING.md)

**License:** MIT - see [LICENSE](LICENSE)
