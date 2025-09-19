import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export const ApiInterceptor: HttpInterceptorFn = (request, next) => {
  // Only intercept requests that start with /api or specific endpoints
  if (shouldIntercept(request.url)) {
    const apiReq = request.clone({
      url: `${API_CONFIG.BASE_URL}${request.url}`,
      setHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    return next(apiReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }

  return next(request);
};

function shouldIntercept(url: string): boolean {
  // Intercept requests to specific API endpoints
  const apiEndpoints = [
    '/FormDefinitions',
    '/FormSubmissions',
    '/api/',
    '/api/Auth',
    '/api/Tenant',
    '/api/WorkPermit',
  ];

  return apiEndpoints.some((endpoint) => url.startsWith(endpoint));
}
