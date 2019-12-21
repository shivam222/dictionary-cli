'use strict';

const geturl = require('../data/url');
const executor = require('./executor');
const util = require('./utils');
const long_game = require('./long_game');
const _ = require('underscore');
const inquirer = require('inquirer');
const chalk = require('chalk');


const getDefinition = word => {
  return new Promise ((resolve, reject) => {
   if (!word) {
    reject("some word expected");
   } else {
    word = word.toLowerCase();
    executor.getResponse(geturl.url_def(word))
    .then( (res) => {
        let defn = {};
        defn.def = JSON.parse(res.text);
        defn.word = word;
        resolve(defn);
    })
    .catch( (err) => {
        err = err.status==400 ? "word not found" : err;
        reject(err);
    });
   }
});
};

const getSynonyms = word => {
  return new Promise ((resolve, reject) => {
    if (!word) {
        reject("some word expected");
        
    } else {
        word = word.toLowerCase();
        executor.getResponse(geturl.url_syn(word))
        .then ( (res) => {
        const synonym = _.findWhere(JSON.parse(res.text), {relationshipType: "synonym"});
        let syn = {
            word
        };
        if (synonym && synonym.words.length > 0) {
            syn.syn = synonym.words;
        }
        resolve(syn);
        })
        .catch( (err) => {
            err = err.status==400 ? "word not found" : err;
            reject(err);
        });
    }
});
};

const getAntonyms = word => {
  return new Promise ((resolve, reject) => {
    if (!word) {
        reject("some word expected");
    } else {
        word = word.toLowerCase();
        executor.getResponse(geturl.url_syn(word))
        .then ( (res) => {
        const antonym = _.findWhere(JSON.parse(res.text), {relationshipType: "antonym"});
        let ant = {
            word
        };
        if (antonym && antonym.words.length > 0) {
            ant.ant = antonym.words;
        }
        resolve(ant);
        })
        .catch( (err) => {
            err = err.status==400 ? "word not found" : err;
            reject(err);
        });
    }
});
};

const getExamples = word => {
  return new Promise ((resolve, reject) => {
    if (!word) {
        reject("some word expected");
    } else {
        word = word.toLowerCase();
        executor.getResponse(geturl.url_ex(word))
        .then( (res) => {
            let ex = JSON.parse(res.text);
            ex.word = word;
            resolve(ex);
        })
        .catch( (err) => {
            err = err.status==400 ? "word not found" : err;
            reject(err);
        });
    }
});
};

const wordOfTheDay = () => {
  return new Promise ((resolve, reject) => {
    let wod = {};
    executor.getResponse(geturl.url_rand())
    .then( (res) => {
        wod.word = JSON.parse(res.text).word;
        return getDefinition(wod.word);
    })
    .then( (defn) => {
        wod.def = defn.def;
        return getSynonyms(wod.word);
    })
    .then ( (syno) => {
        wod.syn = syno.syn;
        return getAntonyms(wod.word);
    })
    .then( (anto) => {
        wod.ant = anto.ant;
        return getExamples(wod.word);
    })
    .then( (exam) => {
        wod.ex = exam.examples;
        resolve(wod);
    })
    .catch( (err) => {
        reject(err);
    });
}); 
};

const getDetails = wd => {
  return new Promise ((resolve, reject) => {
    let details = {};
    if (!wd) {
        reject("some word expected");
    } else {
        wd = wd.toLowerCase();
    // code below is same as in wordOfTheDay, but it gives more flexibility to keep it separate and not create a function
        details.word = wd;
        getDefinition(wd)
        .then( (defn) => {
            details.def = defn.def;
            return getSynonyms(details.word);
        })
        .then ( (syno) => {
            details.syn = syno.syn;
            return getAntonyms(details.word);
        })
        .then( (anto) => {
            details.ant = anto.ant;
            return getExamples(details.word);
        })
        .then ( (exam) => {
            details.ex= exam.examples;
            resolve(details);
        })
        .catch( (err) => {
            err = err.status==400 ? "word not found" : err;
            reject(err);
        });
    }
});
};

const letsPlay = () => {
    return new Promise ((resolve, reject) => {
    let covered_hints = {
        def: 0,
        syn: 0,
        ant: 0
    }
    let expected_answer_set = [];
    let res;
    wordOfTheDay()
    .then( (response) => {
       res = response;
       let cand = [];
       //NOTE: probability of getting definition related question is higher because many words does not have synonyms and antonyms
       if(res.def) {
           cand.push("def");
       }
       if(res.syn) {
           cand.push("syn");
       }
       if(res.ant) {
           cand.push("ant");
       }
       if(res.syn) {
           expected_answer_set = [...res.syn];
       }
       expected_answer_set.push(res.word);
       const choice = _.sample(cand);
       console.log(chalk.yellow('Guess the word'));
       const ques = util.generateQues(res, choice, covered_hints);
       covered_hints[choice]++;
       if(choice === 'syn') {
        // if we have printed a synonym than that can not be the answer
        expected_answer_set = _.without(expected_answer_set, res.syn[covered_hints[choice]-1]);
       }
       if(!ques) {
           reject('Something went wrong:( Try playing again');
       }
       return inquirer
       .prompt([
         {
           name: 'word',
           message: ques
         },
       ]);
    })
    .then(answers => {
        const ans = answers.word;
        const result = util.checkAnswer(expected_answer_set, ans);
        if(result) {
           resolve('you won');
        } else {
           return long_game.play(res, expected_answer_set, covered_hints);
        }
    })
    .then( (res) => {
        resolve(res);
    })
    .catch( (err) => {
        reject(err);
    });
});
};

module.exports = {
    getDefinition: getDefinition,
    getSynonyms: getSynonyms,
    getAntonyms: getAntonyms,
    getExamples:getExamples,
    wordOfTheDay:wordOfTheDay,
    getDetails:getDetails,
    letsPlay:letsPlay
}