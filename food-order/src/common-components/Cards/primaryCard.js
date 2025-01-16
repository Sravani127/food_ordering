import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const PrimaryCard = ({item}) => {
  const navigate = useNavigate();

  return (
    <Grid item key={item.id}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          maxWidth: 300,
        }}
      >
        <CardMedia
          onClick={() => navigate(`/menu?foodname=${item?.foodCategory}`)}
          component="img"
          height="150"
          image={item.image}
          alt={''}
          sx={{ objectFit: "cover" }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            {item?.foodCategory}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default PrimaryCard;
