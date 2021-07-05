import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../actions/cartActions';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { FormattedMessage } from 'react-intl';
import 'react-phone-number-input/style.css';

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { error, shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);
  const [name, setName] = useState(shippingAddress.name);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidNumber, setIsValidNumber] = useState(null);
  const [message, setMessage] = useState(null);

  const validatePhoneNumber = () => {
    if (isValidPhoneNumber(phoneNumber)) {
      setIsValidNumber(true);
    } else {
      setIsValidNumber(false);
    }
  };

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    if (phoneNumber === '') {
      setMessage('Please Fill Phone Number ');
    } else {
      dispatch(saveShippingAddress({ name, phoneNumber, address, city, postalCode, country }));
      history.push('/payment');
    }
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      <h1>
        <FormattedMessage id="shippingScreen.shipping" defaultMessage="Shipping" />
      </h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>
            <FormattedMessage id="shippingScreen.name" defaultMessage="Name" />
          </Form.Label>
          <FormattedMessage id="shippingScreen.namePlaceholder" defaultMessage="Enter your name">
            {(msg) => (
              <Form.Control
                className="inputBG"
                type="text"
                placeholder={msg}
                value={name || ''}
                required
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            )}
          </FormattedMessage>
        </Form.Group>

        <Form.Group controlId="phoneNumber" onBlur={validatePhoneNumber}>
          <Form.Label>
            <FormattedMessage id="shippingScreen.phoneNumber" defaultMessage="Phone Number" />
          </Form.Label>
          <FormattedMessage
            id="shippingScreen.phoneNumberPlaceholder"
            defaultMessage="Enter phone number"
          >
            {(msg) => (
              <PhoneInput
                international
                defaultCountry="NL"
                placeholder={msg}
                value={phoneNumber}
                onChange={setPhoneNumber}
                error={
                  phoneNumber
                    ? isValidPhoneNumber(phoneNumber)
                      ? undefined
                      : 'Invalid phone number'
                    : 'Phone number required'
                }
              />
            )}
          </FormattedMessage>
          {isValidNumber === true ? (
            <Message variant="info">
              <FormattedMessage id="shippingScreen.validNum" defaultMessage="It is valid number" />
            </Message>
          ) : isValidNumber === false ? (
            <Message variant="danger">
              <FormattedMessage
                id="shippingScreen.invalidNum"
                defaultMessage="Phone Number is not valid"
              />
            </Message>
          ) : null}
        </Form.Group>

        <Form.Group controlId="address">
          <Form.Label>
            <FormattedMessage id="shippingScreen.address" defaultMessage="Address" />
          </Form.Label>
          <FormattedMessage id="shippingScreen.addressPlaceholder" defaultMessage="Enter address">
            {(msg) => (
              <Form.Control
                className="inputBG"
                type="text"
                placeholder={msg}
                value={address || ''}
                required
                onChange={(e) => setAddress(e.target.value)}
              ></Form.Control>
            )}
          </FormattedMessage>
        </Form.Group>

        <Form.Group controlId="city">
          <Form.Label>
            <FormattedMessage id="shippingScreen.city" defaultMessage="City" />
          </Form.Label>
          <FormattedMessage id="shippingScreen.cityPlaceholder" defaultMessage="Enter city">
            {(msg) => (
              <Form.Control
                className="inputBG"
                type="text"
                placeholder={msg}
                value={city || ''}
                required
                onChange={(e) => setCity(e.target.value)}
              ></Form.Control>
            )}
          </FormattedMessage>
        </Form.Group>

        <Form.Group controlId="postalCode">
          <Form.Label>
            <FormattedMessage id="shippingScreen.postalCode" defaultMessage="Postal Code" />
          </Form.Label>
          <FormattedMessage
            id="shippingScreen.postalCodePlaceholder"
            defaultMessage="Enter postal code"
          >
            {(msg) => (
              <Form.Control
                className="inputBG"
                type="text"
                placeholder={msg}
                value={postalCode || ''}
                required
                onChange={(e) => setPostalCode(e.target.value)}
              ></Form.Control>
            )}
          </FormattedMessage>
        </Form.Group>

        <Form.Group controlId="country">
          <Form.Label>
            <FormattedMessage id="shippingScreen.country" defaultMessage="Country" />
          </Form.Label>
          <FormattedMessage id="shippingScreen.countryPlaceholder" defaultMessage="Enter country">
            {(msg) => (
              <Form.Control
                className="inputBG"
                type="text"
                placeholder={msg}
                value={country || ''}
                required
                onChange={(e) => setCountry(e.target.value)}
              ></Form.Control>
            )}
          </FormattedMessage>
        </Form.Group>

        <Button type="submit" variant="primary">
          <FormattedMessage id="shippingScreen.continue" defaultMessage="Continue" />
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
