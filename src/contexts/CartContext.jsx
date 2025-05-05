import { createContext, useContext, useEffect, useReducer } from "react";

const initialState = {
  cart: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
};

// Create context
const CartContext = createContext(undefined);

// Reducer function to manage cart state
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const newItem = action.payload.item;

      // Optional: Prevent adding items from different restaurants
      if (state.cart.length > 0 && state.cart[0].restaurantId !== newItem.restaurantId) {
        console.error("Cannot add items from different restaurants to the same cart.");
        // You might want to set an error state here instead of just logging
        return state; // Return current state without changes
      }

      // Check if item already exists
      const existingItemIndex = state.cart.findIndex(item => item.id === newItem.id);
      let updatedCart;

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        updatedCart = state.cart.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + newItem.quantity } 
            : item
        );
      } else {
        // Item is new, add it
        updatedCart = [...state.cart, newItem];
      }

      // Recalculate totals based on the updatedCart
      const updatedTotalItems = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
      const updatedTotalPrice = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        cart: updatedCart,
        totalItems: updatedTotalItems,
        totalPrice: updatedTotalPrice,
      };
    }
    case "REMOVE_FROM_CART": {
      const itemToRemove = state.cart.find(item => item.id === action.payload.itemId);
      if (!itemToRemove) return state; // Item not found

      const filteredCart = state.cart.filter(
        (item) => item.id !== action.payload.itemId
      );

      // Recalculate totals
      const updatedTotalItems = filteredCart.reduce((sum, item) => sum + item.quantity, 0);
      const updatedTotalPrice = filteredCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        cart: filteredCart,
        totalItems: updatedTotalItems,
        totalPrice: updatedTotalPrice,
      };
    }
    case "UPDATE_CART_ITEM": {
      const { itemId, quantity } = action.payload;
      if (quantity < 1) return state; // Prevent quantity less than 1

      const updatedCartItems = state.cart.map((item) =>
        item.id === itemId ? { ...item, quantity: quantity } : item
      );

      // Recalculate totals
      const updatedTotalItems = updatedCartItems.reduce((sum, item) => sum + item.quantity, 0);
      const updatedTotalPrice = updatedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        cart: updatedCartItems,
        totalItems: updatedTotalItems,
        totalPrice: updatedTotalPrice,
      };
    }
    case "CHECKOUT": 
      return {
        ...initialState, // Reset to initial state but keep loading false
        isLoading: false,
      };
    default:
      return state;
  }
};

// Create CartProvider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    console.log("Cart state updated:", state);
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};