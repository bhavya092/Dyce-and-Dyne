const express = require('express');
const {isLoggedIn, isDeliveryAgentLoggedIn} = require('../middleware/authentication');
const cartRouter = express.Router(); 
const User = require("../models/user");
const FoodItem = require("../models/foodItem");
const Order = require("../models/order");

cartRouter.get("/", isLoggedIn, (req, res) => {
	User.findById(req.user._id, async function (err, founduser) {
		if (err) {
			console.log(err);
			return res.redirect("back");
		} else {
			founduser.cart.amountPayable = Math.max(
				0,
				founduser.cart.total -
					Math.floor(founduser.wallet / 100),
			);
			founduser.cart.discountApplied = Math.min(
				founduser.cart.total,
				Math.floor(founduser.wallet / 100),
			);
			founduser.markModified('cart');
			await founduser.save()
			cart = founduser.cart.foodItems;
			
			res.render("cart", { items: cart,wallet:founduser.wallet, total: founduser.cart.total,amountPayable : founduser.cart.amountPayable,discountApplied : founduser.cart.discountApplied });
		}
	});
});

cartRouter.post("/:id", isLoggedIn, function (req, res) {
	User.findById(req.user._id, function (err, founduser) {
		if (err) {
			console.log(err);
			return res.redirect("back");
		} else {
			FoodItem.findById(req.params.id, function (err, foundItem) {
				if (err) {
					console.log(err);
					return res.redirect("back");
				} else {
					if (founduser.cart.foodItems.length == 0) {
						founduser.cart.total = foundItem.cost;
					} else {
						founduser.cart.total =
							founduser.cart.total + foundItem.cost;
					}
					var f = 0;
					var i = 0;
					for (i = 0; i < founduser.cart.foodItems.length; i++) {
						if (
							founduser.cart.foodItems[i]._id.toString() ==
							req.params.id.toString()
						) {
							f = 1;
							
							break;
						}
					}
					if (f == 0) {
						founduser.cart.foodItems.push(foundItem);
						founduser.cart.amountPayable = Math.max(
							0,
							founduser.cart.total -
								Math.floor(founduser.wallet / 100),
						);
						founduser.cart.discountApplied = Math.min(
							founduser.cart.total,
							Math.floor(founduser.wallet / 100),
						);
						founduser.save();
					} else {
						
						var q = founduser.cart.foodItems[i].qty;
						
						
						founduser.cart.foodItems[i].qty = q + 1;
						
						founduser.cart.amountPayable = Math.max(
							0,
							founduser.cart.total -
								Math.floor(founduser.wallet / 100),
						);
						founduser.cart.discountApplied = Math.min(
							founduser.cart.total,
							Math.floor(founduser.wallet / 100),
						);
						founduser.markModified("cart");
						founduser.save();
						
					}

					//   founduser.wallet += 160;

					req.flash("success", foundItem.title + " added to cart.");
					return res.redirect("/menu#" + foundItem.category);
				}
			});
		}
	});
});

cartRouter.delete("/decrement/:id", isLoggedIn, function (req, res) {
	User.findById(req.user._id, function (err, founduser) {
		if (err) {
			console.log(err);
			return res.redirect("back");
		} else {
			FoodItem.findById(req.params.id, function (err, foundItem) {
				if (err) {
					console.log(err);
					return res.redirect("back");
				} else {
					var index = -1;
					
					for (var i = 0; i < founduser.cart.foodItems.length; i++) {
						if (
							founduser.cart.foodItems[i]._id.toString() ==
							foundItem._id.toString()
						) {
							index = i;
						}
					}

					if (index !== -1) {
						founduser.cart.total =
							founduser.cart.total -
							founduser.cart.foodItems[index].cost;
						if (founduser.cart.foodItems[index].qty > 1) {
							founduser.cart.foodItems[index].qty -= 1;
							req.flash(
								"success",
								foundItem.title + "'s quantity decreased by 1 .",
							);
						} else {
							founduser.cart.foodItems.splice(index, 1);
							req.flash(
								"success",
								foundItem.title + " removed from cart.",
							);
						}
					}
					founduser.cart.amountPayable = Math.max(
						0,
						founduser.cart.total -
							Math.floor(founduser.wallet / 100),
					);
					founduser.cart.discountApplied = Math.min(
						founduser.cart.total,
						Math.floor(founduser.wallet / 100),
					);
					founduser.markModified('cart');
					founduser.save();
					// req.flash(
					// 	"success",
					// 	foundItem.title + " removed from cart.",
					// );
					return res.redirect("/menu#" + foundItem.category);
				}
			});
		}
	});
});

cartRouter.delete("/:id", isLoggedIn, function (req, res) {
	User.findById(req.user._id, function (err, founduser) {
		if (err) {
			console.log(err);
			return res.redirect("back");
		} else {
			FoodItem.findById(req.params.id, function (err, foundItem) {
				if (err) {
					console.log(err);
					return res.redirect("back");
				} else {
					var index = -1;
					
					for (var i = 0; i < founduser.cart.foodItems.length; i++) {
						if (
							founduser.cart.foodItems[i]._id.toString() ==
							foundItem._id.toString()
						) {
							index = i;
						}
					}

					if (index !== -1) {
						founduser.cart.total =
							founduser.cart.total -
							(founduser.cart.foodItems[index].cost*founduser.cart.foodItems[index].qty);
							founduser.cart.foodItems.splice(index, 1);
							req.flash(
								"success",
								foundItem.title + " removed from cart.",
							);
						
					}
					founduser.cart.amountPayable = Math.max(
						0,
						founduser.cart.total -
							Math.floor(founduser.wallet / 100),
					);
					founduser.cart.discountApplied = Math.min(
						founduser.cart.total,
						Math.floor(founduser.wallet / 100),
					);
					founduser.markModified('cart');
					founduser.save();
					// req.flash(
					// 	"success",
					// 	foundItem.title + " removed from cart.",
					// );
					return res.redirect("/cart");
				}
			});
		}
	});
});

module.exports = cartRouter;
