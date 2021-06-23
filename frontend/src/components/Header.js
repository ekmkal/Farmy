import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import SearchBox from './SearchBox';
import { logout } from '../actions/userActions';
import ReactGA from 'react-ga';
import { Context } from '../components/LanguageContext';
import { FormattedMessage } from 'react-intl';
const { REACT_APP_GUA_ID } = process.env;

const Header = () => {
  const context = useContext(Context);

  const dispatch = useDispatch();
  ReactGA.initialize(REACT_APP_GUA_ID);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const gaLogoEvent = () => {
    ReactGA.event({
      category: 'header click',
      action: 'click logo',
      label: 'View Home Page',
    });
  };

  const gaLoginEvent = () => {
    ReactGA.event({
      category: 'header click',
      action: 'click login',
      label: 'Login from Header',
    });
  };

  const gaCartEvent = () => {
    ReactGA.event({
      category: 'header click',
      action: 'click view cart',
      label: 'View cart',
    });
  };

  const gaPlanEvent = () => {
    ReactGA.event({
      category: 'header click',
      action: 'click view plan',
      label: 'User View Plan',
    });
  };

  const gaProfileEvent = () => {
    ReactGA.event({
      category: 'header click',
      action: 'click view profile',
      label: 'User View Profile',
    });
  };

  const logoutHandler = () => {
    dispatch(logout());
    ReactGA.event({
      category: 'header click',
      action: 'click logout',
      label: 'Logout from Header',
    });
  };

  const gaAdminUserEvent = () => {
    ReactGA.event({
      category: 'header click',
      action: 'admin - click view users',
      label: 'Admin View/Edit users',
    });
  };

  const gaAdminBundlesEvent = () => {
    ReactGA.event({
      category: 'header click',
      action: 'admin - click view bundles',
      label: 'Admin view/edit bundles',
    });
  };

  const gaAdminSubscriptionsEvent = () => {
    ReactGA.event({
      category: 'header click',
      action: 'admin - click view subscriptions',
      label: 'Admin view/edit subscriptions',
    });
  };

  return (
    <header>
      <Navbar expand="lg" collapseOnSelect className="py-2">
        <Container style={{ color: '#ffffff' }}>
          <LinkContainer to="/">
            <Navbar.Brand onClick={gaLogoEvent}>
              <img src="https://i.ibb.co/mBnWcKg/Farmy-copy-1.png" width="80" alt="Farmy logo" />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Route render={({ history }) => <SearchBox history={history} />} />
            <Nav className="ml-auto">
              {userInfo && !userInfo.isAdmin && (
                <LinkContainer to="/preferences">
                  <Nav.Link>
                    <i className="fas fa-utensils"></i>{' '}
                    <FormattedMessage id="header.preference" defaultMessage="Preferences" />
                    {userInfo.preferences?.diet === '' ? (
                      <sup>
                        <span className="badge badge-danger rounded-pill "> &middot; </span>
                      </sup>
                    ) : (
                      ''
                    )}
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && !userInfo.isAdmin && (
                <LinkContainer to="/subscriptions">
                  <Nav.Link onClick={gaPlanEvent}>
                    <i className="fas fa-calendar-alt"></i>{' '}
                    <FormattedMessage id="header.plan" defaultMessage="Plan" />
                  </Nav.Link>
                </LinkContainer>
              )}
              <LinkContainer to="/cart">
                <Nav.Link onClick={gaCartEvent}>
                  <i className="fas fa-shopping-cart"></i>{' '}
                  <FormattedMessage id="header.cart" defaultMessage="Cart" />
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown
                  title={<FormattedMessage id="header.account" defaultMessage="Account" />}
                  id="account"
                >
                  <NavDropdown.Item disabled>{userInfo.name}</NavDropdown.Item>
                  <LinkContainer to="/profile">
                    <NavDropdown.Item onClick={gaProfileEvent}>
                      <FormattedMessage id="header.dropdown.profile" defaultMessage="Profile" />
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    <FormattedMessage id="header.dropdown.logout" defaultMessage="Logout" />
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link onClick={gaLoginEvent}>
                    <i className="fas fa-user"></i>{' '}
                    <FormattedMessage id="header.dropdown.signin" defaultMessage="Sign In" />
                  </Nav.Link>
                </LinkContainer>
              )}

              <select value={context.messages} onChange={context.setLanguage}>
                <FormattedMessage id="header.langEng" defaultMessage="English">
                  {(msg) => <option value="English">{msg}</option>}
                </FormattedMessage>
                <FormattedMessage id="header.langDutch" defaultMessage="Dutch">
                  {(msg) => <option value="Dutch">{msg}</option>}
                </FormattedMessage>
              </select>

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item onClick={gaAdminUserEvent}>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/bundlelist">
                    <NavDropdown.Item onClick={gaAdminBundlesEvent}>Bundles</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/subscriptionlist">
                    <NavDropdown.Item onClick={gaAdminSubscriptionsEvent}>
                      Subscriptions
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
