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
