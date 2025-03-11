import { auth } from './auth';

// Custom error class for rate limiting
export class RateLimitError extends Error {
  constructor(message: string = 'Too many requests. Please try again later.', public retryAfter?: number) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = auth.getToken();
  
  // if (!token || token.trim() === '') {
  //   console.error('Token is missing or invalid.');
  //   return Promise.reject(new Error('No authentication token found.'));
  // } 
  if (!token) {
    auth.logout(); // Logout if token is missing
    return Promise.reject(new Error("No authentication token found."));
  }

  // Ensure headers are set correctly
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');
  
  // For debugging - log the request
  console.log('Making request to:', url);
  console.log('With headers:', Object.fromEntries(headers.entries()));

  try {
    const response = await fetch(url, { 
      ...options, 
      headers,
      // Add credentials for cookies if needed
      credentials: 'include'
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.status === 401) {
      auth.logout(); // Logout if token is invalid
      return Promise.reject(new Error("Unauthorized. Redirecting to login..."));
    }

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const retrySeconds = retryAfter ? parseInt(retryAfter, 10) : undefined;
      const message = await response.text();
      throw new RateLimitError(
        'Server is experiencing high load. Please wait a moment before trying again.',
        retrySeconds
      );
    }

    return response;
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error; // Re-throw rate limit errors
    }
    
    // Log more details about the error
    console.error("Fetch error:", error);
    console.error("Error details:", error instanceof Error ? error.message : 'Unknown error');
    
    if (error instanceof TypeError && error.message.includes('NetworkError')) {
      console.error("This might be a CORS issue. Check server CORS configuration.");
    }
    
    return Promise.reject(error);
  }
};