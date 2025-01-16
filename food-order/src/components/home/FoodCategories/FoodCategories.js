// src/components/FoodCategories.js

import { Grid, Typography } from "@mui/material";
import React, { useContext } from "react";
import PrimaryCard from "../../../common-components/Cards/primaryCard";
import { FoodsContext } from "../../layout/layout";
import "./FoodCategories.css";

const FoodCategories = () => {
  const { foods } = useContext(FoodsContext);

  function createCategoryArray(data) {
    const categoryMap = {};
    data.forEach((item) => {
      const { foodCategory, image } = item;
      if (!categoryMap[foodCategory]) {
        categoryMap[foodCategory] = image;
      }
    });

    const categoryArray = Object.keys(categoryMap).map((foodCategory) => ({
      foodCategory,
      image: categoryMap[foodCategory],
    }));

    return categoryArray;
  }

  return (
    <>
      {createCategoryArray(foods)?.length ? (
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
            Food Categories
          </Typography>
          <div className="food-cards">
            <Grid container spacing={2}>
              {createCategoryArray(foods)?.map((category) => (
                <PrimaryCard item={category} />
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

export default FoodCategories;
