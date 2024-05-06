 // JavaScript code
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

const users = [
  { name: "John Doe", email: "john@example.com" },
  { name: "Jane Smith", email: "jane@example.com" },
  // Add more user data as needed
];

const statistics = [
  {
    exam: "Practice Exam 1",
    participants: 50,
    completionPercentage: 80,
    averageScore: 85,
  },
  {
    exam: "Midterm Exam 1",
    participants: 100,
    completionPercentage: 90,
    averageScore: 75,
  },
  // Add more statistics data as needed
];

// Render exam table
function renderExamTable() {
  const examTableBody = document
    .getElementById("examTable")
    .getElementsByTagName("tbody")[0];
  examTableBody.innerHTML = "";

  exams.forEach((exam, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${exam.name}</td>
    <td>${exam.category}</td>
    <td>${exam.state}</td>
    <td>
      <button onclick="editExam(${index})">Edit</button>
      <button onclick="deleteExam(${index})">Delete</button>
    </td>
  `;
    examTableBody.appendChild(row);
  });
}

// Render user table
function renderUserTable() {
  const userTableBody = document
    .getElementById("userTable")
    .getElementsByTagName("tbody")[0];
  userTableBody.innerHTML = "";

  users.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${user.name}</td>
    <td>${user.email}</td>
    <td>
      <button onclick="editUser(${index})">Edit</button>
      <button onclick="deleteUser(${index})">Delete</button>
    </td>
  `;
    userTableBody.appendChild(row);
  });
}

// Render statistics table
function renderStatisticsTable() {
  const statisticsTableBody = document
    .getElementById("statisticsTable")
    .getElementsByTagName("tbody")[0];
  statisticsTableBody.innerHTML = "";

  statistics.forEach((stat) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${stat.exam}</td>
    <td>${stat.participants}</td>
    <td>${stat.completionPercentage}%</td>
    <td>${stat.averageScore}</td>
  `;
    statisticsTableBody.appendChild(row);
  });
}

// Open exam modal
function openExamModal(exam = null, index = "") {
  const modal = document.getElementById("examModal");
  const form = document.getElementById("examForm");

  if (exam) {
    form.elements.examName.value = exam.name;
    form.elements.examCategory.value = exam.category;
    form.elements.examState.value = exam.state;
    form.elements.startTime.value = exam.startTime;
    form.elements.endTime.value = exam.endTime;
    form.dataset.index = index; // Set index to form dataset
  } else {
    form.reset();
    form.dataset.index = ""; // Reset index when adding new exam
  }

  modal.style.display = "block";
}

// Open user modal
function openUserModal(user = null, index = "") {
  const modal = document.getElementById("userModal");
  const form = document.getElementById("userForm");

  if (user) {
    form.elements.userName.value = user.name;
    form.elements.userEmail.value = user.email;
    form.dataset.index = index;
  } else {
    form.reset();
    form.dataset.index = "";
  }

  modal.style.display = "block";
}

// Close modal
function closeModal() {
  const modals = document.getElementsByClassName("modal");
  for (let i = 0; i < modals.length; i++) {
    modals[i].style.display = "none";
  }
}

// Edit exam
function editExam(index) {
  const exam = exams[index];
  openExamModal(exam, index); // Pass index to know which exam to update
}

// Delete exam
function deleteExam(index) {
  exams.splice(index, 1);
  renderExamTable();
}

// Edit user
function editUser(index) {
  const user = users[index];
  openUserModal(user, index);
}

// Delete user
function deleteUser(index) {
  users.splice(index, 1);
  renderUserTable();
}

// Handle exam form submission
function handleExamFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const index = form.dataset.index; // Retrieve index from form dataset

  const exam = {
    name: form.elements.examName.value,
    category: form.elements.examCategory.value,
    state: form.elements.examState.value,
    startTime: form.elements.startTime.value,
    endTime: form.elements.endTime.value,
  };

  if (index !== "") { // If index exists, update existing exam
    exams[index] = exam;
  } else { // Otherwise, it's a new exam, so add it
    exams.push(exam);
  }

  renderExamTable();
  closeModal();
}

// Handle user form submission
function handleUserFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const index = form.dataset.index;

  const user = {
    name: form.elements.userName.value,
    email: form.elements.userEmail.value,
  };

  if(index !== ""){
    users[index] = user;
  }
  else{
    users.push(user);
  }
  
  renderUserTable();
  closeModal();
}

// Event listeners
document
  .getElementById("createUserBtn")
  .addEventListener("click", () => openUserModal());
document
  .getElementById("examForm")
  .addEventListener("submit", handleExamFormSubmit);
document
  .getElementById("userForm")
  .addEventListener("submit", handleUserFormSubmit);
document
  .getElementsByClassName("close")[0]
  .addEventListener("click", closeModal);
document
  .getElementsByClassName("close")[1]
  .addEventListener("click", closeModal);

// Initial render
renderExamTable();
renderUserTable();
renderStatisticsTable();
