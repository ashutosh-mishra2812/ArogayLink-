/* eslint-disable @typescript-eslint/no-explicit-any */

// ✅ Default backend URL
const BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:5000/api').trim();

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: any;
}

interface RequestOptions {
  headers?: Record<string, string>;
}

class HttpService {
  private getAuthHeader(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private getHeader(auth = true): Record<string, string> {
    return auth ? this.getAuthHeader() : { 'Content-Type': 'application/json' };
  }

  private async makeRequest<T = any>(
    endPoint: string,
    method: string,
    body?: any,
    auth = true,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    try {
      // ✅ Ensure single-slash endpoint
      const cleanEndpoint = endPoint.startsWith('/') ? endPoint : `/${endPoint}`;
      const url = `${BASE_URL}${cleanEndpoint}`;

      const headers = {
        ...this.getHeader(auth),
        ...(options?.headers || {}),
      };

      const config: RequestInit = {
        method,
        headers,
        ...(body ? { body: JSON.stringify(body) } : {}),
      };

      const response = await fetch(url, config);

      const text = await response.text();
      const contentType = response.headers.get('content-type') || '';

      let data: any;

      if (contentType.includes('application/json')) {
        try {
          data = text ? JSON.parse(text) : {};
        } catch (err) {
          throw new Error(`Invalid JSON response from server: ${text}`);
        }
      } else if (text) {
        // ❌ Non-JSON (HTML or text) response
        throw new Error(
          `Non-JSON response from ${url} (check backend route!):\n${text.substring(0, 300)}...`
        );
      } else {
        data = { success: response.ok, message: response.statusText, data: null };
      }

      if (!response.ok) {
        const errMsg = data?.message || response.statusText || `HTTP ${response.status}`;
        throw new Error(errMsg);
      }

      return data as ApiResponse<T>;
    } catch (error: any) {
      console.error(
        `Api Error [${method || 'UNKNOWN'} ${endPoint || 'UNKNOWN'}]:`,
        error?.message || JSON.stringify(error)
      );
      throw error;
    }
  }

  // ===== Auth-required methods =====
  getWithAuth<T = any>(endPoint: string, options?: RequestOptions) {
    return this.makeRequest<T>(endPoint, 'GET', undefined, true, options);
  }
  postWithAuth<T = any>(endPoint: string, body: any, options?: RequestOptions) {
    return this.makeRequest<T>(endPoint, 'POST', body, true, options);
  }
  putWithAuth<T = any>(endPoint: string, body: any, options?: RequestOptions) {
    return this.makeRequest<T>(endPoint, 'PUT', body, true, options);
  }
  deleteWithAuth<T = any>(endPoint: string, options?: RequestOptions) {
    return this.makeRequest<T>(endPoint, 'DELETE', undefined, true, options);
  }

  // ===== No-auth methods =====
  postWithoutAuth<T = any>(endPoint: string, body: any, options?: RequestOptions) {
    return this.makeRequest<T>(endPoint, 'POST', body, false, options);
  }
  getWithoutAuth<T = any>(endPoint: string, options?: RequestOptions) {
    return this.makeRequest<T>(endPoint, 'GET', undefined, false, options);
  }
}

export const httpService = new HttpService();

// Bound helpers
export const getWithAuth = httpService.getWithAuth.bind(httpService);
export const postWithAuth = httpService.postWithAuth.bind(httpService);
export const putWithAuth = httpService.putWithAuth.bind(httpService);
export const deleteWithAuth = httpService.deleteWithAuth.bind(httpService);

export const getWithoutAuth = httpService.getWithoutAuth.bind(httpService);
export const postWithoutAuth = httpService.postWithoutAuth.bind(httpService);

