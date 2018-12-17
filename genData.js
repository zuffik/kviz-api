const axios = require('axios');
const quizzes = require('./quizzes.json');
const stringifyObject = require('stringify-object');
const fs = require('fs');

quizzes.forEach(async (q, i) => {
    console.log(i);
    fs.writeFileSync('aaa.txt',  `
        mutation q{
          createQuizFromObject(quiz: ${stringifyObject(q, {
        singleQuotes: false,
        filter: (o, p) => p !== 'createdAt'
    })}) {_id}
        }`);
    await axios.post('http://zuffik.eu:8800/graphql', {
        query: `
        mutation q{
          createQuizFromObject(quiz: ${stringifyObject(q, {
            singleQuotes: false,
            filter: (o, p) => p !== 'createdAt'
        })}) {_id}
        }`
    }).then(a => console.log(a));
});