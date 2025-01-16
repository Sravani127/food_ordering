import React, { useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import "./payment.css";

const PaymentPage = ({
  cartItems = [
    {
      name: "Margherita Pizza",
      image: "margherita_pizza.jpg",
      price: 12.99,
    },
    {
      name: "Spaghetti Carbonara",
      image: "spaghetti_carbonara.jpg",
      price: 14.99,
    },
  ],
  deliveryTime,
}) => {
  const [open, setOpen] = useState(false); // State for confirmation modal
  const [isPaid, setIsPaid] = useState(false); // State for payment status

  const handlePay = () => {
    setOpen(true); // Open confirmation modal
  };

  const handleClose = () => {
    setOpen(false); // Close confirmation modal
  };

  const handleConfirm = () => {
    setIsPaid(true); // Set payment status to paid
    setOpen(false); // Close confirmation modal
  };

  return (
    <div>
      <Typography variant="h4">Payment</Typography>
      <div>
        {/* Display cart items */}
        {cartItems.map((item, index) => (
          <div key={index}>
            <Typography>
              {item.name} - ${item.price.toFixed(2)}
            </Typography>
          </div>
        ))}
        {/* Display delivery time */}
        {deliveryTime && <Typography>Delivery Time: {deliveryTime}</Typography>}
      </div>
      {/* Display pay button */}
      {!isPaid ? (
        <Button variant="contained" onClick={handlePay}>
          Pay
        </Button>
      ) : (
        <Typography variant="h6">Paid</Typography>
      )}

      {/* Confirmation modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to proceed with payment?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm}>OK</Button>
        </DialogActions>
      </Dialog>

      {/* Order confirmation message */}
      {isPaid && (
        <Typography variant="h6">Thank you for your order!</Typography>
      )}
    </div>
  );
};

export default PaymentPage;
