var express = require('express')
var app = express();
app.use(express.static('public'));
var http = require('http').Server(app);
var port = 3000;

http.listen(port, function() {
	console.log("Listening on port: ", port);
});

var io = require('socket.io')(http)

var games = {};
var queue = [];
var id = 0;
var gameId = 0;

io.on('connection', function(socket) {
	console.log("New connection");

	assignId(socket);

	if (queue.length > 0) {
		var game = startGame(queue.pop(), socket);
		game.white.emit('gameStarted', 'w')
		game.black.emit('gameStarted', 'b');
	} else {
		queue.push(socket);
	}

	socket.on('message', function(msg) {
		console.log("Got message from client:", msg);
	})

	socket.on('move', function(msg) {
		socket.broadcast.emit('move', msg);
	})

	socket.on('disconnect', function() {
		var opp = getOpponent(socket);
		opp.disconnect();
		games[socket.gId] = undefined;
	})
})

function assignId(socket) {
	socket.userId = id;
	id++;
}

function startGame(s1, s2) {
	s1.gId = gameId;
	s2.gId = gameId;
	var game = {
		white: s1,
		black: s2
	}
	games[gameId] = game;
	gameId++;
	return game;
}

function getOpponent(socket) {
	var game = games[socket.gId];
	return socket.userId === game.white.userId ? game.black : game.white;
}