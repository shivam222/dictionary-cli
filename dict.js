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
         processor.getDefinition(cli.input[1]);
     break;
    case 'syn':
         processor.getSynonyms(cli.input[1]);
     break;
    case 'ant':
         processor.getAntonyms(cli.input[1]);    
     break;
    case 'ex':
         processor.getExamples(cli.input[1]);      
     break;
    case '':
         processor.wordOfTheDay(cli.input[1]);
     break;
}

