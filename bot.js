const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
require('./util/eventLoader')(client);

var prefix = settings.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.on('guildBanAdd' , (guild, user) => {
  let loglar = guild.channels.find('name', 'loglar');
  if (!loglar) return;
  loglar.send('Uygunsuz davranışlarda bulunduğunda dolayı '+ user.username +' yasaklanmıştır !')
});

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.on('message', msg => {
  if (msg.content.toLowerCase() === '!forum') {
    msg.reply('Forum Linki : https://gamercommunitycenter.com/forum/index.php');
  }
  if (msg.content.toLowerCase() === '!portal') {
    msg.reply('Portal Linki : https://gamercommunitycenter.com/portal');
  }
  if (msg.content.toLowerCase() === '!çekiliş') {
    msg.reply('Giveaway Linki : https://gamercommunitycenter.com/portal/giveaway');
  }
  if (msg.content.toLowerCase() === '!iletişim') {
    msg.reply('İletişim Linki : https://gamercommunitycenter.com/portal/iletisim');
  }
  if (msg.content.toLowerCase() === '!instagram') {
    msg.reply('Instagram Linki : https://www.instagram.com/gamercommunitycenter/');
  }
  if (msg.content.toLowerCase() === '!youtube') {
    msg.reply('YoutTube Linki : https://www.youtube.com/channel/UCMo47jWPfuQ721_z-4L4MyQ');
  }
  if (msg.content.toLowerCase() === '!facebook') {
    msg.reply('Facebook Linki : https://www.facebook.com/gamercommunitycenter');
  }
  if (msg.content.toLowerCase() === '!steam') {
    msg.reply('Steam Linki : https://steamcommunity.com/groups/GamerCommunityCenter');
  }
});

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === settings.owner) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(process.env.BOT_TOKEN);
