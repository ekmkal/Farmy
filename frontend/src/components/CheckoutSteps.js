import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FormattedMessage } from 'react-intl';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className="justify-content-center mb-4">
      <Nav.Item>
        {step1 ? (
          <LinkContainer to="/login">
            <Nav.Link>
              <FormattedMessage id="checkoutSteps.signIn" defaultMessage="Sign In" />
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>
            <FormattedMessage id="checkoutSteps.signIn" defaultMessage="Sign In" />
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <LinkContainer to="/shipping">
            <Nav.Link>
              <FormattedMessage id="checkoutSteps.shipping" defaultMessage="Shipping" />
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>
            <FormattedMessage id="checkoutSteps.shipping" defaultMessage="Shipping" />
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <LinkContainer to="/payment">
            <Nav.Link>
              <FormattedMessage id="checkoutSteps.payment" defaultMessage="Payment" />
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>
            <FormattedMessage id="checkoutSteps.payment" defaultMessage="Payment" />
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          <LinkContainer to="/placeorder">
            <Nav.Link>
              <FormattedMessage id="checkoutSteps.placeOrder" defaultMessage="Place Order" />
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>
            <FormattedMessage id="checkoutSteps.placeOrder" defaultMessage="Place Order" />
          </Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
