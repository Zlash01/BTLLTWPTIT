document.addEventListener("DOMContentLoaded", function() {
    var currentDate = new Date();

    var formattedDateTime = currentDate.toLocaleString("en-AU");
      
    // Update the HTML element with the class 'date-time'
    var dateTimeElement = document.querySelector('.date-time');

    if(dateTimeElement) {
      dateTimeElement.textContent = "Date/time: " + formattedDateTime;
    }
});

// Retrieve score from URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const score = urlParams.get('score');

// Calculate number of correct and wrong answers
const totalQuestions = 8; // Assuming there are 8 questions
//const correctAnswers = parseInt(score);
//const wrongAnswers = totalQuestions - correctAnswers;

// Display score
document.getElementById('score').innerText = score + "/" + totalQuestions;

// Display number of correct and wrong answers
//document.getElementById('correct').innerText = correctAnswers;
//document.getElementById('wrong').innerText = wrongAnswers;
