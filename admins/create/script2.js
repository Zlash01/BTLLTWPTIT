import { apiGet, apiPost } from "../../apiServices.js";

let flag = false;

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

document.getElementById("create-exam").addEventListener("click", function () {
  var question = document.getElementById("question").value;
  var answer1 = document.getElementById("ans_1").value;
  var answer2 = document.getElementById("ans_2").value;
  var answer3 = document.getElementById("ans_3").value;
  var answer4 = document.getElementById("ans_4").value;

  const radioButtons = document.querySelectorAll('input[name="correct"]');
  const selectedRadio = Array.from(radioButtons).find((radio) => radio.checked);
  const selectedValue = selectedRadio ? selectedRadio.value : null;

  var questionData = {
    question_text: question,
    exam_id: localStorage.getItem("exam_id"),
  };

  apiPost("/api/questions/", questionData, localStorage.getItem("token")).then(
    (response) => {}
  );
});
