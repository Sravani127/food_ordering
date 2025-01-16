import {
  Button,
  Grid,
  Typography,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Card, CardContent } from '@mui/material';
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import FoodCard from "../../common-components/Cards/FoodCard";
import { FoodsContext } from "../layout/layout";
import { Field, Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getRequest, postRequest } from "../../services/apiService";
import {
  calculateBillDiscount,
  calculateDistanceCharge,
  compareTodayWithInputDate,
  getOrdersTenBonus,
  isSameWeekMondayToSunday,
} from "../../Utils/Utils";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    setCartItems,
    userDetails,
    setOrders,
    orders,
    updateUser,
    userOrders,
  } = useContext(FoodsContext);
  const HOME_DELIVERY = "Home Delivery";
  const tableNumbersOptions = Array.from(
    { length: 25 },
    (_, index) => index + 1
  ).map((number) => {
    if (
      orders?.find(
        (item) =>
          Number(item?.tableNumber) === number && item?.status !== "Paid"
      )
    ) {
      return `${number} - Reserved`;
    }
    return `${number} - Available`;
  });
  const PICKUP = "Pickup from the store";
  const [deliveryType, setDeliveryType] = React.useState(PICKUP);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [bonus, setBonus] = useState(0);

  const homeDeliveryError =
    "Home Delivery is Required when you selected home delivery option";

  // Calculate total bill and GST
  const totalAmount = cartItems?.reduce(
    (total, item) => total + Number(item?.finalPrice),
    0
  );
  const GST = totalAmount * 0.18; // Assuming 18% GST\
  const dobDiscount = compareTodayWithInputDate(userDetails?.dob)
    ? totalAmount * 0.2
    : 0;
    console.log("cartItems",cartItems)
  const discount = calculateBillDiscount(userDetails,Number(totalAmount)) + dobDiscount;
  let totalBill =
    Number(GST) +
    totalAmount -
    discount +
    deliveryCharge -
    (bonus / 100).toFixed(2);
    for(let eachCartItem of cartItems){
      if(eachCartItem.courseType.toLowerCase() === 'dessert'){
        totalBill = totalBill - 2.50;
      }
    }
    // Formik validation schema for table number
    let validationSchema = Yup.object().shape({
      address: Yup.string().when("deliveryType", {
        is: HOME_DELIVERY,
        then: Yup.string().required("Address is required"),
      }),
    });
    if(deliveryType === PICKUP){
      validationSchema = Yup.object().shape({
        tableNumber: Yup.string().required("Table number is required")
      });
    }

  const initialValues = {
    tableNumber: "",
    address: "",
  };

  const onSubmit = (values) => {
    const orderId = generateOrderId();
    console.log(cartItems);
    // Create order object
    const order = {
      orderId: orderId,
      items: cartItems?.map((item) => item.foodName),
      totalBill: totalBill,
      tableNumber: values?.tableNumber?.split("-")?.[0],
      status: "Ordered",
      user_id: userDetails?._id,
      delivery_type: deliveryType,
      createdAt: new Date(),
      distance: values?.distance,
      GST,
      discount,
      deliveryCharge,
      orderItems: cartItems,
    };
    payOrder(order);
  };


  const generateOrderId = () => {
    // Generate a random order ID
    return Math.random().toString(36).substr(2, 9);
  };

  const payOrder = (order) => {
    postRequest("/orders", order).then((res) => {
      if (res?.data) {
        getRequest("/orders").then((res) => {
          if (res?.data) {
            updateUser({
              loyalty_points:
                Number(userDetails?.loyalty_points) +
                (!isSameWeekMondayToSunday(userDetails?.orderTenBonusDate) ||
                !userDetails?.orderTenBonusDate
                  ? getOrdersTenBonus(userOrders)
                  : 0) -
                Number(bonus),
              orderTenBonusDate:
                !isSameWeekMondayToSunday(userDetails?.orderTenBonusDate) ||
                !userDetails?.orderTenBonusDate
                  ? new Date()
                  : userDetails?.orderTenBonusDate,
            });
            setCartItems([]);
            setOrders(res?.data);
            navigate("/orders");
          }
        });
      }
    });
  };

  const onDeliveryChange = (e) => {
    const charge = calculateDistanceCharge(e.target.value) || 0;
    setDeliveryCharge(charge);
  };

  return (
    <>
      {cartItems?.length ? (
        <div
          className="special-foods"
          sx={{ backgroundColor: "#f0f0f0", width: "100%", py: 2 }}
        >
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
            Pay Order
          </Typography>
          <div className="food-cards">
            <Grid container spacing={2}>
              {cartItems?.map((food) => (
                <FoodCard key={food?._id} item={food} />
              ))}
            </Grid>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form>
                <FormControl style={{ width: "400px" }} margin="normal">
                  <InputLabel id="course-type-label">Table Number</InputLabel>
                  <Field
                    as={Select}
                    name="tableNumber"
                    labelId="course-type-label"
                    variant="outlined"
                    MenuProps={{
                      anchorOrigin: { vertical: "bottom", horizontal: "left" },
                      getContentAnchorEl: null,
                      PaperProps: {
                        style: {
                          maxHeight: "300px", // Adjust the maximum height of the menu as needed
                          width: "200px", // Adjust the width of the menu as needed
                        },
                      },
                    }}
                  >
                    {tableNumbersOptions?.map((item) => (
                      <MenuItem
                        value={item}
                        style={{
                          color: item.includes("Available") ? "green" : "red",
                        }}
                      >
                        {item}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
                <ErrorMessage
                  name="tableNumber"
                  component="div"
                  style={{ color: "red", marginBottom: "1rem" }}
                />
                {values?.tableNumber?.includes("Reserved") ? (
                  <div style={{ color: "red", marginBottom: "1rem" }}>
                    Table is already reserved, Please wait for 10 minutes
                  </div>
                ) : (
                  <></>
                )}
                <br />
                <FormControlLabel
                  control={
                    <Checkbox
                      name={PICKUP}
                      checked={deliveryType === PICKUP}
                      onChange={() => setDeliveryType(PICKUP)}
                      color="primary"
                    />
                  }
                  label="Pick up from Store"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name={HOME_DELIVERY}
                      checked={deliveryType === HOME_DELIVERY}
                      onChange={() => setDeliveryType(HOME_DELIVERY)}
                      color="primary"
                    />
                  }
                  label="Home Delivery"
                />
                <br />
                {deliveryType === HOME_DELIVERY && (
                  <>
                    <Field
                      as={TextField}
                      id="address"
                      name="address"
                      label="Address"
                      variant="outlined"
                      sx={{ marginTop: 2 }}
                    />
                    <br />
                    {deliveryType === HOME_DELIVERY && !values?.address && (
                      <p style={{ color: "red", marginBottom: "1rem" }}>
                        {homeDeliveryError}
                      </p>
                    )}
                    <Field
                      as={TextField}
                      id="distance"
                      name="distance"
                      label="Distance"
                      onChange={(e) => {
                        onDeliveryChange(e);
                        setFieldValue("distance", e.target.value);
                      }}
                      variant="outlined"
                      sx={{ marginTop: 2 }}
                    />
                    <br />
                    {Number(values?.distance) > 20 && (
                      <p style={{ color: "red", marginBottom: "1rem" }}>
                        {"Distance exceeds limit"}
                      </p>
                    )}
                    <br />
                  </>
                )}
                {userDetails?.loyalty_points >= 500 && (
                  <>
                    <Field
                      as={TextField}
                      id="bonus"
                      name="bonus"
                      label="Loyalty Points"
                      variant="outlined"
                      onChange={(e) => {
                        setBonus(e.target.value);
                      }}
                      sx={{ marginTop: 2 }}
                    />
                    <br />
                  </>
                )}
                <Card>
            <CardContent>
              <Box mt={2}>

          {cartItems.map((item) => (
            <Typography key={item._id} variant="body1">
              {item.foodName}: ₹{item.finalPrice}
            </Typography>
          ))}
                <Typography variant="body1">
                  Total Amount: ₹{Number(totalAmount).toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  GST (18%): ₹{GST?.toFixed(2)}
                </Typography>
                  {discount ? (
                  <Typography variant="body1">Discount: ₹{Number(discount).toFixed(2)}	</Typography>
                  ) : null}
                  {bonus ? (
                  <Typography variant="body1">
                      Loyalty Points: {bonus} (₹{(bonus / 100).toFixed(2)})
                  </Typography>
                  ) : null}
                <Typography variant="h6">
                    Total Bill: ₹{Number(totalBill).toFixed(2)}
                </Typography>
              </Box>
           </CardContent>
        </Card>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={deliveryType === HOME_DELIVERY && !values?.address}
                  style={{ marginTop: 20 }}
                >
                  Order
                </Button>
              </Form>
            )}
          </Formik>
          
        </div>
      ) : (
        <div align="center">No Items</div>
      )}
    </>
  );
};

export default CartPage;
