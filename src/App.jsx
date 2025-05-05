import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "./contexts/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register/Register";
import Home from "./pages/HomePage/Home";
import Sidebar from "./components/Sidebar/Sidebar";

// Create a protected route component
const ProtectedRoute = ({ children }) => {
  const { state } = useAuth();
  const { isAuthenticated } = state;
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// Create a route that redirects authenticated users
const AuthRoute = ({ children }) => {
  const { state } = useAuth();
  const { isAuthenticated } = state;
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

function App() {
  const { state } = useAuth();
  const { isAuthenticated, loading, error } = state;

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      {isAuthenticated && <Sidebar />}
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />

        {/* Home route */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Auth routes */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          }
        />

        {/* Protected routes */}
      </Routes>
    </Router>
  );
}

export default App;
