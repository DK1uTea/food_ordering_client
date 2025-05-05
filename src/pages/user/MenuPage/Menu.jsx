import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import restaurantService from '../../../services/restaurantService';
import './Menu.css';

const Menu = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await restaurantService.getAllRestaurants();
        setRestaurants(data || []); // Ensure data is an array
      } catch (err) {
        setError(`Failed to fetch restaurants: ${err.message}`);
        console.error("Fetch restaurants error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <Container className="menu-container py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="menu-heading">Choose a Restaurant</h1>
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
        <Row xs={1} md={2} lg={3} className="g-4">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <Col key={restaurant._id}> {/* Assuming _id is the unique identifier */}
                <Card className="restaurant-card h-100 shadow-sm">
                  {/* You might want to add an image here if available */}
                  {/* <Card.Img variant="top" src={restaurant.imageUrl || 'default-image.jpg'} /> */}
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{restaurant.name}</Card.Title>
                    <Card.Text className="text-muted">
                      {restaurant.address}
                      {/* Add more details like cuisine type if available */}
                    </Card.Text>
                    <Button 
                      as={Link} 
                      to={`/menu/${restaurant._id}`} 
                      variant="primary" 
                      className="mt-auto"
                    >
                      View Menu
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <Alert variant="info">No restaurants available at the moment.</Alert>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Menu;
