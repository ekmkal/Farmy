import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FormattedMessage } from 'react-intl';

const ProfileEditTabs = ({ profile, subscriptions, preferences }) => {
  return (
    <Nav className="justify-content-center mb-4">
      <Nav.Item>
        {profile ? (
          <LinkContainer to="/profile">
            <Nav.Link>
              <FormattedMessage id="profileEditTabs.tab-1" defaultMessage="Account Details" />
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link>
            <FormattedMessage id="profileEditTabs.tab-1-profile" defaultMessage="Profile" />
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {subscriptions ? (
          <LinkContainer to="/subscriptions">
            <Nav.Link className={'active'}>
              <FormattedMessage id="profileEditTabs.tab-2" defaultMessage="Subscriptions" />
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link>
            <FormattedMessage id="profileEditTabs.tab-2" defaultMessage="Subscriptions" />
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {preferences ? (
          <LinkContainer to="/preferences">
            <Nav.Link>
              <FormattedMessage id="profileEditTabs.tab-3" defaultMessage="Diet Preferences" />
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link>
            <FormattedMessage id="profileEditTabs.tab-3" defaultMessage="Diet Preferences" />
          </Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default ProfileEditTabs;
