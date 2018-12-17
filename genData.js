const axios = require('axios');
const quizzes = require('./quizzes.json');

quizzes.forEach(async (q, i) => {
    console.log(i);
    console.log(JSON.stringify(q).length);
    await axios.post('http://zuffik.eu:8800/graphql', {
            query: `
        mutation q{
          createQuizFromObject(quiz: ${JSON.stringify(q).replace(/\\"([^(\\")"]+)\\":/g, "$1:")}) {_id}
        }`
    });
});