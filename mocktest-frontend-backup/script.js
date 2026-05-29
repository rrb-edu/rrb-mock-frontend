let tabWarnings = 0;
let activeSection = "General Awareness";
if(localStorage.getItem("examStarted") !== "yes"){
  window.location.href = "login.html";
}
document.getElementById("candidateName").innerText =
  localStorage.getItem("candidateName");
let totalTime =
  Number(localStorage.getItem("savedTime")) ||
  90 * 60;

document.getElementById("rollNumber").innerText =
  localStorage.getItem("candidateRoll");

function startTimer(){

  let timer = setInterval(()=>{

    let minutes =
      Math.floor(totalTime / 60);

    let seconds =
      totalTime % 60;

    seconds =
      seconds < 10 ? "0" + seconds : seconds;

    document.getElementById("timer")
    .innerText =
      `${minutes}:${seconds}`;

     totalTime--;

localStorage.setItem(
  "savedTime",
  totalTime
);

    if(totalTime < 0){

      clearInterval(timer);

      alert("Time Over!");

      submitTest();
    }

  },1000);

}
let selectedTest =
  localStorage.getItem("selectedTest") || "free";

let allAdminQuestions =
  JSON.parse(localStorage.getItem("adminQuestions")) || [];

let questions = [];

if(selectedTest === "premium"){

  questions =
    allAdminQuestions.filter(q =>
      q.testType === "premium"
    );

}
else{

  questions =
    allAdminQuestions.filter(q =>
      q.testType !== "premium"
    );

}

if(questions.length === 0){

  questions = [];

  for(let i = 1; i <= 120; i++){

    questions.push({
      q: `${selectedTest.toUpperCase()} Sample Question ${i}: Who was the Chief Election Commissioner of India as of November 2020?`,
      options: [
        "Sushil Chandra",
        "Ashok Lavasa",
        "Ranjit Sinha",
        "Sunil Arora"
      ],
      answer: 3,
      image: "",
      category: "General Awareness",
      testType: selectedTest
    });

  }

}
document.getElementById("examTitle").innerText =
  selectedTest === "premium"
  ? "🌟 PREMIUM MOCK TEST"
  : "FREE MOCK TEST";

  for(let i = 1; i <= 120; i++){

    questions.push({
      q: `Sample Question ${i}: Who was the Chief Election Commissioner of India as of November 2020?`,
      options: [
        "Sushil Chandra",
        "Ashok Lavasa",
        "Ranjit Sinha",
        "Sunil Arora"
      ],
      answer: 3
    });

  }



let currentQuestion = 0;
let answers = Array(questions.length).fill(null);
let review = Array(questions.length).fill(false);
let visited = Array(questions.length).fill(false);
if(localStorage.getItem("savedAnswers")){
  answers = JSON.parse(localStorage.getItem("savedAnswers"));
}

if(localStorage.getItem("savedReview")){
  review = JSON.parse(localStorage.getItem("savedReview"));
}

if(localStorage.getItem("savedVisited")){
  visited = JSON.parse(localStorage.getItem("savedVisited"));
}

function loadQuestion(){
  visited[currentQuestion] = true;


  let section =
  questions[currentQuestion].category ||
  "General Awareness";

document.getElementById("sectionName").innerText =
  "Section: " + section;

  document.getElementById("questionNumber").innerText =
  "Question No. " + (currentQuestion + 1);

document.getElementById("questionText").innerText =
questions[currentQuestion].q;

let imageHTML = "";

if(questions[currentQuestion].image){

  imageHTML = `
    <img
      src="${questions[currentQuestion].image}"
      class="question-image"
    >
  `;

}
let optionsBox = document.getElementById("optionsBox");

optionsBox.innerHTML = imageHTML;
  questions[currentQuestion].options.forEach((opt, index)=>{
    optionsBox.innerHTML += `
      <label class="option">
        <input type="radio" name="option" value="${index}"
        ${answers[currentQuestion] === index ? "checked" : ""}>
        ${opt}
      </label>
    `;
  });

  updateGrid();
  updateStatus();
}

document.body.addEventListener("click", function(){
  if(document.fullscreenElement === null){
    document.documentElement.requestFullscreen();
  }
});

function saveAnswer(){
  let selected = document.querySelector('input[name="option"]:checked');

  if(selected){
    answers[currentQuestion] = Number(selected.value);
    review[currentQuestion] = false;
    localStorage.setItem("savedAnswers", JSON.stringify(answers));
localStorage.setItem("savedReview", JSON.stringify(review));
localStorage.setItem("savedVisited", JSON.stringify(visited));
  }
}

function saveNext(){
  saveAnswer();

  if(currentQuestion < questions.length - 1){
    currentQuestion++;
    loadQuestion();
  }
}

function markReview(){
  saveAnswer();
  review[currentQuestion] = true;

  if(currentQuestion < questions.length - 1){
    currentQuestion++;
    loadQuestion();
  }
}

function clearResponse(){
  answers[currentQuestion] = null;
  review[currentQuestion] = false;
  loadQuestion();
}


function updateGrid(){

  let grid = document.getElementById("questionGrid");
  grid.innerHTML = "";

  questions.forEach((q, index)=>{

    let bg = "#e5e7eb";
    let border = "none";
    let color = "black";

    if(q.category === activeSection){
      bg = "#fb923c";
      color = "white";
      border = "3px solid #ea580c";
    }

    if(answers[index] !== null){
      bg = "#22c55e";
      color = "white";
      border = "none";
    }

    if(review[index]){
      bg = "#a855f7";
      color = "white";
      border = "3px solid #581c87";
    }

    if(index === currentQuestion){
      bg = "#2563eb";
      color = "white";
      border = "3px solid #1e3a8a";
    }

    grid.innerHTML += `
      <button
        class="q-btn"
        onclick="goToQuestion(${index})"
        style="
          background:${bg};
          color:${color};
          border:${border};
        "
      >
        ${index + 1}
      </button>
    `;

  });

}

function goToQuestion(index){
  saveAnswer();
  currentQuestion = index;
  loadQuestion();
}

function updateStatus(){
  let answered = answers.filter(a => a !== null).length;
  let reviewed = review.filter(r => r === true).length;
  let visitedCount = visited.filter(v => v === true).length;
  let notVisited = questions.length - visitedCount;
  let notAnswered = visitedCount - answered;

  document.getElementById("answeredCount").innerText = answered;
  document.getElementById("reviewCount").innerText = reviewed;
  document.getElementById("notVisitedCount").innerText = notVisited;
  document.getElementById("notAnsweredCount").innerText = notAnswered;
}

function submitTest(){

  saveAnswer();

  let confirmSubmit =
    confirm("Are you sure you want to submit test?");

  if(!confirmSubmit) return;

  let correct = 0;
  let wrong = 0;
  let unanswered = 0;

  questions.forEach((q, index)=>{

    if(answers[index] === null){

      unanswered++;

    }
    else if(answers[index] === q.answer){

      correct++;

    }
    else{

      wrong++;

    }

  });

  let score =
    correct - (wrong * 0.33);

  let percentage =
    ((score / questions.length) * 100)
    .toFixed(2);

localStorage.setItem("examResult", JSON.stringify({
  correct: correct,
  wrong: wrong,
  unanswered: unanswered,
  score: score.toFixed(2),
  percentage: percentage
}));

localStorage.setItem("questionsData", JSON.stringify(questions));
localStorage.setItem("userAnswers", JSON.stringify(answers));
let leaderboard =
  JSON.parse(localStorage.getItem("leaderboard")) || [];

leaderboard.push({
  name: localStorage.getItem("candidateName"),
  roll: localStorage.getItem("candidateRoll"),
  score: Number(score.toFixed(2)),
  percentage: percentage
});

localStorage.setItem(
  "leaderboard",
  JSON.stringify(leaderboard)
);
localStorage.removeItem("savedTime");
localStorage.removeItem("examStarted");
fetch("https://rrb-mock-backend.onrender.com/api/results/save", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: localStorage.getItem("candidateName"),
    roll: localStorage.getItem("candidateRoll"),
    correct: correct,
    wrong: wrong,
    unanswered: unanswered,
    score: Number(score.toFixed(2)),
    percentage: percentage
  })
});
window.location.href = "result.html";

}

loadQuestion();
startTimer();

function prevQuestion(){
  saveAnswer();

  if(currentQuestion > 0){
    currentQuestion--;
    loadQuestion();
  }
}

function jumpSectionByName(sectionName){

  saveAnswer();

  activeSection = sectionName;

  let index = questions.findIndex(
    q => q.category === sectionName
  );

  if(index !== -1){

    currentQuestion = index;

    loadQuestion();

  }
  else{

    alert(sectionName + " questions not found");

  }

}

//dark mode toggle
function toggleTheme(){

  document.body.classList.toggle("dark");

  if(document.body.classList.contains("dark")){
    localStorage.setItem("theme", "dark");
  }
  else{
    localStorage.setItem("theme", "light");
  }

}

if(localStorage.getItem("theme") === "dark"){
  document.body.classList.add("dark");
}

function toggleSidebar(){
  document.querySelector(".side-panel").classList.toggle("show");
}

//loader
window.addEventListener("load", ()=>{

  setTimeout(()=>{

    document.getElementById("loader")
    .style.display = "none";

  },1500);

});


window.addEventListener("beforeunload", function(e){

  if(localStorage.getItem("examStarted") === "yes"){

    e.preventDefault();

    e.returnValue =
      "Exam is running. Are you sure you want to leave?";

  }

});

document.addEventListener("fullscreenchange", ()=>{

  if(
    localStorage.getItem("examStarted") === "yes"
  ){

    if(!document.fullscreenElement){

      fullscreenWarnings++;
      document.getElementById("fullscreenCount").innerText =
  fullscreenWarnings;
if(fullscreenWarnings >= 3){

  alert("Exam Auto Submitted");

  submitTest();

}
      alert(
        "Warning " +
        fullscreenWarnings +
        ": Do not exit fullscreen during exam!"
      );

      document.documentElement.requestFullscreen();

    }

  }

});

document.addEventListener("visibilitychange", function(){

  if(
    document.hidden &&
    localStorage.getItem("examStarted") === "yes"
  ){

    tabWarnings++;
    document.getElementById("tabCount").innerText =
  tabWarnings;

    alert(
      "Warning " +
      tabWarnings +
      ": Do not switch tabs during exam!"
    );

    if(tabWarnings >= 3){

      alert("Exam auto submitted due to tab switching.");

      submitTest();

    }

  }

});