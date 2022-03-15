const geolib = require("geolib");
const axios = require("axios");

const express = require('express');
const {isDeliveryAgentLoggedIn} = require('../middleware/authentication');
const deliveryRouter = express.Router(); 

const User = require("../models/user");
const FoodItem = require("../models/foodItem");
const Order = require("../models/order");

// Implemetation of Genetic algorithm : Ordered Crossover
var NO_OF_CHILDREN = 0;
var N = 0;
var CITIES = [];
var ADDRESS = [];
var CORDINATES = [];
var GENE_POOL = [];
var PARENTS = [];

function create_initial_population() {
	for (var i = 0; i < NO_OF_CHILDREN; i++) {
		var tour = [];
		for (var j = 0; j < N; j++) tour[j] = j;
		tour.sort(() => Math.random() - 0.5);
		while (PARENTS.includes(tour)) tour.sort(() => Math.random() - 0.5);
		PARENTS.push(tour);
		GENE_POOL.push(tour);
	}
}

function calculate_fitness(arr) {
	var sum = 0;
	for (var i = 1; i < arr.length; i++)
		sum =
			sum +
			geolib.getDistance(
				CORDINATES[arr[i]],
				CORDINATES[arr[i - 1]],
				0.01,
			);
	sum =
		sum +
		geolib.getDistance(
			CORDINATES[0],
			CORDINATES[arr[arr.length - 1]],
			0.01,
		);
	return sum;
}

function select_best_genes() {
	var pq = [];
	for (var i = 0; i < GENE_POOL.length; i++)
		pq[i] = [calculate_fitness(GENE_POOL[i]), i];
	pq.sort(function (a, b) {
		if (a[0] < b[0]) return -1;
		else if (a[0] > b[0]) return 1;
		return 0;
	});
	for (var i = 0; i < NO_OF_CHILDREN; i++) PARENTS[i] = GENE_POOL[pq[i][1]];
	GENE_POOL = [];
	for (var i = 0; i < NO_OF_CHILDREN; i++) GENE_POOL[i] = PARENTS[i];
}

function getChild(p1, p2, l) {
	let c1 = [],
		c2 = [];
	for (var i = 0; i < N; i++) {
		c1[i] = -1;
		c2[i] = -1;
	}
	let start = Math.floor(N / 2) - 1;
	for (var i = start; i <= start + l; i++) {
		c1[i] = p1[i];
		c2[i] = p2[i];
	}
	var temp = [];
	for (var i = 0; i < N; i++) if (!c1.includes(p2[i])) temp.push(p2[i]);
	let index = 0;
	for (var i = 0; i < N; i++) if (c1[i] == -1) c1[i] = temp[index++];
	temp = [];
	for (var i = 0; i < N; i++) if (!c2.includes(p1[i])) temp.push(p1[i]);
	index = 0;
	for (var i = 0; i < N; i++) if (c2[i] == -1) c2[i] = temp[index++];

	return [c1, c2];
}

function crossover() {
	const len = Math.log2(N);
	offsprings = [];
	for (var i = 0; i < NO_OF_CHILDREN; i++) {
		for (var j = 0; j < NO_OF_CHILDREN; j++) {
			if (i != j) {
				let children = getChild(PARENTS[i], PARENTS[j], len);

				GENE_POOL.push(children[0]);
				GENE_POOL.push(children[1]);
			}
		}
	}
}

function mutation() {
	for (var i = 0; i < Math.floor(Math.log2(NO_OF_CHILDREN)); i++) {
		for (var j = 0; j < 2; j++) {
			let index = Math.floor(Math.random() * NO_OF_CHILDREN);
			let el1 = Math.floor(Math.random() * N);
			let el2 = Math.floor(Math.random() * N);
			while (el2 == el1) el2 = Math.floor(Math.random() * N);
			let x = GENE_POOL[index][el1];
			GENE_POOL[index][el1] = GENE_POOL[index][el2];
			GENE_POOL[index][el2] = x;
		}
	}
}

function genetic_TSP() {
	create_initial_population();
	let iterations = 0;
	let limit = N ** (5 / 2);
	while (iterations < limit) {
		select_best_genes();
		crossover();
		if (iterations % 20 == 0) mutation();
		iterations++;
	}
	select_best_genes();
	return [PARENTS[0], calculate_fitness(PARENTS[0])];
}

const getAdd = async (add) => {
	try {
		return await axios.get(
			"https://api.mapbox.com/geocoding/v5/mapbox.places/" +
				add +
				".json?access_token=" + process.env.ACCESS_TOKEN_MAPBOX,
		);
	} catch (error) {
		console.error(error);
	}
};

const _addressToLatLng = async (address) => {
	const resp = await getAdd(address);
	if (resp.data) {
		var lng = resp["data"]["features"][0].geometry.coordinates[0];
		var lat = resp["data"]["features"][0].geometry.coordinates[1];

		return { longitude: lng, latitude: lat };
	}
};

//=============================== ROUTES ===============================


deliveryRouter.get("/tsp/:deliveryNo", isDeliveryAgentLoggedIn ,async function (req, res) {
	var currdt = Date.now();
	Order.find({ isDelivered: false }, async function (err, allOrders) {
		if (err) console.log(err);
		else {
			var map = {};
			var schedule = [];
			for (var i = 0; i < allOrders.length; i++) {
				var currdt = allOrders[i].date;
				var temp = [];
				temp.push(allOrders[i]);
				for (var j = i + 1; j < allOrders.length; j++) {
					var diff = allOrders[j].date - currdt;
					diff = diff / 1000;
					if (diff <= 1200) {
						i++;
						temp.push(allOrders[j]);
					} else break;
				}
				schedule.push(temp);
			}
			var allOrders = schedule[req.params.deliveryNo];

			NO_OF_CHILDREN = 0;
			N = 0;
			CITIES = [];
			ADDRESS = [];
			CORDINATES = [];
			GENE_POOL = [];
			PARENTS = [];
			N = allOrders.length + 1;
			NO_OF_CHILDREN = (3 * N) / 2;
			var i = 0;
			for (i = 0; i < allOrders.length; i++) {
				ADDRESS.push(allOrders[i].user.address);
				CITIES.push(i);
				var x = await _addressToLatLng(allOrders[i].user.address);
				CORDINATES.push(x);
			}
			ADDRESS.push("Mahavir Nagar, Borivali west, Mumbai");
			CORDINATES.push({ longitude: 72.84167, latitude: 19.21333 });
			CITIES.push(i);
			var bestTour;
			var minCost = 100000000;

			for (var i = 0; i < 10; i++) {
				var x = genetic_TSP();
				var tour = x[0];
				var cost = x[1];

				console.log(tour, cost);

				if (cost < minCost) {
					minCost = cost;
					bestTour = tour.slice();
				}
			}
			console.log(bestTour, calculate_fitness(bestTour));
			i = 0;
			for (i = 0; i < N; i++) if (bestTour[i] == N - 1) break;

			var finalTour = [];
			i = (i + 1) % N;
			for (var j = 0; j < N - 1; j++) {
				finalTour[j] = bestTour[i];
				i = (i + 1) % N;
			}
			bestTour = finalTour;
			let cords = [];
			let location = [];
			for (var i = 0; i < N - 1; i++) {
				
				location.push(ADDRESS[bestTour[i]]);
				cords.push([
					CORDINATES[bestTour[i]].longitude,
					CORDINATES[bestTour[i]].latitude,
				]);
			}
			res.render("tsp.ejs", {
				cords: cords,
				order: location,
				schedule: allOrders,
				tspno: req.params.deliveryNo,
			});
		}
	}).sort({ date: 1 });
});

deliveryRouter.get("/", isDeliveryAgentLoggedIn , function (req, res) {
	Order.find({ isDelivered: false }, function (err, allOrders) {
		if (err) console.log(err);
		else {
			var map = {};
			var schedule = [];
			for (var i = 0; i < allOrders.length; i++) {
				var currdt = allOrders[i].date;
				var temp = [];
				temp.push(allOrders[i]);
				for (var j = i + 1; j < allOrders.length; j++) {
					var diff = allOrders[j].date - currdt;
					diff = diff / 1000;
					if (diff <= 1200) {
						i++;
						temp.push(allOrders[j]);
					} else break;
				}
				schedule.push(temp);
			}
			var cost = [];
			for (var i = 0; i < schedule.length; i++) {
				var sum = 0;
				for (var j = 0; j < schedule[i].length; j++)
					sum = sum + schedule[i][j].total;
				cost.push(sum);
			}
			for (var k = 0; k < schedule.length; k++) {
				for (var j = 0; j < schedule[k].length; j++)
					console.log(schedule[k][j]["total"]);
				console.log();
			}

			res.render("delivery", { schedule: schedule, cost: cost });
		}
	}).sort({ date: 1 });
});

deliveryRouter.get("/changeDeliveryStatus/:Orderid", function (req, res) {
	Order.findById(req.params.Orderid, function (err, foundOrder) {
		if (err) {
			console.log(err);
			res.send({ error: err });
		} else {
			foundOrder["isDelivered"] = true;
			foundOrder.save();
			res.send({ status: "OK" });
		}
	});
});

module.exports = deliveryRouter;