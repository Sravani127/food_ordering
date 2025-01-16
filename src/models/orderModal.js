const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  billDate: {
    type: String,
  },
  items: {
    type: Array,
  },
  orderId: {
    type: String,
  },

  totalBill: {
    type: String,
  },
  tableNo: {
    type: String,
  },
  status: {
    type: String,
  },
  tableNumber: {
    type: String,
  },
  user_id: {
    type: String,
  },
  delivery_type: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  distance: {
    type: String,
  },
  GST: {
    type: String,
  },
  discount: {
    type: String,
  },
  deliveryCharge: {
    type: String
  },
  orderItems: {
    type: Array
  }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
