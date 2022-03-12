var AI_moves = 0;
var player_moves = 0;
var boardGlobal = null;
var somelist = [];
var savedConfigurations = [
	[4, 1, 9, 7, 6, 5, 2, 3, 8],
	[4, 3, 6, 1, 7, 5, 8, 2, 9],
	[1, 2, 8, 5, 6, 4, 3, 7, 9],
	[2, 6, 8, 4, 1, 7, 9, 3, 5],
	[7, 6, 9, 2, 3, 1, 5, 4, 8],
	[9, 3, 1, 6, 7, 8, 4, 2, 5],
];
var movesButton = document.getElementById("moves");

// Swap the classes of tiles 
function swapTiles(cell1, cell2) {
	movesButton.innerHTML = "Moves: " + String(player_moves);
	var temp = document.getElementById(cell1).className;
	document.getElementById(cell1).className =
		document.getElementById(cell2).className;
	document.getElementById(cell2).className = temp;

	// If player wins, calculate points earned and add it to users wallet.
	if (goalTest()) {
		var points = parseInt((AI_moves * 100) / player_moves);
		document.getElementById("winbutton").click();
		document.getElementById("modal-title").innerHTML =
			"Wuhooooo! You earned " + points + " points";
	}
}

// Count the number of inversions.
let checkInversion = (arr) => {
	let invCount = 0;
	for (let i = 0; i < arr.length; i++) {
		for (let j = i + 1; j < arr.length; j++) {
			if (arr[j] && arr[i] && arr[i] > arr[j]) {
				invCount++;
			}
		}
	}
	return invCount;
};


// Check if the board is solvable.
let isSolvable = (numberArr) => {
	let inversions = checkInversion(numberArr);
	if (inversions % 2 == 0) {
		return true;
	}
	return false;
};

function shuffle(boardArr) {
	//Use nested loops to access each cell of the 3x3 grid
	board = boardArr.slice();

	for (var row = 1; row <= 3; row++) {
		//For each row of the 3x3 grid
		for (var column = 1; column <= 3; column++) {
			//For each column in this row

			var row2 = Math.floor(Math.random() * 3 + 1); //Pick a random row from 1 to 3
			var column2 = Math.floor(Math.random() * 3 + 1); //Pick a random column from 1 to 3
			var a = (row - 1) * 3 + column;
			var b = (row2 - 1) * 3 + column2;

			swapTiles("cell" + row + column, "cell" + row2 + column2); //Swap the look & feel of both cells
			somelist.push([
				[row, column],
				[row2, column2],
			]);

			temp = board[a - 1];
			board[a - 1] = board[b - 1];
			board[b - 1] = temp;
		}
	}
	boardGlobal = board.slice();
	return board;
}

function goalTest() {
	// console.log(boardGlobal);
	return boardGlobal.toString() === "1,2,3,4,5,6,7,8,9";
}

function getSavedBoard() {
	boardGlobal =
		savedConfigurations[
			Math.floor(Math.random() * savedConfigurations.length)
		].slice();
	var k = 0;
	for (var i = 1; i <= 3; i++) {
		for (var j = 1; j <= 3; j++) {
			document.getElementById("cell" + i + j).className =
				"tile" + boardGlobal[k];
			k += 1;
		}
	}
}


// Get a new random board
// Currently not in use
function getNewBoard() {
	player_moves = 0;
	AI_moves = 0;
	movesButton.innerHTML = "Moves: 0";
	board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	newBoard = shuffle(board);
	while (!isSolvable(newBoard)) {
		newBoard = shuffle(newBoard);
	}

	console.log(newBoard);
	boardGlobal = newBoard.slice();

	AI_moves = solve8puzzle(newBoard);
	console.log(AI_moves);
	console.log(somelist);
}

// Get new game
// Currently not in use
async function getNewGame() {
	var loader = document.getElementById("container-loading");
	var game = document.getElementById("game");
	game.classList.add("displaynone");
	loader.classList.remove("displaynone");
	getSavedBoard();
	console.log(boardGlobal);
	var gameBoard = boardGlobal.slice();
	AI_moves = await solve8puzzle(gameBoard);
	loader.classList.add("displaynone");
	game.classList.remove("displaynone");
	console.log(AI_moves);
}

function clickTile(row, column) {
	var cell = document.getElementById("cell" + row + column);
	var tile = cell.className;
	if (tile != "tile9") {
		//Checking if white tile on the right
		if (column < 3) {
			if (
				document.getElementById("cell" + row + (column + 1))
					.className == "tile9"
			) {
				player_moves += 1;
				var a = (row - 1) * 3 + column;
				var b = (row - 1) * 3 + column + 1;

				temp = boardGlobal[a - 1];
				boardGlobal[a - 1] = boardGlobal[b - 1];
				boardGlobal[b - 1] = temp;
				swapTiles("cell" + row + column, "cell" + row + (column + 1));

				return;
			}
		}
		//Checking if white tile on the left
		if (column > 1) {
			if (
				document.getElementById("cell" + row + (column - 1))
					.className == "tile9"
			) {
				player_moves += 1;
				var a = (row - 1) * 3 + column;
				var b = (row - 1) * 3 + column - 1;

				temp = boardGlobal[a - 1];
				boardGlobal[a - 1] = boardGlobal[b - 1];
				boardGlobal[b - 1] = temp;
				swapTiles("cell" + row + column, "cell" + row + (column - 1));
				return;
			}
		}
		//Checking if white tile is above
		if (row > 1) {
			if (
				document.getElementById("cell" + (row - 1) + column)
					.className == "tile9"
			) {
				player_moves += 1;
				// player_moves += 1;
				var a = (row - 1) * 3 + column;
				var b = (row - 2) * 3 + column;

				temp = boardGlobal[a - 1];
				boardGlobal[a - 1] = boardGlobal[b - 1];
				boardGlobal[b - 1] = temp;
				swapTiles("cell" + row + column, "cell" + (row - 1) + column);
				return;
			}
		}
		//Checking if white tile is below
		if (row < 3) {
			if (
				document.getElementById("cell" + (row + 1) + column)
					.className == "tile9"
			) {
				player_moves += 1;
				// player_moves += 1;
				var a = (row - 1) * 3 + column;
				var b = row * 3 + column;

				temp = boardGlobal[a - 1];
				boardGlobal[a - 1] = boardGlobal[b - 1];
				boardGlobal[b - 1] = temp;
				swapTiles("cell" + row + column, "cell" + (row + 1) + column);
				return;
			}
		}
	}
}

// Add points to user's wallet.
function addWalletPoints(method) {
	var points = parseInt((AI_moves * 100) / player_moves);
	axios({
		method: "post",
		url: "/addWalletPoints",
		data: {
			points: points,
			game: "/games/8puzzle",
		},
	});
	alert("Points saved to your wallet !");
	if(method==1)
	
		location.href="/games";
	else if(method==2)
		location.href="/menu";	

}
getNewGame();
