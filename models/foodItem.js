var mongoose = require('mongoose');

var foodItemSchema = new mongoose.Schema({
    title: String,
    category: String,
    image: String,
    cost: Number,
    desc: String,
    isVeg: Boolean,
    qty: { type: Number, default: 1 },
})

module.exports = mongoose.model("FoodItem", foodItemSchema);