import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID, signal, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Konva from 'konva';
import { COMPONENTS, COMPONENT_CATEGORIES, ComponentDefinition } from '../../data/components-config';

export interface ComponentCategory {
  id: string;
  name: string;
  icon: string;
  collapsed: boolean;
  components: ComponentItem[];
}

export interface ComponentItem {
  id: string;
  name: string;
  icon: string;
  faIcon?: string;
  category: string;
  description: string;
  color: string;
  provider?: string;
  definition?: string;
  learnMoreLink?: string;
}

export interface ShapeTemplate {
  id: string;
  name: string;
  type: 'geo' | 'custom';
  icon: string;
  svgPath?: string;
}

type Tool = 'select' | 'rectangle' | 'circle' | 'line' | 'arrow' | 'pen' | 'text' | 'eraser' | 'hand' | 'shape';
type FillStyle = 'solid' | 'hatch' | 'cross-hatch' | 'dotted' | 'none';
type SizePreset = 'small' | 'medium' | 'large' | 'xlarge';

@Component({
  selector: 'app-konva-canvas-main',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './konva-canvas-main.component.html',
  styleUrls: ['./konva-canvas-main.component.css']
})
export class KonvaCanvasMainComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: false }) containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('toolbar', { static: false }) toolbarRef!: ElementRef<HTMLDivElement>;
  @ViewChild('stylePanel', { static: false}) stylePanelRef!: ElementRef<HTMLDivElement>;
  @ViewChild('imageUpload', { static: false }) imageUploadRef!: ElementRef<HTMLInputElement>;
  
  private isBrowser: boolean;
  private stage!: Konva.Stage;
  private layer!: Konva.Layer;
  private gridLayer!: Konva.Layer;
  private transformer!: Konva.Transformer;
  private drawingLayer!: Konva.Layer;
  private currentShape: any = null;
  private isPaint = false;
  private lastLine: Konva.Line | null = null;
  private history: any[] = [];
  private historyStep = 0;
  private isPanning = false;
  private lastPointerPosition: { x: number; y: number } | null = null;
  private readonly gridSize = 50;
  
  // Icon cache for Font Awesome icons (similar to cytoscape implementation)
  private iconCache: Map<string, string> = new Map();
  private readonly ICON_CACHE_KEY = 'konva-iconify-cache';
  private readonly ICON_CACHE_VERSION = 'v1';
  
  // Draggable panel state
  private isDragging = false;
  private currentDragElement: HTMLElement | null = null;
  private dragOffset = { x: 0, y: 0 };
  
  // Shape picker position
  shapePickerPosition = { top: '80px', right: '16px' };
  
  // Signals for UI state
  sidebarOpen = signal(true);
  selectedCategory = signal<string>('ai-models');
  searchQuery = signal('');
  currentTool = signal<Tool>('select');
  isDarkTheme = signal(false); // Default to light theme (white)
  showGrid = signal(false); // Default to no grid
  
  // Style properties
  currentColor = signal('#3b82f6');
  colorOpacity = signal(100); // Color intensity/opacity from 0-100
  strokeWidth = signal(2);
  fillStyle = signal<FillStyle>('solid');
  sizePreset = signal<SizePreset>('medium');
  showShapePicker = signal(false);
  selectedShape = signal<string>('rectangle');
  strokePattern: 'solid' | 'dashed' | 'dotted' | 'none' = 'solid';
  
  // Text properties
  fontSize = signal(16);
  textAlign = signal<'left' | 'center' | 'right' | 'justify'>('left');
  
  // Available colors (16 colors for main panel)
  colors = [
    '#ffffff', '#d4d4d4', '#737373', '#171717',
    '#7c3aed', '#8b5cf6', '#6366f1', '#3b82f6',
    '#0ea5e9', '#06b6d4', '#eab308', '#f59e0b',
    '#10b981', '#22c55e', '#f43f5e', '#ef4444'
  ];
  
  // Compact colors for tldraw-style panel (12 colors in 4x3 grid)
  compactColors = [
    '#ffffff', '#a8a29e', '#7c3aed', '#8b5cf6',
    '#3b82f6', '#06b6d4', '#f59e0b', '#f97316',
    '#10b981', '#22c55e', '#fb7185', '#ef4444'
  ];
  
  // Shape templates library
  shapeTemplates: ShapeTemplate[] = [
    { id: 'rectangle', name: 'Rectangle', type: 'geo', icon: '▭' },
    { id: 'circle', name: 'Circle', type: 'geo', icon: '○' },
    { id: 'triangle', name: 'Triangle', type: 'geo', icon: '△' },
    { id: 'diamond', name: 'Diamond', type: 'geo', icon: '◇' },
    { id: 'ellipse', name: 'Ellipse', type: 'geo', icon: '⬭' },
    { id: 'hexagon', name: 'Hexagon', type: 'custom', icon: '⬡' },
    { id: 'pentagon', name: 'Pentagon', type: 'custom', icon: '⬟' },
    { id: 'trapezoid', name: 'Trapezoid', type: 'custom', icon: '⏢' },
    { id: 'star', name: 'Star', type: 'custom', icon: '☆' },
    { id: 'heart', name: 'Heart', type: 'custom', icon: '♡' },
    { id: 'cloud', name: 'Cloud', type: 'custom', icon: '☁' },
    { id: 'x-mark', name: 'X Mark', type: 'custom', icon: '✕' },
    { id: 'check', name: 'Check', type: 'custom', icon: '✓' },
    { id: 'arrow-left', name: 'Arrow Left', type: 'custom', icon: '←' },
    { id: 'arrow-up', name: 'Arrow Up', type: 'custom', icon: '↑' },
    { id: 'arrow-down', name: 'Arrow Down', type: 'custom', icon: '↓' },
    { id: 'arrow-right', name: 'Arrow Right', type: 'custom', icon: '→' },
  ];
  
  // Component categories with icons - loaded from config
  categories: ComponentCategory[] = [];
  
  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadComponentsFromConfig();
    this.loadIconCacheFromStorage();
  }
  
  /**
   * Load icon cache from localStorage
   */
  private loadIconCacheFromStorage(): void {
    if (!this.isBrowser) return;
    
    try {
      const cached = localStorage.getItem(this.ICON_CACHE_KEY);
      if (cached) {
        const cacheData = JSON.parse(cached);
        if (cacheData.version === this.ICON_CACHE_VERSION) {
          this.iconCache = new Map(Object.entries(cacheData.icons));
          console.log(`✅ Loaded ${this.iconCache.size} icons from localStorage cache`);
        } else {
          localStorage.removeItem(this.ICON_CACHE_KEY);
        }
      }
    } catch (error) {
      console.warn('Failed to load icon cache:', error);
    }
  }
  
  /**
   * Save icon cache to localStorage
   */
  private saveIconCacheToStorage(): void {
    if (!this.isBrowser) return;
    
    try {
      const cacheData = {
        version: this.ICON_CACHE_VERSION,
        icons: Object.fromEntries(this.iconCache),
        timestamp: Date.now()
      };
      localStorage.setItem(this.ICON_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save icon cache:', error);
    }
  }
  
  /**
   * Fetch icon from Iconify API (same as cytoscape implementation)
   */
  private async fetchIconFromIconify(faIcon: string): Promise<{ path: string, viewBox: string } | null> {
    if (!this.isBrowser) return null;
    
    // Check cache first
    if (this.iconCache.has(faIcon)) {
      return JSON.parse(this.iconCache.get(faIcon)!);
    }
    
    try {
      let iconifyIcon = '';
      let iconName = '';
      
      if (faIcon.startsWith('fab fa-')) {
        iconName = faIcon.replace('fab fa-', '');
        iconifyIcon = `fa6-brands:${iconName}`;
      } else if (faIcon.startsWith('fas fa-')) {
        iconName = faIcon.replace('fas fa-', '');
        const iconNameMap: { [key: string]: string } = {
          'project-diagram': 'diagram-project',
          'cogs': 'gears',
          'tachometer-alt': 'gauge'
        };
        iconName = iconNameMap[iconName] || iconName;
        iconifyIcon = `fa6-solid:${iconName}`;
      } else if (faIcon.startsWith('far fa-')) {
        iconName = faIcon.replace('far fa-', '');
        iconifyIcon = `fa6-regular:${iconName}`;
      } else {
        return null;
      }
      
      const url = `https://api.iconify.design/${iconifyIcon}.svg`;
      const response = await fetch(url);
      
      if (response.ok) {
        const svgText = await response.text();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');
        const pathElement = svgDoc.querySelector('path');
        
        if (svgElement && pathElement) {
          const viewBox = svgElement.getAttribute('viewBox') || '0 0 512 512';
          const path = pathElement.getAttribute('d') || '';
          const iconData = { path, viewBox };
          this.iconCache.set(faIcon, JSON.stringify(iconData));
          this.saveIconCacheToStorage();
          return iconData;
        }
      }
    } catch (error) {
      console.error('Error fetching icon:', error);
    }
    return null;
  }
  
  /**
   * Generate SVG data URL from Font Awesome icon
   */
  private async generateIconDataURL(faIcon: string, color: string): Promise<string> {
    const iconData = await this.fetchIconFromIconify(faIcon);
    
    if (!iconData) {
      // Fallback to simple circle
      return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><circle cx="24" cy="24" r="20" fill="${color}"/></svg>`)}`;
    }
    
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <svg x="6" y="6" width="36" height="36" viewBox="${iconData.viewBox}">
        <path d="${iconData.path}" fill="${color}"/>
      </svg>
    </svg>`;
    
    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  }
  
  private loadComponentsFromConfig(): void {
    // Convert the config data to our component structure
    const categoriesMap = new Map<string, ComponentCategory>();
    
    // Initialize categories from COMPONENT_CATEGORIES
    Object.entries(COMPONENT_CATEGORIES).forEach(([categoryId, categoryDef]) => {
      categoriesMap.set(categoryId, {
        id: categoryId,
        name: categoryDef.name,
        icon: categoryDef.icon,
        collapsed: false,
        components: []
      });
    });
    
    // Add components to their respective categories
    Object.values(COMPONENTS).forEach((comp: ComponentDefinition) => {
      const category = categoriesMap.get(comp.category);
      if (category) {
        category.components.push({
          id: comp.id,
          name: comp.name,
          icon: comp.icon,
          faIcon: comp.faIcon,
          category: comp.category,
          description: comp.description,
          color: comp.color,
          provider: comp.provider,
          definition: comp.definition,
          learnMoreLink: comp.learnMoreLink
        });
      }
    });
    
    // Convert to array and sort by order
    this.categories = Array.from(categoriesMap.values())
      .sort((a, b) => {
        const orderA = COMPONENT_CATEGORIES[a.id as keyof typeof COMPONENT_CATEGORIES]?.order || 999;
        const orderB = COMPONENT_CATEGORIES[b.id as keyof typeof COMPONENT_CATEGORIES]?.order || 999;
        return orderA - orderB;
      })
      .filter(cat => cat.components.length > 0); // Only include categories with components
  }
  
  ngOnInit(): void {
    console.log('Konva Canvas initialized');
  }
  
  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    setTimeout(() => {
      this.initKonva();
      this.initDraggablePanels();
    }, 100);
  }
  
  private initDraggablePanels(): void {
    // Make toolbar draggable
    if (this.toolbarRef?.nativeElement) {
      this.makeDraggable(this.toolbarRef.nativeElement);
    }
    
    // Make style panel draggable
    if (this.stylePanelRef?.nativeElement) {
      this.makeDraggable(this.stylePanelRef.nativeElement);
    }
    
    // Ensure style panel is visible on init
    setTimeout(() => {
      this.adjustStylePanelPosition();
    }, 100);
  }
  
  private makeDraggable(element: HTMLElement): void {
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;
    
    const dragStart = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      // Only allow dragging from the drag handle or the panel itself (not buttons)
      if (target.classList.contains('panel-drag-handle') || 
          target === element ||
          target.classList.contains('draggable-panel')) {
        
        const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        
        initialX = clientX - element.offsetLeft;
        initialY = clientY - element.offsetTop;
        
        isDragging = true;
        element.classList.add('dragging');
        e.preventDefault();
      }
    };
    
    const drag = (e: MouseEvent | TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        
        const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        
        currentX = clientX - initialX;
        currentY = clientY - initialY;
        
        // Keep within viewport bounds
        const maxX = window.innerWidth - element.offsetWidth;
        const maxY = window.innerHeight - element.offsetHeight;
        
        currentX = Math.max(0, Math.min(currentX, maxX));
        currentY = Math.max(0, Math.min(currentY, maxY));
        
        element.style.left = currentX + 'px';
        element.style.top = currentY + 'px';
        element.style.right = 'auto';
      }
    };
    
    const dragEnd = () => {
      isDragging = false;
      element.classList.remove('dragging');
    };
    
    element.addEventListener('mousedown', dragStart);
    element.addEventListener('touchstart', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);
  }
  
  private initKonva(): void {
    const container = this.containerRef?.nativeElement;
    if (!container) return;
    
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    // Create stage
    this.stage = new Konva.Stage({
      container: container,
      width: width,
      height: height,
      draggable: false
    });
    
    // Create grid layer first (background)
    this.gridLayer = new Konva.Layer();
    this.stage.add(this.gridLayer);
    
    // Create main layer
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    
    // Create drawing layer for temp shapes
    this.drawingLayer = new Konva.Layer();
    this.stage.add(this.drawingLayer);
    
    // Create transformer for shape manipulation
    this.transformer = new Konva.Transformer({
      borderStroke: '#667eea',
      borderStrokeWidth: 2,
      anchorFill: '#667eea',
      anchorStroke: '#2a2a2a',
      anchorSize: 12,
      rotateEnabled: true,
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    });
    this.layer.add(this.transformer);
    
    // Add infinite grid background
    this.drawInfiniteGrid();
    
    // Update grid on stage move and zoom
    this.stage.on('dragend', () => this.drawInfiniteGrid());
    
    // Add wheel event for zooming with mouse wheel
    this.stage.on('wheel', (e) => {
      e.evt.preventDefault();
      
      const oldScale = this.stage.scaleX();
      const pointer = this.stage.getPointerPosition();
      if (!pointer) return;
      
      const mousePointTo = {
        x: (pointer.x - this.stage.x()) / oldScale,
        y: (pointer.y - this.stage.y()) / oldScale,
      };
      
      // Zoom factor
      const scaleBy = 1.1;
      const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
      
      // Limit zoom range
      const limitedScale = Math.max(0.1, Math.min(10, newScale));
      
      this.stage.scale({ x: limitedScale, y: limitedScale });
      
      const newPos = {
        x: pointer.x - mousePointTo.x * limitedScale,
        y: pointer.y - mousePointTo.y * limitedScale,
      };
      
      this.stage.position(newPos);
      this.drawInfiniteGrid();
    });
    
    // Setup event handlers
    this.setupEventHandlers();
    
    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
    
    console.log('✅ Konva stage initialized');
  }
  
  private drawInfiniteGrid(): void {
    // Clear existing grid
    this.gridLayer.destroyChildren();
    
    // If grid is hidden, just return
    if (!this.showGrid()) {
      this.gridLayer.batchDraw();
      return;
    }
    
    const stagePos = this.stage.position();
    const stageScale = this.stage.scaleX();
    const width = this.stage.width();
    const height = this.stage.height();
    
    // Grid color based on theme
    const gridColor = this.isDarkTheme() ? '#2a2a2a' : '#d0d0d0';
    
    // Calculate the visible area in grid coordinates with extra padding
    // Add much larger buffer to ensure grid extends far beyond visible area
    const bufferMultiplier = 10; // Increase from 2 to 10
    const startX = Math.floor((-stagePos.x / stageScale - width * bufferMultiplier) / this.gridSize) * this.gridSize;
    const startY = Math.floor((-stagePos.y / stageScale - height * bufferMultiplier) / this.gridSize) * this.gridSize;
    const endX = startX + (width / stageScale) * (1 + bufferMultiplier * 2) + this.gridSize;
    const endY = startY + (height / stageScale) * (1 + bufferMultiplier * 2) + this.gridSize;
    
    // Draw vertical lines
    for (let x = startX; x < endX; x += this.gridSize) {
      this.gridLayer.add(new Konva.Line({
        points: [x, startY, x, endY],
        stroke: gridColor,
        strokeWidth: 1 / stageScale,
        listening: false
      }));
    }
    
    // Draw horizontal lines
    for (let y = startY; y < endY; y += this.gridSize) {
      this.gridLayer.add(new Konva.Line({
        points: [startX, y, endX, y],
        stroke: gridColor,
        strokeWidth: 1 / stageScale,
        listening: false
      }));
    }
    
    this.gridLayer.batchDraw();
  }
  
  private drawGrid(): void {
    // Legacy method - kept for compatibility
    this.drawInfiniteGrid();
  }
  
  private setupEventHandlers(): void {
    // Mouse down
    this.stage.on('mousedown touchstart', (e) => {
      const tool = this.currentTool();
      const pos = this.stage.getPointerPosition();
      if (!pos) return;
      
      // Handle hand tool for panning
      if (tool === 'hand') {
        this.isPanning = true;
        this.lastPointerPosition = pos;
        this.stage.container().style.cursor = 'grabbing';
        return;
      }
      
      if (e.target !== this.stage) {
        return;
      }
      
      if (tool === 'select') {
        this.transformer.nodes([]);
      } else if (tool === 'rectangle') {
        this.startDrawingRect(pos);
      } else if (tool === 'circle') {
        this.startDrawingCircle(pos);
      } else if (tool === 'line' || tool === 'arrow') {
        this.startDrawingLine(pos, tool === 'arrow');
      } else if (tool === 'pen') {
        this.startDrawingPen(pos);
      } else if (tool === 'text') {
        this.addText(pos);
      } else if (tool === 'shape') {
        const shape = this.createShapeFromTemplate(pos, this.selectedShape());
        this.layer.add(shape);
        this.saveHistory();
      }
    });
    
    // Mouse move
    this.stage.on('mousemove touchmove', () => {
      const pos = this.stage.getPointerPosition();
      if (!pos) return;
      
      const tool = this.currentTool();
      
      // Handle panning
      if (this.isPanning && this.lastPointerPosition) {
        const dx = pos.x - this.lastPointerPosition.x;
        const dy = pos.y - this.lastPointerPosition.y;
        
        const currentPos = this.stage.position();
        this.stage.position({
          x: currentPos.x + dx,
          y: currentPos.y + dy
        });
        
        this.lastPointerPosition = pos;
        this.drawInfiniteGrid(); // Update grid during panning, not just at end
        return;
      }
      
      if (!this.isPaint) return;
      
      if (tool === 'rectangle' && this.currentShape) {
        this.updateRect(pos);
      } else if (tool === 'circle' && this.currentShape) {
        this.updateCircle(pos);
      } else if ((tool === 'line' || tool === 'arrow') && this.currentShape) {
        this.updateLine(pos);
      } else if (tool === 'pen' && this.lastLine) {
        this.updatePen(pos);
      }
    });
    
    // Mouse up
    this.stage.on('mouseup touchend', () => {
      // Stop panning
      if (this.isPanning) {
        this.isPanning = false;
        this.lastPointerPosition = null;
        this.stage.container().style.cursor = 'grab';
        return;
      }
      
      if (!this.isPaint) return;
      
      this.isPaint = false;
      const tool = this.currentTool();
      
      if (tool === 'rectangle' || tool === 'circle' || tool === 'line' || tool === 'arrow') {
        if (this.currentShape) {
          this.layer.add(this.currentShape);
          this.drawingLayer.destroyChildren();
          this.currentShape = null;
          this.saveHistory();
        }
      } else if (tool === 'pen') {
        if (this.lastLine) {
          this.layer.add(this.lastLine);
          this.drawingLayer.destroyChildren();
          this.lastLine = null;
          this.saveHistory();
        }
      }
    });
    
    // Click on shape to select
    this.stage.on('click tap', (e) => {
      if (this.currentTool() !== 'select') return;
      
      if (e.target === this.stage) {
        this.transformer.nodes([]);
        return;
      }
      
      const target = e.target as any;
      if (target && target !== this.transformer && target.draggable) {
        this.transformer.nodes([target]);
      }
    });
  }
  
  // Drawing methods
  private startDrawingRect(pos: { x: number; y: number }): void {
    this.isPaint = true;
    const color = this.currentColor();
    this.currentShape = new Konva.Rect({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      fill: this.fillStyle() !== 'none' ? this.hexToRgba(color, 0.3) : 'transparent',
      stroke: color,
      strokeWidth: this.strokeWidth(),
      draggable: true
    });
    this.drawingLayer.add(this.currentShape);
  }
  
  private updateRect(pos: { x: number; y: number }): void {
    const startX = this.currentShape.x();
    const startY = this.currentShape.y();
    
    this.currentShape.width(pos.x - startX);
    this.currentShape.height(pos.y - startY);
  }
  
  private startDrawingCircle(pos: { x: number; y: number }): void {
    this.isPaint = true;
    const color = this.currentColor();
    this.currentShape = new Konva.Circle({
      x: pos.x,
      y: pos.y,
      radius: 0,
      fill: this.fillStyle() !== 'none' ? this.hexToRgba(color, 0.3) : 'transparent',
      stroke: color,
      strokeWidth: this.strokeWidth(),
      draggable: true
    });
    this.drawingLayer.add(this.currentShape);
  }
  
  private updateCircle(pos: { x: number; y: number }): void {
    const startX = this.currentShape.x();
    const startY = this.currentShape.y();
    const radius = Math.sqrt(Math.pow(pos.x - startX, 2) + Math.pow(pos.y - startY, 2));
    this.currentShape.radius(radius);
  }
  
  private startDrawingLine(pos: { x: number; y: number }, isArrow: boolean): void {
    this.isPaint = true;
    const color = this.currentColor();
    this.currentShape = new Konva.Arrow({
      points: [pos.x, pos.y, pos.x, pos.y],
      stroke: color,
      strokeWidth: this.strokeWidth(),
      fill: color,
      pointerLength: isArrow ? 10 : 0,
      pointerWidth: isArrow ? 10 : 0,
      draggable: true
    });
    this.drawingLayer.add(this.currentShape);
  }
  
  private updateLine(pos: { x: number; y: number }): void {
    const points = this.currentShape.points();
    this.currentShape.points([points[0], points[1], pos.x, pos.y]);
  }
  
  private startDrawingPen(pos: { x: number; y: number }): void {
    this.isPaint = true;
    const color = this.currentColor();
    this.lastLine = new Konva.Line({
      stroke: color,
      strokeWidth: this.strokeWidth(),
      globalCompositeOperation: 'source-over',
      lineCap: 'round',
      lineJoin: 'round',
      points: [pos.x, pos.y],
      draggable: true
    });
    this.drawingLayer.add(this.lastLine);
  }
  
  private updatePen(pos: { x: number; y: number }): void {
    const newPoints = this.lastLine!.points().concat([pos.x, pos.y]);
    this.lastLine!.points(newPoints);
  }
  
  private addText(pos: { x: number; y: number }): void {
    const textColor = this.isDarkTheme() ? '#e2e8f0' : '#1a1a1a';
    
    const text = new Konva.Text({
      x: pos.x,
      y: pos.y,
      text: 'Double-click to edit',
      fontSize: this.fontSize(),
      fontFamily: 'Arial',
      fill: textColor,
      align: this.textAlign(),
      draggable: true,
      width: 200
    });
    
    this.layer.add(text);
    
    // Add double-click to edit
    text.on('dblclick dbltap', () => {
      this.editText(text);
    });
    
    this.saveHistory();
  }
  
  private editText(textNode: Konva.Text): void {
    const textPosition = textNode.absolutePosition();
    const stageBox = this.stage.container().getBoundingClientRect();
    
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    
    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = (stageBox.top + textPosition.y) + 'px';
    textarea.style.left = (stageBox.left + textPosition.x) + 'px';
    textarea.style.width = textNode.width() + 'px';
    textarea.style.fontSize = textNode.fontSize() + 'px';
    textarea.style.border = '2px solid #667eea';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = '#1a1a1a';
    textarea.style.color = '#e2e8f0';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.fontFamily = textNode.fontFamily();
    
    textarea.focus();
    
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        textNode.text(textarea.value);
        document.body.removeChild(textarea);
        this.saveHistory();
      }
    });
    
    textarea.addEventListener('blur', () => {
      textNode.text(textarea.value);
      document.body.removeChild(textarea);
      this.saveHistory();
    });
  }
  
  // Component drag and drop
  onDragStart(event: DragEvent, component: ComponentItem): void {
    if (!event.dataTransfer) return;
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('application/json', JSON.stringify(component));
  }
  
  onCanvasDrop(event: DragEvent): void {
    event.preventDefault();
    if (!event.dataTransfer) return;
    
    try {
      const componentData: ComponentItem = JSON.parse(event.dataTransfer.getData('application/json'));
      
      // Get the canvas container's position
      const containerRect = this.containerRef.nativeElement.getBoundingClientRect();
      
      // Calculate the drop position relative to the canvas, accounting for stage position and scale
      const scale = this.stage.scaleX();
      const stagePos = this.stage.position();
      
      const pos = {
        x: (event.clientX - containerRect.left - stagePos.x) / scale,
        y: (event.clientY - containerRect.top - stagePos.y) / scale
      };
      
      // Call async method without awaiting (fire and forget)
      this.addComponentShape(pos, componentData);
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }
  
  private async addComponentShape(pos: { x: number; y: number }, component: ComponentItem): Promise<void> {
    const group = new Konva.Group({
      x: pos.x,
      y: pos.y,
      draggable: true,
      name: 'component-group'
    });
    
    const textColor = this.isDarkTheme() ? '#e2e8f0' : '#1a1a1a';
    const iconColor = component.color || '#3b82f6';
    
    // Use Font Awesome icon via Iconify API
    if (component.faIcon) {
      try {
        const iconDataURL = await this.generateIconDataURL(component.faIcon, iconColor);
        
        // Load the SVG as an image
        const imageObj = new Image();
        imageObj.onload = () => {
          const icon = new Konva.Image({
            x: 16,
            y: 0,
            image: imageObj,
            width: 48,
            height: 48
          });
          
          // Add icon to group first
          group.add(icon);
          
          // Then add name text below icon
          const name = new Konva.Text({
            x: 0,
            y: 55,
            text: component.name,
            fontSize: 14,
            fontStyle: 'bold',
            align: 'center',
            fill: textColor,
            width: 80
          });
          
          group.add(name);
          this.layer.batchDraw();
        };
        
        imageObj.onerror = () => {
          console.error('Failed to load icon:', component.faIcon);
          // Fallback to emoji if icon fails to load
          this.addComponentWithEmojiIcon(group, component, textColor);
        };
        
        imageObj.src = iconDataURL;
        
      } catch (error) {
        console.error('Error generating icon:', error);
        // Fallback to emoji
        this.addComponentWithEmojiIcon(group, component, textColor);
      }
    } else {
      // No faIcon, use emoji fallback
      this.addComponentWithEmojiIcon(group, component, textColor);
    }
    
    this.layer.add(group);
    this.saveHistory();
  }
  
  /**
   * Fallback method to add component with emoji icon
   */
  private addComponentWithEmojiIcon(group: Konva.Group, component: ComponentItem, textColor: string): void {
    const iconText = component.icon || '📦';
    
    const icon = new Konva.Text({
      x: 0,
      y: 0,
      text: iconText,
      fontSize: 48,
      align: 'center',
      fill: textColor,
      width: 80,
      fontFamily: 'Arial, sans-serif'
    });
    
    const name = new Konva.Text({
      x: 0,
      y: 55,
      text: component.name,
      fontSize: 14,
      fontStyle: 'bold',
      align: 'center',
      fill: textColor,
      width: 80
    });
    
    group.add(icon, name);
    this.layer.batchDraw();
  }
  
  // History management
  private saveHistory(): void {
    const json = this.layer.toJSON();
    this.history = this.history.slice(0, this.historyStep + 1);
    this.history.push(json);
    this.historyStep++;
  }
  
  // Keyboard shortcuts
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.isBrowser) return;
    
    // Undo: Cmd+Z or Ctrl+Z
    if ((event.metaKey || event.ctrlKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      this.undo();
    }
    
    // Redo: Cmd+Shift+Z or Ctrl+Shift+Z
    if ((event.metaKey || event.ctrlKey) && event.key === 'z' && event.shiftKey) {
      event.preventDefault();
      this.redo();
    }
    
    // Delete: Delete or Backspace
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      this.deleteSelected();
    }
    
    // Duplicate: Cmd+D or Ctrl+D
    if ((event.metaKey || event.ctrlKey) && event.key === 'd') {
      event.preventDefault();
      this.duplicateSelected();
    }
    
    // Select All: Cmd+A or Ctrl+A
    if ((event.metaKey || event.ctrlKey) && event.key === 'a') {
      event.preventDefault();
      this.selectAll();
    }
    
    // Tool shortcuts
    if (!event.metaKey && !event.ctrlKey) {
      switch(event.key.toLowerCase()) {
        case 'v': this.setTool('select'); break;
        case 'h': this.setTool('hand'); break;
        case 'r': this.setTool('rectangle'); break;
        case 'c': this.setTool('circle'); break;
        case 'l': this.setTool('line'); break;
        case 'a': this.setTool('arrow'); break;
        case 'p': this.setTool('pen'); break;
        case 't': this.setTool('text'); break;
      }
    }
  }
  
  undo(): void {
    if (this.historyStep === 0) return;
    this.historyStep--;
    const json = this.history[this.historyStep];
    this.layer.destroyChildren();
    this.layer = Konva.Node.create(json, this.stage.container());
    this.stage.add(this.layer);
  }
  
  redo(): void {
    if (this.historyStep === this.history.length - 1) return;
    this.historyStep++;
    const json = this.history[this.historyStep];
    this.layer.destroyChildren();
    this.layer = Konva.Node.create(json, this.stage.container());
    this.stage.add(this.layer);
  }
  
  deleteSelected(): void {
    const selectedNodes = this.transformer.nodes();
    selectedNodes.forEach(node => node.destroy());
    this.transformer.nodes([]);
    this.saveHistory();
  }
  
  duplicateSelected(): void {
    const selectedNodes = this.transformer.nodes();
    selectedNodes.forEach(node => {
      const clone = node.clone({ x: node.x() + 20, y: node.y() + 20 });
      this.layer.add(clone);
    });
    this.saveHistory();
  }
  
  selectAll(): void {
    const shapes = this.layer.children.filter(child => child !== this.transformer);
    this.transformer.nodes(shapes as Konva.Shape[]);
  }
  
  // UI Methods
  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
    
    // Adjust style panel position to ensure it's visible
    setTimeout(() => {
      this.adjustStylePanelPosition();
    }, 300); // Wait for sidebar animation to complete
  }
  
  private adjustStylePanelPosition(): void {
    if (!this.stylePanelRef?.nativeElement) return;
    
    const panel = this.stylePanelRef.nativeElement;
    const panelRect = panel.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    
    // Check if panel is off-screen or too close to the right edge
    if (panelRect.right > viewportWidth - 10 || panelRect.left < 10) {
      // Reset to default visible position
      panel.style.right = '20px';
      panel.style.left = 'auto';
      panel.style.top = '20px';
    }
  }
  
  selectCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId);
  }
  
  setTool(tool: Tool): void {
    this.currentTool.set(tool);
    if (tool !== 'select') {
      this.transformer.nodes([]);
    }
  }
  
  toggleTheme(): void {
    this.isDarkTheme.update(v => !v);
    const isDark = this.isDarkTheme();
    
    // Update grid color
    this.drawInfiniteGrid();
    
    // Update canvas background color
    if (this.stage) {
      const container = this.stage.container();
      const bgColor = isDark ? '#0a0a0a' : '#f5f5f5';
      container.style.backgroundColor = bgColor;
      
      // Also update the canvas wrapper div
      const canvasWrapper = this.containerRef?.nativeElement?.querySelector('.main-content');
      if (canvasWrapper instanceof HTMLElement) {
        canvasWrapper.style.backgroundColor = bgColor;
      }
    }
  }
  
  toggleGrid(): void {
    this.showGrid.update(v => !v);
    this.drawInfiniteGrid();
  }
  
  setColor(color: string): void {
    this.currentColor.set(color);
    // Apply to selected shapes
    const selectedNodes = this.transformer.nodes();
    selectedNodes.forEach(node => {
      if (node instanceof Konva.Shape) {
        const opacity = this.colorOpacity() / 100;
        node.stroke(this.hexToRgba(color, opacity));
        // If filled, update fill too
        if (this.fillStyle() !== 'none') {
          node.fill(this.hexToRgba(color, opacity * 0.3));
        }
      }
    });
    this.layer.batchDraw();
  }
  
  setColorOpacity(opacity: number): void {
    this.colorOpacity.set(opacity);
    // Apply to selected shapes with current color
    const color = this.currentColor();
    const selectedNodes = this.transformer.nodes();
    selectedNodes.forEach(node => {
      if (node instanceof Konva.Shape) {
        const normalizedOpacity = opacity / 100;
        node.stroke(this.hexToRgba(color, normalizedOpacity));
        // If filled, update fill too
        if (this.fillStyle() !== 'none') {
          node.fill(this.hexToRgba(color, normalizedOpacity * 0.3));
        }
      }
    });
    this.layer.batchDraw();
  }
  
  setStrokeWidth(width: number): void {
    this.strokeWidth.set(width);
    // Apply to selected shapes
    const selectedNodes = this.transformer.nodes();
    selectedNodes.forEach(node => {
      if (node instanceof Konva.Shape) {
        node.strokeWidth(width);
      }
    });
    this.layer.batchDraw();
  }
  
  setFillStyle(style: FillStyle): void {
    this.fillStyle.set(style);
    const selectedNodes = this.transformer.nodes();
    selectedNodes.forEach(node => {
      if (node instanceof Konva.Shape) {
        this.applyFillStyle(node, style);
      }
    });
    this.layer.batchDraw();
  }
  
  setStrokePattern(pattern: 'solid' | 'dashed' | 'dotted' | 'none'): void {
    this.strokePattern = pattern;
    const selectedNodes = this.transformer.nodes();
    selectedNodes.forEach(node => {
      if (node instanceof Konva.Shape) {
        if (pattern === 'solid') {
          node.dash([]);
        } else if (pattern === 'dashed') {
          node.dash([10, 5]);
        } else if (pattern === 'dotted') {
          node.dash([2, 4]);
        } else if (pattern === 'none') {
          node.strokeWidth(0);
        }
      }
    });
    this.layer.batchDraw();
  }
  
  setSizePreset(size: SizePreset): void {
    this.sizePreset.set(size);
  }
  
  setFontSize(size: number): void {
    this.fontSize.set(size);
    // Apply to selected text shapes
    const selectedNodes = this.transformer.nodes();
    selectedNodes.forEach(node => {
      if (node instanceof Konva.Text) {
        node.fontSize(size);
      }
    });
    this.layer.batchDraw();
  }
  
  setTextAlign(align: 'left' | 'center' | 'right' | 'justify'): void {
    this.textAlign.set(align);
    // Apply to selected text shapes
    const selectedNodes = this.transformer.nodes();
    selectedNodes.forEach(node => {
      if (node instanceof Konva.Text) {
        node.align(align);
      }
    });
    this.layer.batchDraw();
  }
  
  toggleShapePicker(event?: MouseEvent): void {
    if (event && event.target) {
      const button = event.target as HTMLElement;
      const rect = button.getBoundingClientRect();
      
      // Position popup below the button
      this.shapePickerPosition = {
        top: `${rect.bottom + 8}px`,
        right: `${window.innerWidth - rect.right}px`
      };
    }
    this.showShapePicker.update(v => !v);
  }
  
  selectShapeTemplate(shapeId: string): void {
    this.selectedShape.set(shapeId);
    this.currentTool.set('shape');
    this.showShapePicker.set(false);
  }
  
  private createShapeFromTemplate(pos: { x: number; y: number }, templateId: string): Konva.Shape | Konva.Group {
    const size = this.getSizeFromPreset();
    const color = this.currentColor();
    const strokeWidth = this.strokeWidth();
    const fill = this.fillStyle() !== 'none' ? this.hexToRgba(color, 0.3) : 'transparent';
    
    switch (templateId) {
      case 'rectangle':
        return new Konva.Rect({
          x: pos.x,
          y: pos.y,
          width: size.width,
          height: size.height,
          fill, stroke: color, strokeWidth,
          draggable: true
        });
        
      case 'circle':
        return new Konva.Circle({
          x: pos.x + size.width / 2,
          y: pos.y + size.height / 2,
          radius: Math.min(size.width, size.height) / 2,
          fill, stroke: color, strokeWidth,
          draggable: true
        });
        
      case 'triangle':
        return new Konva.RegularPolygon({
          x: pos.x + size.width / 2,
          y: pos.y + size.height / 2,
          sides: 3,
          radius: Math.min(size.width, size.height) / 2,
          fill, stroke: color, strokeWidth,
          draggable: true
        });
        
      case 'diamond':
        return new Konva.RegularPolygon({
          x: pos.x + size.width / 2,
          y: pos.y + size.height / 2,
          sides: 4,
          radius: Math.min(size.width, size.height) / 2,
          rotation: 45,
          fill, stroke: color, strokeWidth,
          draggable: true
        });
        
      case 'pentagon':
        return new Konva.RegularPolygon({
          x: pos.x + size.width / 2,
          y: pos.y + size.height / 2,
          sides: 5,
          radius: Math.min(size.width, size.height) / 2,
          fill, stroke: color, strokeWidth,
          draggable: true
        });
        
      case 'hexagon':
        return new Konva.RegularPolygon({
          x: pos.x + size.width / 2,
          y: pos.y + size.height / 2,
          sides: 6,
          radius: Math.min(size.width, size.height) / 2,
          fill, stroke: color, strokeWidth,
          draggable: true
        });
        
      case 'star':
        return new Konva.Star({
          x: pos.x + size.width / 2,
          y: pos.y + size.height / 2,
          numPoints: 5,
          innerRadius: Math.min(size.width, size.height) / 4,
          outerRadius: Math.min(size.width, size.height) / 2,
          fill, stroke: color, strokeWidth,
          draggable: true
        });
        
      case 'ellipse':
        return new Konva.Ellipse({
          x: pos.x + size.width / 2,
          y: pos.y + size.height / 2,
          radiusX: size.width / 2,
          radiusY: size.height / 2,
          fill, stroke: color, strokeWidth,
          draggable: true
        });
        
      case 'heart':
        // Heart shape using custom path
        return new Konva.Line({
          x: pos.x + size.width / 2,
          y: pos.y + size.height / 3,
          points: this.getHeartPoints(size.width * 0.8),
          closed: true,
          fill, stroke: color, strokeWidth,
          draggable: true
        });
        
      case 'cloud':
        // Cloud shape using circles
        const cloudGroup = new Konva.Group({
          x: pos.x,
          y: pos.y,
          draggable: true
        });
        
        const circles = [
          { x: size.width * 0.3, y: size.height * 0.5, r: size.width * 0.2 },
          { x: size.width * 0.5, y: size.height * 0.4, r: size.width * 0.25 },
          { x: size.width * 0.7, y: size.height * 0.5, r: size.width * 0.2 },
        ];
        
        circles.forEach(c => {
          cloudGroup.add(new Konva.Circle({
            x: c.x, y: c.y, radius: c.r,
            fill, stroke: color, strokeWidth
          }));
        });
        
        return cloudGroup;
        
      case 'arrow-right':
      case 'arrow-left':
      case 'arrow-up':
      case 'arrow-down':
        return this.createArrowShape(pos, size, templateId, color, strokeWidth, fill);
        
      case 'x-mark':
        return new Konva.Line({
          x: pos.x,
          y: pos.y,
          points: [
            0, 0, size.width, size.height,
            size.width, 0, 0, size.height
          ],
          stroke: color,
          strokeWidth: strokeWidth * 2,
          lineCap: 'round',
          draggable: true
        });
        
      case 'check':
        return new Konva.Line({
          x: pos.x + size.width * 0.2,
          y: pos.y + size.height * 0.5,
          points: [
            0, 0,
            size.width * 0.3, size.height * 0.4,
            size.width * 0.7, -size.height * 0.3
          ],
          stroke: color,
          strokeWidth: strokeWidth * 2,
          lineCap: 'round',
          lineJoin: 'round',
          draggable: true
        });
        
      case 'trapezoid':
        return new Konva.Line({
          x: pos.x,
          y: pos.y,
          points: [
            size.width * 0.2, 0,
            size.width * 0.8, 0,
            size.width, size.height,
            0, size.height
          ],
          closed: true,
          fill, stroke: color, strokeWidth,
          draggable: true
        });
        
      default:
        return new Konva.Rect({
          x: pos.x, y: pos.y,
          width: size.width, height: size.height,
          fill, stroke: color, strokeWidth,
          draggable: true
        });
    }
  }
  
  private getHeartPoints(size: number): number[] {
    const points: number[] = [];
    for (let i = 0; i < 360; i += 5) {
      const t = (i * Math.PI) / 180;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      points.push((x * size) / 32, (y * size) / 32);
    }
    return points;
  }
  
  private createArrowShape(
    pos: { x: number; y: number },
    size: { width: number; height: number },
    direction: string,
    color: string,
    strokeWidth: number,
    fill: string
  ): Konva.Line {
    let points: number[];
    let rotation = 0;
    
    // Base arrow pointing right
    const w = size.width;
    const h = size.height;
    points = [
      0, h * 0.4,
      w * 0.6, h * 0.4,
      w * 0.6, h * 0.2,
      w, h * 0.5,
      w * 0.6, h * 0.8,
      w * 0.6, h * 0.6,
      0, h * 0.6
    ];
    
    // Rotate based on direction
    if (direction === 'arrow-left') rotation = 180;
    else if (direction === 'arrow-up') rotation = -90;
    else if (direction === 'arrow-down') rotation = 90;
    
    return new Konva.Line({
      x: pos.x + w / 2,
      y: pos.y + h / 2,
      points,
      closed: true,
      fill, stroke: color, strokeWidth,
      offsetX: w / 2,
      offsetY: h / 2,
      rotation,
      draggable: true
    });
  }
  
  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  private applyFillStyle(shape: Konva.Shape, style: FillStyle): void {
    const color = this.currentColor();
    
    switch (style) {
      case 'solid':
        shape.fill(this.hexToRgba(color, 0.3));
        shape.fillPatternImage(undefined);
        break;
      case 'none':
        shape.fill('transparent');
        shape.fillPatternImage(undefined);
        break;
      case 'hatch':
      case 'cross-hatch':
      case 'dotted':
        // For patterns, we'll use a simple semi-transparent fill for now
        // Full pattern implementation would require creating pattern images
        shape.fill(this.hexToRgba(color, 0.15));
        break;
    }
  }
  
  private getSizeFromPreset(): { width: number; height: number } {
    const preset = this.sizePreset();
    switch (preset) {
      case 'small': return { width: 80, height: 60 };
      case 'medium': return { width: 140, height: 100 };
      case 'large': return { width: 200, height: 150 };
      case 'xlarge': return { width: 300, height: 220 };
      default: return { width: 140, height: 100 };
    }
  }
  
  getFilteredComponents(): ComponentItem[] {
    const category = this.categories.find(c => c.id === this.selectedCategory());
    if (!category) return [];
    
    const query = this.searchQuery().toLowerCase();
    if (!query) return category.components;
    
    return category.components.filter(comp => 
      comp.name.toLowerCase().includes(query) ||
      comp.description.toLowerCase().includes(query)
    );
  }
  
  // Get filtered categories for cytoscape-style sidebar
  getFilteredCategories(): ComponentCategory[] {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.categories;
    
    return this.categories
      .map(category => ({
        ...category,
        components: category.components.filter(comp =>
          comp.name.toLowerCase().includes(query) ||
          comp.description.toLowerCase().includes(query)
        )
      }))
      .filter(category => category.components.length > 0);
  }
  
  // Toggle category collapse state
  toggleCategory(category: ComponentCategory): void {
    category.collapsed = !category.collapsed;
  }
  
  // Export/Import methods
  zoomIn(): void {
    const oldScale = this.stage.scaleX();
    const newScale = oldScale * 1.2;
    this.stage.scale({ x: newScale, y: newScale });
    this.drawInfiniteGrid();
  }
  
  zoomOut(): void {
    const oldScale = this.stage.scaleX();
    const newScale = oldScale / 1.2;
    this.stage.scale({ x: newScale, y: newScale });
    this.drawInfiniteGrid();
  }
  
  resetZoom(): void {
    this.stage.scale({ x: 1, y: 1 });
    this.stage.position({ x: 0, y: 0 });
    this.drawInfiniteGrid();
  }
  
  zoomToFit(): void {
    this.stage.scale({ x: 1, y: 1 });
    this.stage.position({ x: 0, y: 0 });
    this.drawInfiniteGrid();
  }
  
  exportToPNG(): void {
    const dataURL = this.stage.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = `architecture-${Date.now()}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  exportToSVG(): void {
    console.log('SVG export - implement with konva-to-svg if needed');
  }
  
  exportToJSON(): void {
    // Create simple, readable JSON structure
    console.log('=== STARTING EXPORT ===');
    console.log('Total layer children:', this.layer.children.length);
    
    const shapes = this.layer.children.filter((child: any) => 
      child.getClassName() !== 'Transformer'
    ).map((shape: any) => {
      const className = shape.getClassName();
      console.log('Exporting shape - className:', className, 'type:', typeof className, shape);
      
      // Skip shapes without a valid className
      if (!className || className === 'Shape') {
        console.warn('Skipping shape without valid type:', shape);
        return null;
      }
      
      const baseData: any = {
        id: shape.id() || `shape-${Date.now()}-${Math.random()}`,
        type: className,
        x: shape.x(),
        y: shape.y(),
        rotation: shape.rotation() || 0,
      };
      
      // Add type-specific properties
      if (className === 'Rect') {
        baseData.width = shape.width();
        baseData.height = shape.height();
        baseData.fill = shape.fill();
        baseData.stroke = shape.stroke();
        baseData.strokeWidth = shape.strokeWidth();
        baseData.cornerRadius = shape.cornerRadius() || 0;
      } else if (className === 'Circle') {
        baseData.radius = shape.radius();
        baseData.fill = shape.fill();
        baseData.stroke = shape.stroke();
        baseData.strokeWidth = shape.strokeWidth();
      } else if (className === 'Line' || className === 'Arrow') {
        baseData.points = shape.points();
        baseData.stroke = shape.stroke();
        baseData.strokeWidth = shape.strokeWidth();
        if (className === 'Arrow') {
          baseData.pointerLength = shape.pointerLength();
          baseData.pointerWidth = shape.pointerWidth();
        }
      } else if (className === 'Text') {
        baseData.text = shape.text();
        baseData.fontSize = shape.fontSize();
        baseData.fontFamily = shape.fontFamily();
        baseData.fill = shape.fill();
        baseData.width = shape.width();
      } else if (className === 'Image') {
        // Handle images
        baseData.width = shape.width();
        baseData.height = shape.height();
        // Convert image to base64 for export
        const image = shape.image();
        if (image) {
          const canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(image, 0, 0);
            baseData.imageData = canvas.toDataURL();
          }
        }
      } else if (className === 'Group') {
        // Compact group export - icon and name only
        // Group structure: [0] = icon Text, [1] = name Text
        const iconText = shape.children[0];
        const nameText = shape.children[1];
        
        baseData.componentIcon = iconText ? iconText.text() : '📦';
        baseData.componentName = nameText ? nameText.text() : 'Component';
      }
      
      return baseData;
    }).filter((shape: any) => shape !== null); // Remove null entries
    
    const exportData = {
      version: '1.0',
      created: new Date().toISOString(),
      canvas: {
        width: this.stage.width(),
        height: this.stage.height(),
        scale: this.stage.scaleX(),
        position: this.stage.position()
      },
      shapes: shapes
    };
    
    console.log('Total shapes exported:', shapes.length);
    
    const jsonStr = JSON.stringify(exportData, null, 2);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonStr);
    const link = document.createElement('a');
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `architecture-${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  importFromJSON(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event: any) => {
        try {
          const data = JSON.parse(event.target.result);
          
          // Clear current canvas
          this.layer.destroyChildren();
          
          // Restore canvas settings
          if (data.canvas) {
            if (data.canvas.scale) {
              this.stage.scale({ x: data.canvas.scale, y: data.canvas.scale });
            }
            if (data.canvas.position) {
              this.stage.position(data.canvas.position);
            }
          }
          
          // Recreate shapes
          let skippedCount = 0;
          let loadedCount = 0;
          
          data.shapes.forEach((shapeData: any) => {
            // Skip shapes without a type
            if (!shapeData.type) {
              console.warn('Skipping shape without type:', shapeData);
              skippedCount++;
              return;
            }
            
            let shape: any;
            
            switch (shapeData.type) {
              case 'Rect':
                shape = new Konva.Rect({
                  id: shapeData.id,
                  x: shapeData.x,
                  y: shapeData.y,
                  width: shapeData.width,
                  height: shapeData.height,
                  fill: shapeData.fill,
                  stroke: shapeData.stroke,
                  strokeWidth: shapeData.strokeWidth,
                  cornerRadius: shapeData.cornerRadius || 0,
                  rotation: shapeData.rotation || 0,
                  draggable: true
                });
                break;
                
              case 'Circle':
                shape = new Konva.Circle({
                  id: shapeData.id,
                  x: shapeData.x,
                  y: shapeData.y,
                  radius: shapeData.radius,
                  fill: shapeData.fill,
                  stroke: shapeData.stroke,
                  strokeWidth: shapeData.strokeWidth,
                  rotation: shapeData.rotation || 0,
                  draggable: true
                });
                break;
                
              case 'Line':
                shape = new Konva.Line({
                  id: shapeData.id,
                  x: shapeData.x,
                  y: shapeData.y,
                  points: shapeData.points,
                  stroke: shapeData.stroke,
                  strokeWidth: shapeData.strokeWidth,
                  rotation: shapeData.rotation || 0,
                  draggable: true
                });
                break;
                
              case 'Arrow':
                shape = new Konva.Arrow({
                  id: shapeData.id,
                  x: shapeData.x,
                  y: shapeData.y,
                  points: shapeData.points,
                  stroke: shapeData.stroke,
                  strokeWidth: shapeData.strokeWidth,
                  fill: shapeData.stroke,
                  pointerLength: shapeData.pointerLength || 10,
                  pointerWidth: shapeData.pointerWidth || 10,
                  rotation: shapeData.rotation || 0,
                  draggable: true
                });
                break;
                
              case 'Text':
                shape = new Konva.Text({
                  id: shapeData.id,
                  x: shapeData.x,
                  y: shapeData.y,
                  text: shapeData.text,
                  fontSize: shapeData.fontSize,
                  fontFamily: shapeData.fontFamily,
                  fill: shapeData.fill,
                  width: shapeData.width,
                  rotation: shapeData.rotation || 0,
                  draggable: true
                });
                break;
                
              case 'Image':
                // Restore images from base64
                if (shapeData.imageData) {
                  const imageObj = new Image();
                  imageObj.onload = () => {
                    const konvaImage = new Konva.Image({
                      id: shapeData.id,
                      x: shapeData.x,
                      y: shapeData.y,
                      image: imageObj,
                      width: shapeData.width,
                      height: shapeData.height,
                      rotation: shapeData.rotation || 0,
                      draggable: true
                    });
                    this.layer.add(konvaImage);
                  };
                  imageObj.src = shapeData.imageData;
                }
                break;
                
              case 'Group':
                // Recreate component groups from compact format - icon and name only
                shape = new Konva.Group({
                  id: shapeData.id,
                  x: shapeData.x,
                  y: shapeData.y,
                  rotation: shapeData.rotation || 0,
                  draggable: true,
                  name: 'component-group'
                });
                
                const componentName = shapeData.componentName || 'Component';
                const componentIcon = shapeData.componentIcon || '📦';
                const textColor = this.isDarkTheme() ? '#e2e8f0' : '#1a1a1a';
                
                // Recreate simplified structure - icon above, name below
                const icon = new Konva.Text({
                  x: 0,
                  y: 0,
                  text: componentIcon,
                  fontSize: 48,
                  align: 'center',
                  fill: textColor,
                  width: 80,
                  fontFamily: 'Arial, sans-serif' // Better emoji rendering
                });
                
                const name = new Konva.Text({
                  x: 0,
                  y: 55,
                  text: componentName,
                  fontSize: 14,
                  fontStyle: 'bold',
                  align: 'center',
                  fill: textColor,
                  width: 80
                });
                
                shape.add(icon, name);
                break;
                
              default:
                console.warn('Unknown shape type:', shapeData.type);
                break;
            }
            
            if (shape) {
              this.layer.add(shape);
              loadedCount++;
            }
          });
          
          // Redraw grid after import
          this.drawInfiniteGrid();
          
          // Re-add transformer
          this.transformer = new Konva.Transformer({
            borderStroke: '#667eea',
            borderStrokeWidth: 2,
            anchorFill: '#667eea',
            anchorStroke: '#2a2a2a',
            anchorSize: 12,
          });
          this.layer.add(this.transformer);
          
          this.layer.batchDraw();
          this.saveHistory();
          
          // Show result message
          let message = `Successfully loaded ${loadedCount} shape(s)`;
          if (skippedCount > 0) {
            message += `\n⚠️ Skipped ${skippedCount} shape(s) without type information`;
          }
          alert(message);
        } catch (error) {
          console.error('Error importing JSON:', error);
          alert('Failed to import file. Please check the file format.');
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  }
  
  clearCanvas(): void {
    if (confirm('Are you sure you want to clear the canvas?')) {
      this.layer.destroyChildren();
      this.transformer = new Konva.Transformer({
        borderStroke: '#667eea',
        borderStrokeWidth: 2,
        anchorFill: '#667eea',
        anchorStroke: '#2a2a2a',
        anchorSize: 12,
      });
      this.layer.add(this.transformer);
      this.saveHistory();
    }
  }
  
  createGroup(): void {
    const selectedNodes = this.transformer.nodes();
    if (selectedNodes.length < 2) {
      alert('Please select at least 2 shapes to group');
      return;
    }
    
    const group = new Konva.Group({ draggable: true });
    
    selectedNodes.forEach((node: any) => {
      group.add(node);
    });
    
    this.layer.add(group);
    this.transformer.nodes([group as any]);
    this.saveHistory();
  }
  
  generateAILayout(): void {
    console.log('AI Layout generation - implement your AI logic here');
    alert('AI Layout generation coming soon!');
  }
  
  // Image Upload Methods
  triggerImageUpload(): void {
    if (this.imageUploadRef?.nativeElement) {
      this.imageUploadRef.nativeElement.click();
    }
  }
  
  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target?.result) return;
      
      const imageUrl = e.target.result as string;
      this.addImageToCanvas(imageUrl);
    };
    
    reader.readAsDataURL(file);
    // Reset input so same file can be uploaded again
    input.value = '';
  }
  
  private addImageToCanvas(imageUrl: string): void {
    const imageObj = new Image();
    imageObj.onload = () => {
      // Calculate scaled dimensions to fit within reasonable size
      const maxWidth = 400;
      const maxHeight = 400;
      let width = imageObj.width;
      let height = imageObj.height;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }
      
      // Get center of visible viewport
      const stagePos = this.stage.position();
      const stageScale = this.stage.scaleX();
      const centerX = (-stagePos.x + this.stage.width() / 2) / stageScale;
      const centerY = (-stagePos.y + this.stage.height() / 2) / stageScale;
      
      // Create Konva image
      const konvaImage = new Konva.Image({
        x: centerX - width / 2,
        y: centerY - height / 2,
        image: imageObj,
        width: width,
        height: height,
        draggable: true,
      });
      
      // Add shadow and hover effects
      konvaImage.on('mouseenter', () => {
        konvaImage.shadowColor('black');
        konvaImage.shadowBlur(10);
        konvaImage.shadowOpacity(0.5);
        this.stage.container().style.cursor = 'move';
      });
      
      konvaImage.on('mouseleave', () => {
        konvaImage.shadowBlur(0);
        this.stage.container().style.cursor = 'default';
      });
      
      this.layer.add(konvaImage);
      this.saveHistory();
      
      // Select the newly added image
      this.transformer.nodes([konvaImage]);
    };
    
    imageObj.onerror = () => {
      alert('Failed to load image. Please try another file.');
    };
    
    imageObj.src = imageUrl;
  }
  
  private handleResize(): void {
    if (!this.containerRef) return;
    const container = this.containerRef.nativeElement;
    this.stage.width(container.offsetWidth);
    this.stage.height(container.offsetHeight);
    // Redraw grid on resize
    this.drawInfiniteGrid();
    // Ensure style panel stays visible on resize
    this.adjustStylePanelPosition();
  }
  
  // Stub methods for template compatibility
  onMouseDown(event: MouseEvent): void {}
  onMouseMove(event: MouseEvent): void {}
  onMouseUp(event: MouseEvent): void {}
  getCursor(): string {
    const tool = this.currentTool();
    if (tool === 'select') return 'default';
    if (tool === 'hand') return this.isPanning ? 'grabbing' : 'grab';
    if (tool === 'text') return 'text';
    if (tool === 'shape') return 'crosshair';
    return 'crosshair';
  }
  toggleLayers(): void {}
  
  ngOnDestroy(): void {
    if (this.stage) {
      this.stage.destroy();
    }
    if (this.isBrowser) {
      window.removeEventListener('resize', () => this.handleResize());
    }
  }
}
