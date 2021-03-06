import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { register } from '../actions/userActions';
import GoogleAuth from '../components/GoogleAuth';
import FacebookAuth from '../components/FacebookAuth';
import useEventGaTracker from '../hooks/useEventGaTracker';
import Email from 'react-email-autocomplete';
import emailValidator from 'validator';
import { FormattedMessage } from 'react-intl';
import ReactGA from 'react-ga';
const { REACT_APP_GUA_ID } = process.env;

const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [isValidEmailMessage, setIsValidEmailMessage] = useState(null);
  const [isNotValidEmailMessage, setIsNotValidEmailMessage] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const EventGaTracker = useEventGaTracker('SignUp');
  const validatedEmail = emailValidator.isEmail(email.trim());

  const validateEmail = () => {
    if (validatedEmail) {
      setIsValidEmailMessage('Valid Email.');
    } else {
      setIsNotValidEmailMessage('Enter valid Email!');
    }
  };

  const dispatch = useDispatch();

  const userHistoryRoutes = useSelector((state) => state.userHistoryRoutes);
  const { routesHistory } = userHistoryRoutes;
  const signupOriginPath = routesHistory[routesHistory.length - 3];

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error } = userRegister;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const redirect = '/register/bundleplan';

  const gaLoginEvent = () => {
    ReactGA.initialize(REACT_APP_GUA_ID);
    ReactGA.event({
      category: 'page click',
      action: 'click login',
      label: 'Login from Register Page',
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

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else if (!validatedEmail) {
      setMessage('Email is not valid');
    } else {
      dispatch(register(name, email, password));
      EventGaTracker('successfully signup', signupOriginPath);
    }
  };

  return (
    <FormContainer>
      <h1>
        <FormattedMessage id="registerScreen.signUp" defaultMessage="Sign Up" />
      </h1>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler} className="mb-2">
        <Form.Group controlId="name">
          <Form.Label>
            <FormattedMessage id="registerScreen.name" defaultMessage="Name" />
          </Form.Label>
          <FormattedMessage id="registerScreen.namePlaceholder" defaultMessage="Enter name">
            {(msg) => (
              <Form.Control
                className="inputBG"
                type="name"
                placeholder={msg}
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            )}
          </FormattedMessage>
        </Form.Group>

        <Form.Group controlId="email" onBlur={validateEmail}>
          <Form.Label>
            <FormattedMessage id="registerScreen.email" defaultMessage="Email Address" />
          </Form.Label>
          <FormattedMessage id="registerScreen.emailPlaceholder" defaultMessage="Enter email">
            {(msg) => (
              <Email
                // className="inputBG"
                className="form-control inputBG"
                type="email"
                placeholder={msg}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
          </FormattedMessage>
        </Form.Group>
        {isValidEmailMessage ? (
          <Message variant="info">{isValidEmailMessage}</Message>
        ) : isNotValidEmailMessage ? (
          <Message variant="danger">{isNotValidEmailMessage}</Message>
        ) : null}

        <Form.Group controlId="password">
          <Form.Label>
            <FormattedMessage id="registerScreen.password" defaultMessage="Password" />
          </Form.Label>
          <FormattedMessage id="registerScreen.passwordPlaceholder" defaultMessage="Enter password">
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
        <Form.Group controlId="confirmPassword">
          <Form.Label>
            <FormattedMessage
              id="registerScreen.confirmPassword"
              defaultMessage="Confirm Password"
            />
          </Form.Label>
          <FormattedMessage
            id="registerScreen.confirmPasswordPlaceholder"
            defaultMessage="Confirm password"
          >
            {(msg) => (
              <Form.Control
                className="inputBG"
                type="password"
                placeholder={msg}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            )}
          </FormattedMessage>
        </Form.Group>

        <Button type="submit" variant="success" className="mt-2 btn btn-block">
          <FormattedMessage id="registerScreen.register" defaultMessage="Register" />
        </Button>
      </Form>

      {apiKey && (
        <>
          <GoogleAuth
            apiKey={apiKey.googleid}
            registerEvent={() => {
              EventGaTracker('successfully signup with google ', signupOriginPath);
            }}
          />
          <FacebookAuth
            apiKey={apiKey.facebookid}
            registerEvent={() => {
              EventGaTracker('successfully signup with facebook ', signupOriginPath);
            }}
          />
        </>
      )}

      <Row className="py-3">
        <Col>
          <FormattedMessage id="registerScreen.haveAccount" defaultMessage="Have an Account" />?
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} onClick={gaLoginEvent}>
            <FormattedMessage id="registerScreen.login" defaultMessage="Login" />
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
