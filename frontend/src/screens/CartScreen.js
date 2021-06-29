import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../actions/cartActions';
import { FormattedMessage } from 'react-intl';
import { Context } from '../components/LanguageContext';
import { renderWithLang } from '../languages/renderWithLang';

const CartScreen = ({ match, location, history }) => {
  const { lang } = useContext(Context);

  const bundleId = match.params.id;
  const [qty, setQty] = useState(
    location.search ? Number(location.search.slice(1).split('&')[0].split('=')[1]) : 1
  );

  const [orderFrq, setOrderFrq] = useState(
    location.search ? Number(location.search.slice(1).split('&')[1].split('=')[1]) : 1
  );

  const [orderPer, setOrderPer] = useState(
    location.search ? location.search.slice(1).split('&')[2].split('=')[1] : 'Weekly'
  );

  const [orderPerInLang, setOrderPerInLang] = useState(
    location.search ? location.search.slice(1).split('&')[2].split('=')[1] : 'Weekly'
  );

  const arrayOfTime = [
    { value: 'Weekly', nl: 'Wekelijks' },
    { value: 'Every-2-Weeks', nl: 'Elke-2-weken' },
    { value: 'Monthly', nl: 'Maandelijks' },
  ];
  const arrayOfFrequencyWeekly = [1, 2, 3];
  const arrayOfFrequencyTwoWeeks = [1, 2, 3, 4];

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (bundleId) {
      history.push(`/cart/${bundleId}?qty=${qty}&frq=${orderFrq}&orderper=${orderPer}`);
      dispatch(addToCart(bundleId, qty, orderFrq, orderPer));
    }
    history.push(`/cart/${bundleId}?qty=${qty}&frq=${orderFrq}&orderper=${orderPer}`);
  }, [dispatch, bundleId, qty, history, orderFrq, orderPer]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping');
  };

  return (
    <Row>
      <Col md={12} className="my-3">
        <h1>
          <FormattedMessage id="cartScreen.header" defaultMessage="Shopping Cart" />
        </h1>
        {cartItems.length === 0 ? (
          <Message>
            <FormattedMessage id="cartScreen.emptyMsg" defaultMessage="Your cart is empty" />{' '}
            <Link to="/">
              <FormattedMessage id="cartScreen.goBack" defaultMessage="Go Back" />
            </Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={renderWithLang(item.name, lang)} fluid rounded />
                  </Col>
                  <Col md={2}>
                    <Link to={`/bundles/${item.product}`} style={{ fontSize: 'large' }}>
                      {renderWithLang(item.name, lang)}
                    </Link>
                  </Col>
                  <Col md={1}>€{item.price}</Col>
                  <Col md={1.5}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) => setQty(e.target.value)}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                    <small>
                      <FormattedMessage id="cartScreen.quantity" defaultMessage="Quantity" />
                    </small>
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      as="select"
                      value={item.orderPer}
                      onChange={(e) => {
                        setOrderPer(e.target.value);
                        setOrderPerInLang(
                          renderWithLang(
                            arrayOfTime.filter((x) => x.value === e.target.value)[0],
                            lang
                          )
                        );
                      }}
                    >
                      {arrayOfTime.map((x, index) => (
                        <option key={index} className="signup-bundle-options" value={x.value}>
                          {renderWithLang(x, lang)}
                        </option>
                      ))}
                    </Form.Control>
                    <small>
                      <FormattedMessage id="cartScreen.howOften" defaultMessage="How Often" />
                    </small>
                  </Col>
                  <Col md={1.5}>
                    <Form.Control
                      as="select"
                      value={orderFrq}
                      onChange={(e) => setOrderFrq(e.target.value)}
                    >
                      {(orderPer === 'Weekly' || orderPer === 'Monthly') &&
                        arrayOfFrequencyWeekly.map((x) => (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        ))}
                      {orderPer === 'Every-2-Weeks' &&
                        arrayOfFrequencyTwoWeeks.map((x) => (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        ))}
                    </Form.Control>
                    <small>
                      <FormattedMessage id="cartScreen.per" defaultMessage="Per" /> {orderPerInLang}
                    </small>
                  </Col>
                  <Col md={1}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={6} className="m-auto text-center">
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                <FormattedMessage id="cartScreen.subtotal" defaultMessage="Subtotal" /> (
                {cartItems.reduce((acc, item) => acc + Number(item.qty) + Number(item.orderFrq), 0)}
                ) <FormattedMessage id="cartScreen.items" defaultMessage="items" />
              </h2>
              €
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price * item.orderFrq, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                <FormattedMessage
                  id="cartScreen.proceedButton"
                  defaultMessage="Proceed To Checkout"
                />
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
