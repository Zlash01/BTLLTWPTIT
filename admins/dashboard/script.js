import { apiGet } from "../../apiServices.js";

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

function getDataExams() {
  apiGet("/api/exams/", localStorage.getItem("token"))
    .then((response) => {
      console.log("Exam response:", response);
      // Check if the response is an array
      if (Array.isArray(response)) {
        // Store the array of exams in localStorage as a string
        localStorage.setItem("exams", JSON.stringify(response));
      } else {
        console.error(
          "Unexpected response format. Expected an array of exams."
        );
      }
    })
    .catch((error) => {
      console.error("Error fetching exams:", error);
    });
}

function showExamDetails(examId) {
  const id = examId;
  alert(id);
  localStorage.setItem("exam_id", id);
  window.location.href = "../examDetail/exam-details.html";
}

// Function to render exam cards
function renderExams() {
  const exams = JSON.parse(localStorage.getItem("exams"));
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const filterState = document.getElementById("filterState").value;
  const filteredExams = exams.filter((exam) => {
    const nameMatch = exam.name.toLowerCase().includes(searchInput);
    const stateMatch =
      filterState === "all" ||
      exam.join_anytime === (filterState === "anytime");
    return nameMatch && stateMatch;
  });

  const examsList = document.getElementById("examsList");
  examsList.innerHTML = "";

  filteredExams.forEach((exam) => {
    const examCard = document.createElement("div");
    examCard.classList.add("exam-card");
    let timeInfo = "";

    if (!exam.join_anytime) {
      const startDate = new Date(exam.start_time);
      const endDate = new Date(exam.end_time);
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      const formattedStartTime = startDate.toLocaleString("en-US", options);
      const formattedEndTime = endDate.toLocaleString("en-US", options);
      timeInfo = `<p>Start Time: ${formattedStartTime}</p><p>End Time: ${formattedEndTime}</p>`;
    }

    examCard.innerHTML = `
      <div class="exam-info">
        <h3>${exam.name}</h3>
        <p>Description: ${exam.description}</p>
        <p>Duration: ${exam.duration} minutes</p>
        <p>State: ${exam.join_anytime ? "Join Anytime" : "Specific Time"}</p>
        ${timeInfo}
      </div>
      <div class="more-details">
        <button class="details-btn" data-exam-id="${
          exam.id
        }">More Details</button>
      </div>
    `;

    examsList.appendChild(examCard);
  });

  // Add event listener after rendering exams
  const detailsButtons = document.querySelectorAll(".details-btn");
  detailsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const examId = button.dataset.examId;
      showExamDetails(examId);
    });
  });
}

function logout() {
  window.location.href = "../../auth/index.html";
}

setDataUser();
getDataExams();
renderExams();

document.getElementById("searchInput").addEventListener("input", renderExams);
document.getElementById("filterState").addEventListener("change", renderExams);
document.getElementById("logout").addEventListener("click", logout);

window.onload = function () {
  setDataUser();
  getDataExams();
  renderExams();
};
