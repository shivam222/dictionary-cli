#!/usr/bin/env node
'use strict';

const meow = require('meow');
const processor = require('./lib/processor');
const logger = require('./lib/logging');
let action = "";

const cli = meow(`
        Usage
         $ dict <action> <word>

        Examples
         $ dict syn start
         $ dict start
`);

if (cli.input[0]) {
    action = cli.input[0].toLowerCase();
}

switch (action) {
    case 'defn':
        processor.getDefinition(cli.input[1])
            .then((defn) => {
                logger.logInfo(`Definitions of the word "${defn.word}":`);
                logger.logKeyInArray(defn.def, "text");
            })
            .catch((err) => {
                logger.logErr(err);
            });
        break;
    case 'syn':
        processor.getSynonyms(cli.input[1])
            .then((syno) => {
                logger.logInfo(`Synonyms of the word "${syno.word}":`);
                logger.logKeyInArray(syno.syn);
            })
            .catch((err) => {
                logger.logErr(err);
            });
        break;
    case 'ant':
        processor.getAntonyms(cli.input[1])
            .then((anto) => {
                logger.logInfo(`Antonyms of the word "${anto.word}":`);
                logger.logKeyInArray(anto.ant);
            })
            .catch((err) => {
                logger.logErr(err);
            });
        break;
    case 'ex':
        processor.getExamples(cli.input[1])
            .then((exam) => {
                logger.logInfo(`Examples of the word "${exam.word}":`);
                logger.logKeyInArray(exam.examples, "text");
            })
            .catch((err) => {
                logger.logErr(err);
            });
        break;
    case '':
        processor.wordOfTheDay()
            .then((wod) => {
                logger.logInfo(`Word of the day is "${wod.word}":`);
                logger.logInfo(`Definitions of the word "${wod.word}":`);
                logger.logKeyInArray(wod.def, "text");
                logger.logInfo(`Synonyms of the word "${wod.word}":`);
                logger.logKeyInArray(wod.syn);
                logger.logInfo(`Antonyms of the word "${wod.word}":`);
                logger.logKeyInArray(wod.ant);
                logger.logInfo(`Examples of the word "${wod.word}":`);
                logger.logKeyInArray(wod.ex, "text");
            })
            .catch((err) => {
                logger.logErr(err);
            });
        break;
    case 'play':
        processor.letsPlay()
            .then((result) => {
                if (result) {
                    logger.logInfo("Good job:)");
                } else {
                    logger.logInfo("Bye:|Keep learning");
                }
            })
            .catch((err) => {
                logger.logErr(err);
            });
        break;
    default:
        processor.getDetails(cli.input[0])
            .then((details) => {
                logger.logInfo(`Definitions of the word "${details.word}":`);
                logger.logKeyInArray(details.def, "text");
                logger.logInfo(`Synonyms of the word "${details.word}":`);
                logger.logKeyInArray(details.syn);
                logger.logInfo(`Antonyms of the word "${details.word}":`);
                logger.logKeyInArray(details.ant);
                logger.logInfo(`Examples of the word "${details.word}":`);
                logger.logKeyInArray(details.ex, "text");
            })
            .catch((err) => {
                logger.logErr(err);
            });
        break;
}

