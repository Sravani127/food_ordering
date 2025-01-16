// Offers.js
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import './offers.css';

const Offers = ({ offers }) => {
  return (
    <div className="offers">
      {offers.map((offer, index) => (
        <Card key={index} className="offer-card">
          <CardContent>
            <Typography variant="h6" component="h2">{offer.name}</Typography>
            <Typography variant="body2" color="textSecondary" component="p">Description: {offer.description}</Typography>
            <Typography variant="body2" color="textSecondary" component="p">Validity: {offer.validity}</Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Offers;
