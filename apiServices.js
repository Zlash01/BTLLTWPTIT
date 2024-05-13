// apiService.js
const API_BASE_URL = "http://26.10.188.85:8080"; // Base URL for your API

// Function to create default headers, with optional Bearer token
function createHeaders(token = null) {
  const headers = {
    "Content-Type": "application/json", // Default content type
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // Add Bearer token if provided
  }

  //console.log("Headers:", headers); // Add this line to log the headers
  return headers;
}

// function setTokenCookie(token) {
//   const date = new Date();
//   date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000); // Expires in 30 days
//   const expires = `expires=${date.toUTCString()}`;
//   document.cookie = `accessToken=${encodeURIComponent(
//     token
//   )};${expires};path=/`;
// }

// Function to handle API errors
function handleApiError(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json(); // Parse response JSON
}

// Function to make a GET request
export async function apiGet(endpoint, token = null, queryParams = {}) {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  const searchParams = new URLSearchParams(queryParams);
  url.search = searchParams.toString();
  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: createHeaders(token),
    });
    return handleApiError(response);
  } catch (error) {
    console.error("API GET error:", error);
    throw error; // Re-throw error for further handling if needed
  }
}

// Function to make a POST request
export async function apiPost(endpoint, data, token = null) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: createHeaders(token),
      body: JSON.stringify(data), // Stringify JSON data
    });
    return handleApiError(response);
  } catch (error) {
    console.error("API POST error:", error);
    throw error;
  }
}

export async function apiPut(endpoint, data, token = null) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT", // HTTP PUT method
      headers: createHeaders(token), // Create headers with optional tokens
      body: JSON.stringify(data), // Stringify the data to send
    });
    return handleApiError(response);
  } catch (error) {
    console.error("API PUT error:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}

export async function apiDelete(endpoint, token = null) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE", // HTTP DELETE method
      headers: createHeaders(token), // Create headers with optional tokens
    });
    return handleApiError(response);
  } catch (error) {
    console.error("API DELETE error:", error);
    throw error; // Re-throw the error for further handling if needed
  }
}
