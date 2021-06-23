import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Container, Button, Carousel } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import Filter from '../components/Filter';
import { listBundles, listLatestBundles } from '../actions/bundleActions';
import Bundle from '../components/Bundle';
import FeedBack from '../components/FeedBack';
import feedback from '../feedback.json';
import introduction from '../introduction.json';
import FarmsMap from '../components/FarmsMap';
import FarmStory from '../components/FarmStory';
import PersonalizedRecommendations from '../components/PersonalizedRecommendations';
import { Context } from '../components/LanguageContext';
import { FormattedMessage } from 'react-intl';

const HomeScreen = ({ match }) => {
  const { lang } = useContext(Context);

  const dispatch = useDispatch();

  const bundleList = useSelector((state) => state.bundleList);
  const { loading, error, bundles } = bundleList;

  const bundleLatest = useSelector((state) => state.bundleLatest);
  const { loading: loadingLatest, error: errorLatest, bundles: bundlesListLatest } = bundleLatest;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const keyword = match.params.keyword;

  useEffect(() => {
    dispatch(listLatestBundles());
    dispatch(listBundles(keyword));
  }, [dispatch, keyword]);

  const renderContentWithLang = (content) => {
    switch (lang) {
      case 'English':
        return {
          header: content.headingEn,
          desc: content.descriptionEn,
          feedbackText: content.feedbackEn,
        };
      case 'Dutch':
        return {
          header: content.headingNl,
          desc: content.descriptionNl,
          feedbackText: content.feedbackNl,
        };
      default:
        return {
          header: content.headingEn,
          desc: content.descriptionEn,
          feedbackText: content.feedbackEn,
        };
    }
  };

  return (
    <>
      <Meta />
      {loading && loadingLatest && <Loader />}
      {error && errorLatest && <Message variant="danger">{error}</Message>}
      {!keyword ? (
        <>
          {userInfo && (
            <Message style={{ color: '#b36458' }} variant="success">
              <FormattedMessage id="homeScreen.welcomeMsg" defaultMessage="Welcome" />{' '}
              {userInfo.name}!
            </Message>
          )}

          <Carousel style={{ color: 'white', fontSize: 'large', height: '460px' }}>
            <Carousel.Item>
              <img className=" " src={introduction[0].image} alt="support_locals" />
              <Carousel.Caption>
                <h3 style={{ color: 'white' }} className="header">
                  {renderContentWithLang(introduction[0]).header}
                </h3>
                <p className="label" className="sub-header">
                  {renderContentWithLang(introduction[0]).desc}
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={introduction[1].image}
                alt="healthy_and_fresh"
                className="veggies-pic"
              />
              <Carousel.Caption>
                <h3 style={{ color: 'white' }} className="header">
                  {renderContentWithLang(introduction[1]).header}
                </h3>
                <p className="label" className="sub-header">
                  {renderContentWithLang(introduction[1]).desc}
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                className="car-img"
                src={introduction[2].image}
                alt="Delivery"
              />
              <Carousel.Caption>
                <h3 style={{ color: 'white' }} className="header">
                  {renderContentWithLang(introduction[2]).header}
                </h3>
                <p className="label" className="sub-header">
                  {renderContentWithLang(introduction[2]).desc}
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>

          {userInfo && userInfo.preferences?.diet !== '' ? (
            <PersonalizedRecommendations
              preferences={userInfo.preferences && userInfo.preferences.diet}
            />
          ) : (
            userInfo && (
              <h2 style={{ color: '#808080	' }} className="border text-center prerefrence-box">
                <FormattedMessage id="homeScreen.fillInMsg" defaultMessage="Please fill in" />
                <Link to="/preferences" style={{ color: '#808080	' }}>
                  <span style={{ color: '#b36458' }}>
                    {' '}
                    <FormattedMessage
                      id="homeScreen.preferences"
                      defaultMessage="preferences"
                    />{' '}
                  </span>
                </Link>{' '}
                <FormattedMessage
                  id="homeScreen.recomToSee"
                  defaultMessage="to see recommendations"
                />
              </h2>
            )
          )}
          {!bundles.length && !bundlesListLatest.length && (
            <Message variant="primary">
              <FormattedMessage
                id="homeScreen.message.nothingFound"
                defaultMessage="Nothing Found"
              />
            </Message>
          )}

          {userInfo && (
            <>
              <Container className="mb-5 latest-bundles">
                <h1>
                  <FormattedMessage
                    id="homeScreen.heading.latestBundles"
                    defaultMessage="Latest Bundles"
                  />
                </h1>
                <Row>
                  {bundlesListLatest.map((bundle) => (
                    <Col key={bundle._id}>
                      <Bundle bundle={bundle} />
                    </Col>
                  ))}
                </Row>
              </Container>
            </>
          )}
          <Container className="mb-5" className={!userInfo && 'bundlesPadding'}>
            <h1>
              <FormattedMessage id="homeScreen.heading.ourBundles" defaultMessage="Our Bundles" />
            </h1>

            <Filter keyword={keyword} />
            {loading && <Loader />}
            {bundles.length === 0 && !loading ? (
              <h3>
                <FormattedMessage id="homeScreen.noBundles" defaultMessage="No Bundles Found" />!
              </h3>
            ) : (
              <Row>
                {bundles &&
                  bundles.length &&
                  bundles.map((bundle) => (
                    <Col sm={12} md={6} lg={6} xl={3} key={bundle._id}>
                      <Link to={`/bundles/${bundle._id}`}>
                        <Bundle bundle={bundle} />
                      </Link>
                      <LinkContainer to={`/bundles/${bundle._id}`}>
                        <Button className="large-btn" variant="outline-success" size="lg" block>
                          <FormattedMessage
                            id="homeScreen.subscribeButton"
                            defaultMessage="Subscribe"
                          />
                        </Button>
                      </LinkContainer>
                    </Col>
                  ))}
              </Row>
            )}
          </Container>

          <Container className="mb-4">
            <h1>
              <FormattedMessage id="homeScreen.ourFarmers" defaultMessage="Our Farmers" />
            </h1>
            <FarmsMap />
            <FarmStory />
          </Container>
        </>
      ) : (
        <Container className="mb-5">
          <Link to="/" className="btn btn-light">
            <FormattedMessage id="homeScreen.goBack" defaultMessage="Go Back" />
          </Link>
          {keyword && (
            <h1>
              <FormattedMessage
                id="homeScreen.heading.searchResult"
                defaultMessage="Search Results for"
              />{' '}
              "{keyword}"
            </h1>
          )}

          {bundles.length ? (
            <Row>
              {bundles.map((bundle) => (
                <Col key={bundle._id} md={4}>
                  <Link to={`/bundles/${bundle._id}`}>
                    <Bundle bundle={bundle} />
                  </Link>
                  <LinkContainer to={`/subscription/${bundle._id}`}>
                    <Button variant="outline-success" size="lg" block>
                      <FormattedMessage
                        id="homeScreen.subscribeButton"
                        defaultMessage="Subscribe"
                      />
                    </Button>
                  </LinkContainer>
                </Col>
              ))}
            </Row>
          ) : (
            <>
              <Message variant="danger">
                <FormattedMessage id="homeScreen.noResults" defaultMessage="No results found" />.
              </Message>
              <h3>
                <FormattedMessage id="homeScreen.youMayLike" defaultMessage="You may also like" />
              </h3>
              <Row>
                {bundlesListLatest.map((bundle) => (
                  <Col key={bundle._id}>
                    <Bundle bundle={bundle} />
                    <LinkContainer to={`/bundles/${bundle._id}`}>
                      <Button variant="outline-success" size="lg" block>
                        <FormattedMessage
                          id="homeScreen.subscribeButton"
                          defaultMessage="Subscribe"
                        />
                      </Button>
                    </LinkContainer>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Container>
      )}
      <Container className="mb-5">
        <h1>
          <FormattedMessage
            id="homeScreen.heading.ratings"
            defaultMessage="Loved by thousands of customers"
          />
        </h1>
        <Row>
          {feedback &&
            feedback.map((feed, index) => {
              return (
                <Col key={index}>
                  <FeedBack text={renderContentWithLang(feed).feedbackText} name={feed.name} />
                </Col>
              );
            })}
        </Row>
      </Container>
    </>
  );
};

export default HomeScreen;
