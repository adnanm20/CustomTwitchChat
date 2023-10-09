let x = "@badge-info=;badges=premium/1;client-nonce=04e5d70361200774b61e6b6ce5656a61;color=#18358C;display-name=Arclmpulse;emotes=;first-msg=0;flags=;id=800737d2-b73b-4eb5-bac2-72676e126fe3;mod=0;returning-chatter=0;room-id=163299585;subscriber=0;tmi-sent-ts=1696685989147;turbo=0;user-id=101844081;user-type= :arclmpulse!arclmpulse@arclmpulse.tmi.twitch.tv PRIVMSG #blastpremier :Gigachad jame time\r\n";
let y = "@ban-duration=600;room-id=163299585;target-user-id=851137191;tmi-sent-ts=1696685990027 :tmi.twitch.tv CLEARCHAT #blastpremier :dev777n\r\n";
let z = "PING :tmi.twitch.tv\r\n";
let i1 = ":tmi.twitch.tv CAP * ACK :twitch.tv/membership twitch.tv/tags twitch.tv/commands\r\n";
let i2 = ":tmi.twitch.tv 001 non_existent24 :Welcome, GLHF!\r\n" +
":tmi.twitch.tv 002 non_existent24 :Your host is tmi.twitch.tv\r\n" +
":tmi.twitch.tv 003 non_existent24 :This server is rather new\r\n" +
":tmi.twitch.tv 004 non_existent24 :-\r\n" +
":tmi.twitch.tv 375 non_existent24 :-\r\n" +
":tmi.twitch.tv 372 non_existent24 :You are in a maze of twisty passages, all alike.\r\n" +
":tmi.twitch.tv 376 non_existent24 :>\r\n" +
"@badge-info=;badges=;color=#0000FF;display-name=non_existent24;emote-sets=0,300374282,477339272,537206155,610186276;user-id=436687893;user-type= :tmi.twitch.tv GLOBALUSERSTATE\r\n"
let i3 = ":non_existent24!non_existent24@non_existent24.tmi.twitch.tv JOIN #blastpremier\r\n" +
":non_existent24.tmi.twitch.tv 353 non_existent24 = #blastpremier :non_existent24\r\n" +
":non_existent24.tmi.twitch.tv 366 non_existent24 #blastpremier :End of /NAMES list\r\n"
let i4 = "@badge-info=;badges=;color=#0000FF;display-name=non_existent24;emote-sets=0,300374282,477339272,537206155,610186276,fe932871-97c6-4730-bdfb-b43c0c2da73f;mod=0;subscriber=0;user-type= :tmi.twitch.tv USERSTATE #blastpremier\r\n" +
"@emote-only=0;followers-only=10;r9k=0;room-id=163299585;slow=5;subs-only=0 :tmi.twitch.tv ROOMSTATE #blastpremier\r\n"

console.log(parser(x));
console.log(parser(y));
console.log(parser(z));
console.log(parser(i1));
console.log(parser(i2));
console.log(parser(i3));
console.log(parser(i4));


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
			default:
		}
		// console.log(a);
		objs.push(obj);
	});

	return objs;
}
