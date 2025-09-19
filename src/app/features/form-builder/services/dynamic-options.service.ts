import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

export interface OptionItem {
  value: string;
  label: string;
}

export interface ApiConfig {
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  dataPath?: string;
  valueField?: string;
  labelField?: string;
  transformFunction?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DynamicOptionsService {
  constructor(private http: HttpClient) {}

  /**
   * Get options based on the source type
   */
  getOptions(
    optionSource: 'static' | 'api' | 'external',
    staticOptions?: string,
    apiConfig?: ApiConfig
  ): Observable<OptionItem[]> {
    switch (optionSource) {
      case 'static':
        return this.getStaticOptions(staticOptions);
      case 'api':
        return this.getApiOptions(apiConfig);
      case 'external':
        return this.getExternalApiOptions(apiConfig);
      default:
        return of([]);
    }
  }

  /**
   * Parse static options from comma-separated string or JSON
   */
  private getStaticOptions(staticOptions?: string): Observable<OptionItem[]> {
    if (!staticOptions) {
      return of([]);
    }

    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(staticOptions);
      if (Array.isArray(parsed)) {
        return of(
          parsed.map((item) => ({
            value: String(item.value || item),
            label: String(item.label || item),
          }))
        );
      }
    } catch {
      // If not JSON, treat as comma-separated values
    }

    // Parse comma-separated values
    const options = staticOptions
      .split(',')
      .map((option) => option.trim())
      .filter((option) => option.length > 0)
      .map((option) => ({
        value: option,
        label: option,
      }));

    return of(options).pipe(delay(100)); // Simulate loading
  }

  /**
   * Get options from internal API endpoints
   */
  private getApiOptions(apiConfig?: ApiConfig): Observable<OptionItem[]> {
    if (!apiConfig?.url) {
      return of([]);
    }

    const headers = new HttpHeaders(apiConfig.headers || {});

    return this.http.get(apiConfig.url, { headers }).pipe(
      map((response) => this.transformApiResponse(response, apiConfig)),
      catchError((error) => {
        console.error('Error fetching API options:', error);
        return throwError(() => new Error('Failed to load options from API'));
      })
    );
  }

  /**
   * Get options from external API
   */
  private getExternalApiOptions(
    apiConfig?: ApiConfig
  ): Observable<OptionItem[]> {
    if (!apiConfig?.url) {
      return of([]);
    }

    const headers = new HttpHeaders(apiConfig.headers || {});
    const method = apiConfig.method || 'GET';

    let request: Observable<any>;

    switch (method) {
      case 'GET':
        request = this.http.get(apiConfig.url, { headers });
        break;
      case 'POST':
        request = this.http.post(apiConfig.url, apiConfig.params, { headers });
        break;
      case 'PUT':
        request = this.http.put(apiConfig.url, apiConfig.params, { headers });
        break;
      case 'DELETE':
        request = this.http.delete(apiConfig.url, { headers });
        break;
      default:
        return throwError(() => new Error('Unsupported HTTP method'));
    }

    return request.pipe(
      map((response) => this.transformApiResponse(response, apiConfig)),
      catchError((error) => {
        console.error('Error fetching external API options:', error);
        return throwError(
          () => new Error('Failed to load options from external API')
        );
      })
    );
  }

  /**
   * Transform API response to OptionItem array
   */
  private transformApiResponse(response: any, config: ApiConfig): OptionItem[] {
    let data = response;

    // Extract data using dataPath if specified
    if (config.dataPath) {
      data = this.getNestedValue(response, config.dataPath);
    }

    if (!Array.isArray(data)) {
      console.warn('API response is not an array:', data);
      return [];
    }

    const valueField = config.valueField || 'value';
    const labelField = config.labelField || 'label';

    // Apply custom transform function if provided
    if (config.transformFunction) {
      try {
        const transformFn = new Function(
          'data',
          'valueField',
          'labelField',
          config.transformFunction
        );
        return transformFn(data, valueField, labelField);
      } catch (error) {
        console.error('Error executing transform function:', error);
      }
    }

    // Default transformation
    return data.map((item: any) => ({
      value: String(item[valueField] || item),
      label: String(item[labelField] || item),
    }));
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  /**
   * Validate API configuration
   */
  validateApiConfig(config?: ApiConfig): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!config) {
      errors.push('API configuration is required');
      return { isValid: false, errors };
    }

    if (!config.url) {
      errors.push('API URL is required');
    }

    if (config.url && !this.isValidUrl(config.url)) {
      errors.push('Invalid API URL format');
    }

    if (
      config.method &&
      !['GET', 'POST', 'PUT', 'DELETE'].includes(config.method)
    ) {
      errors.push('Invalid HTTP method');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
