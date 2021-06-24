import React, { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../actions/cartActions';
import { FormattedMessage } from 'react-intl';

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress.address) {
    history.push('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push('/placesubscription');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>
        <FormattedMessage id="paymentScreen.payment" defaultMessage="Payment Method" />
      </h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">
            <FormattedMessage id="paymentScreen.method" defaultMessage="Select Method" />
          </Form.Label>
          <Col>
            <FormattedMessage id="paymentScreen.or" defaultMessage="or">
              {(msg) => (
                <Form.Check
                  type="radio"
                  label={`PayPal ${msg} Credit Card`}
                  id="PayPal"
                  name="paymentMethod"
                  value="PayPal"
                  checked
                  onChange={(e) => setPaymentMethod(e.target.value)}
                ></Form.Check>
              )}
            </FormattedMessage>
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary">
          <FormattedMessage id="paymentScreen.continue" defaultMessage="Contiue" />
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
