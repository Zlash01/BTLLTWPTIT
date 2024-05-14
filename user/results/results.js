import { apiGet } from "../../apiServices";

function setDataUser() {
  // Retrieve the JSON string from localStorage
  apiGet("/api/users/current", localStorage.getItem("token")).then(
    (response) => {
      const name = response.name;
      const usernameElement = document.getElementById("username");
      usernameElement.textContent = name;
    }
  );
}
setDataUser();
