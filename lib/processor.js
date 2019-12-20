'use strict';

const geturl = require('../data/url');
const executor = require('./executor');
const _ = require('underscore');

const getDefinition = word => {
  return new Promise ((resolve, reject) => { // Improve this promise constructor
   if (word) {
       word = word.toLowerCase();
   } else {
       console.log("some word expected"); // TODO:  logging pending
       return;
   }
   executor.getResponse(geturl.url_def(word))
   .then( (res) => {
       // FIXME: handle error if word is not found
       console.log(JSON.parse(res.text));  // TODO:  logging pending (using logger + correct format)
       resolve(word);
   })
   .catch( (err) => {
       console.log(err.response.res.text); // // TODO:  logging pending (using logger + correct format)
       reject();
   });
});
};

const getSynonyms = word => {
  return new Promise ((resolve, reject) => {
    if (word) {
        word = word.toLowerCase();
    } else {
        console.log("some word expected"); // TODO:  logging pending
        return;
    }  
    executor.getResponse(geturl.url_syn(word))
    .then ( (res) => {
       const synonym = _.findWhere(JSON.parse(res.text), {relationshipType: "synonym"});
       if (synonym && synonym.words.length > 0) {
         console.log(synonym.words); // TODO: formatting
       } else {
         console.log("Sorry! No synonym available for this word:(");
       }
       resolve(word);
    })
    .catch( (err) => {
        console.log(err.response.res.text);
        reject();
    });
});
};

const getAntonyms = word => {
  return new Promise ((resolve, reject) => {
    if (word) {
        word = word.toLowerCase();
    } else {
        console.log("some word expected"); // TODO:  logging pending
        return;
    }  
    executor.getResponse(geturl.url_syn(word))
    .then ( (res) => {
       const antonym = _.findWhere(JSON.parse(res.text), {relationshipType: "antonym"});
       if (antonym && antonym.words.length > 0) {
         console.log(antonym.words); // TODO: formatting
       } else {
         console.log("Sorry! No antonym available for this word:(");
       }
       resolve(word);
    })
    .catch( (err) => {
        //console.log(err.response.res.text);
        console.log(err);
        reject();
    });
});
};

const getExamples = word => {
  return new Promise ((resolve, reject) => {
    if (word) {
        word = word.toLowerCase();
    } else {
        console.log("some word expected"); // TODO:  logging pending
        return;
    }
    executor.getResponse(geturl.url_ex(word))
    .then( (res) => {
        // FIXME: handle error if word is not found
        console.log(JSON.parse(res.text));  // TODO:  logging pending (using logger + correct format)
        resolve(word);
    })
    .catch( (err) => {
        console.log(err.response.res.text); // // TODO:  logging pending (using logger + correct format)
        reject();
    });
});
};

const wordOfTheDay = () => {
    executor.getResponse(geturl.url_rand())
    .then( (res) => {
        // FIXME: handle error if word is not found
        const wod = JSON.parse(res.text).word;
        console.log(wod);  // TODO:  logging pending (using logger + correct format)
        return getDefinition(wod);
    })
    .then( (wod) => {
        return getSynonyms(wod);
    })
    .then ( (wod) => {
        return getAntonyms(wod);
    })
    .then( (wod) => {
        return getExamples(wod);
    })
    .catch( (err) => {
        console.log("Problem in getting random word info"); // // TODO:  logging pending (using logger + correct format)
    });   
};

const getDetails = wod => {
    if (wod) {
        wod = wod.toLowerCase();
    } else {
        console.log("some word expected"); // TODO:  logging pending
        return;
    }
    getDefinition(wod)
    .then( (wod) => {
        return getSynonyms(wod);
    })
    .then ( (wod) => {
        return getAntonyms(wod);
    })
    .then( (wod) => {
        return getExamples(wod);
    })
    .catch( (err) => {
        console.log("Problem in getting word info"); // // TODO:  logging pending (using logger + correct format)
    }); 
}

module.exports = {
    getDefinition: getDefinition,
    getSynonyms: getSynonyms,
    getAntonyms: getAntonyms,
    getExamples:getExamples,
    wordOfTheDay:wordOfTheDay,
    getDetails:getDetails
}