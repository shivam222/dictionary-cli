'use strict';

const geturl = require('../data/url');
const executor = require('./executor');
const _ = require('underscore');

const getDefinition = word => {
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
   })
   .catch( (err) => {
       console.log(err.response.res.text); // // TODO:  logging pending (using logger + correct format)
   });
};

const getSynonyms = word => {
    if (word) {
        word = word.toLowerCase();
    } else {
        console.log("some word expected"); // TODO:  logging pending
        return;
    }  
    executor.getResponse(geturl.url_syn(word))
    .then ( (res) => {
       const synonym = _.findWhere(JSON.parse(res.text), {relationshipType: "synonym"}).words;
       if (synonym.length > 0) {
         console.log(synonym); // TODO: formatting
       } else {
         console.log("Sorry! No synonym available for this word:(");
       }
    })
    .catch( (err) => {
        console.log(err.response.res.text);
    });
};

const getAntonyms = word => {
    if (word) {
        word = word.toLowerCase();
    } else {
        console.log("some word expected"); // TODO:  logging pending
        return;
    }  
    executor.getResponse(geturl.url_syn(word))
    .then ( (res) => {
       const antonym = _.findWhere(JSON.parse(res.text), {relationshipType: "antonym"}).words;
       if (antonym.length > 0) {
         console.log(antonym); // TODO: formatting
       } else {
         console.log("Sorry! No antonym available for this word:(");
       }
    })
    .catch( (err) => {
        console.log(err.response.res.text);
    });
};

const getExamples = word => {
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
    })
    .catch( (err) => {
        console.log(err.response.res.text); // // TODO:  logging pending (using logger + correct format)
    });    
};

const wordOfTheDay = () => {
    executor.getResponse(geturl.url_rand())
    .then( (res) => {
        // FIXME: handle error if word is not found
        const wod = JSON.parse(res.text).word;
        console.log(wod);  // TODO:  logging pending (using logger + correct format)
    })
    .catch( (err) => {
        console.log(err.response.res.text); // // TODO:  logging pending (using logger + correct format)
    });   
};

module.exports = {
    getDefinition: getDefinition,
    getSynonyms: getSynonyms,
    getAntonyms: getAntonyms,
    getExamples:getExamples,
    wordOfTheDay:wordOfTheDay
}