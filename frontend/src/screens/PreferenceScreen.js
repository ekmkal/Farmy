import React, { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import ProfileEditTabs from '../components/ProfileEditTabs';
import FormContainer from '../components/FormContainer';
import { FormattedMessage } from 'react-intl';
import { Context } from '../components/LanguageContext';
import { renderWithLang } from '../languages/renderWithLang';

const PreferenceScreen = ({ history }) => {
  const { lang } = useContext(Context);

  const [diet, setDiet] = useState('');
  const [cookingSkill, setCookingSkill] = useState('');
  const [cuisine, setCuisine] = useState([]);
  const [cookingTime, setCookingTime] = useState('');

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const subscriptionListMy = useSelector((state) => state.subscriptionListMy);
  const { subscriptions } = subscriptionListMy;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (!user || !user.name || !subscriptions || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });

        dispatch(getUserDetails('profile'));
      } else {
        setDiet(user.preferences.diet);
        setCookingSkill(user.preferences.cookingSkill);
        setCuisine(user.preferences.cuisine);
        setCookingTime(user.preferences.cookingTime);
      }
    }
  }, [dispatch, history, userInfo, user, subscriptions, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateUserProfile({
        id: user._id,
        preferences: { diet, cookingSkill, cuisine, cookingTime },
      })
    );
  };

  const handleCheck = (cuisineForCheck) => {
    if (cuisine.includes(cuisineForCheck)) {
      const filteredCuisine = cuisine.filter((x) => x !== cuisineForCheck);
      setCuisine(filteredCuisine);
    } else {
      setCuisine([...cuisine, cuisineForCheck]);
    }
  };

  const diets = [
    { value: 'Vegetarian', nl: 'Vegetarisch' },
    { value: 'Vegan', nl: 'Veganistisch' },
    { value: 'Mediterranean', nl: 'Mediterraan' },
    { value: 'Low-carb', nl: 'Koolhydraatarm' },
  ];
  const cookingSkills = [
    { value: 'Beginner', nl: 'Beginner' },
    { value: 'Regular', nl: 'Regelmatig' },
    { value: 'Pro', nl: 'Pro' },
  ];
  const cuisines = [
    { value: 'Greek', nl: 'Grieks' },
    { value: 'Japanese', nl: 'Japans' },
    { value: 'Caribbean', nl: 'Caribisch' },
    { value: 'Vietnamese', nl: 'Vietnamese' },
    { value: 'Mexican', nl: 'Mexicaans' },
    { value: 'Thai', nl: 'Thais' },
    { value: 'Korean', nl: 'Koreaans' },
    { value: 'Indian', nl: 'Indisch' },
    { value: 'Italian', nl: 'Italiaans' },
  ];
  const cookingDurations = [
    { value: 'Less than 20 minutes', nl: 'Minder dan 20 minuten' },
    { value: 'From 20 to 40 minutes', nl: 'Van 20 tot 40 minuten' },
    { value: 'More than 45 minutes', nl: 'Meer dan 45 minuten' },
  ];

  return (
    <FormContainer>
      <ProfileEditTabs profile subscriptions preferences />
      {success && (
        <Message variant="success">
          <FormattedMessage id="preferenceScreen.updateMsg" defaultMessage="Preferences Updated" />
        </Message>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <h6>
              <FormattedMessage
                id="preferenceScreen.heading.diet"
                defaultMessage="Choose your favorite diet"
              />
            </h6>
            <Form.Control
              as="select"
              onChange={(e) => setDiet(e.target.value)}
              value={diet || ''}
              className="inputBG"
            >
              <FormattedMessage
                id="preferenceScreen.placeholder.diet"
                defaultMessage="Choose a diet"
              >
                {(msg) => (
                  <option value="" disabled={diet !== ''}>
                    {msg}..
                  </option>
                )}
              </FormattedMessage>
              {diets.map((x, index) => (
                <option key={index} value={x.value}>
                  {renderWithLang(x, lang)}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <h6>
              <FormattedMessage
                id="preferenceScreen.heading.skill"
                defaultMessage="What is your cooking skill level?"
              />
            </h6>
            <Form.Control
              className="inputBG"
              as="select"
              onChange={(e) => setCookingSkill(e.target.value)}
              value={cookingSkill || ''}
            >
              <FormattedMessage
                id="preferenceScreen.placeholder.skill"
                defaultMessage="Choose a level"
              >
                {(msg) => (
                  <option value="" disabled={cookingSkill !== ''}>
                    {msg}..
                  </option>
                )}
              </FormattedMessage>
              {cookingSkills.map((x, index) => (
                <option key={index} value={x.value}>
                  {renderWithLang(x, lang)}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <h6>
              <FormattedMessage
                id="preferenceScreen.heading.cookingTime"
                defaultMessage="How much time for cooking?"
              />
            </h6>
            <Form.Control
              className="inputBG"
              as="select"
              onChange={(e) => setCookingTime(e.target.value)}
              value={cookingTime || ''}
            >
              <FormattedMessage
                id="preferenceScreen.placeholder.cookingTime"
                defaultMessage="Choose a duration"
              >
                {(msg) => (
                  <option value="" disabled={cookingTime !== ''}>
                    {msg}..
                  </option>
                )}
              </FormattedMessage>
              {cookingDurations.map((x, index) => (
                <option key={index} value={x.value}>
                  {renderWithLang(x, lang)}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <h6>
              <FormattedMessage
                id="preferenceScreen.heading.cuisine"
                defaultMessage="Select your favorite cuisines"
              />
            </h6>
            {cuisines.map((x, index) => (
              <Form.Check
                className="inputBG"
                key={index}
                type="checkbox"
                id={x.value}
                label={renderWithLang(x, lang)}
                value={x.value}
                checked={cuisine.includes(x.value)}
                onChange={(e) => handleCheck(e.target.value)}
              />
            ))}
          </Form.Group>

          <Button type="submit" variant="primary">
            <FormattedMessage id="preferenceScreen.form.button" defaultMessage="Update" />
          </Button>
        </Form>
      )}
    </FormContainer>
  );
};

export default PreferenceScreen;
