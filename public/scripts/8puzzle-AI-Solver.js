var goalState = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var goal = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
var seq = {
  1: (0, 0),
  2: (0, 1),
  3: (0, 2),
  4: (1, 0),
  5: (1, 1),
  6: (1, 2),
  7: (2, 0),
  8: (2, 1),
  9: (2, 2),
};

class BoardState {
  constructor(nums, parentMove, pos, moves, parent) {
    this.nums = nums.slice();
    this.board = [];
    while (nums.length) this.board.push(nums.splice(0, 3));
    this.parentMove = parentMove;
    this.pos = pos;
    this.moves = moves;
    this.parent = parent;
  }
  getString() {
    var text = this.nums.join(",");
    return text;
  }
  manhattan() {
    var board = this.board.slice();
    var dist = 0;
    const board2d0 = [];
    while (board.length) board2d0.push(board.splice(0, 3));
    var board2d = board2d0[0];

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (board2d[i][j] != 9) {
          var x = j + 1 + i * 3;
          if (board2d[i][j] != x) {
            var y = board2d[i][j];
            var a = parseInt(y / 3);
            var b = y % 3;
            dist += Math.abs(a - i) + Math.abs(b - j);
          }
        }
      }
    }

    return dist;
  }
  goalTest() {
    var board2d = this.board;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (board2d[i][j] != goal[i][j]) {
          return false;
        }
      }
    }
    return true;
  }
}

class PriorityQueueAStarFrontier {
  constructor() {
    this.frontier = [];
  }
  push(node) {
    this.frontier.push(node);
  }
  empty() {
    return this.frontier.length == 0;
  }
  remove() {
    if (!this.empty()) {
      var index = 0;
      var minVal = this.frontier[0].moves + this.frontier[0].manhattan();
      for (var i = 1; i < this.frontier.length; i++) {
        var temp = this.frontier[i].moves + this.frontier[i].manhattan();
        if (temp <= minVal) {
          minVal = temp;
          index = i;
        }
      }
      var node = this.frontier[index];
      this.frontier.splice(index, 1);
      return node;
    }
  }
}

class Solver {
  constructor(nums, pos) {
    this.nums = nums;
    this.initialState = new BoardState(nums, "NIL", pos, 0, null);
    this.path = [];
    this.closed = [];
    this.nodesTraversed = 0;
    this.open = new PriorityQueueAStarFrontier();
  }

  solve() {
    this.open.push(this.initialState);
    this.closed.push(this.initialState.getString());
    var boardList = "";

    while (this.open.empty() == false) {
      var state = this.open.remove();

      if (state.goalTest() == true) {
        var minMoves = this.backtrack(state);
        return minMoves;
      }

      var i = state.pos[0];
      var j = state.pos[1];
      if (i > 0 && i < 3 && j >= 0 && j < 3) {
        var newState = this.up(state);
        boardList = newState.getString();

        if (this.closed.includes(boardList) == false) {
          this.open.push(newState);
          this.closed.push(boardList);
        }
      }
      if (i >= 0 && i < 2 && j >= 0 && j < 3) {
        var newState = this.down(state);
        boardList = newState.getString();

        if (this.closed.includes(boardList) == false) {
          this.open.push(newState);
          this.closed.push(boardList);
        }
      }
      if (i >= 0 && i < 3 && j > 0 && j < 3) {
        var newState = this.left(state);
        boardList = newState.getString();

        if (this.closed.includes(boardList) == false) {
          this.open.push(newState);
          this.closed.push(boardList);
        }
      }
      if (i >= 0 && i < 3 && j >= 0 && j < 2) {
        var newState = this.right(state);
        boardList = newState.getString();

        if (this.closed.includes(boardList) == false) {
          this.open.push(newState);
          this.closed.push(boardList);
        }
      }
    }
  }
  up(state) {
    var len = state.board.length;
    var board = new Array(len); // boost in Safari

    for (var i = 0; i < len; ++i) board[i] = state.board[i].slice(0);
    var a = state.pos[0];
    var b = state.pos[1];
    var temp = board[a][b];
    board[a][b] = board[a - 1][b];
    board[a - 1][b] = temp;
    var newState = new BoardState(
      flatten(board),
      "Up",
      [state.pos[0] - 1, state.pos[1]],
      state.moves + 1,
      state
    );
    return newState;
  }
  down(state) {
    var len = state.board.length;
    var board = new Array(len); // boost in Safari

    for (var i = 0; i < len; ++i) board[i] = state.board[i].slice(0);
    var a = state.pos[0];
    var b = state.pos[1];
    var temp = board[a][b];
    board[a][b] = board[a + 1][b];
    board[a + 1][b] = temp;
    var newState = new BoardState(
      flatten(board),
      "Down",
      [state.pos[0] + 1, state.pos[1]],
      state.moves + 1,
      state
    );
    return newState;
  }
  left(state) {
    var len = state.board.length;
    var board = new Array(len); // boost in Safari

    for (var i = 0; i < len; ++i) board[i] = state.board[i].slice(0);
    var a = state.pos[0];
    var b = state.pos[1];
    var temp = board[a][b];
    board[a][b] = board[a][b - 1];
    board[a][b - 1] = temp;
    var newState = new BoardState(
      flatten(board),
      "Left",
      [state.pos[0], state.pos[1] - 1],
      state.moves + 1,
      state
    );
    return newState;
  }
  right(state) {
    var len = state.board.length;
    var board = new Array(len); // boost in Safari

    for (var i = 0; i < len; ++i) board[i] = state.board[i].slice(0);
    var a = state.pos[0];
    var b = state.pos[1];
    var temp = board[a][b];
    board[a][b] = board[a][b + 1];
    board[a][b + 1] = temp;
    var newState = new BoardState(
      flatten(board),
      "Right",
      [state.pos[0], state.pos[1] + 1],
      state.moves + 1,
      state
    );
    return newState;
  }
  backtrack(state) {
    var node = state;
    var moves = 0;
    while (node.parent != null) {
      moves += 1;
      this.path.push(node.parentMove);
      node = node.parent;
    }
    console.log(this.path);
    return moves;
  }
}

function solve8puzzle(nums) {
  var a = -1;
  var b = -1;
  for (var i = 0; i < 9; i++) {
    if (nums[i] == 9) {
      a = parseInt(i / 3);
      b = i % 3;
      break;
    }
  }
  solver = new Solver(nums, [a, b]);
  return solver.solve();
}

function flatten(board) {
  var x = [];
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      x.push(board[i][j]);
    }
  }
  return x;
}
