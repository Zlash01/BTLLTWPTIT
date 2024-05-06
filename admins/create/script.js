// Get references to the necessary HTML elements
const questionForm = document.querySelector(".question__main__form");
const questionContainer = document.querySelector(".ctn");
const importFileInput = document.getElementById("importFile");

questionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const question = document.getElementById("question").value;
  const answers = [];
  const correctAnswers = [];

  for (let i = 1; i <= 4; i++) {
    const answer = document.getElementById(`ans_${i}`).value;
    const isCorrect = document.getElementById(`correct-${i}`).checked;
    answers.push(answer);
    if (isCorrect) {
      correctAnswers.push(answer);
    }
  }

  // Create new question elements
  const [questionElement, answerContainer, buttonContainer] =
    createQuestionElements(question, answers, correctAnswers);

  // Append elements to the question container
  questionContainer.appendChild(questionElement);
  questionContainer.appendChild(answerContainer);
  questionContainer.appendChild(buttonContainer);

  // Reset the form
  questionForm.reset();
});

// Function to create question elements
function createQuestionElements(question, answers, correctAnswers) {
  const questionElement = document.createElement("div");
  questionElement.classList.add("displayed__question");

  const questionText = document.createElement("p");
  questionText.textContent = question;
  questionElement.appendChild(questionText);

  const answerContainer = document.createElement("div");
  answerContainer.classList.add("displayed__answer");

  answers.forEach((answer) => {
    const answerElement = document.createElement("p");
    answerElement.textContent = answer.startsWith("*")
      ? answer.slice(1)
      : answer;
    if (
      correctAnswers.includes(answer.startsWith("*") ? answer.slice(1) : answer)
    ) {
      answerElement.classList.add("correct__ans__green");
    }
    answerContainer.appendChild(answerElement);
  });

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("btn-container");

  const editButton = document.createElement("button");
  editButton.classList.add("edit-btn");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () =>
    editQuestion(questionElement, answerContainer, buttonContainer)
  );
  buttonContainer.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-btn");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () =>
    deleteQuestion(questionElement, answerContainer, buttonContainer)
  );
  buttonContainer.appendChild(deleteButton);

  return [questionElement, answerContainer, buttonContainer];
}

// Function to edit a question
function editQuestion(questionElement, answerContainer, buttonContainer) {
  const question = questionElement.querySelector("p").textContent;
  const answers = Array.from(
    answerContainer.querySelectorAll("p"),
    (p) => p.textContent
  );
  const correctAnswers = answers.filter((answer, index) => {
    const answerElement = answerContainer.querySelectorAll("p")[index];
    return answerElement.classList.contains("correct__ans__green");
  });

  // Fill the form with the question and answers
  document.getElementById("question").value = question;
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`ans_${i}`).value = answers[i - 1] || "";
    document.getElementById(`correct-${i}`).checked = correctAnswers.includes(
      answers[i - 1]
    );
  }

  // Remove the previous elements from the question container
  questionContainer.removeChild(questionElement);
  questionContainer.removeChild(answerContainer);
  questionContainer.removeChild(buttonContainer);
}

// Function to delete a question
function deleteQuestion(questionElement, answerContainer, buttonContainer) {
  questionContainer.removeChild(questionElement);
  questionContainer.removeChild(answerContainer);
  questionContainer.removeChild(buttonContainer);
}

// Function to import questions from a file
function importQuestions(file) {
  const fileReader = new FileReader();
  const fileExtension = file.name.split(".").pop().toLowerCase();

  fileReader.onload = () => {
    const data = new Uint8Array(fileReader.result);
    const workbook = XLSX.read(data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const questions = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      blankRows: false,
    });

    questions.forEach((question) => {
      const [questionText, ...answers] = question;
      const correctAnswers = answers
        .filter((answer) => answer.startsWith("*"))
        .map((answer) => answer.slice(1));

      const [questionElement, answerContainer, buttonContainer] =
        createQuestionElements(questionText, answers, correctAnswers);

      questionContainer.appendChild(questionElement);
      questionContainer.appendChild(answerContainer);
      questionContainer.appendChild(buttonContainer);
    });
  };

  if (fileExtension === "xlsx") {
    fileReader.readAsArrayBuffer(file);
  } else {
    console.error("Please select an Excel (.xlsx) file.");
  }
}

// Event listener for importing questions
importFileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  importQuestions(file);
});

function create(){
  alert("Create successfully!")
  window.location.href = "../../dashboard/html/index.html";
}