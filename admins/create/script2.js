import { apiDelete, apiGet, apiPost } from "../../apiServices.js";

document.getElementById("joinAnytime").addEventListener("change", function () {
  var timeFields = document.getElementById("timeFields");
  var startTimeInput = document.getElementById("startTime");
  var endTimeInput = document.getElementById("endTime");

  if (this.checked) {
    timeFields.style.display = "block";
    startTimeInput.disabled = false;
    endTimeInput.disabled = false;
  } else {
    startTimeInput.disabled = true;
    endTimeInput.disabled = true;
  }
});

document.getElementById("create-exam").addEventListener("click", function () {
  var name = document.getElementById("examName").value;
  var description = document.getElementById("examDescription").value;
  var duration = document.getElementById("examDuration").value;
  var check = document.getElementById("joinAnytime");
  var start_time = document.getElementById("startTime").value;
  var end_time = document.getElementById("endTime").value;

  var examData = {
    name: name,
    description: description,
    duration: duration,
  };

  if (check.checked) {
    if (start_time && end_time) {
      examData.join_anytime = false;
      examData.start_time = new Date(start_time); // Assuming start_time is a valid date string
      examData.end_time = new Date(end_time); // Assuming end_time is a valid date string
    } else {
      alert("Please provide both start and end times.");
    }
  } else {
    examData.join_anytime = true;
  }

  console.log(JSON.stringify(examData, null, 2));
  apiPost("/api/exams", examData, localStorage.getItem("token"))
    .then((response) => {
      localStorage.setItem("exam_id", response.id);
      console.log("Exam created successfully:", response);
      alert("Create sucessfully!");
    })
    .catch((error) => {
      console.error("Error creating exam:", error);
    });
});

document
  .getElementById("question__submit")
  .addEventListener("click", function () {
    var question = document.getElementById("question").value;
    var answer1 = document.getElementById("ans_1").value;
    var answer2 = document.getElementById("ans_2").value;
    var answer3 = document.getElementById("ans_3").value;
    var answer4 = document.getElementById("ans_4").value;
    const radioButtons = document.querySelectorAll('input[name="correct"]');
    const selectedRadio = Array.from(radioButtons).find(
      (radio) => radio.checked
    );
    const selectedValue = selectedRadio ? selectedRadio.value : null;
    var questionData = {
      question_text: question,
      exam_id: localStorage.getItem("exam_id"),
    };

    apiPost("/api/questions/", questionData, localStorage.getItem("token"))
      .then((response) => {
        const questionId = response.id;
        localStorage.setItem("newQuestionId", questionId);

        // Add 4 answers for the new question
        const answerData1 = {
          answer_text: answer1,
          is_correct: selectedValue === "1",
          question_id: questionId,
        };
        apiPost("/api/answers/", answerData1, localStorage.getItem("token"));

        const answerData2 = {
          answer_text: answer2,
          is_correct: selectedValue === "2",
          question_id: questionId,
        };
        apiPost("/api/answers/", answerData2, localStorage.getItem("token"));

        const answerData3 = {
          answer_text: answer3,
          is_correct: selectedValue === "3",
          question_id: questionId,
        };
        apiPost("/api/answers/", answerData3, localStorage.getItem("token"));

        const answerData4 = {
          answer_text: answer4,
          is_correct: selectedValue === "4",
          question_id: questionId,
        };
        apiPost("/api/answers/", answerData4, localStorage.getItem("token"));
        alert("Question added successfully!");
      })
      .catch((error) => {
        console.error("Error posting question:", error);
      });
    bundle();
    console.log("Question added successfully!");
  });

function getExamQuestions() {
  var exam_id = localStorage.getItem("exam_id");
  apiGet(
    `/api/questions/all-question/${exam_id}`,
    localStorage.getItem("token")
  ).then((response) => {
    console.log(response);
    addQuestionsToList(response);
  });
}

function addQuestionsToList(jsonData) {
  // const jsonData = JSON.parse(localStorage.getItem("questions"));
  console.log("fdsafksajlk", jsonData);
  const questionList = document.getElementById("ctn-question");

  jsonData.forEach((questionObj, index) => {
    const question = questionObj.question;
    const questionContainer = document.createElement("div");
    questionContainer.classList.add("questionContainer");

    const questionFlex = document.createElement("div");
    questionFlex.classList.add("question-flex");

    const questionText = document.createElement("p");
    questionText.classList.add("question");
    questionText.textContent = `Question ${index + 1}: ${
      question.question_text
    }`;
    questionFlex.appendChild(questionText);

    question.answers.forEach((answer, answerIndex) => {
      const answerText = document.createElement("p");
      answerText.classList.add("answer");
      if (answer.is_correct) {
        answerText.classList.add("true");
      } else {
        answerText.classList.add("false");
      }
      answerText.textContent = answer.answer_text;
      questionFlex.appendChild(answerText);
    });

    questionContainer.appendChild(questionFlex);

    const examActions = document.createElement("div");
    examActions.classList.add("exam-actions");

    const editBtn = document.createElement("a");
    editBtn.classList.add("edit-btn");
    editBtn.href = "#";
    const editIcon = document.createElement("i");
    editIcon.classList.add("fa", "fa-pencil");
    editBtn.appendChild(editIcon);
    const editText = document.createTextNode(" Edit Question");
    editBtn.appendChild(editText);
    editBtn.addEventListener("click", () => {
      editQuestion(question.id);
    });
    examActions.appendChild(editBtn);

    const deleteBtn = document.createElement("a");
    deleteBtn.classList.add("delete-exam-btn");
    deleteBtn.id = `delete-${index}`;
    deleteBtn.textContent = "Delete Question";
    deleteBtn.addEventListener("click", () => {
      deleteQuestion(question.id);
    });
    examActions.appendChild(deleteBtn);

    questionContainer.appendChild(examActions);
    questionList.appendChild(questionContainer);
  });
}

function editQuestion(questionId) {
  console.log(`Edit Question with ID: ${questionId}`);

  apiGet(
    `/api/questions/single-question/${questionId}`,
    localStorage.getItem("token")
  )
    .then((response) => {
      console.log("question response:", response);

      // Get the question data from the response
      const questionData = response;

      // Get the HTML elements
      const questionInput = document.getElementById("question");
      const ans1Input = document.getElementById("ans_1");
      const ans2Input = document.getElementById("ans_2");
      const ans3Input = document.getElementById("ans_3");
      const ans4Input = document.getElementById("ans_4");

      // Set the values of the input fields
      questionInput.value = questionData.question_text;
      ans1Input.value = questionData.answers[0].answer_text;
      ans2Input.value = questionData.answers[1].answer_text;
      ans3Input.value = questionData.answers[2].answer_text;
      ans4Input.value = questionData.answers[3].answer_text;

      // Create radio buttons for each answer
      const answerContainer = document.createElement("div");
      questionData.answers.forEach((answer, index) => {
        const radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.name = "correct";
        radioButton.value = index + 1;
        radioButton.checked = answer.is_correct;

        const label = document.createElement("label");
        label.textContent = `Answer ${index + 1}`;

        answerContainer.appendChild(radioButton);
        answerContainer.appendChild(label);
      });

      // Append the answer container to the page
      document.body.appendChild(answerContainer);
      deleteEdit(questionId);
    })
    .catch((error) => {
      console.log("error: ", error);
    });
}

function deleteEdit(questionId) {
  apiDelete(
    `/api/questions/${questionId}`,
    localStorage.getItem("token")
  ).catch((error) => {
    console.log("error: ", error);
  });
}

function deleteQuestion(questionId) {
  console.log(`Delete Question with ID: ${questionId}`);
  // Add your code to handle deleting the question here
  apiDelete(
    `/api/questions/${questionId}`,
    localStorage.getItem("token")
  ).catch((error) => {
    console.log("error: ", error);
  });
  alert("Delete Sucessfully!");
  window.location.href = `./create.html?reload=${Math.random()}`;
}

function bundle() {
  const id = localStorage.getItem("exam_id");
  if (id != 0) {
    getExamQuestions();
    addQuestionsToList();
  }
}

window.onload = bundle;

function logout() {
  window.location.href = "../../auth/index.html";
}
document.getElementById("logout").addEventListener("click", logout);

function setDataUser() {
  // Retrieve the JSON string from localStorage
  apiGet("/api/users/current", localStorage.getItem("token")).then(
    (response) => {
      const name = response.name;
      const usernameElement = document.getElementById("username");
      usernameElement.textContent = name;
    }
  );
}
setDataUser();
