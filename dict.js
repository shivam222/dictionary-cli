#!/usr/bin/env node
'use strict';

const meow = require('meow');
const processor = require('./lib/processor');
let action="";

const cli = meow(`
        Usage
         $ dict <action> <word>

        Examples
         $ dict syn start
         $ dict start
`);

if(cli.input[0]) {
    action = cli.input[0].toLowerCase();
}

switch (action) {
    case 'defn': 
         processor.getDefinition(cli.input[1])
         .then( (defn) => {
              console.log(defn); // better logging
         })
         .catch( (err) => {
              console.log(err);
         });
     break;
    case 'syn':
         processor.getSynonyms(cli.input[1])
         .then( (syn) => {
            console.log(syn); // better logging
       })
       .catch( (err) => {
            console.log(err); // important formatting
       });
     break;
    case 'ant':
         processor.getAntonyms(cli.input[1])
         .then( (ant) => {
            console.log(ant); // better logging
       })
       .catch( (err) => {
            console.log(err);
       });   
     break;
    case 'ex':
         processor.getExamples(cli.input[1])
         .then( (ex) => {
            console.log(ex); // better logging
       })
       .catch( (err) => {
            console.log(err);
       });      
     break;
    case '':
         processor.wordOfTheDay()
         .then( (wod) => {
            console.log(wod); // better logging
       })
       .catch( (err) => {
            console.log(err);
       });
     break;
    case 'play':
         processor.letsPlay()
         .then( (result) => {
            console.log(result); // better logging
       })
       .catch( (err) => {
            console.log(err);
       });
     break;
    default:
         processor.getDetails(cli.input[0])
         .then( (details) => {
            console.log(details); // better logging
       })
       .catch( (err) => {
            console.log(err);
       });
     break;
}

