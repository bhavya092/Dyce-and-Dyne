const express = require('express');
const {isLoggedIn, isDeliveryAgentLoggedIn} = require('../middleware/authentication');
const userRouter = express.Router(); 

const passport = require("passport");
var LocalStrategy = require("passport-local");
const User = require("../models/user");
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Show Login Page
userRouter.get("/login", function (req, res) {
	res.render("login");
});


//Login User using Passport js
userRouter.post("/login", function (req, res, next) {
	passport.authenticate(
		"local",
		{
			successRedirect: "/",
			failureRedirect: "/auth/login",
			failureFlash: true,
			succssFlash: true,
		},
		function (err, user) {
			if (err) {
				return next(err);
			}
			if (!user) {
				req.flash("error", "Password or Email does not match");
				return res.redirect("/auth/login");
			}
			if (user.isCustomer == false) {
				req.flash("error", "Please login via Delivery Agent Portal");
				return res.redirect("/auth/deliverylogin");
			}
			req.logIn(user, function (err) {
				if (err) {
					return next(err);
				}
				req.flash("success", "Welcome back " + user.name);
				return res.redirect("/");
			});
		},
	)(req, res, next);
});

//Show Signup Page
userRouter.get("/signup", function (req, res) {
	res.render("signup");
});


//Authenticate User first time
userRouter.post("/signup", function (req, res) {
	console.log(req.body);
	var newUser = new User({
		username: req.body.username,
		name: req.body.name,
		phone: req.body.phone,
		isCustomer: true,
	});
	var inputAddress = `${req.body.flatwing}\n${req.body.locality}\n${req.body.pincode}\n${req.body.city}`;
	var addressObj = {
		fullAddress: inputAddress,
		flatwing: req.body.flatwing,
		locality: req.body.locality,
		pincode: req.body.pincode,
		city: req.body.city,
	};
	newUser.addresses.push(addressObj);
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			console.log(err);
			if (
				err.message ==
				"A user with the given username is already registered"
			) {
				req.flash(
					"error",
					"A user with the given Email Id is already registered",
				);
				return res.redirect("/auth/signup");
			} else {
				req.flash(
					"error",
					"A user with the given Phone No. is already registered",
				);
				return res.redirect("/auth/signup");
			}
		} else {
			passport.authenticate("local")(req, res, function () {
				req.flash("success", "Welcome to Dyce & Dyne " + user.name);
				res.redirect("/");
			});
		}
	});
});

//Show login for Delivery agents
userRouter.get("/deliverylogin", function (req, res) {
	res.render("deliverylogin");
});

// Carry out login for delivery agents
userRouter.post("/deliverylogin", function (req, res, next) {
	passport.authenticate(
		"local",
		{
			successRedirect: "/",
			failureRedirect: "/auth/deliverylogin",
			failureFlash: true,
			succssFlash: true,
		},
		function (err, user) {
	
			if (err) {
				return next(err);
			}
			if (!user) {
				req.flash("error", "Password or Email does not match");
				return res.redirect("/auth/deliverylogin");
			}
			if (user.isCustomer == true) {
				req.flash("error", "Please login via Customer Portal");
				return res.redirect("/auth/login");
			}
			req.logIn(user, function (err) {
				if (err) {
					return next(err);
				}
				req.flash("success", "Welcome back " + user.name);
				return res.redirect("/delivery");
			});
		},
	)(req, res, next);
});


// Show Signup for delivery agents
userRouter.get("/deliverysignup", function (req, res) {
	res.render("deliverysignup");
});


// Signup delivery agents
userRouter.post("/deliverysignup", function (req, res) {
	var newDeliveryAgent = new User({
		username: req.body.username,
		name: req.body.name,
		phone: req.body.phone,
		isCustomer: false,
	});
	var inputAddress = `${req.body.flatwing}\n${req.body.locality}\n${req.body.pincode}\n${req.body.city}`;
	var addressObj = {
		fullAddress: inputAddress,
		flatwing: req.body.flatwing,
		locality: req.body.locality,
		pincode: req.body.pincode,
		city: req.body.city,
	};
	newDeliveryAgent.addresses.push(addressObj);
	User.register(newDeliveryAgent, req.body.password, function (err, user) {
		if (err) {
			console.log(err);
			if (
				err.message ==
				"A user with the given username is already registered"
			) {
				req.flash(
					"error",
					"A delivery agent with the given Email Id is already registered",
				);
				return res.redirect("auth/deliverysignup");
			} else {
				req.flash(
					"error",
					"A delivery agent with the given Phone No. is already registered",
				);
				return res.redirect("/auth/deliverysignup");
			}
		} else {
			passport.authenticate("local")(req, res, function () {
				req.flash("success", "Welcome to Dyce & Dyne " + user.name);
				res.redirect("/delivery");
			});
		}
	});
});


//Logout any users.
userRouter.get("/logout", function (req, res) {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/");
});

module.exports = userRouter