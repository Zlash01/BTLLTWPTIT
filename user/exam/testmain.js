var minsEl = document.getElementById("minutes");
var secsEl = document.getElementById("seconds");

function countdownTimer() {
  const countDownDate = new Date().getTime() + 10 * 60 * 1000;
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

      window.location.href = "../../results/html/index.html?score=" + score;
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
