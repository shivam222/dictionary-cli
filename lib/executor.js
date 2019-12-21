'use strict';

const sa = require('superagent');

const getResponse = url => {
    return new Promise((resolve, reject) => {
        sa.get(url)
            .end((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
    });
};

module.exports = {
    getResponse: getResponse
}