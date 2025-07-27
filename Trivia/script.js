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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let playerName = "";
let playerId = "";
let currentQuestionIndex = 0;
let questions = [];
let hasAnswered = false;

function joinGame() {
  playerName = document.getElementById("playerName").value.trim();
  if (!playerName) return alert("Enter your name!");

  const newPlayerRef = db.ref("players").push({ name: playerName, score: 0 });
  playerId = newPlayerRef.key;

  document.getElementById("login-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";

  db.ref("questions").once("value").then((snapshot) => {
    questions = snapshot.val();
    if (!questions || questions.length === 0) {
      document.getElementById("question-text").innerText = "Waiting for host to start the game...";
      return;
    }
    showQuestion();
  });
}

function showQuestion() {
  if (currentQuestionIndex >= questions.length) {
    document.getElementById("question-text").innerText = "Game Over! Thanks for playing!";
    document.getElementById("options").innerHTML = "";
    return;
  }

  hasAnswered = false;
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
  if (hasAnswered) return;
  hasAnswered = true;

  const correct = questions[currentQuestionIndex].answer;
  const isCorrect = selected === correct;

  db.ref("answers/" + playerId + "/" + currentQuestionIndex).set({
    answer: selected,
    correct: isCorrect
  });

  if (isCorrect) {
    db.ref("players/" + playerId + "/score").get().then(snapshot => {
      const currentScore = snapshot.val() || 0;
      db.ref("players/" + playerId).update({ score: currentScore + 1 });
    });
  }

  document.getElementById("feedback").innerText = isCorrect ? "✅ Correct!" : "❌ Wrong!";

  // Go to next question after delay
  setTimeout(() => {
    currentQuestionIndex++;
    showQuestion();
  }, 1500);
}

function startGame() {
  const questions = [
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
  ];
  db.ref("questions").set(questions);
  alert("Game started. Players can now join.");
}
