import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import GoogleAuth from '../components/GoogleAuth';
import FacebookAuth from '../components/FacebookAuth';
import { login } from '../actions/userActions';
import useEventGaTracker from '../hooks/useEventGaTracker';
import ReactGA from 'react-ga';
import { FormattedMessage } from 'react-intl';
const { REACT_APP_GUA_ID } = process.env;

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('');

  const EventGaTracker = useEventGaTracker('SignIn');

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/';
  const userHistoryRoutes = useSelector((state) => state.userHistoryRoutes);
  const { routesHistory } = userHistoryRoutes;
  const signupOriginPath = routesHistory[routesHistory.length - 2];

  const gaRegisterEvent = () => {
    ReactGA.initialize(REACT_APP_GUA_ID);
    ReactGA.event({
      category: 'page click',
      action: 'click register',
      label: 'Register from Login Page',
    });
  };
  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    } else {
      const getApiKey = async () => {
        try {
          const { data } = await axios.get('/api/config/authid');
          if (data) {
            setApiKey(data);
          } else {
            throw new Error('failed to fetch the api key');
          }
        } catch (error) {
          console.log(error);
        }
      };

      getApiKey();
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
    EventGaTracker('successfull signIn', signupOriginPath);
  };

  return (
    <FormContainer>
      <h1>
        <FormattedMessage id="loginScreen.signIn" defaultMessage="Sign In" />
      </h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form className="mb-2" onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>
            <FormattedMessage id="loginScreen.email" defaultMessage="Email Address" />
          </Form.Label>
          <FormattedMessage id="loginScreen.emailPlaceholder" defaultMessage="Enter email">
            {(msg) => (
              <Form.Control
                className="inputBG"
                type="email"
                placeholder={msg}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            )}
          </FormattedMessage>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>
            <FormattedMessage id="loginScreen.password" defaultMessage="Password" />
          </Form.Label>
          <FormattedMessage id="loginScreen.passwordPlaceholder" defaultMessage="Enter password">
            {(msg) => (
              <Form.Control
                className="inputBG"
                type="password"
                placeholder={msg}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            )}
          </FormattedMessage>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-2 btn btn-block">
          <FormattedMessage id="loginScreen.signIn" defaultMessage="Sign In" />
        </Button>
      </Form>

      {apiKey && (
        <>
          <GoogleAuth
            apiKey={apiKey.googleid}
            registerEvent={() => {
              EventGaTracker('successfull signIn with google ', signupOriginPath);
            }}
          />
          <FacebookAuth
            apiKey={apiKey.facebookid}
            registerEvent={() => {
              EventGaTracker('successfull signIn with facebook ', signupOriginPath);
            }}
          />
        </>
      )}

      <Row className="py-3">
        <Col>
          <FormattedMessage id="loginScreen.newCustomer" defaultMessage="New Customer" />?{' '}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
            onClick={gaRegisterEvent}
          >
            <FormattedMessage id="loginScreen.register" defaultMessage="Register" />
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};
export default LoginScreen;
