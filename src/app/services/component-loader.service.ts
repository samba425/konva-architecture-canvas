import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

export interface ComponentProperty {
  type: 'text' | 'number' | 'select' | 'textarea';
  label: string;
  default?: any;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export interface ComponentDefinition {
  id: string;
  name: string;
  icon: string;
  category: string;
  provider?: string;
  description: string;
  definition?: string;
  learnMoreLink?: string;
  color: string;
  canHaveChildren?: boolean;
  properties?: {
    [key: string]: ComponentProperty;
  };
}

export interface CategoryDefinition {
  name: string;
  icon: string;
  description: string;
  color: string;
  order: number;
}

export interface ComponentsData {
  categories: { [key: string]: CategoryDefinition };
  components: { [key: string]: ComponentDefinition };
}

@Injectable({
  providedIn: 'root'
})
export class ComponentLoaderService {
  private componentsCache: ComponentsData | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Load all components and categories from JSON files
   */
  loadComponents(): Observable<ComponentsData> {
    if (this.componentsCache) {
      return new Observable(observer => {
        observer.next(this.componentsCache!);
        observer.complete();
      });
    }

    // List of categories to load
    const categoryPaths = [
      'infrastructure',
      'ai_models',
      'storage',
      'networking',
      'tooling',
      'data_processing',
      'deployment',
      'cisco_ai',
      'cisco_ai_pods'
    ];

    const categories: { [key: string]: CategoryDefinition } = {};
    const components: { [key: string]: ComponentDefinition } = {};

    // Load all category files
    const categoryRequests = categoryPaths.map(catPath =>
      this.http.get<CategoryDefinition>(`/design/Build_ur_own_arch/components/${catPath}/category.json`)
        .pipe(
          map(catData => ({ key: catPath, data: catData }))
        )
    );

    return forkJoin(categoryRequests).pipe(
      map(categoryResults => {
        categoryResults.forEach(result => {
          categories[result.key] = result.data;
        });

        this.componentsCache = { categories, components };
        return this.componentsCache;
      })
    );
  }

  /**
   * Load components for a specific category
   */
  loadCategoryComponents(categoryPath: string): Observable<ComponentDefinition[]> {
    // Component file names for each category (you'll need to expand this)
    const componentFiles: { [key: string]: string[] } = {
      'infrastructure': ['aws-ec2', 'azure-vms', 'gcp-compute', 'nvidia-gpu', 'google-tpu'],
      'ai_models': ['gpt-4', 'claude', 'llama'],
      'storage': ['amazon-s3', 'azure-blob', 'gcp-storage', 'aws-efs'],
      'networking': ['vpc', 'azure-vnet', 'gcp-vpc', 'aws-alb'],
      'data_processing': ['apache-spark', 'apache-kafka'],
      'deployment': ['aws-ecs', 'azure-aci'],
      'cisco_ai': ['cisco-catalyst', 'cisco-umbrella-ai'],
      'tooling': [],
      'cisco_ai_pods': []
    };

    const files = componentFiles[categoryPath] || [];
    
    if (files.length === 0) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    const componentRequests = files.map(fileName =>
      this.http.get<ComponentDefinition>(`/design/Build_ur_own_arch/components/${categoryPath}/${fileName}.json`)
    );

    return forkJoin(componentRequests);
  }

  /**
   * Get all components organized by category
   */
  getAllComponentsByCategory(): Observable<{ [category: string]: ComponentDefinition[] }> {
    const categoryPaths = [
      'infrastructure',
      'ai_models',
      'storage',
      'networking',
      'tooling',
      'data_processing',
      'deployment',
      'cisco_ai',
      'cisco_ai_pods'
    ];

    const requests = categoryPaths.map(catPath =>
      this.loadCategoryComponents(catPath).pipe(
        map(components => ({ category: catPath, components }))
      )
    );

    return forkJoin(requests).pipe(
      map(results => {
        const byCategory: { [category: string]: ComponentDefinition[] } = {};
        results.forEach(result => {
          byCategory[result.category] = result.components;
        });
        return byCategory;
      })
    );
  }

  /**
   * Clear the cache (useful for refreshing data)
   */
  clearCache(): void {
    this.componentsCache = null;
  }
}
