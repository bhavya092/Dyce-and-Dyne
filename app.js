require("dotenv").config();

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



const User = require("./models/user");



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

var userRouter = require('./routes/auth.routes');



// HOME PAGE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

//-----------------------------AUTH--------------------------------------
app.use('/auth', userRouter);




//========================== RUN ==================================

var port = process.env.PORT || 3000
app.listen(port, () => {
	console.log("Serving on port "+port);
});
