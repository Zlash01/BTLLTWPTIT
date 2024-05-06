document.querySelector(".register__btn").addEventListener("click", function () {
  let flag = true;
  const account = document.querySelector("#register__user").value.trim();
  const password = document.querySelector("#register__pw").value.trim();
  const password_again = document
    .querySelector("#register__pw__again")
    .value.trim();
  console.log(account);
  console.log(password);
  console.log(password_again);

  if (password !== password_again) {
    flag = false;
  } else if (!isValidPassword(password)) {
    flag = false;
  }

  if (flag == true) {
    console.log("Account is valid.");
    alert("Account created!");

    window.location.href = "../html/index.html";
    
  } else {
    console.log(
      "Password is invalid. It must have at least 1 uppercase letter, 1 lowercase letter, 1 number, and be 8 characters long."
    );
    alert(
      "Password is invalid. It must have at least 1 uppercase letter, 1 lowercase letter, 1 number, and be 8 characters long."
    );
  }
});

function isValidPassword(password) {
  // Password must be at least 8 characters long
  if (password.length < 8) {
    return false;
  }

  // Password must contain at least one uppercase letter, one lowercase letter, and one number
  var hasUpperCase = false;
  var hasLowerCase = false;
  var hasNumber = false;

  for (var i = 0; i < password.length; i++) {
    var char = password.charAt(i);
    if (char >= "A" && char <= "Z") {
      hasUpperCase = true;
    } else if (char >= "a" && char <= "z") {
      hasLowerCase = true;
    } else if (!isNaN(parseInt(char))) {
      hasNumber = true;
    }
  }

  return hasUpperCase && hasLowerCase && hasNumber;
}
