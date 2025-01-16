// src/components/SpecialFoods.js

import { Grid, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import FoodCard from "../../../common-components/Cards/FoodCard";
import { FoodsContext } from "../../layout/layout";
import "./FavoriteFoods.css";
import { userId } from "../../../constants";

const FavoriteFoods = () => {
  const { foods } = useContext(FoodsContext);
  const navigate = useNavigate();

  // const favoriteFoods = foods?.filter((item) => item?.isFavourite );
  const favoriteFoods = foods?.filter((item) => item.isLikedBy.includes(userId));
  
  console.log(favoriteFoods, userId);

  return (
    <>
      {favoriteFoods?.length ? (
        <div
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
            Favorite Foods
          </Typography>
          <div className="food-cards">
            <Grid container spacing={2}>
              {favoriteFoods?.map((food) => (
                <FoodCard key={food?._id} item={food} />
              ))}
            </Grid>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default FavoriteFoods;
