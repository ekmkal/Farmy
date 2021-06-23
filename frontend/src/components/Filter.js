import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, InputGroup, FormControl, Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { listBundles } from '../actions/bundleActions';
import { FormattedMessage } from 'react-intl';
import { Context } from '../components/LanguageContext';

const Filter = ({ keyword }) => {
  const { lang } = useContext(Context);

  const dispatch = useDispatch();

  const initialValue = '';

  const [minPrice, setMinPrice] = useState(initialValue);
  const [maxPrice, setMaxPrice] = useState(initialValue);
  const [rating, setRating] = useState(initialValue);
  const [category, setCategory] = useState(initialValue);
  const [sortBy, setSortBy] = useState(initialValue);
  const [formSubmit, setFormSubmit] = useState(false);

  useEffect(() => {
    dispatch(listBundles(keyword, minPrice, maxPrice, rating, category, sortBy));
    // eslint-disable-next-line
  }, [dispatch, keyword, formSubmit]);

  const categoriesArray = [
    { value: 'All', nl: 'Alle' },
    { value: 'Vegan', nl: 'Veganistisch' },
    { value: 'Vegetarian', nl: 'Vegetarisch' },
    { value: 'Low-carb', nl: 'Koolhydraatarm' },
    { value: 'Mediterranean', nl: 'Mediterraan' },
  ];

  // const ratingsArray = ['Any', 1, 2, 3, 4, 5];
  const ratingsArray = [
    { value: 'Any', nl: 'Ieder' },
    { value: 1, nl: 1 },
    { value: 2, nl: 2 },
    { value: 3, nl: 3 },
    { value: 4, nl: 4 },
    { value: 5, nl: 5 },
  ];

  const submitHandler = (e) => {
    e.preventDefault();
    setFormSubmit((currentState) => !currentState);
  };

  const clearFilterHandler = () => {
    setMinPrice(initialValue);
    setMaxPrice(initialValue);
    setRating(initialValue);
    setCategory(initialValue);
    setSortBy(initialValue);
  };

  const renderContentWithLang = (contentObject) => {
    switch (lang) {
      case 'English':
        return contentObject.value;
      case 'Dutch':
        return contentObject.nl;
      default:
        return contentObject.value;
    }
  };

  return (
    <>
      <Form onSubmit={submitHandler} className="justify-content-md-center">
        {/*select menus */}
        <Row>
          <Col sm={12} md={6} lg={6} xl={3}>
            <Form.Group controlId="category">
              <Form.Control
                className="inputBG"
                as="select"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                {categoriesArray.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {renderContentWithLang(cat)}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col sm={12} md={6} lg={6} xl={3}>
            <Form.Group controlId="rating">
              <Form.Control
                className="inputBG"
                as="select"
                onChange={(e) => setRating(e.target.value)}
                value={rating}
              >
                <FormattedMessage id="filter.rating" defaultMessage="Rating">
                  {(msg) =>
                    ratingsArray.map((ratingOption) => (
                      <option key={ratingOption.value} value={ratingOption.value}>
                        {msg}: {renderContentWithLang(ratingOption)}
                      </option>
                    ))
                  }
                </FormattedMessage>
              </Form.Control>
            </Form.Group>
          </Col>
          {/* price inputs */}
          <Col sm={12} md={6} lg={6} xl={3}>
            <InputGroup>
              <InputGroup.Append>
                <InputGroup.Text id="min-price" className="inputBG">
                  <FormattedMessage id="filter.minPrice" defaultMessage="Min price" />
                </InputGroup.Text>
              </InputGroup.Append>
              <FormattedMessage id="filter.minPrice" defaultMessage="Min price">
                {(msg) => (
                  <FormControl
                    placeholder={msg}
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                )}
              </FormattedMessage>
            </InputGroup>
          </Col>
          <Col sm={12} md={6} lg={6} xl={3}>
            <InputGroup>
              <InputGroup.Append>
                <InputGroup.Text id="max-price" className="inputBG">
                  <FormattedMessage id="filter.maxPrice" defaultMessage="Max price" />
                </InputGroup.Text>
              </InputGroup.Append>
              <FormattedMessage id="filter.maxPrice" defaultMessage="Max price">
                {(msg) => (
                  <FormControl
                    placeholder={msg}
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                )}
              </FormattedMessage>
            </InputGroup>
          </Col>
        </Row>
        {/* checkboxes for sorting */}
        <Row className="mx-auto my-2">
          <Col xs={6} sm={6} md={6} lg={6} xl={3}>
            <Form.Group controlId="high-price-order">
              <FormattedMessage id="filter.highestPrice" defaultMessage="Highest Price">
                {(msg) => (
                  <Form.Check
                    onChange={() => setSortBy('highestPrice')}
                    // boxes will be checked only when statement is true, needed for filter clearing
                    checked={sortBy === 'highestPrice'}
                    type="radio"
                    name="sort"
                    label={msg}
                  />
                )}
              </FormattedMessage>
            </Form.Group>
          </Col>
          <Col xs={6} sm={6} md={6} lg={6} xl={3}>
            <Form.Group controlId="low-price-order">
              <FormattedMessage id="filter.lowestPrice" defaultMessage="Lowest Price">
                {(msg) => (
                  <Form.Check
                    onChange={() => setSortBy('lowestPrice')}
                    checked={sortBy === 'lowestPrice'}
                    type="radio"
                    name="sort"
                    label={msg}
                  />
                )}
              </FormattedMessage>
            </Form.Group>
          </Col>
          <Col xs={6} sm={6} md={6} lg={6} xl={3}>
            <Form.Group controlId="order-by-rating">
              <FormattedMessage id="filter.highestRating" defaultMessage="Highest Rating">
                {(msg) => (
                  <Form.Check
                    onChange={() => setSortBy('rating')}
                    checked={sortBy === 'rating'}
                    type="radio"
                    name="sort"
                    label={msg}
                  />
                )}
              </FormattedMessage>
            </Form.Group>
          </Col>
          <Col xs={6} sm={6} md={6} lg={6} xl={3}>
            <Form.Group controlId="order-by-newest">
              <FormattedMessage id="filter.newest" defaultMessage="Newest">
                {(msg) => (
                  <Form.Check
                    onChange={() => setSortBy('newest')}
                    checked={sortBy === 'newest'}
                    type="radio"
                    name="sort"
                    label={msg}
                  />
                )}
              </FormattedMessage>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          {/* for pushing buttons to the right side */}
          <Col></Col>
          <Col></Col>
          <Col></Col>
          <Col></Col>
          <Col>
            <Button type="submit" className="p-2 btn btn-outline-success">
              <FormattedMessage id="filter.filterButton" defaultMessage="Filter Bundles" />
            </Button>
          </Col>
          <Col>
            <Button
              onClick={clearFilterHandler}
              type="submit"
              className="p-2 btn btn-outline-success"
            >
              <FormattedMessage id="filter.clearButton" defaultMessage="Clear Filter" />
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Filter;
