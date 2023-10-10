// const express = require("express");
// const app = express();
// const http = require("http");
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
const WebSocketClient = require("websocket").client;
const fs = require("fs");
const path = require("path");
const auth = require("./authtest.json");

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
		parsedMessages = parser(message.utf8Data);
		parsedMessages.forEach(parsedMessage => {
			if(parsedMessage.cmd == "PING"){
				connection.sendUTF("PONG");
			}
			else if(parsedMessage.cmd == "PRIVMSG") {
				console.log(parsedMessage);
			}
		})
	});

	connection.sendUTF("JOIN #ohnepixel")

});

function parser(messageText) {
	let objs = [];
	let mesages = messageText.split("\r\n");

	mesages.forEach(msg => {
		if(msg.length == 0) return;
		let obj = {};
		// console.log(msg);
		let re = /(^|\s)([A-Z\*\s0-9]+)(\s|$)/;
		// console.log(msg.match(re));
		obj.cmd = msg.match(re)[2];
		let a = msg.split(" :");
		// console.log(a);

		switch(obj.cmd) {
			case("PING"):
				break;
			case("PRIVMSG"):
				obj.tags = parseTags(a[0]);
				obj.username = a[0].match(/display-name=([^\s]+);emotes/)[1];
				obj.msg = a[2];
				break;
			case("CLEARCHAT"):
				obj.tags = a[0].split(";");
				obj.username = a[2];
				break;
			case("NOTICE"):
				break;
			case("PART"):
				break;
			case("421"):
				break;
			case("CLEARMSG"):
				break;
			case(""):
				break;
			case(""):
				break;
			case(""):
				break;
			default:
		}
		objs.push(obj);
	});

	return objs;
}

function parseTags(tagsText) {
	let tagsObj = {};
	let tags = tagsText.split(";");
	tags.forEach(tag => {
		let t = tag.split("=");
		tagsObj[t[0]] = t[1];
	});

	return tagsObj;
}

client.connect('ws://irc-ws.chat.twitch.tv:80');