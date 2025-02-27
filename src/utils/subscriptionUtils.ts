// utils/subscriptionUtils.ts

interface User {
    email: string;
    firstName: string;
    lastName: string;
    id: string;
    isSubscribed: boolean;
  }
  
  /**
   * Checks if the current user has an active subscription
   * @returns boolean indicating if user is subscribed
   */
  export const checkUserSubscription = (): boolean => {
    try {
      const userDataString = localStorage.getItem('user');
      if (!userDataString) return false;
      
      const userData: User = JSON.parse(userDataString);
      return userData.isSubscribed === true;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }
  
  /**
   * Gets the current user from localStorage
   * @returns User object or null if not found/invalid
   */
  export const getCurrentUser = (): User | null => {
    try {
      const userDataString = localStorage.getItem('user');
      if (!userDataString) return null;
      
      return JSON.parse(userDataString) as User;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }