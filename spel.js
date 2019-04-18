const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById('questionCounter');
const scoreText = document.getElementById('score');
const loader = document.getElementById('loading');
const spel = document.getElementById('spel');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availabeQuestions = [];
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
        loaded = xhr.response;

        loadedQuestions();
    }
}

xhr.open("GET", "https://opentdb.com/api.php?amount=10&category=11&difficulty=medium&type=multiple")
xhr.responseType = "json";
xhr.send();


loadedQuestions = ()=> {
    questions = loaded.results.map(loadedQuestion => {
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
}


const KORREKT_SVAR = 10; //Bestämmer antal poäng för korrekt svar
const MAX_FRÅGOR = 10; //Bestämmer antal frågor
startGame = () => {
    questionCounter =0;
    score = 0;
    availabeQuestions = [...questions];
    spel.classList.remove('hidden'); //Visar spelplanen
    loader.classList.add('hidden'); //Döljer loader
    getNewQuestion();
};

getNewQuestion = () => {

    if(availabeQuestions.length === 0 || questionCounter >= MAX_FRÅGOR){
        localStorage.setItem('mostRecentScore', score);

        return window.location.assign("/end.html");
    }

    questionCounter++;
    questionCounterText.innerText = questionCounter + "/" + MAX_FRÅGOR;
    //document.getElementById("myProgress").value = (questionCounter / MAX_FRÅGOR)* 100;//Ökar progressbar
    
    


    const questionIndex = Math.floor(Math.random() * availabeQuestions.length);
    currentQuestion = availabeQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;
    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availabeQuestions.splice(questionIndex, 1); // Tar bort frågan från availableQuestions arrayen

    acceptingAnswers = true; // Man får ta emot frågor igen
};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers){ return};

        acceptingAnswers = false;// Man får inte svara på samma fråga igen
        const selectedChoice = e.target; 
        const selectedAnswer = selectedChoice.dataset["number"];
        document.getElementById("myProgress").value = (questionCounter / MAX_FRÅGOR)* 100;//Ökar progressbar

        const classToApply = 
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';//Avgör vilken klass som skall användas

        if(classToApply == 'correct') {
            increaseScore(KORREKT_SVAR);
        }
        
        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => { //Väntar i en sekund för att programmet skall vara snyggt och inte ladda nästa fråga direkt
        selectedChoice.parentElement.classList.remove(classToApply);

        getNewQuestion();
        }, 1000);
    });
});

increaseScore = num => { //Hanterar poängräkning
    score +=num;
    scoreText.innerText = score;
}

startGame();