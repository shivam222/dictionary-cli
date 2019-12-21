'use strict';
const chalk = require('chalk');
const log = console.log;

const logInfo = (data) => {
    log(chalk.blue(data));
};

const logErr = (data) => {
    log(chalk.red(data));
};

const logKeyInArray = (arr, key) => {
    if (Array.isArray(arr)){
     arr.forEach(element => {
         if(key) {
         log(chalk.green(element[key]));
         } else {
         log(chalk.green(element));
         }
     });
    } else {
      log(chalk.red("No such data is available"));
    }
};

module.exports = {
    logInfo:logInfo,
    logKeyInArray:logKeyInArray,
    logErr:logErr
}