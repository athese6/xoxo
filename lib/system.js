const Promise = require('bluebird');
const path = require('path');
const shell = require('shelljs');
const checkEngines = require('check-engines');
const packageConfig = require('../package.json');
const ora = require('ora');
const logMessage = require("./log-message");

/**
 * Execute a cross platform command using ShellJS, see https://github.com/shelljs/shelljs
 * @param {string} command shell command
 * @param {string} description describe your command for logging purpose
 * @param {Function} loggerMethod the color of the operation can be chalk[color] or logMessage method
 * @return {Promise}
 */
const exec = (command, description = "", loggerMethod = logMessage.info) => new Promise((resolve, reject) => {
    const spinner = ora();
    spinner.start();
    console.log(`${loggerMethod(description, command)}`);
    shell.exec(command, {async: true}, (code, stdout, stderr) => {
        spinner.stop();
        if (stderr) {
            console.log(logMessage.error(`${description} failed!`));
            return reject(stderr);
        }
        console.log(logMessage.success(`${description} completed`));
        resolve(stdout);
    })
});

/**
 * Clear a system directory recursively
 * @param {string} dirPath path to the directory to clear
 * @return {Promise}
 */
const clearDir = dirPath => exec(`rm -rf ${path.normalize(dirPath.normalize())}/*`, "clearing dir", logMessage.danger);

/**
 * set the shell current directory
 * @param dir
 */
const cd = dir => shell.cd(dir);

/**
 * Utility to verify that engine versions (node, npm, iojs, yarn) satisfy semver constraints specified in package.json.
 * @return {Promise}
 */
const checkVersions = () => new Promise((resolve, reject) => {
    resolve();
    // const spinner = ora();
    // spinner.start();
    // console.log(logMessage.info("checking system versions"));
    // checkEngines(packageConfig, (error, info) => {
    //     spinner.stop();
    //     if (error) {
    //         console.log(logMessage.error(`system versions are not satisfied !`));
    //         return reject(error);
    //     }
    //     const result = Object.keys(info).reduce((a, b) => a.concat(`${b} is ${info[b].join(" and it's ")}`), []);
    //     console.log(logMessage.success(`all system versions are fine`, result.join(", ")));
    //     resolve();
    // });
});

module.exports = {
    exec,
    cd,
    checkVersions,
    clearDir
};
