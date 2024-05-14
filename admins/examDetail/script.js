import { apiGet, apiPost, apiDelete } from "../../apiServices.js";

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

function getExamQuestions() {
  var exam_id = localStorage.getItem("exam_id");
  apiGet(
    `/api/questions/all-question/${exam_id}`,
    localStorage.getItem("token")
  ).then((response) => {
    console.log(response);
    localStorage.setItem("questions", JSON.stringify(response));
    addQuestionsToList(response);
  });
}
getExamQuestions();

//get all questions?
function addQuestionsToList(jsonData) {
  const questionList = document.getElementById("question-list");

  jsonData.forEach((questionObj, index) => {
    const question = questionObj.question;
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

function logout() {
  window.location.href = "../../auth/index.html";
}

function DeleteCurrent() {
  const exam_id = localStorage.getItem("exam_id");
  apiDelete(`/api/exams/${exam_id}`, localStorage.getItem("token"))
    .then((response) => {
      alert("Delete Sucessfully!");
      window.location.href = `../dashboard/index.html?reload=${Math.random()}`;
    })
    .catch((error) => {
      console.log("error: ", error);
    });
}

document.getElementById("logout").addEventListener("click", logout);
document.getElementById("delete").addEventListener("click", DeleteCurrent);

document.getElementById("edit-btn").addEventListener("click", function () {
  window.location.href = `../create/create.html?reload=${Math.random()}`;
});
