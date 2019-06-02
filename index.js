require('dotenv').config();
//^^ For using .env file

const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const opus = require('opusscript');

const search = require('youtube-search');

const client = new Discord.Client();

const streamOptions = {
	seek: 0,
	volume: 1
};

const DISCORD_API_TOKEN = process.env.DISCORD_API_TOKEN;

client.login(DISCORD_API_TOKEN);

client.on('ready', () => console.log('Bot Is On!'));

client.on('message', m => {
	if (m.author.bot) return;

	if (m.content.toLowerCase().startsWith('/play')) {
		let channel = m.guild.channels.find(
			c => c.id === m.member.voiceChannelID
		);

		if (channel) {
			console.log(
				channel.name + ' Was found and is a ' + channel.type + ' type'
			);

			channel
				.join()
				.then(con => {
					console.log('Bot Joined!');
					const opts = {
						maxResults: 10,
						key: process.env.YOUTUBE_API_TOKEN
					};
					const term = m.content
						.split(' ')
						.filter(word => word !== '/play')
						.join(' ');
					search(term, opts, (err, results) => {
						if (err) return console.err(err);

						const stream = ytdl(results[0].link, {
							filter: 'audioonly'
						});

						const dispatcher = con.playStream(
							stream,
							streamOptions
						);
					});
				})
				.catch(console.error);
		}
	}
	if (m.content.toLowerCase().startsWith('/stop')) {
		let channel = m.guild.channels.find(
			c => c.id === m.member.voiceChannelID
		);

		if (channel) {
			console.log(
				channel.name + ' Was found and is a ' + channel.type + ' type'
			);

			channel
				.join()
				.then(con => {
					const dispatcher = con.disconnect();
					console.log('Bot Left! ');
				})
				.catch(err => console.error(err));
		}
	}
});
