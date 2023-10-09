// const express = require("express");
// const app = express();
// const http = require("http");
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
const WebSocketClient = require("websocket").client;
const fs = require("fs");
const path = require("path");
const auth = require("./auth.json");

if(auth.access_token == "" || auth.username == "") {
	console.log("Insert access token and username in auth.json");
	return;
}

const client = new WebSocketClient();

client.on('connectFailed', function (error) {
	console.log('Connect Error: ' + error.toString());
});

client.on('connect', function (connection) {
	console.log('WebSocket Client Connected');

	connection.sendUTF('CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands');
	connection.sendUTF('PASS oauth:' + auth.access_token);
	connection.sendUTF('NICK ' + auth.username);

	connection.on("message", message => {
		console.log(message.utf8Data);
		console.log(parser(message.utf8Data));
	});

	connection.sendUTF("JOIN #blastpremier")

});

function parser(messageText) {
	let objs = [];
	let mesages = messageText.split("\r\n");

	mesages.forEach(msg => {
		if(msg.length == 0) return;
		let obj = {};
		let re = /(^|\s)([A-Z\*\s0-9]+)(\s|$)/;
		obj.cmd = msg.match(re)[2];
		let a = msg.split(":");

		switch(obj.cmd) {
			case("PING"):
				break;
			case("PRIVMSG"):
				obj.tags = a[0].split(";");
				obj.username = a[0].match(new RegExp("display-name=([^\s]+)"))[1];
				obj.msg = a[2];
				break;
			case("CLEARCHAT"):
				obj.tags = a[0].split(";");
				obj.username = a[2];
				break;
			//TODO: other cmds
			default:
		}
		objs.push(obj);
	});

	return objs;
}

client.connect('ws://irc-ws.chat.twitch.tv:80');