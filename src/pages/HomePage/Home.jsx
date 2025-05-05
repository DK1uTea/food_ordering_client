import React from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { state } = useAuth();
  const { user } = state;

  // Featured items for the carousel - in a real app, these would come from an API
  const featuredItems = [
    {
      id: 1,
      name: "Signature Burger",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400&q=80",
      description: "Our famous burger with special sauce and premium toppings"
    },
    {
      id: 2,
      name: "Fresh Pizza",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400&q=80",
      description: "Hand-tossed pizza with premium ingredients"
    },
    {
      id: 3,
      name: "Healthy Salad",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400&q=80",
      description: "Fresh salad with organic vegetables and homemade dressing"
    }
  ];

  // Quick action categories
  const quickActions = [
    {
      title: "Browse Menu",
      icon: "bi-card-list",
      description: "Explore our delicious offerings",
      path: "/menu",
      color: "primary"
    },
    {
      title: "Your Cart",
      icon: "bi-cart",
      description: "Review your selected items",
      path: "/cart",
      color: "success"
    },
    {
      title: "Order History",
      icon: "bi-clock-history",
      description: "View your previous orders",
      path: "/my-orders",
      color: "info"
    }
  ];
  
  return (
    <Container className="home-container py-4">
      <Row className="welcome-section mb-4">
        <Col>
          <h1 className="welcome-heading">
            Welcome, {user?.name || 'Food Lover'}!
          </h1>
          <p className="welcome-subheading">
            What delicious meal are you craving today?
          </p>
        </Col>
      </Row>

      {/* Featured Items Carousel */}
      <Row className="mb-5">
        <Col>
          <Card className="border-0 shadow">
            <Card.Body>
              <h2 className="section-title mb-4">Featured Items</h2>
              <Carousel className="featured-carousel">
                {featuredItems.map((item) => (
                  <Carousel.Item key={item.id}>
                    <img
                      className="d-block w-100 carousel-img"
                      src={item.image}
                      alt={item.name}
                    />
                    <Carousel.Caption className="carousel-caption">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <Button as={Link} to="/menu" variant="primary">
                        Order Now
                      </Button>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <h2 className="section-title mb-3">Quick Actions</h2>
        </Col>
      </Row>
      <Row className="g-4">
        {quickActions.map((action, index) => (
          <Col md={4} sm={6} key={index}>
            <Card 
              as={Link} 
              to={action.path} 
              className={`quick-action-card h-100 text-center bg-${action.color} text-white`}
            >
              <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                <i className={`bi ${action.icon} action-icon`}></i>
                <Card.Title className="mt-3">{action.title}</Card.Title>
                <Card.Text>{action.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Special Offer */}
      <Row className="mt-5">
        <Col md={12}>
          <Card className="border-0 shadow promo-card">
            <Card.Body className="p-4">
              <Row>
                <Col md={8}>
                  <h3>Special Offer</h3>
                  <p className="lead">
                    Get 15% off on your first order with code: <strong>WELCOME15</strong>
                  </p>
                  <Button as={Link} to="/menu" variant="danger" size="lg" className="mt-3">
                    Order Now
                  </Button>
                </Col>
                <Col md={4} className="d-none d-md-block">
                  <div className="promo-icon">
                    <i className="bi bi-tag-fill"></i>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
