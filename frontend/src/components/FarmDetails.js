/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listFarmDetails } from '../actions/farmActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { Card } from 'react-bootstrap';
import { Context } from '../components/LanguageContext';

const FarmDetails = ({ farmId }) => {
  const { lang } = useContext(Context);

  const dispatch = useDispatch();

  const farmDetails = useSelector((state) => state.farmDetails);
  const { loading, error, farm } = farmDetails;

  useEffect(() => {
    dispatch(listFarmDetails(farmId));
  }, [dispatch]);

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
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      {farm && (
        <Card className="rounded m-4" style={{ minHeight: '5rem', fontSize: 'large' }}>
          <Card.Header as="div" style={{ backgroundColor: 'transparent' }}>
            {farm.length !== 0 && <h5>{renderContentWithLang(farm.name)}</h5>}
          </Card.Header>
          <div className="farm-details">
            {farm.length !== 0 && (
              <div style={{ padding: '0.5rem' }}>"{renderContentWithLang(farm.story)}"</div>
            )}
            <img alt="farm" src={farm.image} />
          </div>
        </Card>
      )}
    </>
  );
};

export default FarmDetails;
