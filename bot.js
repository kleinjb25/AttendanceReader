//Copyright Justin Klein 2023
//This file was created to read uniqueids(terminology courtesy of Miami University) 
//and append them to a university domain name to be submitted for attendance on The Hub. 
//Any other use of this bot is forbidden by the author.
require('dotenv').config();
const Discord = require('discord.io');
var logger = require('winston');
var testing = false; //whether the bot is in testing mode or not (able to add names outside of club)
var adminBool = false; //whether the user is an admin or not
var options, attendees = [];
var admins = [];
const now = new Date();
var start = 18 * 60;
var end = 22 * 60;
var time = now.getHours() * 60 + now.getMinutes();
var domain = "@miamioh.edu";
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
	colorize: true
});
logger.level = "debug";
const bot = new Discord.Client({token: process.env.BOT_TOKEN,
   autorun: true});
bot.on("ready", () => {
	logger.info("connected with " + bot.username + ", which has an id of " + bot.id);
});

bot.on("message", function (user1, userID, channelID, message, evt) {
	if (message.substring(0, 1) === "$") {
		adminBool = false;
		var query = message.substring(1).split(" ");
		var command = query[0] + query[1];
		var uniqueid = query[1];
		query = query.splice(1);
		for (var i = 0; i < admins.length; i++) {
			if (user1 === admins[i])
				adminBool = true;
		}	
		switch(command) {
			case "attend" + uniqueid: {
				if (uniqueid === undefined) {
					bot.sendMessage({
						to: channelID,
						message: "No uniqueid? D:"
					});
					break;
				}
				if (now.getDay() != 4 || time < start || time > end && !testing) {
					//if not in testing mode, check if the current time is between 6:00pm and 10:00pm on Thursday (day 0 is Sun, 6 is Sat)
					bot.sendMessage({
						to: channelID,
						message: "Club isn't meeting now!"
					});
					debug.log(now.getDay() + " " + time);
					break;
				} else {
					let con = uniqueid + domain;
					attendees.push(con);
					bot.sendMessage({
						to: channelID,
						message: "Current attendees: " + attendees.join("\n ")
					});
					break;
				}
			} case "help" + uniqueid : {
				bot.sendMessage({
					to: channelID,
					message: "commands:\n$attend uniqueid: " +
					"appends the uniqueid to a message of all other uniqueids in attendance\n" +
					"$help: displays this message\n" +
					"$ping: displays latency in milliseconds\n"
				});
				break;
			} case "helpAdmin" + uniqueid : {
				if (adminBool) {
					bot.sendMessage({
						to: channelID,
						message: "Admin commands:\n" + 
						"$changeDomain (d): changes the current domain to d, must have '@' and '.edu' somewhere\n" +
						"changeAdmin [a]: changes the array of admins to a, a must be a comma-delimited list of names\n" +
						"$helpAdmin: displays this message\n" +
						"$stop: stops the bot, depending on how it was launched\n" +
						"$test: changes whether the bot is in testing mode or not - the only difference with testing mode right now is that the time check is ignored\n" +
						"$changeTime (s) (e): changes the start and end times to s and e, respectively," +
						"s and e must be the starting hour of the time you want in military time  (for example, instead of doing 6:00pm, you would do '18') and s must be less than e\n"
					});
				} else {
					bot.sendMessage({
						to: channelID,
						message: "You are not an admin!"
					});
				}
				break;
			} case "ping" + uniqueid: {
				const now = Date.now();
				bot.sendMessage({
					to: channelID,	
					message: "Pong! Latency: "
				});
				setTimeout(function() {
					bot.sendMessage({
					to: channelID,	
					message: Date.now() - now - 100 + ' ms '
				});
				}, 100);
				break;	
			 } case 'stop' + uniqueid: {
				if (adminBool) {
					bot.sendMessage({
						to: channelID,	
						message: "Warning: depending on how I was launched, this may not do anything. If I do not go offline after a minute, you need to contact my creator.\nBye!"
					});
					setTimeout(function() {
						process.exit();
					}, 500);
				} else {
					bot.sendMessage({
						to: channelID,
						message: "You are not an admin!"
					});
				}
				break;
			} case 'test' + uniqueid: {
				if (adminBool) {
					if(testing) {
						testing = false;
					} else {
						testing = true;
					}
					bot.sendMessage({
						to: channelID,	
						message: "The testing boolean has been set from " + !testing + " to " + testing 
					});
				} else {
					bot.sendMessage({
						to: channelID,
						message: "You are not an admin!"
					});
				}
				break;
			}  case 'changeDomain' + uniqueid: {
				if (adminBool) {
					if (uniqueid === undefined || uniqueid.at(0) !== '@' || uniqueid.substring(uniqueid.length - 4, uniqueid.length) !== '.edu') {
						bot.sendMessage({
							to: channelID,
							message: "No domain? D:"
						});
						break;
					}
					domain = uniqueid;
					bot.sendMessage({
						to: channelID,
						message: "Domain changed to " + domain
					});
				} else {
					bot.sendMessage({
						to: channelID,
						message: "You are not an admin!"
					});
				}
				break;
			} case 'changeAdmin' + uniqueid: {
				if (uniqueid === undefined) {
					bot.sendMessage({
						to: channelID,
						message: "No admins? D:"
					});
					break;
				} else if (uniqueid.includes(",")) {
					admins = uniqueid.split(",");
					bot.sendMessage({
					to: channelID,
					message: "Admins: " + admins.join("\n ")
					});
				} else {
					admins = [uniqueid];
					bot.sendMessage({
						to: channelID,
						message: "Admins: " + admins.join("\n ")
					});
				}
				break;
			} case 'changeTime': {
				bot.sendMessage({
					to: channelID,
					message: "not implemented yet sorry"
				});
			} default: {
				bot.sendMessage({
					to: channelID,	
					message: "Oh I am SOOOOO sorry. ~~/s~~ I don't know what you were trying to type. You can see a list of commands to use by typing !help or !helpAdmin, if you're an admin."
				});
				break;
			}
		}
	}
});
