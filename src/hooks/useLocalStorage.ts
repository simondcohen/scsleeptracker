import { useState, useEffect } from 'react';

// Custom hook for persisting state in localStorage
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Get stored value from localStorage
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };
  
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue);
  
  // Set to localStorage whenever state changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
      
      // Dispatch a custom event so other instances of the hook know to update
      window.dispatchEvent(new Event('local-storage-change'));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  
  // Listen for changes in localStorage from other instances of this hook
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };
    
    window.addEventListener('local-storage-change', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('local-storage-change', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [readValue]);
  
  return [storedValue, setStoredValue];
}