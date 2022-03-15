const express = require('express');
const {isLoggedIn, isDeliveryAgentLoggedIn} = require('../middleware/authentication');
const gamesRouter = express.Router(); 

//Show games page
gamesRouter.get('/',isLoggedIn,function(req,res){
	res.render("games");
})

// Redirect to 8puzzle

gamesRouter.get("/8puzzle", isLoggedIn, function (req, res) {
	res.render("8puzzle");
});

//Redirect to Connect4
gamesRouter.get("/connect4", isLoggedIn, function (req, res) {
	res.render("connect4");
});

module.exports = gamesRouter;