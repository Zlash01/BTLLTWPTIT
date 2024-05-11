var minsEl = document.getElementById("minutes");
var secsEl = document.getElementById("seconds");

var minsValue = parseInt(minsEl.textContent);
var secsValue = parseInt(secsEl.textContent);

function countdownTimer() {
  const countDownDate = new Date().getTime() + minsValue * 60 * 1000;
  const second = 1000;
  const minute = second * 60;

  const interval = setInterval(() => {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    minsEl.innerText = formatNumber(Math.floor(distance / minute));
    secsEl.innerText = formatNumber(Math.floor((distance % minute) / second));

    if (distance <= 0) {
      clearInterval(interval);
      minsEl.innerText = "00";
      secsEl.innerText = "00";
      document.getElementById("testForm").submit();

      // Display score after timer expires
      var formData = new FormData(document.getElementById("testForm"));
      var correctAnswers = document.querySelectorAll('input[type="hidden"]');
      var score = 0;

      for (let i = 0; i < correctAnswers.length; i++) {
        if (formData.get("question" + (i + 1)) === correctAnswers[i].value) {
          score++;
        }
      }

      window.location.href = "../results/html/index.html?score=" + score;
    }
  }, 1000);
}

function formatNumber(number) {
  if (number < 10) {
    return "0" + number;
  }
  return number;
}

countdownTimer();

document.getElementById("submitButton").addEventListener("click", function () {
  var formData = new FormData(document.getElementById("testForm"));
  var correctAnswers = document.querySelectorAll('input[type="hidden"]');
  var score = 0;

  for (let i = 0; i < correctAnswers.length; i++) {
    if (formData.get("question" + (i + 1)) === correctAnswers[i].value) {
      score++;
    }
  }

  window.location.href = "../results/index.html?score=" + score;
});

document.addEventListener('DOMContentLoaded', function() {
  const testForms = document.getElementsByClassName('testform');
  const boxContainer = document.getElementById('box-container');

  // Loop through each test form (assuming there's only one)
  Array.from(testForms).forEach(function(testForm) {
    // Get all questions and their corresponding radio buttons within the current test form
    const questions = testForm.querySelectorAll('.question');

    // Create question indicator buttons dynamically
    questions.forEach(function(question, index) {
      const button = document.createElement('button');
      button.className = 'indicatorButton';
      button.id = 'button' + (index + 1);
      button.textContent = index + 1; // Display question number (1-based index)
      boxContainer.appendChild(button);

      // Scroll to the corresponding question when button is clicked
      button.addEventListener('click', function() {
        // Get the position of the target question element
        const targetQuestion = question; // Use the current question element directly
      
        if (targetQuestion) {
          const targetQuestionPosition = targetQuestion.getBoundingClientRect().top + window.pageYOffset;

          // Scroll to the target question element
          window.scrollTo({
            top: targetQuestionPosition - 100,
            behavior: 'smooth' // Smooth scrolling effect
          });

        } else {
          console.error(`Question ${index + 1} not found.`);
        }
      });

      const radioButtons = question.querySelectorAll('input[type="radio"]');
      radioButtons.forEach(function(radioButton) {
        radioButton.addEventListener('change', function() {
          

          if (this.checked) {
            // Change color of the corresponding button to green when radio button is checked
            button.style.backgroundColor = '#4CAF50';
          }
        });
      });
    });
  });
});


//added indcator generator