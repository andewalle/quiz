const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById('questionCounter');
const scoreText = document.getElementById('score');
const loader = document.getElementById('loading');
const spel = document.getElementById('spel');


let currentQuestion = {};
let acceptingAnswers = false;
let scor = 0;
let questionCounter = 0;
let availabeQuestions = [];





fetch("https://opentdb.com/api.php?amount=10&category=11&difficulty=medium&type=multiple")

.then(res => {
    return res.json();
})

.then(loadedQuestions => {
    console.log(loadedQuestions);
    questions = loadedQuestions.results.map(loadedQuestion => {
        const formattedQuestion = {
            question: loadedQuestion.question
        };

        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random()*5) + 1;
        answerChoices.splice(formattedQuestion.answer -1, 0,
            loadedQuestion.correct_answer);

        answerChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index+1)] = choice;
        })
        return formattedQuestion;

    });
    
    startGame();
})

.catch(err => {
    console.error(err);
});


const KORREKT_SVAR = 10;
const MAX_FRÅGOR = 5;
startGame = () => {
    questionCounter =0;
    score = 0;
    availabeQuestions = [...questions];
    spel.classList.remove('hidden');
    loader.classList.add('hidden');
    getNewQuestion();
};

getNewQuestion = () => {

    if(availabeQuestions.length === 0 || questionCounter >= MAX_FRÅGOR){
        localStorage.setItem('mostRecentScore', score);

        return window.location.assign("/end.html");
    }

    questionCounter++;
    questionCounterText.innerText = questionCounter + "/" + MAX_FRÅGOR;
    document.getElementById("myProgress").value = (questionCounter / MAX_FRÅGOR)* 100;
    
    


    const questionIndex = Math.floor(Math.random() * availabeQuestions.length);
    currentQuestion = availabeQuestions[questionIndex];
    question.innerText = currentQuestion.question;
    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availabeQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply = 
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if(classToApply == 'correct') {
            incrementScore(KORREKT_SVAR);
        }
        
        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
        selectedChoice.parentElement.classList.remove(classToApply);

        getNewQuestion();
        }, 1000);
    });
});

incrementScore = num => {
    score +=num;
    scoreText.innerText = score;
}

startGame();