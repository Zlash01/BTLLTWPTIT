const exams = [
  { name: "Practice Exam 1", category: "Practice", state: "joinAnytime" },
  { name: "Practice Exam 2", category: "Practice", state: "joinAnytime" },
  {
    name: "Midterm Exam 1",
    category: "Midterm",
    state: "specificTime",
    startTime: "2024-03-01T09:00:00",
    endTime: "2024-03-04T12:00:00",
  },
  { name: "Midterm Exam 2", category: "Midterm", state: "joinAnytime" },
  {
    name: "Endterm Exam 1",
    category: "Endterm",
    state: "specificTime",
    startTime: "2024-03-15T09:00:00",
    endTime: "2024-03-15T12:00:00",
  },
];

const studentResults = [
  {
    name: "John Doe",
    exam: "Practice Exam 1",
    entries: 10,
    completionPercentage: 80,
    avgPoint: 8.5,
    points: [7, 9, 8, 6, 10, 9, 8, 7, 9, 8],
  },
  {
    name: "Jane Smith",
    exam: "Practice Exam 1",
    entries: 8,
    completionPercentage: 75,
    avgPoint: 7.8,
    points: [6, 8, 9, 7, 8, 6, 9, 8],
  },
  {
    name: "Bob Johnson",
    exam: "Midterm Exam 1",
    entries: 12,
    completionPercentage: 90,
    avgPoint: 9.2,
    points: [10, 9, 8, 9, 10, 9, 8, 7, 10, 9, 10, 9],
  },
  {
    name: "Alice Williams",
    exam: "Midterm Exam 2",
    entries: 9,
    completionPercentage: 85,
    avgPoint: 8.7,
    points: [9, 8, 7, 9, 10, 8, 9, 8, 9],
  },
  {
    name: "Tom Brown",
    exam: "Endterm Exam 1",
    entries: 15,
    completionPercentage: 95,
    avgPoint: 9.5,
    points: [10, 9, 9, 10, 9, 8, 10, 9, 10, 9, 10, 9, 10, 10, 9],
  },
];

import { apiGet } from "../../apiServices.js";
let data = null;
function getDataStatistic() {
  // Retrieve the JSON string from localStorage
  apiGet("/api/participations/statistic", localStorage.getItem("token")).then(
    (response) => {
      data = response.data;
      console.log(data);
      renderTableRows(data);
    }
  );
}

// Populate exam filter options
const examFilter = document.getElementById("exam-filter");
const uniqueExams = [...new Set(studentResults.map((result) => result.exam))];
uniqueExams.forEach((exam) => {
  const option = document.createElement("option");
  option.value = exam;
  option.textContent = exam;
  examFilter.appendChild(option);
});

// hiển thị ngày theo dạng dd-mm-yyy
function convertDateFormat(dateStr) {
  return new Date(dateStr).toLocaleDateString();
}

// Render table rows
function renderTableRows(filteredResults) {
  const tableBody = document.querySelector("#results-table tbody");
  tableBody.innerHTML = "";

  filteredResults.forEach((result) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = result.user.name;
    row.appendChild(nameCell);

    const examCell = document.createElement("td");
    examCell.textContent = result.exam.name;
    row.appendChild(examCell);

    const startTimeCell = document.createElement("td");
    startTimeCell.textContent = convertDateFormat(result.start_time);
    row.appendChild(startTimeCell);

    const endTimeCell = document.createElement("td");
    endTimeCell.textContent = convertDateFormat(result.end_time);
    row.appendChild(endTimeCell);

    const scoreCell = document.createElement("td");
    scoreCell.textContent = result.score;
    row.appendChild(scoreCell);

    // const entriesCell = document.createElement("td");
    // entriesCell.textContent = result.entries;
    // row.appendChild(entriesCell);

    // const completionCell = document.createElement("td");
    // completionCell.textContent = `${result.completionPercentage}%`;
    // row.appendChild(completionCell);

    // const avgPointCell = document.createElement("td");
    // avgPointCell.textContent = result.avgPoint;
    // row.appendChild(avgPointCell);

    // const pointsCell = document.createElement("td");
    // pointsCell.textContent = result.points.join(", ");
    // row.appendChild(pointsCell);

    tableBody.appendChild(row);
  });
}

// Filter results based on selected exam and date
function filterResults() {
  const selectedExam = document.getElementById("exam-filter").value;
  const selectedDate = document.getElementById("date-filter").value;

  let filteredResults = data;

  if (selectedExam) {
    filteredResults = filteredResults.filter(
      (result) => result.exam.name === selectedExam
    );
  }

  if (selectedDate) {
    const examDate = convertDateFormat(selectedDate);

    console.log(examDate);
    // filteredResults = filteredResults.filter((result) => {
    //   //const exam = exams.find((e) => e.name === result.exam);
    //   // if (exam.state === "specificTime") {
    //   //   const examStartDate = new Date(exam.startTime);
    //   //   const examEndDate = new Date(exam.endTime);
    //   //   return examDate >= examStartDate && examDate <= examEndDate;
    //   // }
    //   // return true;
    // });
    filteredResults = filteredResults.filter((result) => {
      let startTimeData = convertDateFormat(result.start_time);
      return startTimeData === examDate; // Return the result of the comparison
    });
  }

  renderTableRows(filteredResults);
}

// Initial table render
//renderTableRows(studentResults);
getDataStatistic();

// Event listeners
// examFilter.addEventListener("change", filterResults);
// document
//   .getElementById("date-filter")
//   .addEventListener("change", filterResults);

// Export to PDF
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("export-btn").addEventListener("click", () => {
    const doc = new jspdf.jsPDF();

    if (typeof doc.autoTable !== "undefined") {
      const table = document.getElementById("results-table");
      doc.autoTable({ html: table });
      doc.save("student-results.pdf");
    } else {
      console.error("jspdf-autotable plugin is not loaded correctly.");
    }
  });
});

window.filterResults = filterResults;
