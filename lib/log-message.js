const chalk = require('chalk');
const emoji = require('node-emoji');

const info = (title, text = "", icon = emoji.get("speech_balloon")) => `${chalk.cyan(title)}  ${text}  ${icon}`;
const danger = (title, text = "", icon = emoji.get("fearful")) => `${chalk.yellow(title)}  ${text}  ${icon}`;
const error = (title, text = "", icon = `${emoji.get("scream")} ${emoji.get("thumbsdown")}`) => `${chalk.red(title)}  ${text}  ${icon}`;
const success = (title, text = "", icon = `${emoji.get("smile")} ${emoji.get("thumbsup")}`) => `${chalk.green(title)}  ${text} ${icon}`;

module.exports = {
  info,
  danger,
  error,
  success
};
