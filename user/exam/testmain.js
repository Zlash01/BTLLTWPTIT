import { apiGet, apiPost, apiPut } from "../../apiServices.js";

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
        localStorage.setItem("participation_id", response.id);
        console.log("Successful! Total questions:", total_questions);
      } else {
        console.error("Total questions not found in the response.");
      }
    })
    .catch((error) => {
      console.error("Error creating participation: ", error);
    });
}

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

function getExamQuestions() {
  var exam_id = localStorage.getItem("exam_id");
  apiGet(
    `/api/questions/all-question/${exam_id}`,
    localStorage.getItem("token")
  )
    .then((response) => {
      console.log(response);
      addQuestionsToWeb(response);
    })
    .then(() => checkbox());
}

function submitExam() {
  //get all the questions id and answer (radio button) corresponding to the answer id
  const questions = document.querySelectorAll(".question");
  const answers = [];
  questions.forEach((question) => {
    const question_id = question.querySelector("input").dataset.questionId;
    const answer_id = question.querySelector("input:checked").dataset.answerId;
    answers.push({ question_id, answer_id });
  });

  let submitData = {
    participationId: localStorage.getItem("participation_id"),
    answers: answers,
  };
  console.log(submitData);

  apiPost(
    `/api/student-answers/${localStorage.getItem("participation_id")}`,
    submitData,
    localStorage.getItem("token")
  )
    .then((response) => {
      console.log("Submit response:", response);
    })
    .then(() => {
      apiPut(
        `/api/participations/exams/submit/${localStorage.getItem(
          "participation_id"
        )}`,
        {},
        localStorage.getItem("token")
      ).then((response) => {
        console.log("Submit exam response:", response);
        // window.location.href = "/user/exam/result.html";
      });
    })
    .catch((error) => {
      console.error("Error submitting exam:", error);
    });
}

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
      submitExam();
    }
  }, 1000);
}

function formatNumber(number) {
  if (number < 10) {
    return "0" + number;
  }
  return number;
}

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
    console.log("debug", questions.length);
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

countdownTimer();
startExamParticipation();
getDataExams();
getExamQuestions();
document.getElementById("submitButton").addEventListener("click", submitExam);
