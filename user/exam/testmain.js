import { apiGet, apiPost } from "../../apiServices.js";

var minsEl = document.getElementById("minutes");
var secsEl = document.getElementById("seconds");

var minsValue = parseInt(minsEl.textContent);
var secsValue = parseInt(secsEl.textContent);

function startExamParticipation() {
  // Retrieve exam ID and token from localStorage
  const exam_id = localStorage.getItem("exam_id");
  const token = localStorage.getItem("token");
  // console.log(exam_id);
  // console.log(token);
  // Check if exam_id and token are available
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
//startExamParticipation();

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
//getDataExams();

//get all questions?
function getExamQuestions() {
  const exam_id = localStorage.getItem("exam_id");
  apiGet(`/api/questions/exam/${exam_id}`, localStorage.getItem("token"))
    .then((response) => {
      const questionsWithId = response.map(({ id, question_text }) => ({
        id,
        question_text,
        answers: [], // Initialize answers array for each question
      }));
      console.log(questionsWithId);
      localStorage.setItem("questions", JSON.stringify(questionsWithId));
    })
    .catch((error) => {
      console.error("Error fetching exams:", error);
    });
}
getExamQuestions();

// get all answers?
function getExamAnswers() {
  const questionsWithId = JSON.parse(localStorage.getItem("questions"));
  console.log(questionsWithId);
  const token = localStorage.getItem("token");
  const promises = questionsWithId.map(({ id, question_text }) => {
    return apiGet(`/api/answers/${id}`, token)
      .then((response) => {
        const answers = response.map(({ id, answer_text, is_correct }) => ({
          id,
          answer_text,
          is_correct,
        }));
        const question = questionsWithId.find((q) => q.id === id);
        question.answers = answers;
        //console.log(`Answers for question ${id} (${question_text}):`, answers);
      })
      .catch((error) => {
        console.error(
          `Error fetching answer for question ${id} (${question_text}):`,
          error
        );
      });
  });
  Promise.all(promises).then(() => {
    localStorage.setItem("questions", JSON.stringify(questionsWithId));
    console.log("All answers added to questions JSON.");
    console.log(questionsWithId);
  });
}
getExamAnswers();

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

document.addEventListener("DOMContentLoaded", function () {
  const testForms = document.getElementsByClassName("testform");
  const boxContainer = document.getElementById("box-container");

  // Loop through each test form (assuming there's only one)
  Array.from(testForms).forEach(function (testForm) {
    // Get all questions and their corresponding radio buttons within the current test form
    const questions = testForm.querySelectorAll(".question");

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
});

//added indcator generator

// Sample JSON data of questions and answers
const questionsData = [
  {
    id: 1,
    question_id: 1,
    question_text: "Triết học ra đời trong khoảng thời gian:",
    answers: [
      {
        answer_text: "Xuất hiện cùng lúc với sự xuất hiện của con người",
        is_correct: false,
      },
      {
        answer_text: "Từ khoảng thế kỉ VIII đến thế kỉ VI TCN",
        is_correct: true,
      },
      {
        answer_text: "Từ khoảng thế kỉ VI đến thế kỉ I TCN",
        is_correct: false,
      },
      {
        answer_text: "Từ khoảng thế kỉ I TCN đến thế kỉ III",
        is_correct: false,
      },
    ],
  },
  // Add more question objects here if needed
];

// Function to dynamically add questions to the web
function addQuestionsToWeb() {
  const questionsContainer = document.getElementById("questions-container");

  questionsData.forEach((question, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");

    const questionNumber = document.createElement("p");
    questionNumber.classList.add("question-number");
    questionNumber.textContent = `Question ${index + 1}`;
    questionDiv.appendChild(questionNumber);

    const questionText = document.createElement("p");
    questionText.classList.add("question-text");
    questionText.textContent = question.question_text;
    questionDiv.appendChild(questionText);

    const answersList = document.createElement("ul");
    question.answers.forEach((answer, answerIndex) => {
      const answerItem = document.createElement("li");
      const answerLabel = document.createElement("label");
      const answerInput = document.createElement("input");
      answerInput.type = "radio";
      answerInput.name = `question${index + 1}`;
      answerInput.value = `option${answerIndex + 1}`;
      answerLabel.appendChild(answerInput);
      answerLabel.appendChild(document.createTextNode(`${answer.answer_text}`));
      answerItem.appendChild(answerLabel);
      answersList.appendChild(answerItem);
    });

    questionDiv.appendChild(answersList);

    const correctAnswerInput = document.createElement("input");
    correctAnswerInput.type = "hidden";
    correctAnswerInput.name = `correct${index + 1}`;
    correctAnswerInput.value = `option${
      question.answers.findIndex((a) => a.is_correct) + 1
    }`;
    questionDiv.appendChild(correctAnswerInput);

    questionsContainer.appendChild(questionDiv);
  });
}

// Call the function to add questions to the web
addQuestionsToWeb();
