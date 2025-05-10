import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Table, Button, Badge } from 'react-bootstrap';
import { useOwnerRestaurant } from '../../../hooks/useOwnerRestaurant';
import orderService from '../../../services/orderService';
import './OrderManagement.css';

const OrderManagement = () => {
  const { restaurant, isLoading: isLoadingRestaurant, error: restaurantError } = useOwnerRestaurant();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Get restaurant ID from the hook result
  const restaurantId = restaurant?._id;

  const fetchRestaurantOrders = useCallback(async () => {
    // Don't try to fetch orders if restaurant data is still loading
    if (isLoadingRestaurant || !restaurantId) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    try {
      const pendingOrders = await orderService.getPendingRestaurantOrders(restaurantId);
      setOrders(pendingOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
    } catch (err) {
      setError(`Failed to fetch orders: ${err.message}`);
      console.error("Fetch restaurant orders error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId, isLoadingRestaurant]);

  useEffect(() => {
    fetchRestaurantOrders();
  }, [fetchRestaurantOrders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
        await orderService.updateOrderStatus(restaurantId, orderId, newStatus); 
        fetchRestaurantOrders(); 
    } catch (err) {
        setError(`Failed to update order ${orderId} to ${newStatus}: ${err.message}`);
        console.error("Update order status error:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Show specific loading state for restaurant data
  if (isLoadingRestaurant) {
    return (
      <Container className="order-management-container py-4">
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <p className="mt-2">Loading your restaurant information...</p>
        </div>
      </Container>
    );
  }

  // Show error if restaurant couldn't be loaded
  if (restaurantError || (!isLoadingRestaurant && !restaurantId)) {
    return (
      <Container className="order-management-container py-4">
        <Alert variant="danger">
          Could not load your restaurant information. Please contact support.
        </Alert>
      </Container>
    );
  }

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
                    <th>Customer</th>
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
                      <td>{order.customerId || 'N/A'}</td>
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
                          onClick={() => handleUpdateStatus(order._id, 'CONFIRMED')}
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
