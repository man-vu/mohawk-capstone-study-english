import axios from "axios";

// Set default timeout for axios requests
axios.defaults.timeout = 5000
axios.defaults.baseURL = process.env.VUE_APP_SERVER_ENDPOINT;

// Set Bearer JSON web token
axios.defaults.headers.common["Authorization"] = !!localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : "";
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (
      error.response.status === 403 &&
      error.response.data.error === "TokenExpiredError"
    ) {
      alert("Your session has expired. Please sign-in again!");

      localStorage.clear();
      window.location.reload();
    } else {
      return Promise.reject(error);
    }
  }
);
