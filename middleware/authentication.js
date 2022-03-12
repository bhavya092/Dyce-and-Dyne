function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash("error", "You need to be logged in to do that.");
		res.redirect("/auth/login");
	}
}

function isDeliveryAgentLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		if (!req.user.isCustomer) {
			return next();
		} else {
			req.flash(
				"error",
				"This Page can only be accessed by a Delivery Agent",
			);
			res.redirect("/auth/deliverylogin");
		}
	} else {
		req.flash("error", "You need to be logged in to do that.");
		res.redirect("/auth/deliverylogin");
	}
}

module.exports = {
    isLoggedIn,
    isDeliveryAgentLoggedIn
};