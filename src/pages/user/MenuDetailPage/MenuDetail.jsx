import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, ListGroup, Badge, Modal, Form, InputGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import restaurantService from '../../../services/restaurantService';
import './MenuDetail.css';

const MenuDetail = () => {
  const { restaurantId } = useParams();
  const { dispatch: cartDispatch, state: cartState } = useCart();
  const [menuItems, setMenuItems] = useState([]);
  const [restaurantName, setRestaurantName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      if (!restaurantId) return;
      setIsLoading(true);
      setError('');
      try {
        const data = await restaurantService.getRestaurantMenu(restaurantId);
        setMenuItems(data || []);
      } catch (err) {
        setError(`Failed to fetch menu: ${err.message}`);
        console.error("Fetch menu error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantId]);

  // --- Modal Handlers ---
  const handleShowModal = (menuItem) => {
    if (cartState.cart.length > 0 && cartState.cart[0].restaurantId !== restaurantId) {
        alert("You can only order from one restaurant at a time. Please clear your cart or complete your current order first.");
        return;
    }
    setSelectedItem(menuItem);
    setSelectedQuantity(1);
    setModalError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setSelectedQuantity(1);
    setModalError('');
  };

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value, 10);
    if (isNaN(quantity) || quantity < 1) {
      setSelectedQuantity(1);
      setModalError('');
    } else if (selectedItem && quantity > selectedItem.quantity) {
      setSelectedQuantity(selectedItem.quantity);
      setModalError(`Only ${selectedItem.quantity} available in stock.`);
    } else {
      setSelectedQuantity(quantity);
      setModalError('');
    }
  };

  const handleConfirmAddToCart = () => {
    if (!selectedItem || selectedQuantity < 1) {
      setModalError("Invalid quantity selected.");
      return;
    }
    
    if (selectedQuantity > selectedItem.quantity) {
        setModalError(`Cannot add ${selectedQuantity}. Only ${selectedItem.quantity} available.`);
        return;
    }

    const itemToAdd = {
      id: selectedItem._id, 
      name: selectedItem.name,
      price: selectedItem.price,
      quantity: selectedQuantity,
      restaurantId: restaurantId,
    };
    
    cartDispatch({ type: 'ADD_TO_CART', payload: { item: itemToAdd } });
    console.log(`${selectedItem.name} (x${selectedQuantity}) added to cart`);
    handleCloseModal();
  };
  // --- End Modal Handlers ---

  return (
    <Container className="menu-detail-container py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="menu-detail-heading">{restaurantName || `Menu`}</h1> 
        </Col>
      </Row>
      {isLoading && <div className="text-center"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}

      {!isLoading && !error && (
        <Row>
          <Col>
            {menuItems.length > 0 ? (
              <ListGroup>
                {menuItems.map((item) => (
                  <ListGroup.Item key={item._id} className="d-flex justify-content-between align-items-center menu-list-item">
                    <div>
                      <h5 className="item-title">{item.name}</h5>
                      <p className="item-description text-muted mb-1">{item.description}</p>
                      <Badge bg="secondary" pill>${item.price.toFixed(2)}</Badge>
                      <small className="text-muted ms-2">(Stock: {item.quantity ?? 'N/A'})</small> 
                    </div>
                    <Button 
                      variant="success" 
                      size="sm" 
                      onClick={() => handleShowModal(item)}
                      disabled={item.quantity === 0}
                    >
                      {item.quantity === 0 ? 'Out of Stock' : <><i className="bi bi-cart-plus"></i> Add</>}
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <Alert variant="info">This restaurant currently has no menu items available.</Alert>
            )}
          </Col>
        </Row>
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add to Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <>
              <h5>{selectedItem.name}</h5>
              <p className="text-muted">{selectedItem.description}</p>
              <p><strong>Price:</strong> ${selectedItem.price.toFixed(2)}</p>
              <p><small>Available in stock: {selectedItem.quantity}</small></p>
              
              <Form.Group as={Row} className="align-items-center">
                <Form.Label column sm="3">Quantity:</Form.Label>
                <Col sm="9">
                  <InputGroup>
                     <Form.Control 
                        type="number" 
                        value={selectedQuantity} 
                        onChange={handleQuantityChange}
                        min="1"
                        max={selectedItem.quantity}
                        isInvalid={!!modalError}
                     />
                     <Form.Control.Feedback type="invalid">
                        {modalError}
                     </Form.Control.Feedback>
                  </InputGroup>
                </Col>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleConfirmAddToCart}
            disabled={!selectedItem || selectedQuantity < 1 || selectedQuantity > selectedItem?.quantity || !!modalError}
          >
            Add to Cart
          </Button>
        </Modal.Footer>
      </Modal>
      
    </Container>
  );
};

export default MenuDetail;
