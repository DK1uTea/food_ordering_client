import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Alert,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext"; // Assuming useCart is exported from CartContext
import { useAuth } from "../../../contexts/AuthContext";
import orderService from "../../../services/orderService";
import "./Cart.css"; // We'll create this CSS file
import { showError, showInfo, showSuccess } from "../../../utils/toastUtils";

const Cart = () => {
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { state: authState } = useAuth();
  const { cart, totalItems, totalPrice } = cartState;
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRemoveItem = (itemId) => {
    cartDispatch({ type: "REMOVE_FROM_CART", payload: { itemId } });
  };

  // TODO: Implement quantity update if needed
  // const handleUpdateQuantity = (itemId, quantity) => {
  //   if (quantity < 1) return; // Prevent quantity less than 1
  //   cartDispatch({ type: 'UPDATE_CART_ITEM', payload: { itemId, quantity } });
  // };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setError("Your cart is empty. Add items before placing an order.");
      return;
    }

    // Assumption: All items in the cart are from the same restaurant
    // Or the backend handles orders with items from multiple restaurants.
    // The current orderService.placeOrder requires a single restaurantId.
    // This might need adjustment based on your actual API design.
    // For now, let's take the restaurantId from the first item.
    const restaurantId = cart[0]?.restaurantId;
    if (!restaurantId) {
      setError(
        "Could not determine the restaurant for the order. Please ensure items have restaurantId."
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const orderItems = cart.map((item) => ({
        menuItemId: item.id, // Assuming item.id is the menuItemId
        quantity: item.quantity,
        // price: item.price // Send price per item for verification
      }));

      await orderService.placeOrder(restaurantId, orderItems);

      // Clear the cart after successful order
      cartDispatch({ type: "CHECKOUT" });
      showSuccess("Order placed successfully! Redirecting to order history...");
      showInfo(`Your order confirmation will be sent to your email ${authState.user.email}.`);

      // Navigate to order history page
      setTimeout(() => {
        navigate("/my-orders");
      }, 1500);

    } catch (err) {
      showError("Failed to place order. Please try again.");
      setError(`Failed to place order: ${err.message}`);
      console.error("Order placement error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="cart-container py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="cart-heading">Your Shopping Cart</h1>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={8}>
          <Card className="cart-items-card shadow-sm">
            <Card.Header as="h5">Cart Items ({totalItems})</Card.Header>
            <Card.Body>
              {cart.length === 0 ? (
                <Alert variant="info">Your cart is currently empty.</Alert>
              ) : (
                <ListGroup variant="flush">
                  {cart.map((item) => (
                    <ListGroup.Item
                      key={item.id}
                      className="d-flex justify-content-between align-items-center cart-item"
                    >
                      <div>
                        <h6 className="item-name">{item.name}</h6>
                        <span className="item-price text-muted">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </span>
                      </div>
                      <div className="item-controls">
                        <span className="item-total-price fw-bold me-3">
                          {(item.price * item.quantity).toFixed(2)}đ
                        </span>
                        {/* Add quantity controls here if needed */}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <i className="bi bi-trash"></i> Remove
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="cart-summary-card shadow-sm">
            <Card.Header as="h5">Order Summary</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Total Items:</span>
                  <strong>{totalItems}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <strong>{totalPrice.toFixed(2)}đ</strong>
                </ListGroup.Item>
                {/* Add Taxes/Fees here if applicable */}
                <ListGroup.Item className="d-flex justify-content-between total-row">
                  <span className="fw-bold">Total:</span>
                  <strong className="fs-5">{totalPrice.toFixed(2)}đ</strong>
                </ListGroup.Item>
              </ListGroup>
              <div className="d-grid mt-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={cart.length === 0 || isLoading}
                >
                  {isLoading ? "Placing Order..." : "Place Order"}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
