const generateQues = (res, choice) => {
    if(choice === 'def') {
        console.log("Guess the word with following definition"); // Improve logging
    } else if (choice === 'syn') {
        console.log('Guess the word with following synonym');
    } else if (choice === 'ant') {
        console.log('Guess the word with following antonym'); 
    } else {
        console.log('Something went wrong:( Try playing again');
        return;
    }
    return res[choice][0].text ? res[choice][0].text : res.word;
};

const checkAnswer = (res, choice, ans) => {

};

module.exports = {
    generateQues: generateQues,
    checkAnswer: checkAnswer
}