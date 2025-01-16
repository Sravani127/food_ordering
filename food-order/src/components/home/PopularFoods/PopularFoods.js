// src/components/SpecialFoods.js

import { Grid, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import FoodCard from "../../../common-components/Cards/FoodCard";
import { FoodsContext } from "../../layout/layout";
import "./PopularFoods.css";

const PopularFoods = () => {
  const { foods } = useContext(FoodsContext);
  const navigate = useNavigate();

  const popularFoods = foods?.filter((item) => item?.isPopular);

  return (
    <>
      {popularFoods?.length ? (
        <div
          className="special-foods"
          sx={{ background: "rgb(223 223 223 / 50%)", width: "100%", py: 2 }}
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
            Popular Foods
          </Typography>
          <div className="food-cards">
            <Grid container spacing={2}>
              {popularFoods?.map((food) => (
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

export default PopularFoods;
