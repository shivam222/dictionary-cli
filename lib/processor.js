'use strict';

const geturl = require('../data/url');
const executor = require('./executor');
const _ = require('underscore');

const getDefinition = word => {
  return new Promise ((resolve, reject) => { // Improve this promise constructor
   if (word) {
       word = word.toLowerCase();
   } else {
       reject("some word expected"); // TODO:  logging pending
   }
   executor.getResponse(geturl.url_def(word))
   .then( (res) => {
       let defn = {};
       defn.def = JSON.parse(res.text);
       defn.word = word;
       resolve(defn);
   })
   .catch( (err) => {
       reject(err);
   });
});
};

const getSynonyms = word => {
  return new Promise ((resolve, reject) => {
    if (word) {
        word = word.toLowerCase();
    } else {
        reject("some word expected"); // TODO:  logging pending
    }  
    executor.getResponse(geturl.url_syn(word))
    .then ( (res) => {
       const synonym = _.findWhere(JSON.parse(res.text), {relationshipType: "synonym"});
       let syn = {};
       syn.word = word;
       if (synonym && synonym.words.length > 0) {
         syn.syn = synonym.words; // use es6 way
       }
       resolve(syn); // TODO: formatting
    })
    .catch( (err) => {
        reject(err);
    });
});
};

const getAntonyms = word => {
  return new Promise ((resolve, reject) => {
    if (word) {
        word = word.toLowerCase();
    } else {
        reject("some word expected"); // TODO:  logging pending
    }  
    executor.getResponse(geturl.url_syn(word))
    .then ( (res) => {
       const antonym = _.findWhere(JSON.parse(res.text), {relationshipType: "antonym"});
       let ant = {};
       ant.word = word;
       if (antonym && antonym.words.length > 0) {
         ant.ant = antonym.words;
       }
       resolve(ant);
    })
    .catch( (err) => {
        reject(err);
    });
});
};

const getExamples = word => {
  return new Promise ((resolve, reject) => {
    if (word) {
        word = word.toLowerCase();
    } else {
        reject("some word expected"); // TODO:  logging pending
    }
    executor.getResponse(geturl.url_ex(word))
    .then( (res) => {
        let ex = JSON.parse(res.text);
        ex.word = word;
        resolve(ex);
    })
    .catch( (err) => {
        reject(err);
    });
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
        reject(err); // // TODO:  logging pending (using logger + correct format)
    });
}); 
};

const getDetails = wd => {
  return new Promise ((resolve, reject) => {
    let details = {};
    if (wd) {
        wd = wd.toLowerCase();
    } else {
        reject("some word expected"); // TODO:  logging pending
    }
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
        reject(err); // // TODO:  logging pending (using logger + correct format)
    });
});
};

const letsPlay = () => {
    wordOfTheDay()
    .then( (res) => {

    })
    .catch( (err) => {

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