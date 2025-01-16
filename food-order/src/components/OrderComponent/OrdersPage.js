import React, { memo, useContext, useEffect, useState } from "react";
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  Typography,
  Box,
  TextField,
  Paper,
} from "@mui/material";
import { Payment, Visibility } from "@mui/icons-material";
import { getRequest, putRequest } from "../../services/apiService";
import PaymentModal from "../../common-components/Modals/PaymentModal/PaymentModal";
import { FoodsContext } from "../layout/layout";
import "./OrderPage.css";

const OrdersTable = () => {
  const { userDetails, setOrders, userOrders, updateUser } =
    useContext(FoodsContext);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [payOrder, setPayOrder] = useState();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  const getAllOrders = () => {
    getRequest("/orders").then((res) => {
      if (res?.data) {
        setOrders(res?.data);
      }
    });
  };

  const updateOrder = () => {
    putRequest(`/orders/${payOrder?._id}`, {
      ...payOrder,
      status: "Paid",
      billDate: new Date().toISOString(),
    }).then((res) => {
      if (res?.data) {
        updateUser({
    
          loyalty_points:
            (Number(userDetails?.loyalty_points) || 0) +
             totalAmount*1 +
            (userOrders?.length === 1 ? 200 : 0),
        });
        getAllOrders();
      }
    });
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Rejected":
        return "red";
      case "Cancelled":
        return "orange";
      case "Ordered":
        return "blue";
      case "Paid":
        return "green";
      default:
        return "black";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const totalAmount = userOrders.reduce(
    (acc, order) => acc + Number(order.totalBill),
    0
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {userDetails?.role_type === "sales" && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        )}
          <Typography variant="h6">
            Total Amount: ₹{totalAmount.toFixed(2)}
          </Typography>
      </Box>
      {userOrders?.length ? (
        <Paper sx={{ overflow: "auto" }}>
          <Table>
            <TableHead sx={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Bill Date</TableCell>
                <TableCell>Delivery Type</TableCell>
                <TableCell>Table Number</TableCell>
                <TableCell>Total Bill</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userOrders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.items.join(", ")}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      style={{ color: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {order?.billDate ? formatDate(order.billDate) : "-"}
                  </TableCell>
                  <TableCell>{order?.delivery_type}</TableCell>
                  <TableCell>{order?.tableNumber}</TableCell>
                  <TableCell>${Number(order?.totalBill)?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      startIcon={<Visibility />}
                      onClick={() => handleViewOrder(order)}
                    >
                      View
                    </Button>
                    {order.status === "Paid" ? (
                      <></>
                    ) : (
                      <Button
                        startIcon={<Payment />}
                        onClick={() => (
                          setPayOrder(order), setIsPaymentModalOpen(true)
                        )}
                      >
                        Pay
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : (
        <>Orders are not available</>
      )}
      <Modal open={!!selectedOrder} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
          }}
        >
          {selectedOrder && (
            <>
              <div className="printable-content">
                <Typography variant="h4">Order Details</Typography>
                <Typography>Order ID: {selectedOrder.orderId}</Typography>
                <Typography>Items: {selectedOrder.items.join(", ")}</Typography>
                <Typography>Status: {selectedOrder.status}</Typography>
                <Typography>
                  Bill Date: {formatDate(selectedOrder.billDate)}
                </Typography>
                <Typography>
                  Table Number: {selectedOrder.tableNumber}
                </Typography>
                <Typography>GST: {selectedOrder.GST}</Typography>
                {selectedOrder.discount && (
                  <Typography>
                    Discount: {Number(selectedOrder.discount).toFixed(2)}
                  </Typography>
                )}
                {selectedOrder.deliveryCharge &&
                  <Typography>
                    Delivery Charge : {selectedOrder.deliveryCharge}
                  </Typography>
                }
                <Typography variant="h6">Item Wise Bill</Typography>
                {selectedOrder.orderItems.map((item) => (
                  <Typography key={item._id} variant="body1">
                    {item.foodName}: ₹{item.finalPrice}
                  </Typography>
                ))}
                <Typography variant="h6">Total Bill: ${Number(selectedOrder.totalBill).toFixed(2)}</Typography>
              </div>
              {selectedOrder.status === "Paid" && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => window.print()}
                >
                  Print Receipt
                </Button>
              )}
            </>
          )}
          <Button onClick={handleCloseModal}>Close</Button>
        </Box>
      </Modal>
      <PaymentModal
        open={isPaymentModalOpen}
        handleClose={handleClosePaymentModal}
        onSubmitOrderPayment={updateOrder}
      />
    </>
  );
};

export default memo(OrdersTable);
