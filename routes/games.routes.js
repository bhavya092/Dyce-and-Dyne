const express = require('express');
const {isLoggedIn, isDeliveryAgentLoggedIn} = require('../middleware/authentication');
const gamesRouter = express.Router(); 


gamesRouter.get('/',isLoggedIn,function(req,res){
	res.render("games");
})

gamesRouter.get("/8puzzle", isLoggedIn, function (req, res) {
	res.render("8puzzle");
});

gamesRouter.get("/connect4", isLoggedIn, function (req, res) {
	res.render("connect4");
});

module.exports = gamesRouter;