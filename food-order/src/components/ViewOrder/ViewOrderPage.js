import React, { useContext, useEffect, useState } from "react";
import {
  Typography,
  Button,
  CircularProgress,
  Box,
  Modal,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { getRequest } from "../../services/apiService";
import { FoodsContext } from "../layout/layout";

const ViewOrder = () => {
  const { userDetails, foods, setCartItems } = useContext(FoodsContext);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search);
  const foodId = queryParam.get("id");
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const item = foods?.find((item) => item?._id === foodId);

  const [foodDetails, setFoodDetails] = useState();
  console.log("id", foodId);
  const getFoodDetails = () => {
    getRequest(`/foods/${foodId}`).then((res) => {
      setFoodDetails(res?.data?.food);
    });
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
    navigate(`/cart`);
    handleCloseModal();
  };

  const onOrderHandle = () => {
    if (item?.extraFoods?.length) {
      handleOpenModal();
    } else {
      navigate(`/order?id=${foodId}`);
    }
  };

  useEffect(() => {
    getFoodDetails();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10px",
      }}
    >
      <div>
        <Typography
          variant="h4"
          align="center"
          sx={{
            bgcolor: "rgba(128, 128, 128, 0.5)",
            color: "black",
            py: 1,
            marginBottom: "10px",
          }}
        >
          {foodDetails?.foodName}
        </Typography>

        <div>
          {foodDetails && (
            <>
              <img
                src={foodDetails?.image} // Assuming foodDetails contains the image URL
                alt={foodDetails?.foodName}
                style={{ width: "100%", maxWidth: 400, marginBottom: 10 }}
              />
              <Typography variant="body1">
                Price: {foodDetails?.finalPrice}
              </Typography>
              <Typography variant="body1">
                Food Type: {foodDetails?.foodType}
              </Typography>
              <Typography variant="body1">
                Food Category: {foodDetails?.foodCategory}
              </Typography>
              <Typography variant="body1">
                Course Type: {foodDetails?.courseType}
              </Typography>
              <Typography variant="body1">
                Description: {foodDetails?.description}
              </Typography>
              {userDetails?.role_type === "manager" && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/edit-food?id=${foodId}`)}
                  style={{ marginTop: 20 }}
                >
                  Edit
                </Button>
              )}{" "}
              <Button
                variant="contained"
                color="primary"
                onClick={() => onOrderHandle()}
                style={{ marginTop: 20 }}
              >
                Order
              </Button>
            </>
          )}
        </div>
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => (
                handleCloseModal, navigate(`/order?id=${foodId}`)
              )}
            >
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
      </div>
    </div>
  );
};

export default ViewOrder;
