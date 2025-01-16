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
  MenuItem,
  Select,
  MenuProps,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FoodCard from "../../common-components/Cards/FoodCard";
import PaymentModal from "../../common-components/Modals/PaymentModal/PaymentModal";
import { FoodsContext } from "../layout/layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getRequest, postRequest } from "../../services/apiService";
import {
  calculateBillDiscount,
  calculateDistanceCharge,
  compareTodayWithInputDate,
  getOrdersTenBonus,
  isSameWeekMondayToSunday,
} from "../../Utils/Utils";

const OrderPage = () => {
  const { foods, userDetails, setOrders, orders, updateUser, userOrders } =
    useContext(FoodsContext);
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
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search);
  const foodId = queryParam.get("id");
  const food = foods?.find((item) => item?._id == foodId);
  const [bonus, setBonus] = useState(0);
  const HOME_DELIVERY = "Home Delivery";
  const PICKUP = "Pickup from the store";
  const [deliveryType, setDeliveryType] = useState(PICKUP);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const homeDeliveryError =
    "Home Delivery is Required when you selected home delivery option";

  const navigate = useNavigate();
  const dobDiscount = compareTodayWithInputDate(userDetails?.dob)
    ? food?.finalPrice * 0.2
    : 0;

  const GST = food?.finalPrice * 0.18; // Assuming 18% GST
  const discount =
    calculateBillDiscount(Number(food?.finalPrice)) + dobDiscount;
  const totalBill =
    Number(GST) +
    Number(food?.finalPrice) -
    discount +
    Number(deliveryCharge) -
    (bonus / 100).toFixed(2);

  // Formik validation schema for table number
  const validationSchema = Yup.object().shape({
    tableNumber: Yup.string().required("Table number is required"),
  });

  const initialValues = {
    tableNumber: "",
    address: "",
  };

  const onSubmit = (values) => {
    const orderId = generateOrderId();
    // Create order object
    const order = {
      orderId: orderId,
      items: [food?.foodName],
      totalBill: totalBill,
      tableNumber: values?.tableNumber?.split("-")?.[0],
      status: "Ordered",
      delivery_type: deliveryType,
      user_id: userDetails?._id,
      createdAt: new Date(),
      distance: values?.distance,
      GST,
      discount,
      deliveryCharge,
      orderItems:[food]
    };
    if (!values?.tableNumber?.includes("Reserved")) {
      payOrder(order);
    }
  };

  const generateOrderId = () => {
    // Generate a random order ID
    return Math.random().toString(36).substr(2, 9);
  };

  const payOrder = (order) => {
    postRequest("/orders", order).then((res) => {
      if (res?.data) {
        console.log("orderTenBonusDate",getOrdersTenBonus(userOrders) )
        updateUser({
          loyalty_points: Number(userDetails?.loyalty_points) + ((!isSameWeekMondayToSunday(userDetails?.orderTenBonusDate) || !userDetails?.orderTenBonusDate) ? getOrdersTenBonus(userOrders) : 0) - Number(bonus),
          orderTenBonusDate: (!isSameWeekMondayToSunday(userDetails?.orderTenBonusDate) || !userDetails?.orderTenBonusDate) ? new Date() : userDetails?.orderTenBonusDate
        });
        getRequest("/orders").then((res) => {
          if (res?.data) {
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
          {[food]?.map((food) => (
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
                      maxHeight: "300px",
                      width: "200px",
                    },
                  },
                }}
              >
                {tableNumbersOptions?.map((item) => (
                  <MenuItem style={{ color: item.includes("Available") ? "green" : "red" }} value={item}>{item}</MenuItem>
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
                  name="Home Delivery"
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

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={
                deliveryType === HOME_DELIVERY &&
                !values?.address &&
                Number(values?.distance) > 20
              }
              style={{ marginTop: 20 }}
            >
              Order
            </Button>
            <Box mt={2}>
              <Typography variant="h6">Total Bill: ${totalBill}</Typography>
              <Typography variant="body1">
                GST (18%): ${GST?.toFixed(2)}
              </Typography>
              <Typography variant="body1">
                Delivery Charge: ${deliveryCharge?.toFixed(2)}
              </Typography>
              {discount ? (
                <Typography variant="body1">Discount: ${discount.toFixed(2)}</Typography>
              ) : (
                <></>
              )}
              {bonus ? (
                <Typography variant="body1">
                  Loyalty Points: {bonus}(${bonus/100})
                </Typography>
              ) : (
                <></>
              )}
            </Box>
            <Typography variant="h5" mt={2}>
              Item-wise Bill:
            </Typography>
            <Typography variant="body1">
              {food?.foodName}: ₹{food?.finalPrice}
            </Typography>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OrderPage;
