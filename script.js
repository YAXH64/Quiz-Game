// Quiz Questions (now added manually)
const quizQuestions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2,
        difficulty: 1
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        correct: 1,
        difficulty: 2
    },
    {
        question: "Who developed the theory of relativity?",
        options: ["Isaac Newton", "Galileo Galilei", "Albert Einstein", "Nikola Tesla"],
        correct: 2,
        difficulty: 3
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["Elephant", "Whale Shark", "Blue Whale", "Giraffe"],
        correct: 2,
        difficulty: 2
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Au", "Ag", "Pb", "Fe"],
        correct: 0,
        difficulty: 1
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
        correct: 2,
        difficulty: 1
    },
    {
        question: "In which year did the Titanic sink?",
        options: ["1910", "1912", "1905", "1899"],
        correct: 1,
        difficulty: 2
    },
    {
        question: "Which element has the atomic number 1?",
        options: ["Oxygen", "Hydrogen", "Helium", "Carbon"],
        correct: 1,
        difficulty: 1
    },
    {
        question: "What is the square root of 64?",
        options: ["6", "7", "8", "9"],
        correct: 2,
        difficulty: 1
    },
    {
        question: "Who was the first president of the United States?",
        options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"],
        correct: 1,
        difficulty: 1
    }
];

// Quiz State
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 20;
let username = "";

// DOM Elements
const welcomeScreen = document.querySelector('.welcome-screen');
const quizArea = document.querySelector('.quiz-area');
const resultsScreen = document.querySelector('.results-screen');
const startBtn = document.getElementById('start-btn');
const usernameInput = document.getElementById('username');

// Quiz Initialization
startBtn.addEventListener('click', () => {
    if (usernameInput.value.trim()) {
        username = usernameInput.value.trim();
        welcomeScreen.classList.remove('active');
        quizArea.classList.add('active');
        loadQuestion();
        startTimer();
    }
});

function loadQuestion() {
    const questionEl = document.querySelector('.question');
    const optionsContainer = document.querySelector('.options-container');
    const progressEl = document.querySelector('.progress span');
    
    questionEl.textContent = quizQuestions[currentQuestion].question;
    optionsContainer.innerHTML = '';
    
    quizQuestions[currentQuestion].options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(index));
        optionsContainer.appendChild(button);
    });
    
    progressEl.textContent = `${currentQuestion + 1}/${quizQuestions.length}`;
}

function checkAnswer(selectedIndex) {
    clearInterval(timer);
    const options = document.querySelectorAll('.option-btn');
    
    if (selectedIndex === quizQuestions[currentQuestion].correct) {
        score += timeLeft * quizQuestions[currentQuestion].difficulty;
        options[selectedIndex].style.backgroundColor = '#2ecc71';
    } else {
        options[selectedIndex].style.backgroundColor = '#e74c3c';
        options[quizQuestions[currentQuestion].correct].style.backgroundColor = '#2ecc71';
    }
    
    options.forEach(option => option.disabled = true);
    
    setTimeout(() => {
        currentQuestion++;
        timeLeft = 20;
        document.querySelector('.timer span').textContent = timeLeft;
        
        if (currentQuestion < quizQuestions.length) {
            loadQuestion();
            startTimer();
        } else {
            showResults();
        }
    }, 1500);
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.querySelector('.timer span').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(null);
        }
    }, 1000);
}

function showResults() {
    quizArea.classList.remove('active');
    resultsScreen.classList.add('active');
    document.querySelector('.final-score').textContent = score;
    updateHighScores();
}

function updateHighScores() {
    const highscores = JSON.parse(localStorage.getItem('quizHighscores')) || [];
    highscores.push({ name: username, score: score });
    highscores.sort((a, b) => b.score - a.score);
    
    const highscoresList = document.querySelector('.highscores-list');
    highscoresList.innerHTML = highscores
        .slice(0, 5)
        .map((entry, index) => `
            <li>${index + 1}. ${entry.name} - ${entry.score}</li>
        `)
        .join('');
    
    localStorage.setItem('quizHighscores', JSON.stringify(highscores.slice(0, 5)));
}

// Restart Quiz
document.getElementById('restart-btn').addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    timeLeft = 20;
    resultsScreen.classList.remove('active');
    welcomeScreen.classList.add('active');
    document.querySelector('.score span').textContent = '0';
});
