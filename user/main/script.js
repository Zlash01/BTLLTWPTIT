const exams = [
  { name: "Practice Exam 1", category: "Practice", state: "Join Anytime" },
  { name: "Practice Exam 2", category: "Practice", state: "Join Anytime" },
  {
    name: "Midterm Exam 1",
    category: "Midterm",
    state: "Specific Time",
    startTime: "2024-03-04T09:00:00",
    endTime: "2024-03-06T12:00:00",
  },
  { name: "Midterm Exam 2", category: "Midterm", state: "Join Anytime" },
  {
    name: "Endterm Exam 1",
    category: "Endterm",
    state: "Specific Time",
    startTime: "2024-03-15T09:00:00",
    endTime: "2024-03-16T12:00:00",
  },
  // Add more exam data as needed
];

// Function to render exam cards
function renderExams() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const filterState = document.getElementById("filterState").value;

  const filteredExams = exams.filter((exam) => {
    const nameMatch = exam.name.toLowerCase().includes(searchInput);
    const stateMatch = filterState === "all" || exam.state === filterState;

    return nameMatch && stateMatch;
  });

  const examsList = document.getElementById("examsList");
  examsList.innerHTML = "";

  filteredExams.forEach((exam) => {
    const examCard = document.createElement("div");
    examCard.classList.add("exam-card");

    let timeInfo = "";
    if (exam.state === "Specific Time") {
      const startDate = new Date(exam.startTime);
      const endDate = new Date(exam.endTime);
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
            <h3>${exam.name}</h3>
            <p>Category: ${exam.category}</p>
            <p>State: ${exam.state}</p>
            ${timeInfo}
            ${
              exam.state === "Specific Time"
                ? isWithinTimeRange(exam.startTime, exam.endTime)
                  ? `<button onclick="startExam('${exam.name}')">Start Exam</button>`
                  : `<button disabled>Unavailable</button>`
                : exam.state === "Join Anytime"
                ? `<button onclick="startExam('${exam.name}')">Start Exam</button>`
                : `<button disabled>Unavailable</button>`
            }
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
