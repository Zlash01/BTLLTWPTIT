import { apiGet, apiPost } from "../../apiServices.js";

function setDataUser() {
  // Retrieve the JSON string from localStorage
  const id = localStorage.getItem("userid");
  apiGet("/api/users/current", localStorage.getItem("token")).then(
    (response) => {
      const name = response.name;
      const usernameElement = document.getElementById("username");
      usernameElement.textContent = name;
    }
  );
}
setDataUser();

function getDataExams() {
  const id = localStorage.getItem("exam_id");
  apiGet(`/api/exams/${id}`, localStorage.getItem("token"))
    .then((response) => {
      console.log("Exam response:", response);
      const totalTime = response.duration;
      localStorage.setItem("total_time", totalTime);

      // Update HTML elements with exam data
      document.getElementById("exam-title").textContent = response.name;
      document.getElementById("exam-description").textContent =
        response.description;
      document.getElementById("duration").textContent = response.duration;
    })
    .catch((error) => {
      console.error("Error fetching exams:", error);
    });
}
getDataExams();

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

function addQuestionsToList() {
  const jsonData = JSON.parse(localStorage.getItem("questions"));

  const questionList = document.getElementById("question-list");

  jsonData.forEach((question, index) => {
    const questionBox = document.createElement("div");
    questionBox.classList.add("question-box");

    const questionText = document.createElement("p");
    questionText.innerHTML = `<strong>Question ${index + 1}:</strong> ${
      question.question_text
    }`;
    questionBox.appendChild(questionText);

    const answersDiv = document.createElement("div");
    answersDiv.classList.add("answers");
    questionBox.appendChild(answersDiv);

    question.answers.forEach((answer, answerIndex) => {
      const answerDiv = document.createElement("div");

      const inputRadio = document.createElement("input");
      inputRadio.type = "radio";
      inputRadio.id = `q${index + 1}-a${answerIndex + 1}`;
      inputRadio.name = `q${index + 1}`;
      inputRadio.value = answer.answer_text;
      inputRadio.disabled = true; // Disable the radio buttons
      if (answer.is_correct) {
        inputRadio.checked = true;
      }
      answerDiv.appendChild(inputRadio);

      const labelRadio = document.createElement("label");
      labelRadio.htmlFor = `q${index + 1}-a${answerIndex + 1}`;
      labelRadio.textContent = answer.answer_text;
      answerDiv.appendChild(labelRadio);

      answersDiv.appendChild(answerDiv);
    });

    questionList.appendChild(questionBox);
  });
}
addQuestionsToList();

function logout() {
  window.location.href = "../../auth/index.html";
}

document.getElementById("logout").addEventListener("click", logout);
