const exams = [
  {
    id: 1,
    name: "Updated Exam Name",
    join_anytime: true,
    duration: 120,
    description: "Updated description for the exam",
    start_time: "2024-05-10T09:00:00.000Z",
    end_time: "2024-05-10T11:00:00.000Z",
    createdAt: "2024-05-02T18:11:00.000Z",
    updatedAt: "2024-05-02T18:47:42.000Z",
  },
  {
    id: 2,
    name: "Exam 2",
    join_anytime: true,
    duration: 10,
    description: "Description for Exam 2",
    start_time: null,
    end_time: null,
    createdAt: "2024-05-02T18:11:29.000Z",
    updatedAt: "2024-05-02T18:11:29.000Z",
  },
  {
    id: 3,
    name: "Updated Exam Name",
    join_anytime: false,
    duration: 120,
    description: "Updated exam description.",
    start_time: "2024-05-05T08:00:00.000Z",
    end_time: "2024-05-05T10:00:00.000Z",
    createdAt: "2024-05-02T18:17:02.000Z",
    updatedAt: "2024-05-05T14:38:47.000Z",
  },
  {
    id: 4,
    name: "Math Exam",
    join_anytime: true,
    duration: 90,
    description: "Test your math skills!",
    start_time: null,
    end_time: null,
    createdAt: "2024-05-05T13:49:19.000Z",
    updatedAt: "2024-05-05T13:49:19.000Z",
  },
];

// import { apiGet, apiPost } from "../../apiServices.js";
// console.log(localStorage.getItem("token"));
// let exams = apiGet("/api/exams/", localStorage.getItem("token"))
//   .then((exam) => {
//     exams = exam.data;
//     count = exam.count;
//     localStorage.setItem("count", count);
//     console.log("Fetched exams:", exam);
//     renderExams(exams);
//   })
//   .catch((error) => {
//     console.error("Error fetching exams:", error);
//   });

// Function to render exam cards
function renderExams() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();

  const filterState = document.getElementById("filterState").value;
  console.log(filterState);

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
    
    <div class="start">
      ${
        exam.join_anytime
          ? `<button class="start-btn" onclick="startExam('${exam.name}')">Start Exam</button>`
          : isWithinTimeRange(exam.start_time, exam.end_time)
          ? `<button class="start-btn" onclick="startExam('${exam.name}')">Start Exam</button>`
          : `<button disabled>Unavailable</button>`
      }
    </div>
    `;
    
    examsList.appendChild(examCard);
  });
}

// Function to check if the current time is within the specified time range
function isWithinTimeRange(startTime, endTime) {
  const currentTime = new Date().getTime();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return currentTime >= start && currentTime <= end;
}

// Function to start an exam (dummy function)
function startExam(examName) {
  window.location.href = "../../exam/html/index.html";
  alert(`Starting ${examName}...`);
  // Implement your logic to start the exam
}

// Initial rendering of exams
renderExams();

// Event listeners for input changes
document.getElementById("searchInput").addEventListener("input", renderExams);
document.getElementById("filterState").addEventListener("change", renderExams);
