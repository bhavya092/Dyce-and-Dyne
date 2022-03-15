require("dotenv").config();

// Imports 
const express = require("express");
const app = express();
const passport = require("passport");
const path = require("path");
const mongoose = require("mongoose");
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");
const methodOverride = require("method-override");
var seedDB = require("./seeds");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const cors = require("cors");
app.use(cors());

const {isLoggedIn, isDeliveryAgentLoggedIn} = require('./middleware/authentication.js');


//Razorpay Instance
const instance = new Razorpay({
	key_id: process.env.KEY_ID,
	key_secret: process.env.KEY_SECRET,
});


//Schema Initiations
const User = require("./models/user");
const FoodItem = require("./models/foodItem");
const Order = require("./models/order");

//Mongoose Connection
mongoose.connect( process.env.MONGO_URI,
	{
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	},
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

app.use(
	require("express-session")({
		secret: "Shhhh Secret!",
		resave: false,
		saveUninitialized: false,
	}),
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(express.static(__dirname + "/public"));


//Routers
var userRouter = require('./routes/auth.routes');
var cartRouter = require('./routes/cart.routes');
var deliveryRouter = require('./routes/delivery.routes');
var gamesRouter = require('./routes/games.routes');


// Home Page
app.get("/", (req, res) => {
	var recItems = [
		{
		"_id": "617bbe86b88aa0244466d9be",
		"title": "Paneer Chilli Dry",
		"category": "starters",
		"image": "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/i9z0ydh86tdfxcpvqtck",
		"cost": 219,
		"desc": "Chilly paneer is indo Chinese starter or Appetizer garlic",
		"isVeg": true,
	},{
		"_id": "617bbe86b88aa0244466d9d1",
		"title": "American Club Sandwich",
		"category": "sandwich",
		"image": "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2013/2/13/0/FN_FNK-Veggie-Lovers-Club-Sandwich_s4x3.jpg.rend.hgtvcom.616.462.suffix/1371614457375.jpeg",
		"cost": 290,
		"desc": "Cottage cheese, mayo, and corn coleslaw salad.",
		"isVeg": true,
	},{
    	"_id":  "617bbe86b88aa0244466d9d4",
		"title": "Exotica Pizza",
		"category": "Italian",
		"image": "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/afxqbzk9aqbnhbbwcaig",
		"cost": 250,
		"desc": "Scrumptious pizza filled with exotic vegetables, topped with eons of cheese",
		"isVeg": true,
	},{
    "_id": "617bbe86b88aa0244466d9dd",
    "title": "Mumbai Tadka Grilled Pav Bhaji",
    "category": "PavBhaji",
    "image": "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/zuyb0ntyznxwu8vvclzx",
    "cost": 240,
    "desc": "Maska masala tadka bhaji + 2 grilled pav + 1 papad",
	"isVeg": true,
}
	]
	res.render("index",{topItems : recItems});
});

//Renders the list of all menu items
app.get("/menu", (req, res) => {
	FoodItem.find(function (err, allItems) {
		if (err) {
			console.log(err);
			res.redirect("/");
		} else {
			res.render("menu", { allItems: allItems });
		}
	});
});


//Show User profile
app.get("/profile", isLoggedIn, function (req, res) {
	User.findById(req.user._id, function (err, foundUser) {
		if (err) {
			console.log(err);
			return res.redirect("back");
		} else {
			var orders = foundUser.orders;
			orders.sort(function (a, b) {
				return new Date(b.date) - new Date(a.date);
			});

			res.render("profile", { orders: orders });
		}
	});
});


//Add points to wallet
app.post("/addWalletPoints", isLoggedIn, function (req, res) {
	User.findById(req.user._id, function (err, foundUser) {
		if (err) {
			console.log(err);
			return res.redirect("back");
		} else {
			foundUser.wallet += req.body.points;
			foundUser.cart.amountPayable = Math.max(
				0,
				foundUser.cart.total -
					Math.floor(foundUser.wallet / 100),
			);
			foundUser.cart.discountApplied = Math.min(
				foundUser.cart.total,
				Math.floor(foundUser.wallet / 100),
			);
			foundUser.save();
			res.redirect(req.body.game);
		}
	});
});

//Order food via COD
app.get("/ordercod", isLoggedIn, function (req, res) {
	cart = req.user.cart.foodItems.sort(function (a, b) {
		var nameA = a.title.toUpperCase();
		var nameB = b.title.toUpperCase();
		if (nameA < nameB) {
			return;
		}
		if (nameA > nameB) {
			return 1;
		}
		return 0;
	});
	res.render("ordercod", {
		items: cart,
		total: req.user.cart.total,
	});
});

app.get("/ordercard", isLoggedIn, function (req, res) {
	cart = req.user.cart.foodItems.sort(function (a, b) {
		var nameA = a.title.toUpperCase();
		var nameB = b.title.toUpperCase();
		if (nameA < nameB) {
			return;
		}
		if (nameA > nameB) {
			return 1;
		}
		return 0;
	});
	res.render("ordercard", {
		items: cart,
		total: req.user.cart.total,
		key: process.env.KEY_ID,
	});
});


//Razorpay Payment Routes
app.post("/api/payment/order", (req, res) => {
	params = req.body;
	instance.orders
		.create(params)
		.then((data) => {
			res.send({ sub: data, status: "success" });
		})
		.catch((error) => {
			res.send({ sub: error, status: "failed" });
		});
});

app.post("/api/payment/verify", (req, res) => {
	body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

	var expectedSignature = crypto
		.createHmac("sha256", process.env.KEY_SECRET)
		.update(body.toString())
		.digest("hex");
	console.log("sig" + req.body.razorpay_signature);
	console.log("sig" + expectedSignature);
	var response = { status: "failure" };
	if (expectedSignature === req.body.razorpay_signature)
		response = { status: "success" };
	res.send(response);
});


//Add Order to database
app.post("/afterOrderPlaced", (req, res) => {
	if (req.isAuthenticated()) {
		User.findById(req.user._id, (err, founduser) => {
			if (err) console.log(err);
			else {
				var inputAddress = `${req.body.flatwing}\n${req.body.locality}\n${req.body.pincode}\n${req.body.city}`;
				var new_order = new Order({
					items: req.user.cart.foodItems,
					total: req.user.cart.amountPayable,
					user: {
						id: req.user._id,
						email: req.user.username,
						name: req.body.name,
						address: `${req.body.locality}, ${req.body.city}`,
						fullAddress: inputAddress,
					},
					paymentMode: req.body.paymentMode,
					isDelivered: false,
					discountApplied: founduser.cart.discountApplied,
					cartTotal: req.user.cart.total,
				});
				Order.create(new_order, function (err, order) {
					if (err) {
						console.log(err);
					} else {
						
						var f = 0;
						founduser.addresses.forEach((address) => {
							if (address.fullAddress == inputAddress) {
								
								f = 1;
							}
						});
						if (f == 0) {
			
							var addressObj = {
								fullAddress: inputAddress,
								flatwing: req.body.flatwing,
								locality: req.body.locality,
								pincode: req.body.pincode,
								city: req.body.city,
							};
							founduser.addresses.push(addressObj);
						}
						founduser.orders.push(order);
						founduser.wallet =
							founduser.wallet -
							founduser.cart.discountApplied * 100;
						founduser.cart.foodItems = [];
						founduser.cart.total = 0;
						founduser.cart.amountPayable = 0;
						founduser.cart.discountApplied = 0;
						founduser.save();
						console.log(new_order._id);
						res.send({ status: "OK", orderid: new_order._id });
					}
				});
			}
		});
	} else {
		res.send({ error: "You need to be logged in first" });
	}
});

//Show status of the order.
app.get("/orderconfirmed/:orderID", isLoggedIn, (req, res) => {
	Order.find({ _id: req.params.orderID }, (err, foundOrder) => {
		if (err) console.log(err);
		else {
			console.log(foundOrder);
			var id = foundOrder[0]._id.toString().substring(0, 8);
			res.render("orderconfirmed", { order: foundOrder[0], orderid: id });
		}
	});
});



// Routers
app.use('/auth', userRouter);
app.use('/cart', cartRouter);
app.use('/delivery', deliveryRouter);
app.use('/games', gamesRouter);





//========================== RUN ==================================

var port = process.env.PORT || 3000
app.listen(port, () => {
	console.log("Serving on port "+port);
});
