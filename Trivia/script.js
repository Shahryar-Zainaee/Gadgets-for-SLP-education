// Paste your Firebase config here
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzWYy20gqe68KUEJti1Kj5YLCsLWVfLW8",
  authDomain: "trivia-ef1de.firebaseapp.com",
  databaseURL: "https://trivia-ef1de-default-rtdb.firebaseio.com",
  projectId: "trivia-ef1de",
  storageBucket: "trivia-ef1de.firebasestorage.app",
  messagingSenderId: "954650809422",
  appId: "1:954650809422:web:3f9758bfb11d57ddf81f1f",
  measurementId: "G-6RVHEQ5XKV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let playerName = "";
let playerId = "";
let currentQuestionIndex = 0;
let questions = [];
let answeredPlayers = {};

function joinGame() {
  playerName = document.getElementById("playerName").value.trim();
  if (!playerName) return alert("Enter your name!");

  const newPlayerRef = db.ref("players").push({ name: playerName, score: 0 });
  playerId = newPlayerRef.key;

  document.getElementById("login-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";

  db.ref("questions").once("value").then((snapshot) => {
    questions = snapshot.val();
    showQuestion();
  });
}

function showQuestion() {
  const q = questions[currentQuestionIndex];
  document.getElementById("question-text").innerText = q.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => submitAnswer(opt);
    optionsDiv.appendChild(btn);
  });

  document.getElementById("feedback").innerText = "";
}

function submitAnswer(selected) {
  const correct = questions[currentQuestionIndex].answer;
  const isCorrect = selected === correct;

  db.ref("answers/" + playerId).set({
    question: currentQuestionIndex,
    answer: selected,
    correct: isCorrect
  });

  document.getElementById("feedback").innerText = isCorrect ? "✅ Correct!" : "❌ Wrong!";
}

function startGame() {
  db.ref("questions").set([
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Rome"],
      answer: "Paris"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Venus", "Mars", "Jupiter"],
      answer: "Mars"
    }
  ]);
}
