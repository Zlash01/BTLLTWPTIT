import { apiGet, apiPost } from "../../apiServices.js";

var minsEl = document.getElementById("minutes");
var secsEl = document.getElementById("seconds");

var minsValue = parseInt(minsEl.textContent);
var secsValue = parseInt(secsEl.textContent);

function startExamParticipation() {
  // Retrieve exam ID and token from localStorage
  const exam_id = localStorage.getItem("exam_id");
  const token = localStorage.getItem("token");
  if (!exam_id || !token) {
    console.error("Exam ID or token not found in localStorage.");
    return;
  }

  // Make API POST request to start exam participation
  apiPost(`/api/participations/exams/${exam_id}/start`, {}, token)
    .then((response) => {
      console.log("Participation: ", response);

      // Check if total_questions is available in the response
      if (response.total_questions !== undefined) {
        const total_questions = response.total_questions;
        localStorage.setItem("total_questions", total_questions);
        console.log("Successful! Total questions:", total_questions);
      } else {
        console.error("Total questions not found in the response.");
      }
    })
    .catch((error) => {
      console.error("Error creating participation: ", error);
    });
}
startExamParticipation();

//get time for exams?
function getDataExams() {
  const id = localStorage.getItem("exam_id");
  apiGet(`/api/exams/${id}`, localStorage.getItem("token"))
    .then((response) => {
      console.log("Exam response:", response);
      const total_time = response.duration;
      localStorage.setItem("total_time", total_time);
    })
    .catch((error) => {
      console.error("Error fetching exams:", error);
    });
}
getDataExams();

function getExamQuestions() {
  var exam_id = localStorage.getItem("exam_id");
  apiGet(
    `/api/questions/all-question/${exam_id}`,
    localStorage.getItem("token")
  ).then((response) => {
    console.log(response);
    addQuestionsToWeb(response);
  });
}
getExamQuestions();

function countdownTimer() {
  const countDownDate =
    new Date().getTime() + localStorage.getItem("total_time") * 60 * 1000;
  const second = 1000;
  const minute = second * 60;

  const interval = setInterval(() => {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    minsEl.innerText = formatNumber(Math.floor(distance / minute));
    secsEl.innerText = formatNumber(Math.floor((distance % minute) / second));

    if (distance <= 0) {
      clearInterval(interval);
      minsEl.innerText = "00";
      secsEl.innerText = "00";
      document.getElementById("testForm").submit();

      // Display score after timer expires
      var formData = new FormData(document.getElementById("testForm"));
      var correctAnswers = document.querySelectorAll('input[type="hidden"]');
      var score = 0;

      for (let i = 0; i < correctAnswers.length; i++) {
        if (formData.get("question" + (i + 1)) === correctAnswers[i].value) {
          score++;
        }
      }

      window.location.href = "../results/html/index.html?score=" + score;
    }
  }, 1000);
}

function formatNumber(number) {
  if (number < 10) {
    return "0" + number;
  }
  return number;
}

countdownTimer();

document.getElementById("submitButton").addEventListener("click", function () {
  var formData = new FormData(document.getElementById("testForm"));
  var correctAnswers = document.querySelectorAll('input[type="hidden"]');
  var score = 0;

  for (let i = 0; i < correctAnswers.length; i++) {
    if (formData.get("question" + (i + 1)) === correctAnswers[i].value) {
      score++;
    }
  }

  window.location.href = "../results/index.html?score=" + score;
});

// Function to dynamically add questions to the web
function addQuestionsToWeb(questionsData) {
  const questionsContainer = document.getElementById("questions-container");

  questionsData.forEach((questionData, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");

    const questionNumber = document.createElement("p");
    questionNumber.classList.add("question-number");
    questionNumber.textContent = `Question ${index + 1}`;
    questionDiv.appendChild(questionNumber);

    const questionText = document.createElement("p");
    questionText.classList.add("question-text");
    questionText.textContent = questionData.question.question_text;
    questionDiv.appendChild(questionText);

    const answersList = document.createElement("ul");
    questionData.question.answers.forEach((answer, answerIndex) => {
      const answerItem = document.createElement("li");
      const answerLabel = document.createElement("label");
      const answerInput = document.createElement("input");
      answerInput.type = "radio";
      answerInput.name = `question-${questionData.question.id}`;
      answerInput.value = answer.id;
      answerInput.dataset.questionId = questionData.question.id;
      answerInput.dataset.answerId = answer.id;
      answerLabel.appendChild(answerInput);
      answerLabel.appendChild(document.createTextNode(`${answer.answer_text}`));
      answerItem.appendChild(answerLabel);
      answersList.appendChild(answerItem);
    });
    questionDiv.appendChild(answersList);
    questionsContainer.appendChild(questionDiv);
  });
}

function checkbox() {
  const testForms = document.getElementsByClassName("testform");
  const boxContainer = document.getElementById("box-container");

  // Loop through each test form (assuming there's only one)
  Array.from(testForms).forEach(function (testForm) {
    // Get all questions and their corresponding radio buttons within the current test form
    const questions = testForm.querySelectorAll(".question");
    console.log("debugginnnn", questions.length);
    // Create question indicator buttons dynamically
    questions.forEach(function (question, index) {
      const button = document.createElement("button");
      button.className = "indicatorButton";
      button.id = "button" + (index + 1);
      button.textContent = index + 1; // Display question number (1-based index)
      boxContainer.appendChild(button);

      // Scroll to the corresponding question when button is clicked
      button.addEventListener("click", function () {
        // Get the position of the target question element
        const targetQuestion = question; // Use the current question element directly

        if (targetQuestion) {
          const targetQuestionPosition =
            targetQuestion.getBoundingClientRect().top + window.pageYOffset;

          // Scroll to the target question element
          window.scrollTo({
            top: targetQuestionPosition - 100,
            behavior: "smooth", // Smooth scrolling effect
          });
        } else {
          console.error(`Question ${index + 1} not found.`);
        }
      });

      const radioButtons = question.querySelectorAll('input[type="radio"]');
      radioButtons.forEach(function (radioButton) {
        radioButton.addEventListener("change", function () {
          if (this.checked) {
            // Change color of the corresponding button to green when radio button is checked
            button.style.backgroundColor = "#4CAF50";
          }
        });
      });
    });
  });
}
checkbox();

document.addEventListener("DOMContentLoaded", checkbox);
