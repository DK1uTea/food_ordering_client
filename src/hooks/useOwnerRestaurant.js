// src/hooks/useOwnerRestaurant.js
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import restaurantService from '../services/restaurantService';

export function useOwnerRestaurant() {
  const { state } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRestaurant = async () => {
      // Only run for authenticated restaurant owners
      if (!state.isAuthenticated || state.user?.role !== 'restaurant-owner') {
        return;
      }
      
      // If we already have restaurant data cached in state, use it
      if (restaurant?._id) {
        return;
      }

      setIsLoading(true);
      try {
        const data = await restaurantService.getOwnerRestaurant();
        if (data && data._id) {
          setRestaurant(data);
        } else {
          setError("No restaurant found for this owner");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRestaurant();
  }, [state.isAuthenticated, state.user?.role, restaurant]);
  
  return { restaurant, isLoading, error };
}