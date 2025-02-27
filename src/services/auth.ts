import { api, API_BASE_URL } from '../config/api';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  isSubscribed: boolean;
  message: string;
  status: string;
  firstName: string;
  lastName: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isSubscribed: boolean;
}

interface PasswordResetResponse {
  redirect: string;
  message: string;
  status: string;
}

const TOKEN_KEY = 'authToken';
const USER_KEY = 'user';

export const auth = {
  login: async (email: string, password: string, recaptchaToken: string): Promise<void> => {
    const response = await fetch(api.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        "g-recaptcha-response": recaptchaToken,
      }),
    });

    let data: Partial<AuthResponse> & { message?: string } = {};
    try {
      data = await response.json();
    } catch (err) {
      throw new Error('Invalid response from server.');
    }

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    auth.setSession(data.token as string);
    
    // Extract user data from JWT token
    const token = data.token as string;
    try {
      const tokenParts = token.split('.');
      const tokenPayload = JSON.parse(atob(tokenParts[1]));
      const userToStore = {
        id: tokenPayload.sub,
        email: tokenPayload.email,
        firstName: tokenPayload.firstName || '',
        lastName: tokenPayload.lastName || '',
        isSubscribed: tokenPayload.isSubscribed || false,
      };
      localStorage.setItem(USER_KEY, JSON.stringify(userToStore));
    } catch (e) {
      console.error('Invalid token format:', e);
      auth.logout();
    }
    const tokenParts = token.split('.');
    const tokenPayload = JSON.parse(atob(tokenParts[1]));
    
    const userToStore = {
      id: tokenPayload.sub,
      email: tokenPayload.email,
      firstName: tokenPayload.firstName || '',
      lastName: tokenPayload.lastName || '',
      isSubscribed: tokenPayload.isSubscribed || false,
    };
    
    localStorage.setItem(USER_KEY, JSON.stringify(userToStore));
  },

  logout: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          console.error('Logout failed on server');
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/';
  },

  forgotPassword: async (email: string, recaptchaToken: string): Promise<PasswordResetResponse> => {
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        "g-recaptcha-response": recaptchaToken,
      }),
    });

    let data: PasswordResetResponse;
    try {
      data = await response.json();
    } catch (err) {
      throw new Error('Invalid response from server.');
    }

    if (!response.ok) {
      throw new Error(data.message || 'Password reset request failed');
    }

    return data;
  },

  resetPassword: async (
    token: string, 
    newPassword: string, 
    confirmPassword: string,
    recaptchaToken?: string // Make recaptchaToken optional
  ): Promise<PasswordResetResponse> => {
    if (newPassword !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Prepare the request body - only include recaptcha if provided
    const requestBody: any = {
      token,
      password: newPassword,
      confirmPassword
    };

    // Only add recaptcha token if it's provided and not empty
    if (recaptchaToken) {
      requestBody["g-recaptcha-response"] = recaptchaToken;
    }

    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    let data: PasswordResetResponse;
    try {
      data = await response.json();
    } catch (err) {
      throw new Error('Invalid response from server.');
    }

    if (!response.ok) {
      throw new Error(data.message || 'Password reset failed');
    }

    return data;
  },

  setSession: (token: string) => {
    try {
      const tokenParts = token.split('.');
      JSON.parse(atob(tokenParts[1]));  // Decode and verify token
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem('isAuthenticated', 'true');
    } catch (e) {
      console.error('Invalid token format:', e);
      auth.logout();
    }
  },
  
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      const userData = JSON.parse(userStr);
      return {
        ...userData,
        isSubscribed: userData.isSubscribed || false,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
      };
    } catch {
      return null;
    }
  },
};