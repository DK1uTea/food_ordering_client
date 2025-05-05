import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import restaurantService from "../services/restaurantService"; // Add this import

// Initial state for the authentication context
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Initialization function for the reducer
const initAuth = () => {
  try {
    console.log("Initializing auth state...");
    const token = localStorage.getItem("token");
    const userDataStr = localStorage.getItem("user");

    if (token && userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        return {
          ...initialState,
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        };
      } catch (error) {
        console.error(
          "Failed to parse user data during initialization:",
          error
        );
      }
    }

    // Default return if no token or parsing failed
    return initialState;
  } catch (error) {
    console.error("Error during auth initialization:", error);
    return initialState;
  }
};

// Create context
const AuthContext = createContext(undefined);

// Reducer function to manage authentication state
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        isAuthenticated: true,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case "REGISTER_REQUEST":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "REGISTER_SUCCESS":
      return {
        ...state,
        isLoading: false,
      };
    case "REGISTER_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };

    default:
      return state;
  }
};

// Create AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, undefined, initAuth);

  // Add this effect to fetch restaurant data for restaurant owners
  useEffect(() => {
    const fetchOwnerRestaurantData = async () => {
      // Check if user is authenticated and is a restaurant owner but doesn't have restaurant ID
      if (
        state.isAuthenticated && 
        state.user && 
        state.user.role === "restaurant-owner" && 
        !state.user.restaurant
      ) {
        try {
          console.log("Fetching restaurant for owner...");
          const restaurantData = await restaurantService.getOwnerRestaurant();
          
          if (restaurantData && restaurantData._id) {
            // Update the user with restaurant ID
            const updatedUser = {
              ...state.user,
              restaurant: restaurantData._id
            };
            
            // Update localStorage for persistence
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // Update state
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: { user: updatedUser }
            });
            
            console.log("Restaurant data fetched and saved:", restaurantData._id);
          } else {
            console.error("No restaurant found for this owner");
          }
        } catch (error) {
          console.error("Error fetching owner's restaurant:", error);
        }
      }
    };
    
    fetchOwnerRestaurantData();
  }, [state.isAuthenticated, state.user?.role]);

  // Your existing debug effect
  useEffect(() => {
    console.log("Auth state changed:", state);
  }, [state]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
