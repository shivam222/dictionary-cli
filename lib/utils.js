'use strict';
const _ = require('underscore');

const generateQues = (res, choice, covered_hints) => {
    let ques;
    if (choice === 'def') {
        ques = `word with following definition \n ${res[choice][covered_hints[choice]].text}\n`;
    } else if (choice === 'syn') {
        ques = `word with following synonym \n ${res[choice][covered_hints[choice]]}\n`;
    } else if (choice === 'ant') {
        ques = `word with following antonym \n ${res[choice][covered_hints[choice]]}\n`;
    } else {
        return false;
    }
    return ques;
};

const checkAnswer = (expected_answer_set, ans) => {
    if (expected_answer_set.indexOf(ans) !== -1) return true;
    return false;
};

module.exports = {
    generateQues: generateQues,
    checkAnswer: checkAnswer
}