import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listMySubscriptions, updateSubscription } from '../actions/subscriptionActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import ProfileEditTabs from '../components/ProfileEditTabs';
import FormContainer from '../components/FormContainer';
import axios from 'axios';
import { FormattedMessage } from 'react-intl';

const ProfileScreen = ({ location, history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [subId, setSubId] = useState();

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const subscriptionListMy = useSelector((state) => state.subscriptionListMy);
  const {
    loading: loadingSubscriptions,
    error: errorSubscriptions,
    subscriptions,
  } = subscriptionListMy;

  const [address, setAddress] = useState();
  const [city, setCity] = useState();
  const [postalCode, setPostalCode] = useState();
  const [country, setCountry] = useState();

  const timeInHours = new Date().getHours();

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (!user || !user.name || !subscriptions) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });

        dispatch(getUserDetails('profile'));
        dispatch(listMySubscriptions());
      } else {
        const chosenSubscription = async () => {
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          };
          const {
            data: { shippingAddress },
          } = await axios.get(`/api/subscriptions/${subId}`, config);
          setAddress(shippingAddress.address);
          setCity(shippingAddress.city);
          setPostalCode(shippingAddress.postalCode);
          setCountry(shippingAddress.country);
        };
        chosenSubscription();
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, history, userInfo, user, subscriptions, subId, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
      dispatch(
        updateSubscription({
          subId,
          address,
          city,
          postalCode,
          country,
        })
      );
    }
  };

  return (
    <FormContainer>
      <ProfileEditTabs profile subscriptions preferences />

      <h2>
        {timeInHours > 0 && timeInHours < 12 ? (
          <FormattedMessage id="profileScreen.message.morning" defaultMessage="Good morning" />
        ) : timeInHours >= 12 && timeInHours <= 15 ? (
          <FormattedMessage id="profileScreen.message.afternoon" defaultMessage="Good afternoon" />
        ) : timeInHours >= 16 && timeInHours <= 24 ? (
          <FormattedMessage id="profileScreen.message.evening" defaultMessage="Good evening" />
        ) : (
          <FormattedMessage id="profileScreen.message.hello" defaultMessage="Hello" />
        )}
        , {user.name}!
      </h2>
      {message && <Message variant="danger">{message}</Message>}
      {success && (
        <Message variant="success">
          <FormattedMessage
            id="profileScreen.message.profileUpdated"
            defaultMessage="Profile Updated"
          />
        </Message>
      )}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>
              <FormattedMessage id="profileScreen.form.name" defaultMessage="Name" />
            </Form.Label>
            <FormattedMessage id="profileScreen.form.namePlaceholder" defaultMessage="Enter name">
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
          <Form.Group controlId="email">
            <Form.Label>
              <FormattedMessage
                id="profileScreen.form.emailaddress"
                defaultMessage="E-mail address"
              />
            </Form.Label>
            <FormattedMessage id="profileScreen.form.emailPlaceholder" defaultMessage="Enter email">
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
              <FormattedMessage id="profileScreen.form.password" defaultMessage="Password" />
            </Form.Label>
            <FormattedMessage
              id="profileScreen.form.passwordPlaceholder"
              defaultMessage="Enter password"
            >
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
                id="profileScreen.form.confirmPassword"
                defaultMessage="Confrim Password"
              />
            </Form.Label>
            <FormattedMessage
              id="profileScreen.form.confirmPasswordPlaceholder"
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

          {loadingSubscriptions ? (
            <Loader />
          ) : errorSubscriptions ? (
            <Message variant="danger">{errorSubscriptions}</Message>
          ) : (
            <>
              <Form.Group>
                <h6>
                  <FormattedMessage
                    id="profileScreen.heading.changeAdress"
                    defaultMessage="Change subscription address"
                  />
                </h6>
                <Form.Control
                  className="inputBG"
                  as="select"
                  // defaultValue={'defaultSub'}
                  onChange={(e) => setSubId(e.target.value)}
                >
                  <FormattedMessage
                    id="profileScreen.heading.changeAdressOption"
                    defaultMessage="Choose a subscription"
                  >
                    {(msg) => <option>{msg}</option>}
                  </FormattedMessage>
                  {subscriptions.map((x) => (
                    <option key={x._id} value={x._id}>
                      {x.subscriptionItems[0].name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="address">
                <Form.Label>
                  <FormattedMessage id="profileScreen.form.adress" defaultMessage="Adress" />
                </Form.Label>
                <FormattedMessage
                  id="profileScreen.form.adressPlaceholder"
                  defaultMessage="Enter address"
                >
                  {(msg) => (
                    <Form.Control
                      className="inputBG"
                      type="text"
                      placeholder={msg}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    ></Form.Control>
                  )}
                </FormattedMessage>
              </Form.Group>
              <Form.Group controlId="">
                <Form.Label>
                  <FormattedMessage id="profileScreen.form.city" defaultMessage="City" />
                </Form.Label>
                <FormattedMessage
                  id="profileScreen.form.cityPlaceholder"
                  defaultMessage="Enter city"
                >
                  {(msg) => (
                    <Form.Control
                      className="inputBG"
                      type="text"
                      placeholder={msg}
                      value={city || ''}
                      onChange={(e) => setCity(e.target.value)}
                    ></Form.Control>
                  )}
                </FormattedMessage>
              </Form.Group>
              <Form.Group controlId="postalCode">
                <Form.Label>
                  <FormattedMessage
                    id="profileScreen.form.postalCode"
                    defaultMessage="Postal Code"
                  />
                </Form.Label>
                <FormattedMessage
                  id="profileScreen.form.postalCodePlaceholder"
                  defaultMessage="Enter postal code"
                >
                  {(msg) => (
                    <Form.Control
                      className="inputBG"
                      type="text"
                      placeholder={msg}
                      value={postalCode || ''}
                      onChange={(e) => setPostalCode(e.target.value)}
                    ></Form.Control>
                  )}
                </FormattedMessage>
              </Form.Group>
              <Form.Group controlId="country">
                <Form.Label>
                  <FormattedMessage id="profileScreen.form.country" defaultMessage="Country" />
                </Form.Label>
                <FormattedMessage
                  id="profileScreen.form.countryPlaceholder"
                  defaultMessage="Enter country"
                >
                  {(msg) => (
                    <Form.Control
                      className="inputBG"
                      type="text"
                      placeholder={msg}
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    ></Form.Control>
                  )}
                </FormattedMessage>
              </Form.Group>
            </>
          )}
          <Button type="submit" variant="primary">
            <FormattedMessage id="profileScreen.form.button" defaultMessage="Update" />
          </Button>
        </Form>
      )}
    </FormContainer>
  );
};

export default ProfileScreen;
