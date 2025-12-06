import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, PLATFORM_ID, signal, HostListener, inject } from '@angular/core';
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

type Tool = 'select' | 'rectangle' | 'circle' | 'line' | 'arrow' | 'pen' | 'text' | 'eraser' | 'hand' | 'shape' | 'connector';
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
  
  // Selection rectangle for multi-select
  private selectionRectangle: Konva.Rect | null = null;
  private isSelecting = false;
  private selectionStartPos: { x: number; y: number } | null = null;
  
  // Icon cache for Font Awesome icons (similar to cytoscape implementation)
  private iconCache: Map<string, string> = new Map();
  private readonly ICON_CACHE_KEY = 'konva-iconify-cache';
  private readonly ICON_CACHE_VERSION = 'v2'; // Bumped to v2 for multiple-path support
  
  // Draggable panel state
  private isDragging = false;
  private currentDragElement: HTMLElement | null = null;
  private dragOffset = { x: 0, y: 0 };
  
  // Shape picker position
  shapePickerPosition = { top: '80px', right: '16px' };
  
  // Smart Connector state
  private connectorFirstShape: any = null;
  private connectorPreviewLine: Konva.Arrow | null = null;
  
  // Clipboard for copy/paste
  private clipboard: any[] = [];
  
  // Keyboard shortcuts help panel
  showShortcutsPanel = signal(false);
  
  // Curved connector toggle
  useCurvedConnectors = signal(false);
  
  // Templates panel
  showTemplatesPanel = signal(false);
  templateSearchQuery = '';
  showMyTemplates = signal(false); // Toggle between pre-built and my templates
  myTemplates: any[] = []; // User's saved templates
  
  // Auto-save flag
  private isRestoring = false;
  
  // Signals for UI state
  sidebarOpen = signal(true);
  selectedCategory = signal<string>('ai-models');
  searchQuery = signal('');
  currentTool = signal<Tool>('select');
  isDarkTheme = signal(false); // Default to light theme (white)
  showGrid = signal(false); // Default to no grid
  
  // Style properties
  currentColor = signal('#3b82f6');
  strokeColor = signal('#3b82f6'); // Border/stroke color
  fillColor = signal('#3b82f6'); // Fill color
  colorMode = signal<'stroke' | 'fill'>('stroke'); // Current color mode being edited
  colorOpacity = signal(100); // Current mode color intensity/opacity from 0-100
  strokeOpacity = signal(100); // Stroke opacity
  fillOpacity = signal(50); // Fill opacity (default 50% for transparency)
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
  
  // Custom component creator
  showCustomComponentModal = signal(false);
  customComponentName = signal('');
  customComponentDescription = signal('');
  customComponentColor = signal('#3b82f6');
  customComponentIcon = signal('');
  customComponentImageFile: File | null = null;
  customComponentImageUrl = signal('');
  
  // Use inject() function for Angular 21+ compatibility
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;
  
  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadComponentsFromConfig();
    this.loadCustomComponents(); // Load saved custom components
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
  private async fetchIconFromIconify(faIcon: string): Promise<{ paths: string[], viewBox: string } | null> {
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
        
        if (svgElement) {
          const viewBox = svgElement.getAttribute('viewBox') || '0 0 512 512';
          
          // Get all paths (some icons have multiple paths)
          const pathElements = svgDoc.querySelectorAll('path');
          const paths: string[] = [];
          
          pathElements.forEach((pathEl) => {
            const d = pathEl.getAttribute('d');
            if (d) {
              paths.push(d);
            }
          });
          
          if (paths.length > 0) {
            const iconData = { paths, viewBox };
            this.iconCache.set(faIcon, JSON.stringify(iconData));
            this.saveIconCacheToStorage();
            return iconData;
          }
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
    
    // Handle multiple paths (some icons have more than one path element)
    const pathElements = iconData.paths.map((p: string) => `<path d="${p}" fill="${color}"/>`).join('');
    
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <svg x="6" y="6" width="36" height="36" viewBox="${iconData.viewBox}">
        ${pathElements}
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
    // Load user's saved templates
    this.loadMyTemplates();
  }
  
  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    setTimeout(() => {
      this.initKonva();
      this.initDraggablePanels();
      
      // Restore auto-saved canvas after Konva is initialized
      setTimeout(() => {
        this.restoreFromLocalStorage();
      }, 500);
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
    
    // Create transformer with auto-save support
    this.createTransformer();
    this.layer.add(this.transformer);
    
    // Auto-save after any shape is dragged
    this.layer.on('dragend', (e) => {
      if (!this.isRestoring && e.target !== this.stage) {
        this.autoSaveToLocalStorage();
      }
    });
    
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
    
    // DON'T save initial state - let restore happen first, then save
    // this.saveHistory(); // Removed to prevent overwriting auto-save data on init
    
    console.log('✅ Konva stage initialized');
  }
  
  /**
   * Create transformer with auto-save event listener
   * This ensures all transformer instances trigger auto-save after transform
   */
  private createTransformer(): void {
    // Remove old transformer from layer if it exists
    if (this.transformer) {
      this.transformer.destroy();
    }
    
    // Create new transformer for shape manipulation with enhanced visibility
    this.transformer = new Konva.Transformer({
      borderStroke: '#3b82f6',
      borderStrokeWidth: 3,
      anchorFill: '#3b82f6',
      anchorStroke: '#ffffff',
      anchorStrokeWidth: 2,
      anchorSize: 14,
      anchorCornerRadius: 3,
      rotateEnabled: true,
      enabledAnchors: ['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right'],
      padding: 5,
      keepRatio: false,
      centeredScaling: false
    });
    
    // Auto-save after transform (resize/rotate)
    this.transformer.on('transformend', () => {
      console.log('🔄 Transform ended, isRestoring:', this.isRestoring);
      if (!this.isRestoring) {
        console.log('💾 Auto-saving after transform...');
        this.autoSaveToLocalStorage();
      }
    });
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
  
  /**
   * Get pointer position in stage coordinates (accounting for zoom and pan)
   */
  private getRelativePointerPosition(): { x: number; y: number } | null {
    const pos = this.stage.getPointerPosition();
    if (!pos) return null;
    
    const transform = this.stage.getAbsoluteTransform().copy();
    transform.invert();
    
    return transform.point(pos);
  }
  
  /**
   * Add selection highlight to a shape (blue glow effect)
   */
  private addSelectionHighlight(node: any): void {
    // Check if node has shadow methods (Shapes do, Groups might not)
    if (typeof node.shadowEnabled === 'function') {
      // Store original shadow state if not already stored
      if (node.attrs.originalShadow === undefined) {
        node.attrs.originalShadow = node.shadowEnabled();
      }
      
      // Add selection highlight - blue glow effect
      node.shadowEnabled(true);
      node.shadowColor('#3b82f6');
      node.shadowBlur(20);
      node.shadowOpacity(0.6);
      node.shadowOffset({ x: 0, y: 0 });
    } else {
      // For Groups and other nodes without shadow support, just mark as selected
      node.attrs.isHighlighted = true;
    }
  }
  
  /**
   * Remove selection highlight from a shape
   */
  private removeSelectionHighlight(node: any): void {
    if (typeof node.shadowEnabled === 'function') {
      if (node.attrs.originalShadow !== undefined) {
        node.shadowEnabled(node.attrs.originalShadow);
      } else {
        node.shadowEnabled(false);
      }
    } else {
      // For Groups and other nodes, just mark as not highlighted
      node.attrs.isHighlighted = false;
    }
  }
  
  private setupEventHandlers(): void {
    // Mouse down
    this.stage.on('mousedown touchstart', (e) => {
      const tool = this.currentTool();
      const pos = this.getRelativePointerPosition();
      if (!pos) return;
      
      // Handle hand tool for panning
      if (tool === 'hand') {
        this.isPanning = true;
        // Store screen position (not transformed) for panning
        const screenPos = this.stage.getPointerPosition();
        this.lastPointerPosition = screenPos || pos;
        this.stage.container().style.cursor = 'grabbing';
        return;
      }
      
      // Don't start drawing if clicking on a shape or transformer
      if (e.target !== this.stage) {
        return;
      }
      
      if (tool === 'select') {
        // Start drag selection
        this.isSelecting = true;
        this.selectionStartPos = pos;
        
        // Create selection rectangle
        if (!this.selectionRectangle) {
          this.selectionRectangle = new Konva.Rect({
            fill: 'rgba(0, 122, 255, 0.1)',
            stroke: '#007aff',
            strokeWidth: 1,
            dash: [4, 4],
            visible: false
          });
          this.layer.add(this.selectionRectangle);
        }
        
        this.selectionRectangle.width(0);
        this.selectionRectangle.height(0);
        this.selectionRectangle.visible(false);
        
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
    this.stage.on('mousemove touchmove', (e) => {
      const pos = this.getRelativePointerPosition();
      if (!pos) return;
      
      const tool = this.currentTool();
      
      // Handle panning - use screen position for panning
      if (this.isPanning && this.lastPointerPosition) {
        const screenPos = this.stage.getPointerPosition();
        if (!screenPos) return;
        
        const dx = screenPos.x - this.lastPointerPosition.x;
        const dy = screenPos.y - this.lastPointerPosition.y;
        
        const currentPos = this.stage.position();
        this.stage.position({
          x: currentPos.x + dx,
          y: currentPos.y + dy
        });
        
        this.lastPointerPosition = screenPos;
        this.drawInfiniteGrid(); // Update grid during panning, not just at end
        return;
      }
      
      // Handle drag selection
      if (this.isSelecting && this.selectionStartPos && this.selectionRectangle) {
        const x1 = this.selectionStartPos.x;
        const y1 = this.selectionStartPos.y;
        const x2 = pos.x;
        const y2 = pos.y;
        
        this.selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
          visible: true
        });
        
        this.layer.batchDraw();
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
    this.stage.on('mouseup touchend', (e) => {
      // Stop panning
      if (this.isPanning) {
        this.isPanning = false;
        this.lastPointerPosition = null;
        this.stage.container().style.cursor = 'grab';
        return;
      }
      
      // Handle drag selection completion
      if (this.isSelecting && this.selectionRectangle && this.selectionStartPos) {
        this.isSelecting = false;
        
        const selRect = this.selectionRectangle.getClientRect();
        
        // Find shapes within selection rectangle
        const selectedShapes: Konva.Node[] = [];
        this.layer.children.forEach((node: Konva.Node) => {
          if (node === this.transformer || node === this.selectionRectangle) return;
          if (!node.draggable || !node.draggable()) return;
          
          const nodeRect = node.getClientRect();
          
          // Check if node intersects with selection rectangle
          if (this.doRectsIntersect(selRect, nodeRect)) {
            selectedShapes.push(node);
          }
        });
        
        // Update selection
        if (selectedShapes.length > 0) {
          const isShiftKey = e.evt && e.evt.shiftKey;
          
          if (isShiftKey) {
            // Add to existing selection
            const currentNodes = this.transformer.nodes().slice();
            selectedShapes.forEach((shape: any) => {
              if (!currentNodes.includes(shape)) {
                currentNodes.push(shape);
                this.addSelectionHighlight(shape);
              }
            });
            this.transformer.nodes(currentNodes);
          } else {
            // Replace selection
            const previousNodes = this.transformer.nodes();
            previousNodes.forEach((node: any) => {
              this.removeSelectionHighlight(node);
            });
            
            selectedShapes.forEach((shape: any) => {
              this.addSelectionHighlight(shape);
            });
            this.transformer.nodes(selectedShapes);
          }
        }
        
        // Hide and reset selection rectangle
        this.selectionRectangle.visible(false);
        this.selectionStartPos = null;
        this.layer.batchDraw();
        return;
      }
      
      // Don't create shapes if we're not painting (prevents creating shapes when releasing after resize/drag)
      if (!this.isPaint) return;
      
      this.isPaint = false;
      const tool = this.currentTool();
      
      if (tool === 'rectangle' || tool === 'circle' || tool === 'line' || tool === 'arrow') {
        if (this.currentShape) {
          this.layer.add(this.currentShape);
          this.drawingLayer.destroyChildren();
          
          // Add double-click handler for connection labels on lines/arrows
          if (tool === 'line' || tool === 'arrow') {
            this.addConnectionLabelHandler(this.currentShape);
          }
          
          this.currentShape = null;
          this.saveHistory();
        }
      } else if (tool === 'pen') {
        if (this.lastLine) {
          this.layer.add(this.lastLine);
          this.drawingLayer.destroyChildren();
          
          // Add double-click handler for connection labels on pen lines
          this.addConnectionLabelHandler(this.lastLine);
          
          this.lastLine = null;
          this.saveHistory();
        }
      }
    });
    
    // Click on shape to select with visual feedback OR to connect shapes in connector mode
    this.stage.on('click tap', (e) => {
      // Smart Connector Mode
      if (this.currentTool() === 'connector') {
        this.handleConnectorClick(e);
        return;
      }
      
      // Select Mode
      if (this.currentTool() !== 'select') return;
      
      if (e.target === this.stage) {
        // Deselect - remove highlight from all shapes (unless shift is held)
        if (!e.evt.shiftKey) {
          const previousNodes = this.transformer.nodes();
          previousNodes.forEach((node: any) => {
            this.removeSelectionHighlight(node);
          });
          this.transformer.nodes([]);
        }
        return;
      }
      
      let target = e.target as any;
      
      // If clicked on a child element (text, image, shape inside a group), 
      // select the parent group instead
      if (target && target.parent) {
        const parent = target.parent;
        // Check if parent is a draggable group and not the main layer
        if (parent instanceof Konva.Group && 
            parent !== this.layer && 
            parent !== this.drawingLayer &&
            parent.draggable()) {
          target = parent;
        }
      }
      
      if (target && target !== this.transformer && target.draggable()) {
        const isShiftKey = e.evt.shiftKey;
        
        if (isShiftKey) {
          // Multi-select: Add to existing selection
          const currentNodes = this.transformer.nodes().slice();
          const index = currentNodes.indexOf(target);
          
          if (index === -1) {
            // Add to selection
            currentNodes.push(target);
            this.addSelectionHighlight(target);
          } else {
            // Remove from selection
            currentNodes.splice(index, 1);
            this.removeSelectionHighlight(target);
          }
          
          this.transformer.nodes(currentNodes);
        } else {
          // Single select: Replace selection
          const previousNodes = this.transformer.nodes();
          previousNodes.forEach((node: any) => {
            if (node !== target) {
              this.removeSelectionHighlight(node);
            }
          });
          
          this.addSelectionHighlight(target);
          this.transformer.nodes([target]);
        }
        
        this.layer.batchDraw();
      }
    });
  }
  
  // Drawing methods
  private startDrawingRect(pos: { x: number; y: number }): void {
    this.isPaint = true;
    const strokeColor = this.strokeColor();
    const fillColor = this.fillColor();
    const strokeOpacity = this.strokeOpacity() / 100;
    const fillOpacity = this.fillOpacity() / 100;
    
    this.currentShape = new Konva.Rect({
      id: `shape-${Date.now()}-${Math.random()}`,
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      fill: this.fillStyle() !== 'none' ? this.hexToRgba(fillColor, fillOpacity) : 'transparent',
      stroke: this.hexToRgba(strokeColor, strokeOpacity),
      strokeWidth: this.strokeWidth(),
      dash: this.getDashArray(),
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
    const strokeColor = this.strokeColor();
    const fillColor = this.fillColor();
    const strokeOpacity = this.strokeOpacity() / 100;
    const fillOpacity = this.fillOpacity() / 100;
    
    this.currentShape = new Konva.Circle({
      id: `shape-${Date.now()}-${Math.random()}`,
      x: pos.x,
      y: pos.y,
      radius: 0,
      fill: this.fillStyle() !== 'none' ? this.hexToRgba(fillColor, fillOpacity) : 'transparent',
      stroke: this.hexToRgba(strokeColor, strokeOpacity),
      strokeWidth: this.strokeWidth(),
      dash: this.getDashArray(),
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
    const strokeColor = this.strokeColor();
    const strokeOpacity = this.strokeOpacity() / 100;
    
    this.currentShape = new Konva.Arrow({
      id: `shape-${Date.now()}-${Math.random()}`,
      points: [pos.x, pos.y, pos.x, pos.y],
      stroke: this.hexToRgba(strokeColor, strokeOpacity),
      strokeWidth: this.strokeWidth(),
      fill: this.hexToRgba(strokeColor, strokeOpacity),
      pointerLength: isArrow ? 10 : 0,
      pointerWidth: isArrow ? 10 : 0,
      dash: this.getDashArray(),
      draggable: true,
      listening: true,
      hitStrokeWidth: 20 // Make it easier to click on thin lines
    });
    this.drawingLayer.add(this.currentShape);
  }
  
  private updateLine(pos: { x: number; y: number }): void {
    const points = this.currentShape.points();
    this.currentShape.points([points[0], points[1], pos.x, pos.y]);
  }
  
  private startDrawingPen(pos: { x: number; y: number }): void {
    this.isPaint = true;
    const strokeColor = this.strokeColor();
    const strokeOpacity = this.strokeOpacity() / 100;
    
    this.lastLine = new Konva.Line({
      id: `shape-${Date.now()}-${Math.random()}`,
      stroke: this.hexToRgba(strokeColor, strokeOpacity),
      strokeWidth: this.strokeWidth(),
      globalCompositeOperation: 'source-over',
      lineCap: 'round',
      lineJoin: 'round',
      points: [pos.x, pos.y],
      dash: this.getDashArray(),
      draggable: true,
      listening: true,
      hitStrokeWidth: 20 // Make it easier to click on thin lines
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
      id: `shape-${Date.now()}-${Math.random()}`,
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
  
  // Connection Label Handler for Lines/Arrows
  private addConnectionLabelHandler(line: any): void {
    if (!line) return;
    
    console.log('Adding connection label handler to:', line.getClassName());
    
    line.on('dblclick dbltap', (e: any) => {
      console.log('Double-click detected on line/arrow');
      e.cancelBubble = true; // Prevent event propagation
      
      // Get the midpoint of the line
      const points = line.points();
      let midX = line.x();
      let midY = line.y();
      
      if (line instanceof Konva.Arrow || line instanceof Konva.Line) {
        if (points && points.length >= 4) {
          midX = line.x() + (points[0] + points[points.length - 2]) / 2;
          midY = line.y() + (points[1] + points[points.length - 1]) / 2;
        }
      }
      
      console.log('Label position:', midX, midY);
      
      // Check if label already exists
      const allLabels = this.layer.find('.connection-label');
      const existingLabel = allLabels.find((node: any) => {
        return node.getAttr('linkedLine') === line.id();
      }) as Konva.Text | undefined;
      
      if (existingLabel) {
        console.log('Editing existing label');
        this.editConnectionLabel(existingLabel);
        return;
      }
      
      console.log('Creating new label');
      
      // Create a new text label
      const textColor = this.isDarkTheme() ? '#e2e8f0' : '#1a1a1a';
      const label = new Konva.Text({
        x: midX - 30,
        y: midY - 10,
        text: 'Label',
        fontSize: 14,
        fontStyle: 'bold',
        fill: textColor,
        name: 'connection-label',
        draggable: true,
        listening: true,
        padding: 6,
        align: 'center',
        width: 60
      });
      
      // Add background rectangle for label
      const labelBg = new Konva.Rect({
        x: midX - 35,
        y: midY - 14,
        width: 70,
        height: 28,
        fill: this.isDarkTheme() ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        cornerRadius: 6,
        name: 'connection-label-bg',
        draggable: true,
        listening: true,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOpacity: 0.3
      });
      
      // Store reference to line and label for moving together
      label.setAttr('linkedLine', line.id());
      labelBg.setAttr('linkedLabel', label._id);
      
      // Add to layer
      this.layer.add(labelBg);
      this.layer.add(label);
      
      // Sync dragging of label and background
      label.on('dragmove', () => {
        labelBg.position(label.position());
      });
      
      labelBg.on('dragmove', () => {
        label.position(labelBg.position());
      });
      
      // Make label editable on double-click
      label.on('dblclick dbltap', (labelEvent: any) => {
        labelEvent.cancelBubble = true;
        console.log('Double-click on label text');
        this.editConnectionLabel(label);
      });
      
      labelBg.on('dblclick dbltap', (bgEvent: any) => {
        bgEvent.cancelBubble = true;
        console.log('Double-click on label background');
        this.editConnectionLabel(label);
      });
      
      this.layer.batchDraw();
      this.saveHistory();
      
      // Auto-edit the new label
      setTimeout(() => this.editConnectionLabel(label), 100);
    });
  }
  
  private editConnectionLabel(label: Konva.Text): void {
    const textPosition = label.getAbsolutePosition();
    const stageBox = this.stage.container().getBoundingClientRect();
    
    const input = document.createElement('input');
    input.value = label.text();
    input.style.position = 'absolute';
    input.style.top = (stageBox.top + textPosition.y) + 'px';
    input.style.left = (stageBox.left + textPosition.x) + 'px';
    input.style.width = '80px';
    input.style.fontSize = '12px';
    input.style.border = '2px solid #667eea';
    input.style.padding = '4px';
    input.style.background = this.isDarkTheme() ? '#1a1a1a' : '#ffffff';
    input.style.color = this.isDarkTheme() ? '#e2e8f0' : '#1a1a1a';
    input.style.outline = 'none';
    input.style.borderRadius = '4px';
    input.style.fontWeight = 'bold';
    input.style.textAlign = 'center';
    input.style.zIndex = '10000';
    
    document.body.appendChild(input);
    input.focus();
    input.select();
    
    const updateLabel = () => {
      const newText = input.value.trim();
      if (newText) {
        label.text(newText);
        // Update background width based on text
        const labelBg = this.layer.findOne(`.connection-label-bg[linkedLabel="${label._id}"]`);
        if (labelBg) {
          const textWidth = label.width();
          labelBg.width(textWidth + 8);
        }
      } else {
        // Remove label if empty
        label.destroy();
        const labelBg = this.layer.findOne(`.connection-label-bg[linkedLabel="${label._id}"]`);
        if (labelBg) labelBg.destroy();
      }
      document.body.removeChild(input);
      this.layer.batchDraw();
      this.saveHistory();
    };
    
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        updateLabel();
      } else if (e.key === 'Escape') {
        document.body.removeChild(input);
      }
    });
    
    input.addEventListener('blur', updateLabel);
  }
  
  // Smart Connector - Click to connect shapes
  private handleConnectorClick(e: any): void {
    // Ignore clicks on stage background
    if (e.target === this.stage) {
      this.cancelConnector();
      return;
    }
    
    let target = e.target as any;
    
    // Navigate to parent group if clicked on child element
    if (target && target.parent) {
      const parent = target.parent;
      if (parent instanceof Konva.Group && 
          parent !== this.layer && 
          parent !== this.drawingLayer &&
          parent.draggable()) {
        target = parent;
      }
    }
    
    // Only connect draggable shapes/groups
    if (!target || !target.draggable()) {
      return;
    }
    
    // First click - select source shape
    if (!this.connectorFirstShape) {
      this.connectorFirstShape = target;
      this.addConnectorHighlight(target);
      console.log('Smart Connector: First shape selected', target.id());
      
      // Add mouse move listener for preview line
      this.stage.on('mousemove.connector', () => {
        this.updateConnectorPreview();
      });
    } 
    // Second click - create connection
    else if (this.connectorFirstShape !== target) {
      this.createSmartConnection(this.connectorFirstShape, target);
      this.cancelConnector();
    }
    // Clicked same shape - cancel
    else {
      this.cancelConnector();
    }
  }
  
  private createSmartConnection(fromShape: any, toShape: any): void {
    // Check if we should use curved connectors
    if (this.useCurvedConnectors()) {
      this.createCurvedConnection(fromShape, toShape);
      return;
    }
    
    // Get connection points at the edges of shapes
    const { from, to } = this.getConnectionPoints(fromShape, toShape);
    
    console.log('Creating smart connection from', from, 'to', to);
    
    // Create arrow
    const strokeColor = this.strokeColor();
    const strokeOpacity = this.strokeOpacity() / 100;
    
    const arrow = new Konva.Arrow({
      id: `connector-${Date.now()}-${Math.random()}`,
      points: [from.x, from.y, to.x, to.y],
      stroke: this.hexToRgba(strokeColor, strokeOpacity),
      strokeWidth: this.strokeWidth(),
      fill: this.hexToRgba(strokeColor, strokeOpacity),
      pointerLength: 10,
      pointerWidth: 10,
      dash: this.getDashArray(),
      draggable: false,
      listening: true,
      hitStrokeWidth: 20,
      // Store connection metadata
      name: 'smart-connector'
    });
    
    // Store references to connected shapes
    arrow.setAttr('fromShape', fromShape.id());
    arrow.setAttr('toShape', toShape.id());
    
    this.layer.add(arrow);
    arrow.moveToBottom(); // Keep connectors behind shapes
    
    // Make arrow selectable for color changes
    arrow.on('click', (e: any) => {
      if (this.currentTool() === 'select') {
        e.cancelBubble = true;
        
        const isShiftKey = e.evt?.shiftKey;
        
        if (isShiftKey) {
          // Multi-select
          const currentNodes = this.transformer.nodes().slice();
          const index = currentNodes.indexOf(arrow);
          
          if (index === -1) {
            currentNodes.push(arrow);
            this.addSelectionHighlight(arrow);
          } else {
            currentNodes.splice(index, 1);
            this.removeSelectionHighlight(arrow);
          }
          
          this.transformer.nodes(currentNodes);
        } else {
          // Single select
          const previousNodes = this.transformer.nodes();
          previousNodes.forEach((node: any) => {
            if (node !== arrow) {
              this.removeSelectionHighlight(node);
            }
          });
          
          this.addSelectionHighlight(arrow);
          this.transformer.nodes([arrow]);
        }
        
        this.layer.batchDraw();
      }
    });
    
    // Add connection label handler
    this.addConnectionLabelHandler(arrow);
    
    // Update connector when shapes move
    this.setupConnectorUpdates(arrow, fromShape, toShape);
    
    this.layer.batchDraw();
    this.saveHistory();
  }
  
  private getShapeCenter(shape: any): { x: number, y: number } {
    const box = shape.getClientRect();
    return {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    };
  }
  
  // Get connection points at the edges of shapes (not centers)
  private getConnectionPoints(fromShape: any, toShape: any): { from: { x: number, y: number }, to: { x: number, y: number } } {
    const fromBox = fromShape.getClientRect();
    const toBox = toShape.getClientRect();
    
    const fromCenter = {
      x: fromBox.x + fromBox.width / 2,
      y: fromBox.y + fromBox.height / 2
    };
    
    const toCenter = {
      x: toBox.x + toBox.width / 2,
      y: toBox.y + toBox.height / 2
    };
    
    // Calculate angle between centers
    const dx = toCenter.x - fromCenter.x;
    const dy = toCenter.y - fromCenter.y;
    const angle = Math.atan2(dy, dx);
    
    // Find exit point on fromShape's edge
    const from = this.getEdgePoint(fromBox, fromCenter, angle);
    
    // Find entry point on toShape's edge (opposite angle)
    const to = this.getEdgePoint(toBox, toCenter, angle + Math.PI);
    
    return { from, to };
  }
  
  // Get the point where a line at given angle intersects the shape's edge
  private getEdgePoint(box: any, center: { x: number, y: number }, angle: number): { x: number, y: number } {
    const halfWidth = box.width / 2;
    const halfHeight = box.height / 2;
    
    // Calculate intersection with rectangle edges
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    // Check which edge the line intersects
    const tanAngle = Math.tan(angle);
    
    let x = center.x;
    let y = center.y;
    
    // Determine which edge to use based on angle
    if (Math.abs(cos) > Math.abs(sin)) {
      // Intersects left or right edge
      if (cos > 0) {
        // Right edge
        x = box.x + box.width;
        y = center.y + (box.x + box.width - center.x) * tanAngle;
      } else {
        // Left edge
        x = box.x;
        y = center.y + (box.x - center.x) * tanAngle;
      }
    } else {
      // Intersects top or bottom edge
      if (sin > 0) {
        // Bottom edge
        y = box.y + box.height;
        x = center.x + (box.y + box.height - center.y) / tanAngle;
      } else {
        // Top edge
        y = box.y;
        x = center.x + (box.y - center.y) / tanAngle;
      }
    }
    
    // Clamp to box boundaries
    x = Math.max(box.x, Math.min(box.x + box.width, x));
    y = Math.max(box.y, Math.min(box.y + box.height, y));
    
    return { x, y };
  }
  
  private setupConnectorUpdates(arrow: Konva.Arrow, fromShape: any, toShape: any): void {
    // Update arrow when either shape moves
    const updateArrow = () => {
      const { from, to } = this.getConnectionPoints(fromShape, toShape);
      arrow.points([from.x, from.y, to.x, to.y]);
      this.layer.batchDraw();
    };
    
    fromShape.on('dragmove.connector', updateArrow);
    toShape.on('dragmove.connector', updateArrow);
    
    // Store update function for cleanup
    arrow.setAttr('updateFn', updateArrow);
  }
  
  private updateConnectorPreview(): void {
    if (!this.connectorFirstShape) return;
    
    const pointerPos = this.stage.getPointerPosition();
    if (!pointerPos) return;
    
    const from = this.getShapeCenter(this.connectorFirstShape);
    
    // Remove old preview
    if (this.connectorPreviewLine) {
      this.connectorPreviewLine.destroy();
    }
    
    // Create preview line
    this.connectorPreviewLine = new Konva.Arrow({
      points: [from.x, from.y, pointerPos.x, pointerPos.y],
      stroke: '#667eea',
      strokeWidth: 2,
      fill: '#667eea',
      pointerLength: 10,
      pointerWidth: 10,
      dash: [10, 5],
      opacity: 0.5,
      listening: false
    });
    
    this.drawingLayer.add(this.connectorPreviewLine);
    this.drawingLayer.batchDraw();
  }
  
  private cancelConnector(): void {
    console.log('Smart Connector: Cancelled');
    
    // Remove highlight
    if (this.connectorFirstShape) {
      this.removeConnectorHighlight(this.connectorFirstShape);
      this.connectorFirstShape = null;
    }
    
    // Remove preview line
    if (this.connectorPreviewLine) {
      this.connectorPreviewLine.destroy();
      this.connectorPreviewLine = null;
    }
    
    // Remove mouse move listener
    this.stage.off('mousemove.connector');
    
    this.drawingLayer.batchDraw();
  }
  
  private addConnectorHighlight(shape: any): void {
    // Store original values for later restoration
    if (!shape.getAttr('_connectorHighlight')) {
      shape.setAttr('_connectorHighlight', true);
      
      // Store original shadow values
      shape.setAttr('_originalShadow', {
        color: shape.shadowColor?.() || 'black',
        blur: shape.shadowBlur?.() || 0,
        opacity: shape.shadowOpacity?.() || 0
      });
      
      // For Groups, highlight the background rectangle if it exists
      if (shape instanceof Konva.Group) {
        const bgRect = shape.findOne('.component-bg') as any;
        if (bgRect && typeof bgRect.stroke === 'function') {
          bgRect.setAttr('_originalStroke', bgRect.stroke());
          bgRect.setAttr('_originalStrokeWidth', bgRect.strokeWidth());
          bgRect.stroke('#667eea');
          bgRect.strokeWidth(3);
        }
      } else if (typeof shape.stroke === 'function') {
        // For basic shapes
        shape.setAttr('_originalStroke', shape.stroke());
        shape.setAttr('_originalStrokeWidth', shape.strokeWidth?.() || 2);
        shape.stroke('#667eea');
        if (typeof shape.strokeWidth === 'function') {
          shape.strokeWidth(3);
        }
      }
    }
    
    // Apply shadow (works for both Groups and Shapes)
    if (typeof shape.shadowColor === 'function') {
      shape.shadowColor('#667eea');
      shape.shadowBlur(20);
      shape.shadowOpacity(0.6);
    }
    
    this.layer.batchDraw();
  }
  
  private removeConnectorHighlight(shape: any): void {
    if (!shape.getAttr('_connectorHighlight')) {
      return; // No highlight to remove
    }
    
    shape.setAttr('_connectorHighlight', false);
    
    // Restore original shadow values
    const originalShadow = shape.getAttr('_originalShadow');
    if (originalShadow && typeof shape.shadowColor === 'function') {
      shape.shadowColor(originalShadow.color);
      shape.shadowBlur(originalShadow.blur);
      shape.shadowOpacity(originalShadow.opacity);
    }
    shape.setAttr('_originalShadow', undefined);
    
    // For Groups, restore background rectangle
    if (shape instanceof Konva.Group) {
      const bgRect = shape.findOne('.component-bg') as any;
      if (bgRect) {
        const originalStroke = bgRect.getAttr('_originalStroke');
        const originalStrokeWidth = bgRect.getAttr('_originalStrokeWidth');
        
        if (originalStroke !== undefined && typeof bgRect.stroke === 'function') {
          bgRect.stroke(originalStroke);
        }
        if (originalStrokeWidth !== undefined && typeof bgRect.strokeWidth === 'function') {
          bgRect.strokeWidth(originalStrokeWidth);
        }
        
        bgRect.setAttr('_originalStroke', undefined);
        bgRect.setAttr('_originalStrokeWidth', undefined);
      }
    } else {
      // For basic shapes
      const originalStroke = shape.getAttr('_originalStroke');
      const originalStrokeWidth = shape.getAttr('_originalStrokeWidth');
      
      if (originalStroke !== undefined && typeof shape.stroke === 'function') {
        shape.stroke(originalStroke);
      }
      if (originalStrokeWidth !== undefined && typeof shape.strokeWidth === 'function') {
        shape.strokeWidth(originalStrokeWidth);
      }
      
      shape.setAttr('_originalStroke', undefined);
      shape.setAttr('_originalStrokeWidth', undefined);
    }
    
    this.layer.batchDraw();
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
      id: `shape-${Date.now()}-${Math.random()}`,
      x: pos.x,
      y: pos.y,
      draggable: true,
      name: 'component-group'
    });
    
    // Add direct click handler to the group
    group.on('click tap', (e) => {
      if (this.currentTool() !== 'select') return;
      
      e.cancelBubble = true; // Prevent event from bubbling to stage
      
      const isShiftKey = e.evt && e.evt.shiftKey;
      
      if (isShiftKey) {
        // Multi-select
        const currentNodes = this.transformer.nodes().slice();
        const index = currentNodes.indexOf(group);
        
        if (index === -1) {
          currentNodes.push(group);
          this.addSelectionHighlight(group);
        } else {
          currentNodes.splice(index, 1);
          this.removeSelectionHighlight(group);
        }
        
        this.transformer.nodes(currentNodes);
      } else {
        // Single select
        const previousNodes = this.transformer.nodes();
        previousNodes.forEach((node: any) => {
          if (node !== group) {
            this.removeSelectionHighlight(node);
          }
        });
        
        this.addSelectionHighlight(group);
        this.transformer.nodes([group]);
      }
      
      this.layer.batchDraw();
    });
    
    // Add double-click handler to edit component name
    group.on('dblclick', (e) => {
      e.cancelBubble = true;
      
      // Find the text node (it's the second child - the name)
      const textNode = group.children?.find((child: any) => 
        child.getClassName() === 'Text' && child.y() > 50
      ) as Konva.Text;
      
      if (!textNode) return;
      
      // Hide text node while editing
      textNode.hide();
      
      // Get the absolute position of the text node
      const textPosition = textNode.getAbsolutePosition();
      const stageBox = this.stage.container().getBoundingClientRect();
      
      // Create HTML input element
      const textarea = document.createElement('input');
      textarea.value = textNode.text();
      textarea.style.position = 'absolute';
      textarea.style.top = (textPosition.y + stageBox.top) + 'px';
      textarea.style.left = (textPosition.x + stageBox.left) + 'px';
      textarea.style.width = textNode.width() + 'px';
      textarea.style.fontSize = textNode.fontSize() + 'px';
      textarea.style.border = '2px solid #3b82f6';
      textarea.style.padding = '2px';
      textarea.style.margin = '0px';
      textarea.style.overflow = 'hidden';
      textarea.style.background = this.isDarkTheme() ? '#1e293b' : '#ffffff';
      textarea.style.color = (typeof textNode.fill() === 'string' ? textNode.fill() : '#000000') as string;
      textarea.style.outline = 'none';
      textarea.style.resize = 'none';
      textarea.style.fontFamily = textNode.fontFamily() || 'Arial';
      textarea.style.fontWeight = textNode.fontStyle() || 'normal';
      textarea.style.textAlign = 'center';
      textarea.style.borderRadius = '4px';
      textarea.style.zIndex = '1000';
      
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      
      let isTextareaRemoved = false;
      
      const removeTextarea = () => {
        if (isTextareaRemoved) return; // Prevent double removal
        isTextareaRemoved = true;
        
        const newText = textarea.value.trim();
        if (newText) {
          textNode.text(newText);
          // Update the stored component name attribute
          group.setAttr('componentName', newText);
        }
        
        // Safely remove textarea
        if (textarea.parentNode) {
          textarea.parentNode.removeChild(textarea);
        }
        textNode.show();
        this.layer.batchDraw();
        this.saveHistory();
      };
      
      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          removeTextarea();
        } else if (e.key === 'Escape') {
          isTextareaRemoved = true;
          if (textarea.parentNode) {
            textarea.parentNode.removeChild(textarea);
          }
          textNode.show();
          this.layer.batchDraw();
        }
      });
      
      textarea.addEventListener('blur', removeTextarea);
    });
    
    const textColor = this.isDarkTheme() ? '#e2e8f0' : '#1a1a1a';
    const iconColor = component.color || '#3b82f6';
    
    // Store component info for later color updates
    group.setAttr('faIcon', component.faIcon);
    group.setAttr('componentName', component.name);
    group.setAttr('iconColor', iconColor); // Store icon color for export/import
    
    // Check if this is a custom component with uploaded image
    const customImageUrl = (component as any).imageUrl;
    if (customImageUrl) {
      // Handle custom uploaded image
      try {
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
          console.error('Failed to load custom image');
          // Fallback to emoji
          this.addComponentWithEmojiIcon(group, component, textColor);
        };
        
        imageObj.src = customImageUrl;
      } catch (error) {
        console.error('Error loading custom image:', error);
        this.addComponentWithEmojiIcon(group, component, textColor);
      }
    }
    // Use Font Awesome icon via Iconify API
    else if (component.faIcon) {
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
  
  /**
   * Helper method for imported components with emoji fallback
   */
  private addImportedComponentWithEmoji(group: Konva.Group, componentName: string, componentIcon: string, textColor: string): void {
    const icon = new Konva.Text({
      x: 0,
      y: 0,
      text: componentIcon,
      fontSize: 48,
      align: 'center',
      fill: textColor,
      width: 80,
      fontFamily: 'Arial, sans-serif'
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
    
    group.add(icon, name);
    this.layer.batchDraw();
  }
  
  // History management
  private saveHistory(): void {
    // Export all shapes with custom logic to preserve icons and attributes
    const shapes = this.layer.children.filter((child: any) => 
      child.getClassName() !== 'Transformer' && !child.hasName('selection-box')
    ).map((shape: any) => this.exportShapeForHistory(shape)).filter(s => s !== null);
    
    const json = JSON.stringify({ shapes });
    this.history = this.history.slice(0, this.historyStep + 1);
    this.history.push(json);
    this.historyStep++;
    
    // Auto-save to localStorage (but not during restore)
    if (!this.isRestoring) {
      this.autoSaveToLocalStorage();
    }
  }
  
  // Auto-save current canvas to localStorage
  private autoSaveToLocalStorage(): void {
    try {
      const canvasData = this.exportToJSONString();
      localStorage.setItem('architecture-builder-autosave', canvasData);
      localStorage.setItem('architecture-builder-autosave-timestamp', new Date().toISOString());
      console.log('Auto-saved to localStorage');
    } catch (error) {
      console.error('Failed to auto-save:', error);
    }
  }
  
  // Restore from localStorage on init
  private restoreFromLocalStorage(): void {
    try {
      const savedData = localStorage.getItem('architecture-builder-autosave');
      if (savedData) {
        const timestamp = localStorage.getItem('architecture-builder-autosave-timestamp');
        console.log('📥 Restoring from:', timestamp);
        
        // Parse to check what we're restoring
        const data = JSON.parse(savedData);
        const shapeCount = data.shapes?.length || 0;
        
        if (shapeCount === 0) {
          console.warn('⚠️ No shapes to restore - localStorage may be empty');
          return; // Don't restore if there's nothing to restore
        }
        
        console.log(`📦 Restoring ${shapeCount} shapes`);
        
        // Set flag to prevent auto-save during restore
        this.isRestoring = true;
        
        this.loadFromJSONString(savedData);
        
        // Ensure grid is redrawn
        this.drawInfiniteGrid();
        
        // Force redraw
        this.layer.batchDraw();
        
        // Clear flag after restore
        this.isRestoring = false;
        
        console.log('✅ Canvas restored successfully');
      } else {
        console.log('ℹ️ No auto-save data found');
      }
    } catch (error) {
      console.error('❌ Failed to restore from auto-save:', error);
      this.isRestoring = false;
    }
  }
  
  // Simplified export for history (similar to exportToJSON but lighter)
  private exportShapeForHistory(shape: any): any {
    const className = shape.getClassName();
    if (!className || className === 'Shape') return null;
    
    const data: any = {
      id: shape.id(),
      type: className,
      x: shape.x(),
      y: shape.y(),
      rotation: shape.rotation() || 0,
      scaleX: shape.scaleX() || 1,
      scaleY: shape.scaleY() || 1,
    };
    
    if (className === 'Group' && shape.hasName('component-group')) {
      data.groupType = 'component-group';
      data.faIcon = shape.getAttr('faIcon');
      data.iconColor = shape.getAttr('iconColor');
      data.componentIcon = shape.getAttr('componentIcon');
      
      // PRIORITY 1: Get from componentName attribute (most reliable)
      let componentName = shape.getAttr('componentName');
      
      // PRIORITY 2: Get from text child as fallback
      if (!componentName) {
        const children = shape.getChildren();
        const nameText = children.find((child: any) => 
          child.getClassName() === 'Text' && child.y() > 50
        );
        
        if (nameText) {
          componentName = nameText.text();
          data.textColor = nameText.fill();
        } else {
          // PRIORITY 3: Try children[1]
          const secondChild = children[1];
          if (secondChild && secondChild.getClassName() === 'Text') {
            componentName = secondChild.text();
            data.textColor = secondChild.fill();
          }
        }
      } else {
        // If we got name from attribute, still get textColor from child
        const children = shape.getChildren();
        const nameText = children.find((child: any) => 
          child.getClassName() === 'Text' && child.y() > 50
        );
        if (nameText) {
          data.textColor = nameText.fill();
        }
      }
      
      data.componentName = componentName || 'Component';
    } else if (className === 'Text') {
      data.text = shape.text();
      data.fontSize = shape.fontSize();
      data.fontFamily = shape.fontFamily();
      data.fill = shape.fill();
      data.width = shape.width();
    } else if (className === 'Rect') {
      data.width = shape.width();
      data.height = shape.height();
      data.fill = shape.fill();
      data.stroke = shape.stroke();
      data.strokeWidth = shape.strokeWidth();
      data.cornerRadius = shape.cornerRadius() || 0;
    } else {
      // For other shapes, use Konva's toJSON as fallback
      return shape.toObject();
    }
    
    return data;
  }
  
  // Keyboard shortcuts
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.isBrowser) return;
    
    // Check if user is typing in an input field or textarea
    const target = event.target as HTMLElement;
    const isTyping = target.tagName === 'INPUT' || 
                     target.tagName === 'TEXTAREA' || 
                     target.isContentEditable;
    
    // If user is typing, only allow Cmd/Ctrl shortcuts (undo, redo, etc.)
    // but not single-key shortcuts
    if (isTyping && !event.metaKey && !event.ctrlKey) {
      return; // Let the typing continue without interference
    }
    
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
    
    // Delete: Delete or Backspace (skip if typing)
    if ((event.key === 'Delete' || event.key === 'Backspace') && !isTyping) {
      event.preventDefault();
      this.deleteSelected();
    }
    
    // Duplicate: Cmd+D or Ctrl+D
    if ((event.metaKey || event.ctrlKey) && event.key === 'd') {
      event.preventDefault();
      this.duplicateSelected();
    }
    
    // Copy: Cmd+C or Ctrl+C
    if ((event.metaKey || event.ctrlKey) && event.key === 'c') {
      event.preventDefault();
      this.copySelected();
    }
    
    // Paste: Cmd+V or Ctrl+V
    if ((event.metaKey || event.ctrlKey) && event.key === 'v' && !isTyping) {
      event.preventDefault();
      this.pasteShapes();
    }
    
    // Keyboard Shortcuts Help: ?
    if (event.key === '?' && !isTyping) {
      event.preventDefault();
      this.toggleShortcutsPanel();
    }
    
    // Escape: Return to Select tool
    if (event.key === 'Escape' && !isTyping) {
      event.preventDefault();
      this.setTool('select');
    }
    
    // Group: Cmd+G or Ctrl+G
    if ((event.metaKey || event.ctrlKey) && event.key === 'g' && !event.shiftKey) {
      event.preventDefault();
      this.groupSelected();
    }
    
    // Ungroup: Cmd+Shift+G or Ctrl+Shift+G
    if ((event.metaKey || event.ctrlKey) && event.key === 'g' && event.shiftKey) {
      event.preventDefault();
      this.ungroupSelected();
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
        case 'k': this.setTool('connector'); break;
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
    
    // Clear current layer (but keep transformer)
    this.layer.children.forEach((child: any) => {
      if (child !== this.transformer) {
        child.destroy();
      }
    });
    
    // Restore shapes from history
    try {
      const data = JSON.parse(json);
      if (data.shapes) {
        data.shapes.forEach((shapeData: any) => {
          this.restoreShapeFromHistory(shapeData);
        });
      }
    } catch (error) {
      console.error('Error restoring from history:', error);
    }
    
    this.layer.batchDraw();
  }
  
  redo(): void {
    if (this.historyStep === this.history.length - 1) return;
    this.historyStep++;
    const json = this.history[this.historyStep];
    
    // Clear current layer (but keep transformer)
    this.layer.children.forEach((child: any) => {
      if (child !== this.transformer) {
        child.destroy();
      }
    });
    
    // Restore shapes from history
    try {
      const data = JSON.parse(json);
      if (data.shapes) {
        data.shapes.forEach((shapeData: any) => {
          this.restoreShapeFromHistory(shapeData);
        });
      }
    } catch (error) {
      console.error('Error restoring from history:', error);
    }
    
    this.layer.batchDraw();
  }
  
  // Restore a shape from history data
  private restoreShapeFromHistory(shapeData: any): void {
    if (!shapeData || !shapeData.type) return;
    
    let shape: any;
    
    if (shapeData.type === 'Group' && shapeData.groupType === 'component-group') {
      // Restore component group with icon
      shape = new Konva.Group({
        id: shapeData.id,
        x: shapeData.x,
        y: shapeData.y,
        draggable: true,
        name: 'component-group'
      });
      
      // Store icon attributes AND componentName
      shape.setAttr('faIcon', shapeData.faIcon);
      shape.setAttr('iconColor', shapeData.iconColor);
      shape.setAttr('componentName', shapeData.componentName || 'Component');
      if (shapeData.componentIcon) {
        shape.setAttr('componentIcon', shapeData.componentIcon);
      }
      
      // Apply scale
      if (shapeData.scaleX) shape.scaleX(shapeData.scaleX);
      if (shapeData.scaleY) shape.scaleY(shapeData.scaleY);
      
      // Load icon async
      if (shapeData.faIcon) {
        this.generateIconDataURL(shapeData.faIcon, shapeData.iconColor || '#3b82f6').then(iconDataURL => {
          const imageObj = new Image();
          imageObj.onload = () => {
            shape.destroyChildren();
            
            const icon = new Konva.Image({
              x: 16,
              y: 0,
              image: imageObj,
              width: 48,
              height: 48
            });
            
            const name = new Konva.Text({
              x: 0,
              y: 55,
              text: shapeData.componentName || 'Component',
              fontSize: 14,
              fontStyle: 'bold',
              align: 'center',
              fill: shapeData.textColor || '#1a1a1a',
              width: 80
            });
            
            shape.add(icon, name);
            // Re-apply scale after children are added
            if (shapeData.scaleX) shape.scaleX(shapeData.scaleX);
            if (shapeData.scaleY) shape.scaleY(shapeData.scaleY);
            this.layer.batchDraw();
          };
          imageObj.src = iconDataURL;
        });
      }
      
      this.layer.add(shape);
    } else if (shapeData.type === 'Text') {
      shape = new Konva.Text({
        id: shapeData.id,
        x: shapeData.x,
        y: shapeData.y,
        text: shapeData.text,
        fontSize: shapeData.fontSize,
        fill: shapeData.fill,
        width: shapeData.width,
        draggable: true
      });
      if (shapeData.scaleX) shape.scaleX(shapeData.scaleX);
      if (shapeData.scaleY) shape.scaleY(shapeData.scaleY);
      shape.on('dblclick dbltap', () => this.editText(shape));
      this.layer.add(shape);
    } else if (shapeData.type === 'Rect') {
      shape = new Konva.Rect({
        id: shapeData.id,
        x: shapeData.x,
        y: shapeData.y,
        width: shapeData.width,
        height: shapeData.height,
        fill: shapeData.fill,
        stroke: shapeData.stroke,
        draggable: true
      });
      if (shapeData.scaleX) shape.scaleX(shapeData.scaleX);
      if (shapeData.scaleY) shape.scaleY(shapeData.scaleY);
      this.layer.add(shape);
    } else {
      // Fallback: use Konva's fromObject
      try {
        shape = Konva.Node.create(shapeData);
        this.layer.add(shape);
      } catch (error) {
        console.error('Could not restore shape:', shapeData, error);
      }
    }
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

  groupSelected(): void {
    const selectedNodes = this.transformer.nodes();
    
    console.log('Group attempt - Selected nodes:', selectedNodes.length, selectedNodes);
    
    // Need at least 2 items to group
    if (selectedNodes.length < 2) {
      console.log('Select at least 2 items to group. Currently selected:', selectedNodes.length);
      alert(`Select at least 2 items to group (currently selected: ${selectedNodes.length}). Use Shift+Click or drag to select multiple items.`);
      return;
    }

    // Create a new group
    const newGroup = new Konva.Group({
      draggable: true,
      name: 'user-group'
    });

    // Add click handler to the user group for selection
    newGroup.on('click', (e) => {
      if (this.currentTool() !== 'select') return;
      
      const isShiftKey = e.evt && e.evt.shiftKey;
      
      if (isShiftKey) {
        // Multi-select
        const currentNodes = this.transformer.nodes().slice();
        const index = currentNodes.indexOf(newGroup);
        
        if (index === -1) {
          currentNodes.push(newGroup);
          this.addSelectionHighlight(newGroup);
        } else {
          currentNodes.splice(index, 1);
          this.removeSelectionHighlight(newGroup);
        }
        
        this.transformer.nodes(currentNodes);
      } else {
        // Single select
        const previousNodes = this.transformer.nodes();
        previousNodes.forEach((node: any) => {
          if (node !== newGroup) {
            this.removeSelectionHighlight(node);
          }
        });
        
        this.addSelectionHighlight(newGroup);
        this.transformer.nodes([newGroup]);
      }
      
      this.layer.batchDraw();
    });

    // Calculate the bounding box of all selected nodes
    let minX = Infinity, minY = Infinity;
    selectedNodes.forEach((node: any) => {
      const pos = node.getAbsolutePosition();
      minX = Math.min(minX, pos.x);
      minY = Math.min(minY, pos.y);
    });

    // Set group position to top-left of bounding box
    newGroup.x(minX);
    newGroup.y(minY);

    // Move selected nodes into the group and adjust their positions
    const oldParentGroups: Set<any> = new Set();
    
    selectedNodes.forEach((node: any) => {
      const absPos = node.getAbsolutePosition();
      
      // Track the old parent group if it exists
      const oldParent = node.getParent();
      if (oldParent instanceof Konva.Group && oldParent.hasName('user-group')) {
        oldParentGroups.add(oldParent);
      }
      
      // Remove from current parent
      node.remove();
      
      // Adjust position relative to new group
      node.x(absPos.x - minX);
      node.y(absPos.y - minY);
      node.draggable(false); // Disable individual dragging but keep listening for color changes
      
      // Keep listening enabled but add click handler to select for color changes only
      if (node instanceof Konva.Group || node instanceof Konva.Shape) {
        node.on('click tap', (e: any) => {
          if (this.currentTool() !== 'select') return;
          e.cancelBubble = true; // Prevent group from being selected
          
          // Select this individual item for color changes
          const isShiftKey = e.evt && e.evt.shiftKey;
          
          if (isShiftKey) {
            const currentNodes = this.transformer.nodes().slice();
            const index = currentNodes.indexOf(node);
            if (index === -1) {
              currentNodes.push(node);
              this.addSelectionHighlight(node);
            } else {
              currentNodes.splice(index, 1);
              this.removeSelectionHighlight(node);
            }
            this.transformer.nodes(currentNodes);
          } else {
            const previousNodes = this.transformer.nodes();
            previousNodes.forEach((n: any) => {
              if (n !== node) {
                this.removeSelectionHighlight(n);
              }
            });
            this.addSelectionHighlight(node);
            this.transformer.nodes([node]);
          }
          
          this.layer.batchDraw();
        });
      }
      
      // Add to group
      newGroup.add(node);
    });
    
    // Clean up old parent groups: remove empty groups or update their borders
    oldParentGroups.forEach((oldGroup: any) => {
      const remainingChildren = oldGroup.getChildren().filter((child: any) => 
        !child.hasName('group-border')
      );
      
      if (remainingChildren.length === 0) {
        // Group is now empty, remove it
        oldGroup.destroy();
      } else {
        // Update the border to fit remaining children
        const border = oldGroup.findOne('.group-border');
        if (border) {
          const groupBounds = oldGroup.getClientRect({ relativeTo: oldGroup });
          const padding = 5;
          border.x(groupBounds.x - padding);
          border.y(groupBounds.y - padding);
          border.width(groupBounds.width + (padding * 2));
          border.height(groupBounds.height + (padding * 2));
        }
      }
    });

    // Add a permanent visual border to show this is a grouped item
    // Position it slightly outside the content with padding
    // Use different colors for nested groups
    const padding = 5;
    const groupBounds = newGroup.getClientRect({ relativeTo: newGroup });
    
    // Determine nesting level by checking if any selected nodes are already groups
    let nestingLevel = 0;
    selectedNodes.forEach((node: any) => {
      if (node instanceof Konva.Group && node.hasName('user-group')) {
        // Find the existing border to determine its nesting level
        const existingBorder = node.findOne('.group-border');
        if (existingBorder) {
          const currentLevel = existingBorder.getAttr('nestingLevel') || 0;
          nestingLevel = Math.max(nestingLevel, currentLevel + 1);
        } else {
          nestingLevel = Math.max(nestingLevel, 1);
        }
      }
    });
    
    // Choose border color based on nesting level
    const borderColors = ['#9333ea', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
    const borderColor = borderColors[nestingLevel % borderColors.length];
    
    const groupBorder = new Konva.Rect({
      x: groupBounds.x - padding,
      y: groupBounds.y - padding,
      width: groupBounds.width + (padding * 2),
      height: groupBounds.height + (padding * 2),
      stroke: borderColor,
      strokeWidth: 2,
      dash: [8, 4], // Dashed line pattern
      listening: false, // Don't interfere with clicks
      name: 'group-border',
      hitStrokeWidth: 0, // Ensure it doesn't capture any hit events
      nestingLevel: nestingLevel // Store nesting level for future reference
    });
    
    // Add border as first child so it appears behind content
    newGroup.add(groupBorder);
    groupBorder.moveToBottom();

    // Add group to layer
    this.layer.add(newGroup);

    // Select the new group
    this.transformer.nodes([newGroup]);
    this.addSelectionHighlight(newGroup);
    
    // Force transformer to move to top and update
    this.transformer.moveToTop();
    this.transformer.forceUpdate();
    
    this.layer.batchDraw();
    this.saveHistory();
    
    console.log('Successfully grouped', selectedNodes.length, 'items');
  }

  ungroupSelected(): void {
    const selectedNodes = this.transformer.nodes();
    
    if (selectedNodes.length === 0) {
      console.log('Select a group to ungroup');
      return;
    }

    const nodesToSelect: Konva.Node[] = [];

    selectedNodes.forEach((node: any) => {
      // Check if this is a group (and not a shape-with-label group)
      if (node instanceof Konva.Group && node.hasName('user-group')) {
        const groupPos = node.getAbsolutePosition();
        const children = node.getChildren().slice(); // Clone array to avoid modification issues

        // Move children out of the group
        children.forEach((child: any) => {
          // Skip the group border - we don't want to ungroup it
          if (child.hasName('group-border')) {
            return;
          }
          
          const childAbsPos = child.getAbsolutePosition();
          
          // Remove from group
          child.remove();
          
          // Set absolute position
          child.x(childAbsPos.x);
          child.y(childAbsPos.y);
          child.draggable(true); // Re-enable dragging
          child.listening(true); // Re-enable event listening
          
          // Add to layer
          this.layer.add(child);
          nodesToSelect.push(child);
        });

        // Remove the empty group
        this.removeSelectionHighlight(node);
        node.destroy();
      } else {
        // If not a user group, keep it selected
        nodesToSelect.push(node);
      }
    });

    // Select the ungrouped items
    if (nodesToSelect.length > 0) {
      this.transformer.nodes(nodesToSelect);
      nodesToSelect.forEach((node: any) => this.addSelectionHighlight(node));
    } else {
      this.transformer.nodes([]);
    }

    this.layer.batchDraw();
    this.saveHistory();
  }
  
  // Lock/Unlock selected shapes
  lockSelected(): void {
    const nodes = this.transformer.nodes();
    if (nodes.length === 0) return;
    
    nodes.forEach((node: any) => {
      node.draggable(false);
      node.setAttr('locked', true);
      
      // Add visual indicator
      this.addLockIndicator(node);
    });
    
    this.layer.batchDraw();
    this.saveHistory();
  }
  
  unlockSelected(): void {
    const nodes = this.transformer.nodes();
    if (nodes.length === 0) return;
    
    nodes.forEach((node: any) => {
      node.draggable(true);
      node.setAttr('locked', false);
      
      // Remove lock indicator
      this.removeLockIndicator(node);
    });
    
    this.layer.batchDraw();
    this.saveHistory();
  }
  
  private addLockIndicator(shape: any): void {
    // Only add indicator to Groups (component shapes)
    if (!(shape instanceof Konva.Group)) return;
    if (shape.findOne('.lock-indicator')) return;
    
    const box = shape.getClientRect();
    const lockIcon = new Konva.Text({
      x: box.width - 20,
      y: 5,
      text: '🔒',
      fontSize: 14,
      name: 'lock-indicator',
      listening: false,
      fill: '#ef4444'
    });
    
    shape.add(lockIcon);
  }
  
  private removeLockIndicator(shape: any): void {
    // Only remove from Groups (component shapes)
    if (!(shape instanceof Konva.Group)) return;
    
    const indicator = shape.findOne('.lock-indicator');
    if (indicator) {
      indicator.destroy();
    }
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
    // Cancel connector mode if switching away
    if (this.currentTool() === 'connector' && tool !== 'connector') {
      this.cancelConnector();
    }
    
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
      
      // Update text colors on canvas for visibility
      this.updateTextColorsForTheme(isDark);
    }
  }
  
  // Update all text colors when theme changes
  private updateTextColorsForTheme(isDark: boolean): void {
    if (!this.layer) return;
    
    // Find all text elements on canvas
    const textShapes = this.layer.find('Text');
    
    textShapes.forEach((textNode: any) => {
      // Only auto-update if text is using default colors (black or white)
      const currentFill = textNode.fill();
      
      // If text is black (#000000) or very dark, change to white in dark mode
      if (!isDark && (currentFill === '#ffffff' || currentFill === 'white')) {
        textNode.fill('#000000');
      } 
      // If text is white (#ffffff) or very light, change to black in light mode
      else if (isDark && (currentFill === '#000000' || currentFill === 'black')) {
        textNode.fill('#ffffff');
      }
      // Also handle very dark colors in dark mode
      else if (isDark) {
        const rgb = this.hexToRgb(currentFill);
        if (rgb && (rgb.r < 50 && rgb.g < 50 && rgb.b < 50)) {
          // Very dark color in dark mode - change to white
          textNode.fill('#ffffff');
        }
      }
      // Handle very light colors in light mode
      else if (!isDark) {
        const rgb = this.hexToRgb(currentFill);
        if (rgb && (rgb.r > 200 && rgb.g > 200 && rgb.b > 200)) {
          // Very light color in light mode - change to black
          textNode.fill('#000000');
        }
      }
    });
  }
  
  // Helper to convert hex to RGB
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  
  toggleGrid(): void {
    this.showGrid.update(v => !v);
    this.drawInfiniteGrid();
  }
  
  // Color mode methods
  setColorMode(mode: 'stroke' | 'fill'): void {
    this.colorMode.set(mode);
    // Update opacity slider to show the current mode's opacity
    if (mode === 'stroke') {
      this.colorOpacity.set(this.strokeOpacity());
    } else {
      this.colorOpacity.set(this.fillOpacity());
    }
  }
  
  getCurrentModeColor(): string {
    return this.colorMode() === 'stroke' ? this.strokeColor() : this.fillColor();
  }
  
  setCurrentModeColor(color: string): void {
    if (this.colorMode() === 'stroke') {
      this.strokeColor.set(color);
      this.applyStrokeColorToSelected(color);
    } else {
      this.fillColor.set(color);
      this.applyFillColorToSelected(color);
    }
  }
  
  private applyStrokeColorToSelected(color: string): void {
    const selectedNodes = this.transformer.nodes();
    selectedNodes.forEach((node: any) => {
      this.applyStrokeColorToNode(node, color);
    });
    this.layer.batchDraw();
    this.saveHistory();
  }
  
  private applyStrokeColorToNode(node: any, color: string): void {
    if (node instanceof Konva.Shape) {
      // For Text shapes, don't apply stroke - text color should only use Fill mode
      if (node instanceof Konva.Text) {
        // Text shapes should only use Fill mode for color, ignore Stroke mode
        return;
      }
      const opacity = this.strokeOpacity() / 100;
      node.stroke(this.hexToRgba(color, opacity));
    } else if (node instanceof Konva.Group) {
      if (node.hasName('component-group')) {
        // For component groups, change the text color (border equivalent)
        const children = node.getChildren();
        children.forEach((child: any) => {
          if (child instanceof Konva.Text) {
            child.fill(color);
          }
        });
      } else if (node.hasName('user-group')) {
        // For user-created groups, ONLY change the group border, not children
        const children = node.getChildren();
        children.forEach((child: any) => {
          if (child.hasName('group-border')) {
            // Change only the group border color
            child.stroke(color);
          }
        });
      }
    }
  }
  
  private applyFillColorToSelected(color: string): void {
    const selectedNodes = this.transformer.nodes();
    console.log('=== Applying color to', selectedNodes.length, 'node(s) ===');
    selectedNodes.forEach((node: any) => {
      console.log('Node type:', node.getClassName(), 'id:', node.id());
      this.applyFillColorToNode(node, color);
    });
    this.layer.batchDraw();
    this.saveHistory();
  }
  
  private applyFillColorToNode(node: any, color: string): void {
    if (node instanceof Konva.Shape) {
      // For Text shapes, apply solid color without opacity (text should be solid)
      if (node instanceof Konva.Text) {
        // Ensure we use the pure hex color, not any rgba conversion
        // If color is already rgba, extract just the hex part
        let solidColor = color;
        if (color.startsWith('rgba')) {
          // Extract RGB values from rgba(r, g, b, a) format
          const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (match) {
            const r = parseInt(match[1]).toString(16).padStart(2, '0');
            const g = parseInt(match[2]).toString(16).padStart(2, '0');
            const b = parseInt(match[3]).toString(16).padStart(2, '0');
            solidColor = `#${r}${g}${b}`;
          }
        }
        node.fill(solidColor);
        console.log('Applied text color:', solidColor, 'original:', color);
      } else {
        // For other shapes, apply with opacity
        const opacity = this.fillOpacity() / 100;
        if (this.fillStyle() !== 'none') {
          node.fill(this.hexToRgba(color, opacity));
        }
      }
    } else if (node instanceof Konva.Group) {
      if (node.hasName('component-group')) {
        // For component groups, regenerate icon with new color
        this.updateComponentGroupColor(node, color);
      } else if (node.hasName('user-group')) {
        // For user-created groups, recursively apply to children (skip border)
        const children = node.getChildren();
        children.forEach((child: any) => {
          if (!child.hasName('group-border')) {
            this.applyFillColorToNode(child, color);
          }
        });
      }
    }
  }

  private async updateComponentGroupColor(group: Konva.Group, color: string): Promise<void> {
    // Find the image/icon in the group
    const children = group.getChildren();
    let iconNode: any = null;
    let componentData: any = null;
    
    // Try to find the icon (Image or Text)
    children.forEach((child: any) => {
      if (child instanceof Konva.Image || (child instanceof Konva.Text && child.fontSize() > 20)) {
        iconNode = child;
      }
    });
    
    if (!iconNode) return;
    
    // If it's an emoji icon (Text), just change its color
    if (iconNode instanceof Konva.Text) {
      iconNode.fill(color);
      this.layer.batchDraw();
      return;
    }
    
    // If it's an SVG icon (Image), we need to regenerate it with new color
    // Store the component info in group attrs when creating it
    if (group.attrs.faIcon) {
      try {
        const iconDataURL = await this.generateIconDataURL(group.attrs.faIcon, color);
        const imageObj = new Image();
        imageObj.onload = () => {
          iconNode.image(imageObj);
          this.layer.batchDraw();
        };
        imageObj.src = iconDataURL;
      } catch (error) {
        console.error('Error updating icon color:', error);
      }
    }
  }
  
  setColor(color: string): void {
    this.currentColor.set(color);
    this.strokeColor.set(color);
    this.fillColor.set(color);
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
    
    // Save to the correct mode's opacity
    if (this.colorMode() === 'stroke') {
      this.strokeOpacity.set(opacity);
    } else {
      this.fillOpacity.set(opacity);
    }
    
    // Apply opacity based on current mode
    if (this.colorMode() === 'stroke') {
      this.applyStrokeColorToSelected(this.strokeColor());
    } else {
      this.applyFillColorToSelected(this.fillColor());
    }
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
  
  private getDashArray(): number[] {
    switch (this.strokePattern) {
      case 'dashed':
        return [10, 5];
      case 'dotted':
        return [2, 4];
      case 'solid':
      default:
        return [];
    }
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
    const strokeColor = this.strokeColor();
    const fillColor = this.fillColor();
    const strokeOpacity = this.strokeOpacity() / 100;
    const fillOpacity = this.fillOpacity() / 100;
    const strokeWidth = this.strokeWidth();
    const fill = this.fillStyle() !== 'none' ? this.hexToRgba(fillColor, fillOpacity) : 'transparent';
    const stroke = this.hexToRgba(strokeColor, strokeOpacity);
    
    switch (templateId) {
      case 'rectangle':
        return new Konva.Rect({
          x: pos.x,
          y: pos.y,
          width: size.width,
          height: size.height,
          fill, stroke, strokeWidth,
          draggable: true
        });
        
      case 'circle':
        return new Konva.Circle({
          x: pos.x + size.width / 2,
          y: pos.y + size.height / 2,
          radius: Math.min(size.width, size.height) / 2,
          fill, stroke, strokeWidth,
          draggable: true
        });
        
      case 'triangle':
        return new Konva.RegularPolygon({
          x: pos.x + size.width / 2,
          y: pos.y + size.height / 2,
          sides: 3,
          radius: Math.min(size.width, size.height) / 2,
          fill, stroke, strokeWidth,
          draggable: true
        });
        
      case 'diamond':
        return new Konva.RegularPolygon({
          x: pos.x + size.width / 2,
          y: pos.y + size.height / 2,
          sides: 4,
          radius: Math.min(size.width, size.height) / 2,
          rotation: 45,
          fill, stroke, strokeWidth,
          draggable: true
        });
        
      case 'pentagon':
        return new Konva.RegularPolygon({
          x: pos.x + size.width / 2,
          y: pos.y + size.height / 2,
          sides: 5,
          radius: Math.min(size.width, size.height) / 2,
          fill, stroke, strokeWidth,
          draggable: true
        });
        
      case 'hexagon':
        return new Konva.RegularPolygon({
          x: pos.x + size.width / 2,
          y: pos.y + size.height / 2,
          sides: 6,
          radius: Math.min(size.width, size.height) / 2,
          fill, stroke, strokeWidth,
          draggable: true
        });
        
      case 'star':
        return new Konva.Star({
          x: pos.x + size.width / 2,
          y: pos.y + size.height / 2,
          numPoints: 5,
          innerRadius: Math.min(size.width, size.height) / 4,
          outerRadius: Math.min(size.width, size.height) / 2,
          fill, stroke, strokeWidth,
          draggable: true
        });
        
      case 'ellipse':
        return new Konva.Ellipse({
          x: pos.x + size.width / 2,
          y: pos.y + size.height / 2,
          radiusX: size.width / 2,
          radiusY: size.height / 2,
          fill, stroke, strokeWidth,
          draggable: true
        });
        
      case 'heart':
        // Heart shape using custom path
        return new Konva.Line({
          x: pos.x + size.width / 2,
          y: pos.y + size.height / 3,
          points: this.getHeartPoints(size.width * 0.8),
          closed: true,
          fill, stroke, strokeWidth,
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
            fill, stroke, strokeWidth
          }));
        });
        
        return cloudGroup;
        
      case 'arrow-right':
      case 'arrow-left':
      case 'arrow-up':
      case 'arrow-down':
        return this.createArrowShape(pos, size, templateId, stroke, strokeWidth, fill);
        
      case 'x-mark':
        return new Konva.Line({
          x: pos.x,
          y: pos.y,
          points: [
            0, 0, size.width, size.height,
            size.width, 0, 0, size.height
          ],
          stroke,
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
          stroke,
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
          fill, stroke, strokeWidth,
          draggable: true
        });
        
      default:
        return new Konva.Rect({
          x: pos.x, y: pos.y,
          width: size.width, height: size.height,
          fill, stroke, strokeWidth,
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

  private doRectsIntersect(r1: any, r2: any): boolean {
    return !(
      r2.x > r1.x + r1.width ||
      r2.x + r2.width < r1.x ||
      r2.y > r1.y + r1.height ||
      r2.y + r2.height < r1.y
    );
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
  
  // Helper method to check if component has custom image
  hasCustomImage(component: ComponentItem): boolean {
    return !!(component as any).imageUrl;
  }
  
  // Helper method to get custom image URL
  getCustomImageUrl(component: ComponentItem): string {
    return (component as any).imageUrl || '';
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
    // Hide transformer during export to avoid selection boxes
    const transformerVisible = this.transformer?.visible();
    if (this.transformer) {
      this.transformer.visible(false);
      this.transformer.nodes([]);
    }
    
    // Clone the entire layer to a temporary stage for export
    const tempStage = new Konva.Stage({
      container: document.createElement('div'),
      width: 10000,
      height: 10000
    });
    
    const tempLayer = this.layer.clone();
    tempStage.add(tempLayer);
    
    // Get bounding box of all content
    const box = tempLayer.getClientRect();
    
    // Add 200px padding
    const padding = 200;
    const finalX = box.x - padding;
    const finalY = box.y - padding;
    const finalWidth = box.width + (padding * 2);
    const finalHeight = box.height + (padding * 2);
    
    // Add white background
    const background = new Konva.Rect({
      x: finalX,
      y: finalY,
      width: finalWidth,
      height: finalHeight,
      fill: '#ffffff',
      listening: false
    });
    
    tempLayer.add(background);
    background.moveToBottom();
    tempLayer.batchDraw();
    
    // Export from temporary layer
    const dataURL = tempLayer.toDataURL({ 
      pixelRatio: 3,
      mimeType: 'image/png',
      x: finalX,
      y: finalY,
      width: finalWidth,
      height: finalHeight
    });
    
    // Clean up temporary stage
    tempStage.destroy();
    
    // Restore transformer visibility
    if (this.transformer && transformerVisible) {
      this.transformer.visible(true);
    }
    
    this.layer.batchDraw();
    
    const link = document.createElement('a');
    link.download = `architecture-${Date.now()}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  exportToSVG(): void {
    // Get the layer's bounding box to determine SVG dimensions
    const box = this.layer.getClientRect();
    
    // Create SVG string manually from layer shapes
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${box.width}" height="${box.height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g id="layer">
`;

    // Simple conversion - get all shapes as data URLs and embed them
    this.layer.children.forEach((child: any) => {
      if (child.getClassName() === 'Transformer') return;
      
      const attrs = child.attrs;
      const x = attrs.x || 0;
      const y = attrs.y || 0;
      
      // For now, we'll export each shape as an embedded image
      // This is a simplified approach
      try {
        const dataURL = child.toDataURL({ pixelRatio: 2 });
        const width = child.width() || 100;
        const height = child.height() || 100;
        svgContent += `    <image x="${x}" y="${y}" width="${width}" height="${height}" xlink:href="${dataURL}"/>\n`;
      } catch (error) {
        console.warn('Could not export shape to SVG:', error);
      }
    });

    svgContent += `  </g>
</svg>`;

    // Download the SVG
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `architecture-${Date.now()}.svg`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
        scaleX: shape.scaleX() || 1,
        scaleY: shape.scaleY() || 1,
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
        console.log('Exporting Text - text:', baseData.text.substring(0, 30), 'fill:', baseData.fill);
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
        // Handle different types of groups
        if (shape.hasName('component-group')) {
          // Component group - has icon and name text
          const iconText = shape.children[0];
          const nameText = shape.children[1];
          
          baseData.componentIcon = (iconText && typeof iconText.text === 'function') ? iconText.text() : '📦';
          baseData.componentName = (nameText && typeof nameText.text === 'function') ? nameText.text() : 'Component';
          baseData.groupType = 'component-group';
          
          // Save text color from the name text element
          if (nameText && typeof nameText.fill === 'function') {
            baseData.textColor = nameText.fill();
          }
          
          // Save the faIcon attribute if it exists (needed for proper icon restoration)
          const faIcon = shape.getAttr('faIcon');
          if (faIcon) {
            baseData.faIcon = faIcon;
          }
          
          // Save the icon color for accurate restoration
          const iconColor = shape.getAttr('iconColor');
          if (iconColor) {
            baseData.iconColor = iconColor;
          }
        } else if (shape.hasName('user-group')) {
          // User-created group - export all children recursively
          baseData.groupType = 'user-group';
          
          // Get the border to extract its properties
          const border = shape.findOne('.group-border');
          if (border && typeof border.stroke === 'function') {
            baseData.borderColor = border.stroke();
            // Export border dimensions
            if (typeof border.width === 'function') {
              baseData.width = border.width();
            }
            if (typeof border.height === 'function') {
              baseData.height = border.height();
            }
          }
          
          baseData.children = shape.getChildren().filter((child: any) => 
            !child.hasName('group-border') // Skip the border
          ).map((child: any) => {
            // Recursively export child structure with all properties
            return this.exportNodeRecursive(child);
          });
        } else {
          // Shape-with-label group or other groups
          baseData.groupType = 'generic-group';
          baseData.childCount = shape.getChildren().length;
        }
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
  
  private exportNodeRecursive(node: any): any {
    const className = node.getClassName();
    const nodeData: any = {
      id: node.id(),
      type: className,
      x: node.x(),
      y: node.y(),
      rotation: node.rotation() || 0,
      scaleX: node.scaleX() || 1,
      scaleY: node.scaleY() || 1
    };
    
    if (className === 'Group') {
      if (node.hasName('component-group')) {
        // Component group
        const iconText = node.children[0];
        const nameText = node.children[1];
        
        nodeData.componentIcon = (iconText && typeof iconText.text === 'function') ? iconText.text() : '📦';
        nodeData.componentName = (nameText && typeof nameText.text === 'function') ? nameText.text() : 'Component';
        nodeData.groupType = 'component-group';
        
        // Save text color from the name text element
        if (nameText && typeof nameText.fill === 'function') {
          nodeData.textColor = nameText.fill();
        }
        
        // Save faIcon attribute for nested component groups too
        const faIcon = node.getAttr('faIcon');
        if (faIcon) {
          nodeData.faIcon = faIcon;
        }
        
        // Save icon color for nested component groups
        const iconColor = node.getAttr('iconColor');
        if (iconColor) {
          nodeData.iconColor = iconColor;
        }
      } else if (node.hasName('user-group')) {
        // Nested user group
        nodeData.groupType = 'user-group';
        
        // Get border properties
        const border = node.findOne('.group-border');
        if (border && typeof border.stroke === 'function') {
          nodeData.borderColor = border.stroke();
          // Export border dimensions for nested groups
          if (typeof border.width === 'function') {
            nodeData.width = border.width();
          }
          if (typeof border.height === 'function') {
            nodeData.height = border.height();
          }
        }
        
        // Recursively export children
        nodeData.children = node.getChildren().filter((child: any) => 
          !child.hasName('group-border')
        ).map((child: any) => this.exportNodeRecursive(child));
      } else {
        // Generic group
        nodeData.groupType = 'generic-group';
      }
    } else if (className === 'Rect') {
      nodeData.width = node.width();
      nodeData.height = node.height();
      nodeData.fill = node.fill();
      nodeData.stroke = node.stroke();
      nodeData.strokeWidth = node.strokeWidth();
      nodeData.cornerRadius = node.cornerRadius() || 0;
      // Include scale for rectangles (important when resized with transformer)
      nodeData.scaleX = node.scaleX();
      nodeData.scaleY = node.scaleY();
    } else if (className === 'Circle') {
      nodeData.radius = node.radius();
      nodeData.fill = node.fill();
      nodeData.stroke = node.stroke();
      nodeData.strokeWidth = node.strokeWidth();
      // Include scale for circles
      nodeData.scaleX = node.scaleX();
      nodeData.scaleY = node.scaleY();
    } else if (className === 'Text') {
      nodeData.text = node.text();
      nodeData.fontSize = node.fontSize();
      nodeData.fontFamily = node.fontFamily();
      nodeData.fill = node.fill();
      nodeData.width = node.width();
      // Include scale for text
      nodeData.scaleX = node.scaleX();
      nodeData.scaleY = node.scaleY();
    }
    
    return nodeData;
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
          
          // Check if this is the old Konva native format (has className: "Layer")
          if (data.className === 'Layer' && data.children) {
            // Old format - use Konva's native import
            this.layer = Konva.Node.create(data, this.stage.container());
            this.stage.add(this.layer);
            
            // Re-add transformer with auto-save support
            this.createTransformer();
            this.layer.add(this.transformer);
            
            this.layer.batchDraw();
            this.drawInfiniteGrid();
            this.saveHistory();
            
            alert(`Successfully loaded architecture from old format`);
            return;
          }
          
          // New format - continue with custom import logic
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
                
                // Apply scale if present
                if (shapeData.scaleX !== undefined) {
                  shape.scaleX(shapeData.scaleX);
                }
                if (shapeData.scaleY !== undefined) {
                  shape.scaleY(shapeData.scaleY);
                }
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
                
                // Apply scale if present
                if (shapeData.scaleX !== undefined) {
                  shape.scaleX(shapeData.scaleX);
                }
                if (shapeData.scaleY !== undefined) {
                  shape.scaleY(shapeData.scaleY);
                }
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
                
                // Add double-click handler to edit text
                shape.on('dblclick dbltap', () => {
                  this.editText(shape as Konva.Text);
                });
                
                // Apply scale if present
                if (shapeData.scaleX !== undefined) {
                  shape.scaleX(shapeData.scaleX);
                }
                if (shapeData.scaleY !== undefined) {
                  shape.scaleY(shapeData.scaleY);
                }
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
                if (shapeData.groupType === 'component-group') {
                  // Recreate component groups from compact format - icon and name only
                  shape = new Konva.Group({
                    id: shapeData.id,
                    x: shapeData.x,
                    y: shapeData.y,
                    rotation: shapeData.rotation || 0,
                    draggable: true,
                    name: 'component-group'
                  });
                  
                  // Add click handler for selection
                  shape.on('click', (e: any) => {
                    if (this.currentTool() !== 'select') return;
                    
                    const isShiftKey = e.evt && e.evt.shiftKey;
                    
                    if (isShiftKey) {
                      const currentNodes = this.transformer.nodes().slice();
                      const index = currentNodes.indexOf(shape);
                      
                      if (index === -1) {
                        currentNodes.push(shape);
                        this.addSelectionHighlight(shape);
                      } else {
                        currentNodes.splice(index, 1);
                        this.removeSelectionHighlight(shape);
                      }
                      
                      this.transformer.nodes(currentNodes);
                    } else {
                      const previousNodes = this.transformer.nodes();
                      previousNodes.forEach((node: any) => {
                        if (node !== shape) {
                          this.removeSelectionHighlight(node);
                        }
                      });
                      
                      this.addSelectionHighlight(shape);
                      this.transformer.nodes([shape]);
                    }
                    
                    this.layer.batchDraw();
                  });
                  
                  // Add double-click handler to edit component name
                  shape.on('dblclick', (e: any) => {
                    e.cancelBubble = true;
                    
                    const textNode = shape.children?.find((child: any) => 
                      child.getClassName() === 'Text' && child.y() > 50
                    ) as Konva.Text;
                    
                    if (!textNode) return;
                    
                    textNode.hide();
                    
                    const textPosition = textNode.getAbsolutePosition();
                    const stageBox = this.stage.container().getBoundingClientRect();
                    
                    const textarea = document.createElement('input');
                    textarea.value = textNode.text();
                    textarea.style.position = 'absolute';
                    textarea.style.top = (textPosition.y + stageBox.top) + 'px';
                    textarea.style.left = (textPosition.x + stageBox.left) + 'px';
                    textarea.style.width = textNode.width() + 'px';
                    textarea.style.fontSize = textNode.fontSize() + 'px';
                    textarea.style.border = '2px solid #3b82f6';
                    textarea.style.padding = '2px';
                    textarea.style.margin = '0px';
                    textarea.style.overflow = 'hidden';
                    textarea.style.background = this.isDarkTheme() ? '#1e293b' : '#ffffff';
                    textarea.style.color = (typeof textNode.fill() === 'string' ? textNode.fill() : '#000000') as string;
                    textarea.style.outline = 'none';
                    textarea.style.resize = 'none';
                    textarea.style.fontFamily = textNode.fontFamily() || 'Arial';
                    textarea.style.fontWeight = textNode.fontStyle() || 'normal';
                    textarea.style.textAlign = 'center';
                    textarea.style.borderRadius = '4px';
                    textarea.style.zIndex = '1000';
                    
                    document.body.appendChild(textarea);
                    textarea.focus();
                    textarea.select();
                    
                    const removeTextarea = () => {
                      const newText = textarea.value.trim();
                      if (newText) {
                        textNode.text(newText);
                        shape.setAttr('componentName', newText);
                      }
                      textarea.parentNode?.removeChild(textarea);
                      textNode.show();
                      this.layer.batchDraw();
                      this.saveHistory();
                    };
                    
                    textarea.addEventListener('keydown', (e) => {
                      if (e.key === 'Enter') {
                        removeTextarea();
                      } else if (e.key === 'Escape') {
                        textarea.parentNode?.removeChild(textarea);
                        textNode.show();
                        this.layer.batchDraw();
                      }
                    });
                    
                    textarea.addEventListener('blur', removeTextarea);
                  });
                  
                  // Restore faIcon attribute if it exists
                  if (shapeData.faIcon) {
                    shape.setAttr('faIcon', shapeData.faIcon);
                  }
                  
                  // Restore icon color if it exists
                  if (shapeData.iconColor) {
                    shape.setAttr('iconColor', shapeData.iconColor);
                  }
                  
                  const componentName = shapeData.componentName || 'Component';
                  const componentIcon = shapeData.componentIcon || '📦';
                  const textColor = shapeData.textColor || (this.isDarkTheme() ? '#e2e8f0' : '#1a1a1a');
                  const iconColor = shapeData.iconColor || '#3b82f6'; // Use saved color or default
                  
                  // Store scale values to apply after icon loads
                  const savedScaleX = shapeData.scaleX !== undefined ? shapeData.scaleX : 1;
                  const savedScaleY = shapeData.scaleY !== undefined ? shapeData.scaleY : 1;
                  
                  // If faIcon exists, fetch from Iconify API
                  if (shapeData.faIcon) {
                    this.generateIconDataURL(shapeData.faIcon, iconColor).then(iconDataURL => {
                      const imageObj = new Image();
                      imageObj.onload = () => {
                        // Remove any existing children
                        shape.destroyChildren();
                        
                        const icon = new Konva.Image({
                          x: 16,
                          y: 0,
                          image: imageObj,
                          width: 48,
                          height: 48
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
                        
                        // Apply scale AFTER icon is loaded and children are added
                        shape.scaleX(savedScaleX);
                        shape.scaleY(savedScaleY);
                        
                        this.layer.batchDraw();
                      };
                      
                      imageObj.onerror = () => {
                        console.error('Failed to load icon:', shapeData.faIcon);
                        // Fallback to emoji
                        this.addImportedComponentWithEmoji(shape, componentName, componentIcon, textColor);
                        // Apply scale even for emoji fallback
                        shape.scaleX(savedScaleX);
                        shape.scaleY(savedScaleY);
                      };
                      
                      imageObj.src = iconDataURL;
                    }).catch(error => {
                      console.error('Error generating icon:', error);
                      // Fallback to emoji
                      this.addImportedComponentWithEmoji(shape, componentName, componentIcon, textColor);
                      // Apply scale for emoji fallback
                      shape.scaleX(savedScaleX);
                      shape.scaleY(savedScaleY);
                    });
                  } else {
                    // No faIcon, use emoji fallback
                    this.addImportedComponentWithEmoji(shape, componentName, componentIcon, textColor);
                    // Apply scale immediately for emoji
                    shape.scaleX(savedScaleX);
                    shape.scaleY(savedScaleY);
                  }
                } else if (shapeData.groupType === 'user-group') {
                  // Recreate user-created groups with nested children
                  shape = this.recreateUserGroup(shapeData);
                } else {
                  // Generic group fallback
                  shape = new Konva.Group({
                    id: shapeData.id,
                    x: shapeData.x,
                    y: shapeData.y,
                    rotation: shapeData.rotation || 0,
                    draggable: true
                  });
                }
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
          
          // Re-add transformer with auto-save support
          this.createTransformer();
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
  
  private recreateUserGroup(groupData: any): Konva.Group {
    // Create the group
    const group = new Konva.Group({
      id: groupData.id,
      x: groupData.x,
      y: groupData.y,
      rotation: groupData.rotation || 0,
      draggable: true,
      name: 'user-group'
    });
    
    // Add click handler for selection
    group.on('click', (e) => {
      if (this.currentTool() !== 'select') return;
      
      const isShiftKey = e.evt && e.evt.shiftKey;
      
      if (isShiftKey) {
        const currentNodes = this.transformer.nodes().slice();
        const index = currentNodes.indexOf(group);
        
        if (index === -1) {
          currentNodes.push(group);
          this.addSelectionHighlight(group);
        } else {
          currentNodes.splice(index, 1);
          this.removeSelectionHighlight(group);
        }
        
        this.transformer.nodes(currentNodes);
      } else {
        const previousNodes = this.transformer.nodes();
        previousNodes.forEach((node: any) => {
          if (node !== group) {
            this.removeSelectionHighlight(node);
          }
        });
        
        this.addSelectionHighlight(group);
        this.transformer.nodes([group]);
      }
      
      this.layer.batchDraw();
    });
    
    // Recreate children recursively
    if (groupData.children && Array.isArray(groupData.children)) {
      groupData.children.forEach((childData: any) => {
        let child: any;
        
        if (childData.type === 'Group') {
          if (childData.groupType === 'user-group') {
            // Nested user group
            child = this.recreateUserGroup(childData);
          } else if (childData.groupType === 'component-group') {
            // Component group
            child = new Konva.Group({
              id: childData.id,
              x: childData.x,
              y: childData.y,
              draggable: false,
              name: 'component-group'
            });
            
            // Add double-click handler to edit nested component name
            child.on('dblclick', (e: any) => {
              e.cancelBubble = true;
              
              const textNode = child.children?.find((c: any) => 
                c.getClassName() === 'Text' && c.y() > 50
              ) as Konva.Text;
              
              if (!textNode) return;
              
              textNode.hide();
              
              const textPosition = textNode.getAbsolutePosition();
              const stageBox = this.stage.container().getBoundingClientRect();
              
              const textarea = document.createElement('input');
              textarea.value = textNode.text();
              textarea.style.position = 'absolute';
              textarea.style.top = (textPosition.y + stageBox.top) + 'px';
              textarea.style.left = (textPosition.x + stageBox.left) + 'px';
              textarea.style.width = textNode.width() + 'px';
              textarea.style.fontSize = textNode.fontSize() + 'px';
              textarea.style.border = '2px solid #3b82f6';
              textarea.style.padding = '2px';
              textarea.style.margin = '0px';
              textarea.style.overflow = 'hidden';
              textarea.style.background = this.isDarkTheme() ? '#1e293b' : '#ffffff';
              textarea.style.color = (typeof textNode.fill() === 'string' ? textNode.fill() : '#000000') as string;
              textarea.style.outline = 'none';
              textarea.style.resize = 'none';
              textarea.style.fontFamily = textNode.fontFamily() || 'Arial';
              textarea.style.fontWeight = textNode.fontStyle() || 'normal';
              textarea.style.textAlign = 'center';
              textarea.style.borderRadius = '4px';
              textarea.style.zIndex = '1000';
              
              document.body.appendChild(textarea);
              textarea.focus();
              textarea.select();
              
              const removeTextarea = () => {
                const newText = textarea.value.trim();
                if (newText) {
                  textNode.text(newText);
                  child.setAttr('componentName', newText);
                }
                textarea.parentNode?.removeChild(textarea);
                textNode.show();
                this.layer.batchDraw();
                this.saveHistory();
              };
              
              textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                  removeTextarea();
                } else if (e.key === 'Escape') {
                  textarea.parentNode?.removeChild(textarea);
                  textNode.show();
                  this.layer.batchDraw();
                }
              });
              
              textarea.addEventListener('blur', removeTextarea);
            });
            
            // Apply scale if present
            if (childData.scaleX !== undefined) {
              child.scaleX(childData.scaleX);
            }
            if (childData.scaleY !== undefined) {
              child.scaleY(childData.scaleY);
            }
            
            // Restore faIcon and iconColor attributes if they exist
            if (childData.faIcon) {
              child.setAttr('faIcon', childData.faIcon);
            }
            if (childData.iconColor) {
              child.setAttr('iconColor', childData.iconColor);
            }
            
            const componentName = childData.componentName || 'Component';
            const componentIcon = childData.componentIcon || '📦';
            const textColor = childData.textColor || (this.isDarkTheme() ? '#e2e8f0' : '#1a1a1a');
            const iconColor = childData.iconColor || '#3b82f6';
            
            // If faIcon exists, fetch from Iconify API
            if (childData.faIcon) {
              this.generateIconDataURL(childData.faIcon, iconColor).then(iconDataURL => {
                const imageObj = new Image();
                imageObj.onload = () => {
                  // Remove any existing children
                  child.destroyChildren();
                  
                  const icon = new Konva.Image({
                    x: 16,
                    y: 0,
                    image: imageObj,
                    width: 48,
                    height: 48
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
                  
                  child.add(icon, name);
                  this.layer.batchDraw();
                };
                
                imageObj.onerror = () => {
                  console.error('Failed to load nested component icon:', childData.faIcon);
                  // Fallback to emoji
                  this.addImportedComponentWithEmoji(child, componentName, componentIcon, textColor);
                };
                
                imageObj.src = iconDataURL;
              }).catch(error => {
                console.error('Error generating nested component icon:', error);
                // Fallback to emoji
                this.addImportedComponentWithEmoji(child, componentName, componentIcon, textColor);
              });
            } else {
              // No faIcon, use emoji fallback
              this.addImportedComponentWithEmoji(child, componentName, componentIcon, textColor);
            }
            
            // Add click handler for color changes
            child.on('click tap', (e: any) => {
              if (this.currentTool() !== 'select') return;
              e.cancelBubble = true;
              
              const isShiftKey = e.evt && e.evt.shiftKey;
              
              if (isShiftKey) {
                const currentNodes = this.transformer.nodes().slice();
                const index = currentNodes.indexOf(child);
                if (index === -1) {
                  currentNodes.push(child);
                  this.addSelectionHighlight(child);
                } else {
                  currentNodes.splice(index, 1);
                  this.removeSelectionHighlight(child);
                }
                this.transformer.nodes(currentNodes);
              } else {
                const previousNodes = this.transformer.nodes();
                previousNodes.forEach((n: any) => {
                  if (n !== child) {
                    this.removeSelectionHighlight(n);
                  }
                });
                this.addSelectionHighlight(child);
                this.transformer.nodes([child]);
              }
              
              this.layer.batchDraw();
            });
          }
        } else if (childData.type === 'Rect') {
          // Handle Rect shapes within user groups
          child = new Konva.Rect({
            id: childData.id,
            x: childData.x,
            y: childData.y,
            width: childData.width,
            height: childData.height,
            fill: childData.fill,
            stroke: childData.stroke,
            strokeWidth: childData.strokeWidth,
            cornerRadius: childData.cornerRadius || 0,
            rotation: childData.rotation || 0,
            draggable: false
          });
          
          // Apply scale if present
          if (childData.scaleX !== undefined) {
            child.scaleX(childData.scaleX);
          }
          if (childData.scaleY !== undefined) {
            child.scaleY(childData.scaleY);
          }
        } else if (childData.type === 'Text') {
          // Handle Text shapes within user groups
          child = new Konva.Text({
            id: childData.id,
            x: childData.x,
            y: childData.y,
            text: childData.text,
            fontSize: childData.fontSize,
            fontFamily: childData.fontFamily,
            fill: childData.fill,
            width: childData.width,
            rotation: childData.rotation || 0,
            draggable: false
          });
          
          // Apply scale if present
          if (childData.scaleX !== undefined) {
            child.scaleX(childData.scaleX);
          }
          if (childData.scaleY !== undefined) {
            child.scaleY(childData.scaleY);
          }
          
          // Add double-click handler to edit text
          child.on('dblclick dbltap', () => {
            this.editText(child as Konva.Text);
          });
        } else if (childData.type === 'Circle') {
          // Handle Circle shapes within user groups
          child = new Konva.Circle({
            id: childData.id,
            x: childData.x,
            y: childData.y,
            radius: childData.radius,
            fill: childData.fill,
            stroke: childData.stroke,
            strokeWidth: childData.strokeWidth,
            rotation: childData.rotation || 0,
            draggable: false
          });
          
          // Apply scale if present
          if (childData.scaleX !== undefined) {
            child.scaleX(childData.scaleX);
          }
          if (childData.scaleY !== undefined) {
            child.scaleY(childData.scaleY);
          }
        }
        
        if (child) {
          group.add(child);
        }
      });
    }
    
    // Add the group border
    const padding = 5;
    const borderColor = groupData.borderColor || '#9333ea';
    
    // Use saved dimensions if available, otherwise calculate from children
    let borderWidth, borderHeight, borderX, borderY;
    
    if (groupData.width && groupData.height) {
      // Use saved dimensions
      borderWidth = groupData.width;
      borderHeight = groupData.height;
      borderX = -padding;  // Border is relative to group, so offset by padding
      borderY = -padding;
    } else {
      // Calculate from children bounds
      const groupBounds = group.getClientRect({ relativeTo: group });
      borderX = groupBounds.x - padding;
      borderY = groupBounds.y - padding;
      borderWidth = groupBounds.width + (padding * 2);
      borderHeight = groupBounds.height + (padding * 2);
    }
    
    const groupBorder = new Konva.Rect({
      x: borderX,
      y: borderY,
      width: borderWidth,
      height: borderHeight,
      stroke: borderColor,
      strokeWidth: 2,
      dash: [8, 4],
      listening: false,
      name: 'group-border',
      hitStrokeWidth: 0
    });
    
    group.add(groupBorder);
    groupBorder.moveToBottom();
    
    return group;
  }
  
  clearCanvas(): void {
    if (confirm('Are you sure you want to clear the canvas?')) {
      this.layer.destroyChildren();
      this.createTransformer();
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
    // Just apply the hierarchical layout - it works best for most architectures
    this.applyAutoLayout('hierarchical');
    this.showLayoutMenu.set(false);
  }
  
  // Smart Auto-Layout Feature
  showLayoutMenu = signal(false);
  
  toggleLayoutMenu(): void {
    this.showLayoutMenu.set(!this.showLayoutMenu());
  }
  
  applyAutoLayout(layoutType: 'grid' | 'hierarchical' | 'circular' | 'force' | 'horizontal' | 'vertical'): void {
    const shapes = this.layer.find('.component, .shape').filter((node: any) => 
      !node.parent || node.parent === this.layer
    );
    
    if (shapes.length === 0) {
      alert('No shapes to layout');
      return;
    }
    
    switch (layoutType) {
      case 'grid':
        this.applyGridLayout(shapes);
        break;
      case 'hierarchical':
        this.applyHierarchicalLayout(shapes);
        break;
      case 'circular':
        this.applyCircularLayout(shapes);
        break;
      case 'force':
        this.applyForceDirectedLayout(shapes);
        break;
      case 'horizontal':
        this.applyHorizontalLayout(shapes);
        break;
      case 'vertical':
        this.applyVerticalLayout(shapes);
        break;
    }
    
    this.showLayoutMenu.set(false);
    this.saveHistory();
  }
  
  private applyGridLayout(shapes: any[]): void {
    const cols = Math.ceil(Math.sqrt(shapes.length));
    const spacing = 150;
    const startX = 100;
    const startY = 100;
    
    shapes.forEach((shape, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      shape.position({
        x: startX + col * spacing,
        y: startY + row * spacing
      });
    });
  }
  
  private applyHierarchicalLayout(shapes: any[]): void {
    // Group shapes by their y-position to determine existing tiers
    const tiers: any[][] = [];
    const tierThreshold = 100; // Group shapes within 100px vertically
    
    // Sort by current Y position
    const sortedShapes = [...shapes].sort((a, b) => a.y() - b.y());
    
    sortedShapes.forEach(shape => {
      let addedToTier = false;
      
      for (const tier of tiers) {
        if (Math.abs(tier[0].y() - shape.y()) < tierThreshold) {
          tier.push(shape);
          addedToTier = true;
          break;
        }
      }
      
      if (!addedToTier) {
        tiers.push([shape]);
      }
    });
    
    // Layout each tier
    const tierSpacing = 200;
    const startY = 100;
    
    tiers.forEach((tier, tierIndex) => {
      const nodeSpacing = 150;
      const tierWidth = (tier.length - 1) * nodeSpacing;
      const startX = (this.stage.width() - tierWidth) / 2;
      
      tier.forEach((shape, nodeIndex) => {
        shape.position({
          x: startX + nodeIndex * nodeSpacing,
          y: startY + tierIndex * tierSpacing
        });
      });
    });
  }
  
  private applyCircularLayout(shapes: any[]): void {
    const centerX = this.stage.width() / 2;
    const centerY = this.stage.height() / 2;
    const radius = Math.min(this.stage.width(), this.stage.height()) / 3;
    const angleStep = (2 * Math.PI) / shapes.length;
    
    shapes.forEach((shape, index) => {
      const angle = index * angleStep - Math.PI / 2; // Start from top
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      shape.position({ x, y });
    });
  }
  
  private applyForceDirectedLayout(shapes: any[]): void {
    // Simple force-directed layout simulation
    const centerX = this.stage.width() / 2;
    const centerY = this.stage.height() / 2;
    const iterations = 50;
    const repulsionStrength = 3000;
    const attractionStrength = 0.01;
    const damping = 0.5;
    
    // Initialize velocities
    const velocities = shapes.map(() => ({ x: 0, y: 0 }));
    
    for (let iter = 0; iter < iterations; iter++) {
      // Calculate forces
      const forces = shapes.map(() => ({ x: 0, y: 0 }));
      
      // Repulsion between nodes
      for (let i = 0; i < shapes.length; i++) {
        for (let j = i + 1; j < shapes.length; j++) {
          const dx = shapes[j].x() - shapes[i].x();
          const dy = shapes[j].y() - shapes[i].y();
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = repulsionStrength / (distance * distance);
          
          forces[i].x -= force * dx / distance;
          forces[i].y -= force * dy / distance;
          forces[j].x += force * dx / distance;
          forces[j].y += force * dy / distance;
        }
        
        // Attraction to center
        const dx = centerX - shapes[i].x();
        const dy = centerY - shapes[i].y();
        forces[i].x += dx * attractionStrength;
        forces[i].y += dy * attractionStrength;
      }
      
      // Update positions
      shapes.forEach((shape, i) => {
        velocities[i].x = (velocities[i].x + forces[i].x) * damping;
        velocities[i].y = (velocities[i].y + forces[i].y) * damping;
        
        shape.position({
          x: shape.x() + velocities[i].x,
          y: shape.y() + velocities[i].y
        });
      });
    }
  }
  
  private applyHorizontalLayout(shapes: any[]): void {
    const spacing = 150;
    const startX = 100;
    const centerY = this.stage.height() / 2;
    
    shapes.forEach((shape, index) => {
      shape.position({
        x: startX + index * spacing,
        y: centerY
      });
    });
  }
  
  private applyVerticalLayout(shapes: any[]): void {
    const spacing = 150;
    const centerX = this.stage.width() / 2;
    const startY = 100;
    
    shapes.forEach((shape, index) => {
      shape.position({
        x: centerX,
        y: startY + index * spacing
      });
    });
  }
  
  // Alignment tools
  alignLeft(): void {
    const selected = this.transformer.nodes();
    if (selected.length < 2) return;
    
    const leftMost = Math.min(...selected.map((n: any) => n.x()));
    selected.forEach((node: any) => node.x(leftMost));
    this.saveHistory();
  }
  
  alignRight(): void {
    const selected = this.transformer.nodes();
    if (selected.length < 2) return;
    
    const rightMost = Math.max(...selected.map((n: any) => n.x() + n.width()));
    selected.forEach((node: any) => node.x(rightMost - node.width()));
    this.saveHistory();
  }
  
  alignTop(): void {
    const selected = this.transformer.nodes();
    if (selected.length < 2) return;
    
    const topMost = Math.min(...selected.map((n: any) => n.y()));
    selected.forEach((node: any) => node.y(topMost));
    this.saveHistory();
  }
  
  alignBottom(): void {
    const selected = this.transformer.nodes();
    if (selected.length < 2) return;
    
    const bottomMost = Math.max(...selected.map((n: any) => n.y() + n.height()));
    selected.forEach((node: any) => node.y(bottomMost - node.height()));
    this.saveHistory();
  }
  
  alignCenterHorizontal(): void {
    const selected = this.transformer.nodes();
    if (selected.length < 2) return;
    
    const centerX = selected.reduce((sum: number, n: any) => sum + n.x() + n.width() / 2, 0) / selected.length;
    selected.forEach((node: any) => node.x(centerX - node.width() / 2));
    this.saveHistory();
  }
  
  alignCenterVertical(): void {
    const selected = this.transformer.nodes();
    if (selected.length < 2) return;
    
    const centerY = selected.reduce((sum: number, n: any) => sum + n.y() + n.height() / 2, 0) / selected.length;
    selected.forEach((node: any) => node.y(centerY - node.height() / 2));
    this.saveHistory();
  }
  
  distributeHorizontally(): void {
    const selected = this.transformer.nodes();
    if (selected.length < 3) return;
    
    const sorted = selected.sort((a: any, b: any) => a.x() - b.x());
    const leftMost = sorted[0].x();
    const rightMost = sorted[sorted.length - 1].x() + sorted[sorted.length - 1].width();
    const totalWidth = rightMost - leftMost;
    const spacing = totalWidth / (sorted.length - 1);
    
    sorted.forEach((node: any, index: number) => {
      if (index > 0 && index < sorted.length - 1) {
        node.x(leftMost + index * spacing);
      }
    });
    this.saveHistory();
  }
  
  distributeVertically(): void {
    const selected = this.transformer.nodes();
    if (selected.length < 3) return;
    
    const sorted = selected.sort((a: any, b: any) => a.y() - b.y());
    const topMost = sorted[0].y();
    const bottomMost = sorted[sorted.length - 1].y() + sorted[sorted.length - 1].height();
    const totalHeight = bottomMost - topMost;
    const spacing = totalHeight / (sorted.length - 1);
    
    sorted.forEach((node: any, index: number) => {
      if (index > 0 && index < sorted.length - 1) {
        node.y(topMost + index * spacing);
      }
    });
    this.saveHistory();
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
  
  // Custom Component Creator Methods
  openCustomComponentModal(): void {
    this.showCustomComponentModal.set(true);
    // Reset form
    this.customComponentName.set('');
    this.customComponentDescription.set('');
    this.customComponentColor.set('#3b82f6');
    this.customComponentIcon.set('📦');
    this.customComponentImageUrl.set('');
    this.customComponentImageFile = null;
  }
  
  closeCustomComponentModal(): void {
    this.showCustomComponentModal.set(false);
  }
  
  onCustomComponentImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    this.customComponentImageFile = file;
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      this.customComponentImageUrl.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }
  
  submitCustomComponent(): void {
    const name = this.customComponentName().trim();
    if (!name) {
      alert('Please enter a component name');
      return;
    }
    
    // Check if we have image or icon
    const hasImage = this.customComponentImageUrl();
    
    // Create custom component
    const customComponent: ComponentItem = {
      id: `custom-${Date.now()}`,
      name: name,
      icon: hasImage ? '' : this.customComponentIcon(), // Clear icon if image is uploaded
      category: 'custom',
      description: this.customComponentDescription() || 'Custom component',
      color: this.customComponentColor(),
      provider: 'Custom'
    };
    
    // If image is uploaded, store it (this will override icon/emoji)
    if (hasImage) {
      (customComponent as any).imageUrl = this.customComponentImageUrl();
    }
    
    // Add to custom category or create it
    let customCategory = this.categories.find(cat => cat.id === 'custom');
    if (!customCategory) {
      customCategory = {
        id: 'custom',
        name: 'Custom Components',
        icon: '⭐',
        collapsed: false,
        components: []
      };
      this.categories.unshift(customCategory); // Add at the beginning
    }
    
    customCategory.components.push(customComponent);
    
    // Save to localStorage
    this.saveCustomComponents();
    
    // Close modal
    this.closeCustomComponentModal();
    
    // Show success message
    console.log('✅ Custom component added:', name);
  }
  
  private saveCustomComponents(): void {
    if (!this.isBrowser) return;
    
    const customCategory = this.categories.find(cat => cat.id === 'custom');
    if (customCategory && customCategory.components.length > 0) {
      try {
        localStorage.setItem('custom-components', JSON.stringify(customCategory.components));
      } catch (error) {
        console.error('Failed to save custom components:', error);
      }
    }
  }
  
  private loadCustomComponents(): void {
    if (!this.isBrowser) return;
    
    try {
      const saved = localStorage.getItem('custom-components');
      if (saved) {
        const customComponents = JSON.parse(saved);
        if (customComponents.length > 0) {
          const customCategory: ComponentCategory = {
            id: 'custom',
            name: 'Custom Components',
            icon: '⭐',
            collapsed: false,
            components: customComponents
          };
          this.categories.unshift(customCategory);
        }
      }
    } catch (error) {
      console.error('Failed to load custom components:', error);
    }
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
  
  // ===== NEW FEATURES =====
  
  // 1. AUTO-LAYOUT - Arrange components in a clean grid
  autoLayout(): void {
    if (!this.layer) return;
    
    const shapes = this.layer.children.filter((child: any) => 
      child.getClassName() !== 'Transformer' && 
      child.draggable() &&
      child.name() !== 'smart-connector' // Skip connectors
    );
    
    if (shapes.length === 0) return;
    
    console.log('Auto-layout for', shapes.length, 'shapes');
    
    // Simple grid layout
    const padding = 40;
    const spacing = 60;
    const cols = Math.ceil(Math.sqrt(shapes.length));
    
    // Find average shape size
    let totalWidth = 0;
    let totalHeight = 0;
    shapes.forEach((shape: any) => {
      const box = shape.getClientRect();
      totalWidth += box.width;
      totalHeight += box.height;
    });
    const avgWidth = totalWidth / shapes.length;
    const avgHeight = totalHeight / shapes.length;
    
    // Arrange in grid
    shapes.forEach((shape: any, index: number) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      const x = padding + col * (avgWidth + spacing);
      const y = padding + row * (avgHeight + spacing);
      
      shape.to({
        x: x,
        y: y,
        duration: 0.5
      });
    });
    
    // Update smart connectors
    this.updateAllSmartConnectors();
    
    this.saveHistory();
  }
  
  // Update all smart connectors after layout changes
  private updateAllSmartConnectors(): void {
    const connectors = this.layer.find('.smart-connector');
    connectors.forEach((connector: any) => {
      const fromId = connector.getAttr('fromShape');
      const toId = connector.getAttr('toShape');
      
      if (fromId && toId) {
        const fromShape = this.layer.findOne(`#${fromId}`);
        const toShape = this.layer.findOne(`#${toId}`);
        
        if (fromShape && toShape) {
          const { from, to } = this.getConnectionPoints(fromShape, toShape);
          connector.points([from.x, from.y, to.x, to.y]);
        }
      }
    });
    this.layer.batchDraw();
  }
  
  // 2. COPY/PASTE SHAPES
  copySelected(): void {
    const selected = this.transformer.nodes();
    if (selected.length === 0) {
      console.log('No shapes selected to copy');
      return;
    }
    
    this.clipboard = selected.map((node: any) => {
      return node.toJSON();
    });
    
    console.log('Copied', this.clipboard.length, 'shapes to clipboard');
  }
  
  pasteShapes(): void {
    if (this.clipboard.length === 0) {
      console.log('Clipboard is empty');
      return;
    }
    
    console.log('Pasting', this.clipboard.length, 'shapes from clipboard');
    
    const offset = 30; // Offset pasted shapes
    const pastedNodes: any[] = [];
    
    this.clipboard.forEach((nodeJson: string) => {
      try {
        const node = Konva.Node.create(nodeJson);
        
        // Offset position
        node.x(node.x() + offset);
        node.y(node.y() + offset);
        
        // Generate new ID
        node.id(`shape-${Date.now()}-${Math.random()}`);
        
        this.layer.add(node);
        pastedNodes.push(node);
      } catch (error) {
        console.error('Failed to paste shape:', error);
      }
    });
    
    // Select pasted shapes
    if (pastedNodes.length > 0) {
      this.transformer.nodes(pastedNodes);
      pastedNodes.forEach((node: any) => this.addSelectionHighlight(node));
    }
    
    this.layer.batchDraw();
    this.saveHistory();
  }
  
  // 3. BACKGROUND COLOR FOR SHAPES
  setBackgroundColor(color: string): void {
    const selected = this.transformer.nodes();
    if (selected.length === 0) return;
    
    selected.forEach((node: any) => {
      if (node instanceof Konva.Group) {
        // For groups, find and color the background rectangle
        const bgRect = node.findOne('.component-bg') as any;
        if (bgRect && typeof bgRect.fill === 'function') {
          bgRect.fill(color);
        }
      } else if (typeof node.fill === 'function') {
        // For basic shapes
        node.fill(color);
      }
    });
    
    this.layer.batchDraw();
    this.saveHistory();
  }
  
  // 4. CURVED CONNECTORS (Enhanced smart connector with curves)
  createCurvedConnection(fromShape: any, toShape: any): void {
    const { from, to } = this.getConnectionPoints(fromShape, toShape);
    
    // Calculate control points for quadratic curve
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    
    // Offset control point perpendicular to line
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const curve = length * 0.15; // Curve amount
    
    // Perpendicular offset
    const offsetX = -dy / length * curve;
    const offsetY = dx / length * curve;
    
    const controlX = midX + offsetX;
    const controlY = midY + offsetY;
    
    // Create curved line using Line with tension
    const strokeColor = this.strokeColor();
    const strokeOpacity = this.strokeOpacity() / 100;
    
    const line = new Konva.Line({
      id: `connector-${Date.now()}-${Math.random()}`,
      points: [from.x, from.y, controlX, controlY, to.x, to.y],
      stroke: this.hexToRgba(strokeColor, strokeOpacity),
      strokeWidth: this.strokeWidth(),
      lineCap: 'round',
      lineJoin: 'round',
      tension: 0.5, // Smooth curve
      bezier: true,
      draggable: false,
      listening: true,
      hitStrokeWidth: 20,
      name: 'smart-connector curved-connector'
    });
    
    // Store references
    line.setAttr('fromShape', fromShape.id());
    line.setAttr('toShape', toShape.id());
    line.setAttr('isCurved', true);
    
    // Add arrow head manually at the end
    const arrowHead = new Konva.RegularPolygon({
      x: to.x,
      y: to.y,
      sides: 3,
      radius: 10,
      fill: this.hexToRgba(strokeColor, strokeOpacity),
      rotation: Math.atan2(to.y - controlY, to.x - controlX) * 180 / Math.PI + 90,
      listening: false
    });
    
    // Store arrow head reference in line
    line.setAttr('arrowHead', arrowHead);
    
    // Update arrow head color when line color changes
    const originalLineStroke = line.stroke.bind(line);
    line.stroke = function(color?: string) {
      if (color !== undefined) {
        arrowHead.fill(color); // Update arrow head to match
      }
      return originalLineStroke(color);
    } as any;
    
    // Create draggable control point handle
    const controlHandle = new Konva.Circle({
      x: controlX,
      y: controlY,
      radius: 8,
      fill: '#667eea',
      stroke: 'white',
      strokeWidth: 2,
      draggable: true,
      visible: false, // Hidden by default, shown on hover/select
      name: 'curve-control-handle'
    });
    
    // Store control point reference
    line.setAttr('controlHandle', controlHandle);
    controlHandle.setAttr('curveLine', line);
    controlHandle.setAttr('arrowHead', arrowHead);
    
    const group = new Konva.Group({
      name: 'curved-connector-group'
    });
    group.add(line);
    group.add(arrowHead);
    group.add(controlHandle);
    
    this.layer.add(group);
    group.moveToBottom();
    
    // Show control handle ONLY when line is clicked/selected
    line.on('click', (e: any) => {
      if (this.currentTool() === 'select') {
        e.cancelBubble = true; // Prevent event from bubbling
        
        // Hide all other control handles first
        this.layer.find('.curve-control-handle').forEach((handle: any) => {
          handle.visible(false);
        });
        
        // Show this line's control handle
        controlHandle.visible(true);
        
        // Select the line in the transformer for color changes
        const isShiftKey = e.evt?.shiftKey;
        
        if (isShiftKey) {
          // Multi-select: Add to existing selection
          const currentNodes = this.transformer.nodes().slice();
          const index = currentNodes.indexOf(line);
          
          if (index === -1) {
            currentNodes.push(line);
            this.addSelectionHighlight(line);
          } else {
            currentNodes.splice(index, 1);
            this.removeSelectionHighlight(line);
          }
          
          this.transformer.nodes(currentNodes);
        } else {
          // Single select
          const previousNodes = this.transformer.nodes();
          previousNodes.forEach((node: any) => {
            if (node !== line) {
              this.removeSelectionHighlight(node);
            }
          });
          
          this.addSelectionHighlight(line);
          this.transformer.nodes([line]);
        }
        
        this.layer.batchDraw();
      }
    });
    
    // Hide when clicking elsewhere on canvas
    this.stage.on('click.curvehandles', (e: any) => {
      const clickedOnLine = e.target === line;
      const clickedOnHandle = e.target === controlHandle;
      
      if (!clickedOnLine && !clickedOnHandle) {
        controlHandle.visible(false);
        this.layer.batchDraw();
      }
    });
    
    // When dragging control handle, update curve shape
    controlHandle.on('dragmove', () => {
      const { from: newFrom, to: newTo } = this.getConnectionPoints(fromShape, toShape);
      const points = line.points();
      
      // Update curve with new control point position
      line.points([newFrom.x, newFrom.y, controlHandle.x(), controlHandle.y(), newTo.x, newTo.y]);
      
      // Update arrow head rotation
      const controlX = controlHandle.x();
      const controlY = controlHandle.y();
      arrowHead.rotation(Math.atan2(newTo.y - controlY, newTo.x - controlX) * 180 / Math.PI + 90);
      
      this.layer.batchDraw();
    });
    
    controlHandle.on('dragend', () => {
      this.saveHistory();
    });
    
    // Setup updates when shapes move
    const updateCurve = () => {
      const { from: newFrom, to: newTo } = this.getConnectionPoints(fromShape, toShape);
      
      // Calculate new default control point position (maintain offset ratio)
      const oldPoints = line.points();
      const oldFrom = { x: oldPoints[0], y: oldPoints[1] };
      const oldTo = { x: oldPoints[4], y: oldPoints[5] };
      const oldControl = { x: oldPoints[2], y: oldPoints[3] };
      
      // Calculate offset ratio from old line
      const oldMidX = (oldFrom.x + oldTo.x) / 2;
      const oldMidY = (oldFrom.y + oldTo.y) / 2;
      const offsetRatioX = oldControl.x - oldMidX;
      const offsetRatioY = oldControl.y - oldMidY;
      
      // Apply same ratio to new line
      const newMidX = (newFrom.x + newTo.x) / 2;
      const newMidY = (newFrom.y + newTo.y) / 2;
      const newControlX = newMidX + offsetRatioX;
      const newControlY = newMidY + offsetRatioY;
      
      controlHandle.position({ x: newControlX, y: newControlY });
      line.points([newFrom.x, newFrom.y, newControlX, newControlY, newTo.x, newTo.y]);
      arrowHead.position({ x: newTo.x, y: newTo.y });
      arrowHead.rotation(Math.atan2(newTo.y - newControlY, newTo.x - newControlX) * 180 / Math.PI + 90);
      
      this.layer.batchDraw();
    };
    
    fromShape.on('dragmove.connector', updateCurve);
    toShape.on('dragmove.connector', updateCurve);
    
    this.addConnectionLabelHandler(line);
    this.layer.batchDraw();
    this.saveHistory();
  }
  
  // 5. KEYBOARD SHORTCUTS PANEL
  toggleShortcutsPanel(): void {
    this.showShortcutsPanel.update(v => !v);
  }
  
  // 6. CURVED CONNECTORS TOGGLE
  toggleCurvedConnectors(): void {
    this.useCurvedConnectors.update(v => !v);
  }
  
  // 8. TEMPLATES SYSTEM
  templates = [
    {
      id: '01-simple-rag-chatbot',
      name: 'Simple RAG Chatbot',
      description: 'Basic RAG architecture with vector DB and LLM',
      thumbnail: '🤖',
      category: 'AI/ML',
      file: 'samples/01-simple-rag-chatbot.json'
    },
    {
      id: '02-multi-model-ai-platform',
      name: 'Multi-Model AI Platform',
      description: 'Platform supporting multiple AI models',
      thumbnail: '🧠',
      category: 'AI/ML',
      file: 'samples/02-multi-model-ai-platform.json'
    },
    {
      id: '03-cloud-infrastructure',
      name: 'Cloud Infrastructure',
      description: 'Standard cloud deployment architecture',
      thumbnail: '☁️',
      category: 'Cloud',
      file: 'samples/03-cloud-infrastructure.json'
    },
    {
      id: '04-enterprise-ai-platform',
      name: 'Enterprise AI Platform',
      description: 'Complete enterprise-grade AI system',
      thumbnail: '🏢',
      category: 'AI/ML',
      file: 'samples/04-enterprise-ai-platform.json'
    },
    {
      id: '05-observability-stack',
      name: 'Observability Stack',
      description: 'Monitoring and logging infrastructure',
      thumbnail: '📊',
      category: 'DevOps',
      file: 'samples/05-observability-stack.json'
    },
    {
      id: '06-grouped-microservices',
      name: 'Grouped Microservices',
      description: 'Microservices architecture with groups',
      thumbnail: '🔷',
      category: 'Architecture',
      file: 'samples/06-grouped-microservices.json'
    },
    {
      id: '07-nested-groups-cloud',
      name: 'Nested Groups Cloud',
      description: 'Complex nested group architecture',
      thumbnail: '📦',
      category: 'Cloud',
      file: 'samples/07-nested-groups-cloud.json'
    },
    {
      id: '08-kubernetes-pods-groups',
      name: 'Kubernetes Pods',
      description: 'K8s pod organization and groups',
      thumbnail: '☸️',
      category: 'DevOps',
      file: 'samples/08-kubernetes-pods-groups.json'
    },
    {
      id: 'cisco-ai-stack-complete',
      name: 'Cisco AI Stack',
      description: 'Complete Cisco AI infrastructure',
      thumbnail: '🌐',
      category: 'Enterprise',
      file: 'samples/cisco-ai-stack-complete.json'
    },
    {
      id: 'complex-enterprise-platform',
      name: 'Complex Enterprise Platform',
      description: 'Full-featured enterprise system',
      thumbnail: '🏗️',
      category: 'Enterprise',
      file: 'samples/complex-enterprise-platform.json'
    }
  ];
  
  toggleTemplatesPanel(): void {
    this.showTemplatesPanel.update(v => !v);
    if (this.showTemplatesPanel()) {
      this.templateSearchQuery = ''; // Reset search when opening
    }
  }
  
  clearAutoSaveData(): void {
    const confirmed = confirm('This will clear all auto-saved data. Your current canvas will not be affected, but you will lose any saved work from previous sessions. Continue?');
    if (confirmed) {
      localStorage.removeItem('architecture-builder-autosave');
      localStorage.removeItem('architecture-builder-autosave-timestamp');
      console.log('✅ Auto-save data cleared successfully');
      alert('Auto-save data cleared! The app will now auto-save your current work.');
      // Immediately save current canvas
      this.autoSaveToLocalStorage();
    }
  }
  
  // Save current canvas as custom template
  saveAsMyTemplate(): void {
    if (!this.isBrowser) return;
    
    const templateName = prompt('Enter a name for your template:');
    if (!templateName || templateName.trim() === '') {
      return;
    }
    
    const jsonData = this.exportToJSONString();
    const template = {
      id: `custom-${Date.now()}`,
      name: templateName.trim(),
      description: `Custom template created on ${new Date().toLocaleDateString()}`,
      thumbnail: '💾',
      category: 'My Templates',
      data: jsonData,
      created: new Date().toISOString()
    };
    
    // Load existing templates
    const saved = localStorage.getItem('my-templates');
    const templates = saved ? JSON.parse(saved) : [];
    
    // Add new template
    templates.push(template);
    
    // Save to localStorage
    localStorage.setItem('my-templates', JSON.stringify(templates));
    
    // Update the list
    this.loadMyTemplates();
    
    alert(`✅ Template "${templateName}" saved successfully!`);
    console.log('Template saved:', template);
  }
  
  // Load user's saved templates from localStorage
  loadMyTemplates(): void {
    if (!this.isBrowser) {
      this.myTemplates = [];
      return;
    }
    
    const saved = localStorage.getItem('my-templates');
    this.myTemplates = saved ? JSON.parse(saved) : [];
    console.log('Loaded', this.myTemplates.length, 'custom templates');
  }
  
  // Load a custom template
  loadMyTemplate(template: any): void {
    if (confirm(`Load template "${template.name}"? This will replace your current canvas.`)) {
      this.loadFromJSONString(template.data);
      this.showTemplatesPanel.set(false);
      console.log('Loaded custom template:', template.name);
    }
  }
  
  // Delete a custom template
  deleteMyTemplate(template: any, event: Event): void {
    if (!this.isBrowser) return;
    
    event.stopPropagation(); // Prevent loading the template
    
    if (confirm(`Delete template "${template.name}"?`)) {
      this.myTemplates = this.myTemplates.filter(t => t.id !== template.id);
      localStorage.setItem('my-templates', JSON.stringify(this.myTemplates));
      console.log('Deleted template:', template.name);
    }
  }
  
  // Toggle between pre-built and my templates
  toggleMyTemplates(): void {
    this.showMyTemplates.update(v => !v);
  }
  
  // Create new blank template
  createNewTemplate(): void {
    if (confirm('Create a new blank canvas? This will clear your current work. (Your work is auto-saved and can be restored)')) {
      // Clear the canvas
      this.layer.destroyChildren();
      
      // Re-add transformer with auto-save support
      this.createTransformer();
      this.layer.add(this.transformer);
      
      this.layer.batchDraw();
      this.showTemplatesPanel.set(false);
      
      console.log('Created new blank template');
    }
  }
  
  getFilteredTemplates() {
    if (!this.templateSearchQuery) {
      return this.templates;
    }
    const query = this.templateSearchQuery.toLowerCase();
    return this.templates.filter(template => 
      template.name.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      template.category.toLowerCase().includes(query)
    );
  }
  
  async loadTemplate(templateFile: string): Promise<void> {
    try {
      console.log('Loading template from:', templateFile);
      const response = await fetch(templateFile);
      
      if (!response.ok) {
        throw new Error(`Template not found: ${response.status} ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        console.warn('Response content-type:', contentType);
      }
      
      const jsonText = await response.text();
      console.log('Received response, length:', jsonText.length);
      
      this.loadFromJSONString(jsonText);
      this.showTemplatesPanel.set(false);
      
      // Show success message
      console.log('Template loaded successfully!');
    } catch (error) {
      console.error('Error loading template:', error);
      alert(`Failed to load template: ${templateFile}\n\nPlease restart the dev server if you just updated angular.json`);
    }
  }
  
  private recreateShapeFromData(shapeData: any): void {
    let shape: Konva.Shape | Konva.Group | null = null;
    
    // Recreate based on type
    if (shapeData.type === 'Group') {
      // Component group - recreate using the component system
      const component: ComponentItem = {
        id: shapeData.componentName || 'Custom',
        name: shapeData.componentName || 'Custom Component',
        category: 'custom',
        icon: shapeData.componentIcon || '📦',
        color: shapeData.iconColor || '#6366F1',
        description: '',
        faIcon: shapeData.faIcon
      };
      
      // Use the existing addComponentShape method
      this.addComponentShape({ x: shapeData.x, y: shapeData.y }, component);
      
      // Find the newly created group and apply scale/rotation
      const newGroup = this.layer.findOne(`#${shapeData.id}`) || 
                       this.layer.children.filter((child: any) => 
                         child.getClassName() === 'Group' && 
                         child.hasName('component-group')
                       ).pop();
      
      if (newGroup) {
        shape = newGroup as Konva.Group;
        // Apply saved scale and rotation
        if (shapeData.scaleX) shape.scaleX(shapeData.scaleX);
        if (shapeData.scaleY) shape.scaleY(shapeData.scaleY);
        if (shapeData.rotation) shape.rotation(shapeData.rotation);
      }
      
    } else if (shapeData.type === 'Arrow' || shapeData.type === 'Line') {
      // Recreate connector/arrow
      shape = new Konva.Arrow({
        id: shapeData.id,
        points: shapeData.points,
        stroke: shapeData.stroke,
        strokeWidth: shapeData.strokeWidth || 2,
        fill: shapeData.fill || shapeData.stroke,
        pointerLength: shapeData.pointerLength || 10,
        pointerWidth: shapeData.pointerWidth || 10,
        draggable: true,
        scaleX: shapeData.scaleX || 1,
        scaleY: shapeData.scaleY || 1,
        rotation: shapeData.rotation || 0
      });
      
      this.layer.add(shape);
      
    } else if (shapeData.type === 'Rect') {
      shape = new Konva.Rect({
        id: shapeData.id,
        x: shapeData.x,
        y: shapeData.y,
        width: shapeData.width,
        height: shapeData.height,
        fill: shapeData.fill,
        stroke: shapeData.stroke,
        strokeWidth: shapeData.strokeWidth || 1,
        rotation: shapeData.rotation || 0,
        scaleX: shapeData.scaleX || 1,
        scaleY: shapeData.scaleY || 1,
        draggable: true
      });
      
      this.layer.add(shape);
      
    } else if (shapeData.type === 'Circle') {
      shape = new Konva.Circle({
        id: shapeData.id,
        x: shapeData.x,
        y: shapeData.y,
        radius: shapeData.radius,
        fill: shapeData.fill,
        stroke: shapeData.stroke,
        strokeWidth: shapeData.strokeWidth || 1,
        rotation: shapeData.rotation || 0,
        scaleX: shapeData.scaleX || 1,
        scaleY: shapeData.scaleY || 1,
        draggable: true
      });
      
      this.layer.add(shape);
      
    } else if (shapeData.type === 'Text') {
      shape = new Konva.Text({
        id: shapeData.id,
        x: shapeData.x,
        y: shapeData.y,
        text: shapeData.text,
        fontSize: shapeData.fontSize || 16,
        fontFamily: shapeData.fontFamily || 'Arial',
        fill: shapeData.fill || '#000000',
        scaleX: shapeData.scaleX || 1,
        scaleY: shapeData.scaleY || 1,
        draggable: true
      });
      
      // Add double-click event handler for text editing
      shape.on('dblclick dbltap', () => {
        this.editText(shape as Konva.Text);
      });
      
      this.layer.add(shape);
    }
  }
  
  loadFromJSONString(jsonText: string): void {
    try {
      const data = JSON.parse(jsonText);
      
      // Check if this is the old Konva native format (has className: "Layer")
      if (data.className === 'Layer' && data.children) {
        // Clear current canvas only if we have data to restore
        this.layer.destroyChildren();
        
        // Old format - use Konva's native import
        this.layer = Konva.Node.create(data, this.stage.container());
        this.stage.add(this.layer);
        
        // Re-add transformer with auto-save support
        this.createTransformer();
        this.layer.add(this.transformer);
        
        this.layer.batchDraw();
        this.drawInfiniteGrid();
        this.saveHistory();
        return;
      }
      
      // New format - custom format with shapes array
      console.log('Loaded template data:', data);
      
      if (data.shapes && Array.isArray(data.shapes) && data.shapes.length > 0) {
        // Only clear if we have shapes to restore
        this.layer.destroyChildren();
        
        // Re-add transformer with auto-save support
        this.createTransformer();
        this.layer.add(this.transformer);
        
        // Import each shape from the custom format
        for (const shapeData of data.shapes) {
          this.recreateShapeFromData(shapeData);
        }
        
        // Apply canvas settings if provided
        if (data.canvas) {
          if (data.canvas.scale) {
            this.stage.scale({ x: data.canvas.scale, y: data.canvas.scale });
          }
          if (data.canvas.position) {
            this.stage.position(data.canvas.position);
          }
        }
        
        // Redraw grid and shapes
        this.drawInfiniteGrid();
        this.layer.batchDraw();
        this.saveHistory();
        
        console.log('Successfully loaded', data.shapes.length, 'shapes');
      }
    
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert('Invalid template file format.');
    }
  }
  
  saveAsTemplate(): void {
    const templateName = prompt('Enter template name:');
    if (!templateName) return;
    
    const jsonData = this.exportToJSONString();
    
    // Create downloadable file
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${templateName.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
  
  exportToJSONString(): string {
    // Export current canvas to JSON string with custom format
    console.log('🔍 Total layer children:', this.layer.children.length);
    
    const shapes = this.layer.children.filter((child: any) => 
      child.getClassName() !== 'Transformer'
    ).map((shape: any) => {
      const className = shape.getClassName();
      console.log('🔍 Processing:', className, 'ID:', shape.id(), 'Name:', shape.name());
      
      // Skip shapes without a valid className
      if (!className || className === 'Shape') {
        console.log('⚠️ Skipping invalid shape:', className);
        return null;
      }
      
      const baseData: any = {
        id: shape.id() || `shape-${Date.now()}-${Math.random()}`,
        type: className,
        x: shape.x(),
        y: shape.y(),
        rotation: shape.rotation() || 0,
        scaleX: shape.scaleX() || 1,
        scaleY: shape.scaleY() || 1,
      };
      
      // Add type-specific properties
      if (className === 'Rect') {
        baseData.width = shape.width();
        baseData.height = shape.height();
        baseData.fill = shape.fill();
        baseData.stroke = shape.stroke();
        baseData.strokeWidth = shape.strokeWidth();
      } else if (className === 'Circle') {
        baseData.radius = shape.radius();
        baseData.fill = shape.fill();
        baseData.stroke = shape.stroke();
        baseData.strokeWidth = shape.strokeWidth();
      } else if (className === 'Line' || className === 'Arrow') {
        baseData.points = shape.points();
        baseData.stroke = shape.stroke();
        baseData.strokeWidth = shape.strokeWidth();
        baseData.fill = shape.fill();
        if (className === 'Arrow') {
          baseData.pointerLength = shape.pointerLength();
          baseData.pointerWidth = shape.pointerWidth();
        }
      } else if (className === 'Text') {
        baseData.text = shape.text();
        baseData.fontSize = shape.fontSize();
        baseData.fontFamily = shape.fontFamily();
        baseData.fill = shape.fill();
      } else if (className === 'Group') {
        // Handle component groups
        console.log('🔍 Group found:', shape.name(), 'hasName:', shape.hasName('component-group'));
        if (shape.hasName('component-group')) {
          baseData.componentIcon = shape.getAttr('componentIcon') || '📦';
          baseData.componentName = shape.getAttr('componentName') || 'Component';
          baseData.groupType = 'component-group';
          baseData.faIcon = shape.getAttr('faIcon');
          baseData.iconColor = shape.getAttr('iconColor');
          console.log('✅ Component group exported:', baseData.componentName);
        } else {
          console.log('⚠️ Group is not a component-group, skipping');
          return null; // Skip non-component groups
        }
      }
      
      console.log('✅ Exported shape:', className, baseData.id);
      return baseData;
    }).filter((s: any) => s !== null);
    
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
    
    console.log('✅ Exported', shapes.length, 'shapes to JSON');
    
    return JSON.stringify(exportData, null, 2);
  }
  
  ngOnDestroy(): void {
    if (this.stage) {
      this.stage.destroy();
    }
    if (this.isBrowser) {
      window.removeEventListener('resize', () => this.handleResize());
    }
  }
}
