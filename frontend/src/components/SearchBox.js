import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push('/');
    }
  };

  return (
    <Form onSubmit={submitHandler} inline>
      <FormattedMessage id="searchBox.placeholder" defaultMessage="Search Products...">
        {(msg) => (
          <Form.Control
            type="text"
            name="q"
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={msg}
            className="mr-sm-2 ml-sm-5"
          ></Form.Control>
        )}
      </FormattedMessage>
      <Button type="submit" variant="outline-success" className="p-2 search-btn">
        <FormattedMessage id="searchBox.button" defaultMessage="Search" />
      </Button>
    </Form>
  );
};

export default SearchBox;
