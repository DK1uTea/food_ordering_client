import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Accordion, ListGroup, Badge } from 'react-bootstrap';
import orderService from '../../../services/orderService';
import './OrderHistory.css'; // We'll create this CSS file

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderHistory = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await orderService.getOrderHistory();
        // Sort orders by date, newest first (optional)
        const sortedData = (data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedData);
      } catch (err) {
        setError(`Failed to fetch order history: ${err.message}`);
        console.error("Fetch order history error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Container className="order-history-container py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="order-history-heading">My Order History</h1>
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
        <Row>
          <Col>
            {orders.length > 0 ? (
              <Accordion defaultActiveKey="0" alwaysOpen>
                {orders.map((order, index) => (
                  <Accordion.Item eventKey={String(index)} key={order._id} className="order-accordion-item mb-3">
                    <Accordion.Header>
                      <div className="d-flex justify-content-between w-100 pe-3">
                        <span>Order ID: {order._id.substring(order._id.length - 6)}</span> 
                        <span>Date: {formatDate(order.createdAt)}</span>
                        <Badge pill bg={getStatusBadgeVariant(order.status)}>
                          {order.status || 'Unknown'}
                        </Badge>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      {/* Optional: Display Restaurant Name if available */}
                      {/* {order.restaurant && <p><strong>Restaurant:</strong> {order.restaurant.name}</p>} */}
                      <p><strong>Total Amount:</strong> ${order.totalAmount?.toFixed(2)}</p>
                      <h6>Items:</h6>
                      <ListGroup variant="flush">
                        {order.items?.map((item) => (
                          <ListGroup.Item key={item.menuItemId} className="d-flex justify-content-between">
                            <span>{item.name || 'Item Name Unavailable'} (x{item.quantity})</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            ) : (
              <Alert variant="info">You haven't placed any orders yet.</Alert>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default OrderHistory;
