const moment = require('moment');
const quizzes = require('./quizzes.json');
const stringifyObject = require('stringify-object');
const fs = require('fs');
fs.writeFileSync('aaa.graphql',  `mutation q${+moment() + Math.random().toString().replace('.', '')}{`);
quizzes.forEach(async (q, i) => {
    fs.appendFileSync('aaa.graphql',  `
        
          qa${+moment() + Math.random().toString().replace('.', '')}:createQuizFromObject(quiz: ${stringifyObject(q, {
        singleQuotes: false,
        filter: (o, p) => p !== 'createdAt'
    })}) {_id}
        `);

});
fs.appendFileSync('aaa.graphql',  `}`);
