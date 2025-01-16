// src/components/HomePage.js
import { Container, Typography, Button, Box } from "@mui/material";
import React, { useContext } from "react";
import FavoriteFoods from "./FavoriteFoods/FavoriteFoods";
import FoodCategories from "./FoodCategories/FoodCategories";
import "./HomePage.css";
import PopularFoods from "./PopularFoods/PopularFoods";
import SpecialFoods from "./SpecialFoods/SpecialFoods";
import { Link } from "react-router-dom";
import { FoodsContext } from "../layout/layout";

const HomePage = () => {
  const { userDetails } = useContext(FoodsContext);
  return (
    <div className="home-page">
      <Box
        sx={{
          backgroundColor: "#f0f0f0",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <Typography variant="h2" color={'grey'} gutterBottom>
          Welcome to Our Food Order Website
        </Typography>
        <Typography variant="body1" gutterBottom>
          Discover amazing dishes and deals!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/menu"
          sx={{ marginTop: "16px", borderRadius: "25px", padding: "12px 24px" }}
        >
          View Menu
        </Button>
        {!userDetails?.role_type && (
          <Typography variant="body1" sx={{ marginTop: "24px" }}>
            <strong>Special Offers:</strong>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li>
                Get 20% discount on your total price because of your birthday!
              </li>
              <li>
                Earn 10 Loyalty Points for every $1 spent on food. (1000 points
                equal to $10)
              </li>
              <li>Get an extra 200 points on your first food order!</li>
              <li>
                Refer a friend to our website and receive 100 bonus points when
                they make their first purchase!
              </li>
              <li>
                Order food 10 times from our website in a week to earn 100 bonus
                points!
              </li>
            </ul>
          </Typography>
        )}
      </Box>
      <PopularFoods />
      <SpecialFoods />
      <FavoriteFoods />
      <FoodCategories />
    </div>
  );
};

export default HomePage;
