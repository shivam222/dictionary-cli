'use strict';
const util = require('./utils');
const inquirer = require('inquirer');
const _ = require('underscore');
const sw = require('shuffle-words');
const options =  ['1: try again','2: get a hint','3: quit'];

 const play = (res, expected_answer_set, covered_hints) => {
   return new Promise ((resolve, reject) => {
    console.log("wrong answer:( try again");
    inquirer
    .prompt([
      {
        type: 'list',
        name: 'option',
        message: `
        Select one option
        `,
        choices: options
      },
    ])
   .then(answers => {
    switch(answers.option) {
        case options[0]:
          return takeUserAnswer(res, expected_answer_set, covered_hints);
        case options[1]:
          return takeHint(res, expected_answer_set, covered_hints);
        case options[2]:
          return giveAnswerAndExit(res, expected_answer_set);
      }
   })
   .then ( (result) => {
      resolve(result);
   })
   .catch( (err) => {
        reject(err);
   });
});
};

const takeUserAnswer = (res, expected_answer_set, covered_hints) => {
 return new Promise ((resolve, reject) => {
    return inquirer
    .prompt([
      {
        name: 'word',
        message: `enter you answer`
      }
    ])
   .then( (answer) => {
    const ans = answer.word;
    const result = util.checkAnswer(expected_answer_set, ans);
    if(result) {
     resolve(result);
    } else {
     return play(res, expected_answer_set, covered_hints);
    }
   })
   .then( (result) => {
       resolve(result);
   })
   .catch( (err) => {
       reject(err);
   })
});
};

const populateCandidates = (res, covered_hints, cand) => {
    if (res.syn && res.syn.length > covered_hints.syn) cand.push("syn");
    if (res.ant && res.ant.length > covered_hints.ant) cand.push("ant");
    if (res.def && res.def.length > covered_hints.def) cand.push("def");
}

const jumbleWord = (word) => {
  return sw(word, true);
};

const takeHint = (res, expected_answer_set, covered_hints) => {
return new Promise ((resolve, reject) => {
 let cand = [];
 populateCandidates(res, covered_hints, cand);
 if (cand.length !== 0) {
    const choice = _.sample(cand);
    const ques = util.generateQues(res, choice, covered_hints);
    console.log(`Your hint: ${ques}`);
    covered_hints[choice]++;
    if(choice === 'syn') {
        expected_answer_set = _.without(expected_answer_set, res.syn[covered_hints[choice]-1]);
    }
 } else {
     // jumbled word logic (we fallback to jumbled word hint only when no other hint can be given)
     // because jumbled word hint reduces size of possible answer set to 1
     expected_answer_set = res.word;
     const jumbled = jumbleWord(res.word);
     console.log(`Your hint, answer is jumbled form of the following word: ${jumbled}`);
 }
 return takeUserAnswer(res, expected_answer_set, covered_hints)
 .then( (result) => {
     resolve(result);
 })
 .catch( (err) => {
     reject(err);
 });
});
};

const giveAnswerAndExit = (res, expected_answer_set) => {
    return new Promise ((resolve) => {
        console.log(`expected answer list ${expected_answer_set}
        definition: ${res.def[0].text}`);// improve logging
        resolve(false);
    });
};

module.exports = {
    play: play
}