import React, { useState } from "react";
import {
  Modal,
  Button,
  FormControl,
  InputLabel,
  Input,
  Grid,
  IconButton,
  Typography,
  Box,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  CreditCard,
  PhoneAndroid,
  MonetizationOn,
  Payment,
} from "@mui/icons-material";

const PaymentModal = ({ open, handleClose, onSubmitOrderPayment }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Invalid phone number")
      .required("Phone number is required"),
  });

  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
    },
    validationSchema: paymentMethod === "phonePay" ? validationSchema : null,
    onSubmit: (values) => {
      handlePayment();
    },
  });

  const handlePayment = () => {
    if (paymentMethod === "phonePay" && !formik.isValid) {
      return;
    }
    onSubmitOrderPayment();

    handleClose();
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    // Reset phone number and validation when changing payment method
    formik.resetForm();
    setPhoneNumber("");
    setPhoneNumberError("");
  };

  const handleBackdropClick = () => {
    // Reset modal state when clicking outside of the modal
    setPaymentMethod("");
    formik.resetForm();
    setPhoneNumber("");
    setPhoneNumberError("");
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="payment-modal-title"
      aria-describedby="payment-modal-description"
      BackdropProps={{ onClick: handleBackdropClick }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          p: 4,
          minWidth: 300,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h6"
          id="payment-modal-title"
          align="center"
          gutterBottom
        >
          Choose Payment Method
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <IconButton
              onClick={() => handlePaymentMethodChange("card")}
              sx={{
                color: paymentMethod === "card" ? "primary.main" : "inherit",
              }}
            >
              <CreditCard fontSize="large" />
            </IconButton>
            <Typography variant="body1">Card</Typography>
          </Grid>
          <Grid item>
            <IconButton
              onClick={() => handlePaymentMethodChange("phonePay")}
              sx={{
                color:
                  paymentMethod === "phonePay" ? "primary.main" : "inherit",
              }}
            >
              <PhoneAndroid fontSize="large" />
            </IconButton>
            <Typography variant="body1">Phone Pay</Typography>
          </Grid>
          <Grid item>
            <IconButton
              onClick={() => handlePaymentMethodChange("gPay")}
              sx={{
                color: paymentMethod === "gPay" ? "primary.main" : "inherit",
              }}
            >
              <MonetizationOn fontSize="large" />
            </IconButton>
            <Typography variant="body1">Google Pay</Typography>
          </Grid>
          <Grid item>
            <IconButton
              onClick={() => handlePaymentMethodChange("paytm")}
              sx={{
                color: paymentMethod === "paytm" ? "primary.main" : "inherit",
              }}
            >
              <Payment fontSize="large" />
            </IconButton>
            <Typography variant="body1">Paytm</Typography>
          </Grid>
        </Grid>
        {paymentMethod !== "" && (
          <Box>
            {paymentMethod !== "card" && (
              <form onSubmit={formik.handleSubmit}>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel htmlFor="phone-number">
                    Enter Phone Number
                  </InputLabel>
                  <Input
                    id="phone-number"
                    name="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      formik.handleChange(e);
                    }}
                  />
                  <FormHelperText error>
                    {formik.errors.phoneNumber}
                  </FormHelperText>
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Pay
                </Button>
              </form>
            )}
            {(paymentMethod === "card" || paymentMethod === "") && (
              <Button
                onClick={handlePayment}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Pay
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default PaymentModal;
