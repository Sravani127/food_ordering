import React, { useContext, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Modal,
  FormControlLabel,
  Button,
  Checkbox,
} from "@mui/material";
import { Delete, Add, Remove, MoreVert } from "@mui/icons-material";
import { FoodsContext } from "../../components/layout/layout";
import { useNavigate } from "react-router-dom";
import { deleteRequest, putRequest } from "../../services/apiService";
import { userId } from "../../constants";

const FoodCard = ({ item }) => {
  const { setCartItems, cartItems, foods, refetchFoods, userDetails } =
    useContext(FoodsContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const itemsCount = cartItems?.filter((cartItem) => cartItem === item)?.length;

  const isCartItem = (item) => {
    return cartItems?.find((food) => food?._id === item?._id);
  };

  const handleDelete = (id) => {
    deleteRequest(`/foods/${id}`).then((res) => {
      if (res?.data) {
        refetchFoods();
      }
    });
  };

  const onAddItem = () => {
    if (item?.extraFoods?.length) {
      handleOpenModal();
    } else {
      setCartItems((prev) => [...prev, item]);
    }
  };

  const onRemoveItem = (item) => {
    setCartItems((prev) => {
      const ind = prev.indexOf(item);
      prev.splice(ind, 1);
      return [...prev];
      // prev.filter((cartItem) => cartItem?._id !== item._id)
    });
  };

  const handleOpenOptions = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseOptions = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddToFavourites = () => {
    putRequest(`/foods/${item?._id}`, {
      ...item,
      isLikedBy: item?.isLikedBy.includes(userId)
        ? item?.isLikedBy.filter((item) => item !== userId)
        : [...item.isLikedBy, userId],
    }).then((res) => {
      if (res?.data) {
        handleCloseOptions();
        refetchFoods();
      }
    });
  };

  const handleExtraFoodChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedExtras((prev) => [...prev, value]);
    } else {
      setSelectedExtras((prev) => prev.filter((item) => item !== value));
    }
  };

  const getExtraFoods = (foodId) => {
    return foods?.find((item) => item?._id === foodId)?.foodName;
  };

  const handleContinue = () => {
    const filteredFoods = foods?.filter((food) =>
      selectedExtras?.includes(food?._id)
    );
    setCartItems((prev) => [...prev, ...filteredFoods, item]);
    handleCloseModal();
  };

  const handleAddToPopular = () => {
    putRequest(`/foods/${item?._id}`, {
      ...item,
      isPopular: !item?.isPopular,
    }).then((res) => {
      if (res?.data) {
        handleCloseOptions();
        refetchFoods();
      }
    });
  };

  const onSkip = () => {
    setCartItems((prev) => [...prev, item]);
    handleCloseModal();
  };

  return (
    <Grid item key={item._id}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          maxWidth: 300,
          cursor: "pointer",
          position: "relative",
          transition: "box-shadow 0.3s",
          "&:hover": {
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
            transform: "scale(1.05)",
          },
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 0, right: 0, zIndex: 1 }}
          aria-label="options"
          onClick={handleOpenOptions}
        >
          <MoreVert />
        </IconButton>
        <CardMedia
          onClick={() => navigate(`/view-food?id=${item?._id}`)}
          component="img"
          height="200"
          image={item.image}
          alt={item.foodName}
          sx={{ objectFit: "cover", minWidth: 300 }}
        />
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            {item.foodName}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {item.foodType}
          </Typography>
          <Typography variant="body2" gutterBottom>
            ${item.finalPrice}
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", margin: 2 }}>
          {itemsCount ? (
            <Button variant="contained" color="success">
              <>
                <span onClick={() => onRemoveItem(item)}>-</span>
                {` `}&nbsp;&nbsp;
                <span>{itemsCount}</span>
                {` `}&nbsp;&nbsp;
                <span onClick={() => onAddItem()}>+</span>
              </>
            </Button>
          ) : (
            <Button
              onClick={() => onAddItem()}
              variant="contained"
              color="success"
              sx={{borderRadius: "25px"}}
            >
              Add
            </Button>
          )}
          {userDetails?.role_type === "manager" && (
            <IconButton
              onClick={() => handleDelete(item._id)}
              aria-label="delete"
              sx={{ marginRight: 1 }}
            >
              <Delete />
            </IconButton>
          )}
        </Box>
      </Card>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseOptions}
      >
        {
          <MenuItem onClick={handleAddToFavourites}>
            {
              // item?.isFavourite
              item?.isLikedBy.includes(userId)
                ? "Remove from Favorite foods"
                : !userDetails?.role_type && <>Add to Favorite Foods</>
            }
          </MenuItem>
        }
        <MenuItem onClick={handleAddToPopular}>
          {item?.isPopular
            ? "Remove from Popular foods"
            : userDetails?.role_type && "Add to Popular Foods"}
        </MenuItem>
      </Menu>
      <Modal open={showModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Extra Foods
          </Typography>
          {item?.extraFoods?.map((id) => (
            <FormControlLabel
              key={IDBCursor}
              control={
                <Checkbox
                  checked={selectedExtras.includes(id)}
                  onChange={handleExtraFoodChange}
                  value={id}
                />
              }
              label={getExtraFoods(id)}
            />
          ))}
          <Button variant="contained" color="primary" onClick={onSkip}>
            Skip
          </Button>{" "}
          <Button
            variant="contained"
            color="primary"
            onClick={handleContinue}
            disabled={selectedExtras.length === 0}
          >
            Continue
          </Button>
        </Box>
      </Modal>
    </Grid>
  );
};

export default FoodCard;
