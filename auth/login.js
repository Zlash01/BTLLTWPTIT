import { apiPost } from "../apiServices.js";
function validateLogin() {
  const account = document.querySelector("#login__user").value;
  const password = document.querySelector("#login__pw").value;
  console.log(account);
  console.log(password);

  handleLoginBackend(account, password);
  console.log("debug");
}

function handleLoginBackend(loginUsername, loginPassword) {
  var data = {
    email: loginUsername,
    password: loginPassword,
  };

  apiPost("/api/users/login", data)
    .then((response) => {
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("role", response.role);
      alert("Đăng nhập thành công");
      navigate();
    })
    .catch((error) => {
      alert("Đăng nhập thất bại");
      console.log(error);
    });
}

function navigate() {
  let role = localStorage.getItem("role");
  let isAdmin = false;
  if (role === "admin") isAdmin = true;
  console.log(isAdmin);
  console.log(role);

  if (isAdmin) {
    window.location.href = "http://127.0.0.1:5500/admins/dashboard/index.html";
  } else {
    window.location.href = "http://127.0.0.1:5500/user/main/index.html";
  }
}

window.validateLogin = validateLogin;
