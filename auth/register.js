import { apiPost } from "../apiServices.js";

function validateRegister() {
  const account = document.querySelector("#register__user").value.trim();
  const password = document.querySelector("#register__pw").value.trim();
  const passwordAgain = document
    .querySelector("#register__pw__again")
    .value.trim();
  const name = document.querySelector("#register__name").value.trim();
  const studentClass = document.querySelector("#register__class").value.trim();
  const studentId = document
    .querySelector("#register__student_id")
    .value.trim();

  let flag = true;
  // Check if password and password confirmation match
  if (password !== passwordAgain) {
    flag = false;
  }

  // Check if password meets the requirements
  if (!isValidPasswordFrontend(password)) {
    flag = false;
  }

  // Check if other fields are not empty
  if (!account || !name || !studentClass || !studentId) {
    flag = false;
  }

  if (flag)
    checkRegisterBackend(account, password, name, studentClass, studentId);
  else {
    let msg =
      "Password is invalid. It must have at least 1 uppercase letter, 1 lowercase letter, 1 number, and be 8 characters long.";
    console.log(msg);
    alert(msg);
  }
}

function checkRegisterBackend(email, password, name, class_id, student_id) {
  var data = {
    email: email,
    password: password,
    name: name,
    class: class_id,
    student_id: student_id,
  };

  apiPost("/api/users/register", data)
    .then((response) => {
      localStorage.setItem("token", response.accessToken);
      alert("Đăng ký thành công");
      window.location.href = "http://127.0.0.1:5500/auth/index.html";
    })
    .catch((error) => {
      alert("Đăng ký thất bại");
      console.log(error);
    });
}

function isValidPasswordFrontend(password) {
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

window.validateRegister = validateRegister;
