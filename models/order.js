var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
  items: [],
  total: Number,
  date: { type: Date, default: Date.now },
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    email: String,
    name: String,
    address: String,
    fullAddress: String,
  },
  paymentMode: String,
  isDelivered: Boolean,
  discountApplied: Number,
  cartTotal: Number,
});

module.exports = mongoose.model("Order", orderSchema);
