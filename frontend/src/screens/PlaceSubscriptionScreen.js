import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createSubscription } from '../actions/subscriptionActions';
import { FormattedMessage } from 'react-intl';
import { Context } from '../components/LanguageContext';
import { renderWithLang } from '../languages/renderWithLang';
import { SUBSCRIPTION_CREATE_RESET } from '../constants/subscriptionConstants';
import { USER_DETAILS_RESET } from '../constants/userConstants';

const PlaceSubscriptionScreen = ({ history }) => {
  const { lang } = useContext(Context);

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  if (!cart.shippingAddress.address) {
    history.push('/shipping');
  } else if (!cart.paymentMethod) {
    history.push('/payment');
  }

  //   Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty * item.orderFrq, 0)
  );
  cart.shippingPrice = addDecimals(cart.itemsPrice > 50 ? 0 : 5);
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  const subscriptionCreate = useSelector((state) => state.subscriptionCreate);
  const { subscription, success, error } = subscriptionCreate;

  useEffect(() => {
    if (success) {
      history.push(`/subscription/${subscription._id}`);
      dispatch({ type: USER_DETAILS_RESET });
      dispatch({ type: SUBSCRIPTION_CREATE_RESET });
    }
  }, [history, success, subscription, dispatch]);

  const placeSubscriptionHandler = () => {
    dispatch(
      createSubscription({
        subscriptionItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  const arrayOfTime = [
    { value: 'Weekly', nl: 'Wekelijks' },
    { value: 'Every-2-Weeks', nl: 'Elke-2-weken' },
    { value: 'Monthly', nl: 'Maandelijks' },
  ];

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                <FormattedMessage id="placeSubscriptionScreen.shipping" defaultMessage="Shipping" />
              </h2>
              <p>
                <strong>
                  <FormattedMessage id="placeSubscriptionScreen.address" defaultMessage="Address" />
                  :
                </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode},{cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>
                <FormattedMessage
                  id="placeSubscriptionScreen.paymentMethod"
                  defaultMessage="Payment Method"
                />
              </h2>
              <strong>
                <FormattedMessage id="placeSubscriptionScreen.method" defaultMessage="Method" />:{' '}
              </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>
                <FormattedMessage
                  id="placeSubscriptionScreen.orderItems"
                  defaultMessage="Order Items"
                />
              </h2>
              {cart.cartItems.length === 0 ? (
                <Message>
                  <FormattedMessage
                    id="placeSubscriptionScreen.emptyCart"
                    defaultMessage="Your Cart Is Empty"
                  />
                </Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={renderWithLang(item.name, lang)}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/bundles/${item.product}`}>
                            {renderWithLang(item.name, lang)}
                          </Link>
                        </Col>
                        <Col md={6}>
                          {item.qty}{' '}
                          <FormattedMessage
                            id="placeSubscriptionScreen.bundles"
                            defaultMessage="bundles"
                          />{' '}
                          x ???{item.price} x {item.orderFrq}{' '}
                          <FormattedMessage
                            id="placeSubscriptionScreen.timesEvery"
                            defaultMessage="times every"
                          />{' '}
                          {/* {item.orderPer}= ???{item.qty * item.price * item.orderFrq} */}
                          {renderWithLang(
                            arrayOfTime.filter((x) => x.value === item.orderPer)[0],
                            lang
                          )}{' '}
                          = ???{item.qty * item.price * item.orderFrq}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>
                  <FormattedMessage
                    id="placeSubscriptionScreen.orderSummary"
                    defaultMessage="Order Summary"
                  />
                </h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <FormattedMessage id="placeSubscriptionScreen.items" defaultMessage="Items" />
                  </Col>
                  <Col>???{cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <FormattedMessage
                      id="placeSubscriptionScreen.shipping"
                      defaultMessage="Shipping"
                    />
                  </Col>
                  <Col>???{cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <FormattedMessage id="placeSubscriptionScreen.tax" defaultMessage="Tax" />
                  </Col>
                  <Col>???{cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <FormattedMessage id="placeSubscriptionScreen.total" defaultMessage="Total" />
                  </Col>
                  <Col>???{cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems === 0}
                  onClick={placeSubscriptionHandler}
                >
                  <FormattedMessage
                    id="placeSubscriptionScreen.placeOrder"
                    defaultMessage="Place Order"
                  />
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceSubscriptionScreen;
