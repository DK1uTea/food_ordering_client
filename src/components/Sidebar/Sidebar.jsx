import React, { useState } from "react";
import { Nav, Button, Offcanvas } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const { state, dispatch } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.removeItem("user"); // Remove user data from localStorage
    navigate("/login"); // Redirect to login page
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <>
      <Button variant="primary" className="d-md-none sidebar-toggle" onClick={handleShow}>
        <i className="bi bi-list"></i> Menu
      </Button>

      {/* Sidebar for larger screens */}
      <div className="sidebar d-none d-md-flex">
        <div className="sidebar-header">
          <h3>Food Order</h3>
        </div>
        <Nav className="flex-column sidebar-nav">
          <Nav.Link as={Link} to="/home" className={isActive("/home")}>
            <i className="bi bi-house-door"></i> Home
          </Nav.Link>
          <Nav.Link as={Link} to="/menu" className={isActive("/menu")}>
            <i className="bi bi-card-list"></i> Menu
          </Nav.Link>
          <Nav.Link as={Link} to="/cart" className={isActive("/cart")}>
            <i className="bi bi-cart"></i> Cart
          </Nav.Link>
          <Nav.Link as={Link} to="/orders" className={isActive("/orders")}>
            <i className="bi bi-bag"></i> My Orders
          </Nav.Link>
          <Nav.Link as={Link} to="/profile" className={isActive("/profile")}>
            <i className="bi bi-person"></i> Profile
          </Nav.Link>
          <Nav.Link onClick={handleLogout} className="logout-link">
            <i className="bi bi-box-arrow-right"></i> Logout
          </Nav.Link>
        </Nav>
      </div>

      {/* Offcanvas sidebar for mobile */}
      <Offcanvas show={show} onHide={handleClose} className="mobile-sidebar">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Food Order</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/home" onClick={handleClose}>
              <i className="bi bi-house-door"></i> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/menu" onClick={handleClose}>
              <i className="bi bi-card-list"></i> Menu
            </Nav.Link>
            <Nav.Link as={Link} to="/cart" onClick={handleClose}>
              <i className="bi bi-cart"></i> Cart
            </Nav.Link>
            <Nav.Link as={Link} to="/orders" onClick={handleClose}>
              <i className="bi bi-bag"></i> My Orders
            </Nav.Link>
            <Nav.Link as={Link} to="/profile" onClick={handleClose}>
              <i className="bi bi-person"></i> Profile
            </Nav.Link>
            <Nav.Link onClick={() => { handleLogout(); handleClose(); }} className="logout-link">
              <i className="bi bi-box-arrow-right"></i> Logout
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
