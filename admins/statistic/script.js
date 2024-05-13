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

// Populate exam filter options
const examFilter = document.getElementById("exam-filter");
const uniqueExams = [...new Set(studentResults.map((result) => result.exam))];
uniqueExams.forEach((exam) => {
  const option = document.createElement("option");
  option.value = exam;
  option.textContent = exam;
  examFilter.appendChild(option);
});

// Render table rows
function renderTableRows(filteredResults) {
  const tableBody = document.querySelector("#results-table tbody");
  tableBody.innerHTML = "";

  filteredResults.forEach((result) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = result.name;
    row.appendChild(nameCell);

    const examCell = document.createElement("td");
    examCell.textContent = result.exam;
    row.appendChild(examCell);

    const entriesCell = document.createElement("td");
    entriesCell.textContent = result.entries;
    row.appendChild(entriesCell);

    const completionCell = document.createElement("td");
    completionCell.textContent = `${result.completionPercentage}%`;
    row.appendChild(completionCell);

    const avgPointCell = document.createElement("td");
    avgPointCell.textContent = result.avgPoint;
    row.appendChild(avgPointCell);

    const pointsCell = document.createElement("td");
    pointsCell.textContent = result.points.join(", ");
    row.appendChild(pointsCell);

    tableBody.appendChild(row);
  });
}

// Filter results based on selected exam and date
function filterResults() {
  const selectedExam = examFilter.value;
  const selectedDate = document.getElementById("date-filter").value;

  let filteredResults = studentResults;

  if (selectedExam) {
    filteredResults = filteredResults.filter(
      (result) => result.exam === selectedExam
    );
  }

  if (selectedDate) {
    const examDate = new Date(selectedDate);
    filteredResults = filteredResults.filter((result) => {
      const exam = exams.find((e) => e.name === result.exam);
      if (exam.state === "specificTime") {
        const examStartDate = new Date(exam.startTime);
        const examEndDate = new Date(exam.endTime);
        return examDate >= examStartDate && examDate <= examEndDate;
      }
      return true;
    });
  }

  renderTableRows(filteredResults);
}

// Initial table render
renderTableRows(studentResults);

// Event listeners
examFilter.addEventListener("change", filterResults);
document
  .getElementById("date-filter")
  .addEventListener("change", filterResults);

// Export to PDF
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('export-btn').addEventListener('click', () => {
    const doc = new jspdf.jsPDF();

    if (typeof doc.autoTable !== 'undefined') {
      const table = document.getElementById('results-table');
      doc.autoTable({ html: table });
      doc.save('student-results.pdf');
    } else {
      console.error('jspdf-autotable plugin is not loaded correctly.');
    }
  });
});
const ctx = document.getElementById('myChart').getContext('2d');

// Chuẩn bị dữ liệu cho biểu đồ
const labels = studentResults.map(result => result.name);
const data = {
  labels: labels,
  datasets: [
    {
      label: 'Điểm trung bình',
      data: studentResults.map(result => result.avgPoint),
      backgroundColor: 'rgba(255, 99, 132, 0.5)', // Màu nền cột biểu đồ
      borderColor: 'rgba(255, 99, 132, 1)', // Màu viền cột biểu đồ
      borderWidth: 1
    }
  ]
};

// Tạo biểu đồ cột
const myChart = new Chart(ctx, {
  type: 'bar',
  data: data,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          font: {
            size: 12,
            color: 'rgba(255, 99, 132, 1)' // Màu phông chữ trục y
          }
        },
        grid: {
          color: 'rgba(255, 99, 132, 0.2)' // Màu đường lưới trục y
        }
      },
      x: {
        ticks: {
          font: {
            size: 14,
            color: 'rgba(255, 99, 132, 1)' // Màu phông chữ trục x
          }
        },
        grid: {
          color: 'rgba(255, 99, 132, 0.2)' // Màu đường lưới trục x
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 15,
            color: 'rgba(255, 99, 132, 1)' // Màu phông chữ hộp thoại chú giải
          }
        }
      }
    }
  }
});
