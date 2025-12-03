import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface ComponentProperty {
  type: 'text' | 'number' | 'select' | 'textarea';
  label: string;
  options?: string[];
  default?: any;
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface Component {
  id: string;
  name: string;
  icon: string;
  faIcon?: string;
  category: string;
  provider?: string;
  description?: string;
  definition?: string;
  learnMoreLink?: string;
  color: string;
  canHaveChildren?: boolean;
  image?: string;
  shape?: string;
  properties?: {
    [key: string]: ComponentProperty;
  };
  template?: string;
}

export interface Category {
  name: string;
  icon: string;
  description: string;
  color: string;
  order: number;
}

export interface ComponentsData {
  components: { [key: string]: Component };
  categories: { [key: string]: Category };
}

@Injectable({
  providedIn: 'root'
})
export class ComponentsApiService {
  // Backend API URL - set to Flask backend if running, otherwise fallback to static data
  private apiUrl = 'http://localhost:5002/api/components';
  
  // Cache for components data
  private componentsCache$ = new BehaviorSubject<ComponentsData | null>(null);
  
  constructor(private http: HttpClient) {}

  /**
   * Get all components and categories from the backend API
   * Falls back to static import if API is not available
   */
  getAllComponents(): Observable<ComponentsData> {
    // Return cached data if available
    if (this.componentsCache$.value) {
      return of(this.componentsCache$.value);
    }

    // Try to fetch from backend API
    return this.http.get<ComponentsData>(this.apiUrl).pipe(
      tap(data => {
        console.log('✅ Components loaded from backend API:', data);
        this.componentsCache$.next(data);
      }),
      catchError(error => {
        console.warn('⚠️ Backend API not available, falling back to static import:', error.message);
        return this.loadStaticComponents();
      })
    );
  }

  /**
   * Load components from static import as fallback
   */
  private loadStaticComponents(): Observable<ComponentsData> {
    return new Promise<ComponentsData>(async (resolve) => {
      // Dynamic import to avoid circular dependencies
      const { COMPONENTS, COMPONENT_CATEGORIES } = await import('../data/components-data');
      
      const data: ComponentsData = {
        components: COMPONENTS as any,
        categories: COMPONENT_CATEGORIES as any
      };
      
      console.log('📦 Components loaded from static data:', data);
      this.componentsCache$.next(data);
      resolve(data);
    }) as any;
  }

  /**
   * Get components by category
   */
  getComponentsByCategory(category: string): Observable<Component[]> {
    return this.getAllComponents().pipe(
      map(data => {
        return Object.values(data.components).filter(c => c.category === category);
      })
    );
  }

  /**
   * Get a single component by ID
   */
  getComponentById(id: string): Observable<Component | undefined> {
    return this.getAllComponents().pipe(
      map(data => data.components[id])
    );
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<{ [key: string]: Category }> {
    return this.getAllComponents().pipe(
      map(data => data.categories)
    );
  }

  /**
   * Refresh components cache from backend
   */
  refreshComponents(): Observable<ComponentsData> {
    this.componentsCache$.next(null);
    return this.getAllComponents();
  }

  /**
   * Check if backend API is available
   */
  isBackendAvailable(): Observable<boolean> {
    return this.http.get(this.apiUrl).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  /**
   * Set API URL (useful for configuration)
   */
  setApiUrl(url: string): void {
    this.apiUrl = url;
    this.componentsCache$.next(null);
  }
}
