'use strict';
const apihost = 'https://fourtytwowords.herokuapp.com';
const api_key = 'b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164';

const url_def = word => {
   return `${apihost}/word/${word}/definitions?api_key=${api_key}`;
}

const url_syn = word => {
    return `${apihost}/word/${word}/relatedWords?api_key=${api_key}`;  
}

const url_ex = word => {
    return `${apihost}/word/${word}/examples?api_key=${api_key}`;
}

const url_rand = () => {
    return `${apihost}/words/randomWord?api_key=${api_key}`;  
}

module.exports = {
    url_def:url_def,
    url_syn:url_syn,
    url_ex:url_ex,
    url_rand:url_rand
}