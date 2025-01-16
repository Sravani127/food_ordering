// RestaurantInfo.js
import React from "react";
import { Typography, Box, Icon, Rating } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import "./restaurent-info.css"; // Import custom CSS styles
import FoodItems from "./food-items/food-items";

const RestaurantInfo = ({
  name = "Santhosh Family Dhaba",
  location = "Kondapur",
  rating = 4.5,
  ratingCount = "11k",
}) => {
  return (
    <div className="restaurant-info">
      <Typography variant="h4">{name}</Typography>
      <Box className="location">
        <LocationOnIcon sx={{ mr: 1 }} />
        <Typography variant="body1">{location}</Typography>
      </Box>
      <Box className="rating">
        <Rating value={rating} precision={0.5} readOnly />
        <Typography variant="body2">{ratingCount} ratings</Typography>
      </Box>
      <FoodItems />
    </div>
  );
};

export default RestaurantInfo;
