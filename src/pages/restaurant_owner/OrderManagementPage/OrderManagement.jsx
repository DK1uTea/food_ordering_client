import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Table, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../../../contexts/AuthContext';
import orderService from '../../../services/orderService';
import './OrderManagement.css'; // We'll create this CSS file

const OrderManagement = () => {
  const { state: authState } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Assuming the restaurant ID is stored in the user object after login
  // Adjust 'restaurant' based on your actual user object structure
  const restaurantId = authState.user?.restaurant; 

  const fetchRestaurantOrders = useCallback(async () => {
    if (!restaurantId) {
      setError("Restaurant ID not found for the current user.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const pendingOrders = await orderService.getPendingRestaurantOrders(restaurantId);
      // Filter for orders that need action (e.g., 'pending')
      // const pendingOrders = (data || []).filter(order => order.status === 'pending');
      setOrders(pendingOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))); // Oldest first
    } catch (err) {
      setError(`Failed to fetch orders: ${err.message}`);
      console.error("Fetch restaurant orders error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchRestaurantOrders();
  }, [fetchRestaurantOrders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    // Optimistic UI update (optional)
    // setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId)); 
    
    try {
        // Ensure updateOrderStatus exists in orderService
        await orderService.updateOrderStatus(restaurantId, orderId, newStatus); 
        // Refetch orders after update to get the latest list
        fetchRestaurantOrders(); 
    } catch (err) {
        setError(`Failed to update order ${orderId} to ${newStatus}: ${err.message}`);
        console.error("Update order status error:", err);
        // Revert optimistic update if it failed (if implemented)
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <Container className="order-management-container py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="order-management-heading">Pending Orders</h1>
        </Col>
      </Row>

      {isLoading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!isLoading && !error && (
        <Card className="shadow-sm">
          <Card.Header>Orders Awaiting Confirmation</Card.Header>
          <Card.Body>
            {orders.length > 0 ? (
              <Table striped bordered hover responsive className="order-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Time</th>
                    <th>Customer</th> {/* Assuming customer info is available */}
                    <th>Items</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id.substring(order._id.length - 6)}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>{order.customerId || 'N/A'}</td> {/* Adjust based on user data in order */}
                      <td>
                        <ul className="list-unstyled mb-0 item-list">
                          {order.items?.map(item => (
                            <li key={item.menuItemId || item._id}>
                              {item.name || 'Item'} x {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>${order.totalAmount?.toFixed(2)}</td>
                      <td>
                        <Button 
                          variant="success" 
                          size="sm" 
                          className="me-2 mb-1"
                          onClick={() => handleUpdateStatus(order._id, 'CONFIRMED')} // Or 'accepted'
                        >
                          Accept
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          className="mb-1"
                          onClick={() => handleUpdateStatus(order._id, 'CANCELLED')}
                        >
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Alert variant="info">No pending orders found.</Alert>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default OrderManagement;
