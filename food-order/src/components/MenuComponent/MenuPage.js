import React, { useContext, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Modal,
  Button,
  Box,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { FoodsContext } from "../layout/layout";
import FoodCard from "../../common-components/Cards/FoodCard";

const FoodMenuPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const foodName = queryParams.get("foodname");
  const navigate = useNavigate();
  const { foods, refetchFoods } = useContext(FoodsContext);

  const filteredFoods = foodName
    ? foods?.filter(
        (item) =>
          item?.foodName?.toLowerCase()?.includes(foodName?.toLowerCase()) ||
          item?.foodCategory?.toLowerCase()?.includes(foodName?.toLowerCase())
      )
    : foods;

  // Group food items by course type
  const groupedFoodItems = filteredFoods.reduce((acc, item) => {

    if (!acc[item.courseType]) {
      acc[item.courseType] = [];
    }
    acc[item.courseType].push(item);
    return acc;
  }, {});


  return (
    <div>

      {/* Display food items by course type */}
      {Object.entries(groupedFoodItems).map(([courseType, items]) => (
        <div
          key={courseType}
          className="special-foods"
          sx={{ backgroundColor: "#f0f0f0", width: "100%", py: 2 }}
        >
          <Typography
            variant="h4"
            align="start"
            fontWeight={500}
            fontFamily="Okra, Helvetica, sans-serif"
            sx={{
              // bgcolor: "rgba(128, 128, 128, 0.5)",
              color: "black",
              py: 1,
              marginBottom: "10px",
            }}
          >
            {courseType}
          </Typography>

          <Grid container spacing={2}>
            {items.map((item) => (
              <FoodCard item={item} />
            ))}
          </Grid>
        </div>
      ))}
    </div>
  );
};

export default FoodMenuPage;
