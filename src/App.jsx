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
import Menu from "./pages/user/MenuPage/Menu";
import MenuDetail from "./pages/user/MenuDetailPage/MenuDetail";
import OrderHistory from "./pages/user/OrderHistoryPage/OrderHistory";
import Cart from "./pages/user/CartPage/Cart";
import OrderManagement from "./pages/restaurant_owner/OrderManagementPage/OrderManagement";
import { ToastContainer, toast, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
  const { user, isAuthenticated, loading, error } = state;

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

        {/* User route - Protected route */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              {user && user.role === "user" ? <Cart /> : <Navigate to="/" />}
            </ProtectedRoute>
          }
        />

        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              {user && user.role === "user" ? <Menu /> : <Navigate to="/" />}
            </ProtectedRoute>
          }
        />

        <Route
          path="/menu/:restaurantId"
          element={
            <ProtectedRoute>
              {user && user.role === "user" ? (
                <MenuDetail />
              ) : (
                <Navigate to="/" />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              {user && user.role === "user" ? (
                <OrderHistory />
              ) : (
                <Navigate to="/" />
              )}
            </ProtectedRoute>
          }
        />

        {/* Restaurant-owner route */}
        <Route
          path="/order-management"
          element={
            <ProtectedRoute>
              {user && user.role === "restaurant-owner" ? (
                <OrderManagement />
              ) : (
                <Navigate to="/" />
              )}
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </Router>
  );
}

export default App;
