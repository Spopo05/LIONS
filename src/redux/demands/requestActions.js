import axios from "axios";

// Use YOUR API URL (the one you just created)
const API_URL = "https://67719603ee76b92dd49017b3.mockapi.io/lourigalaouina/Demandes";

// This function gets all requests from the API
export const fetchRequests = () => async (dispatch) => {
  try {
    console.log("Fetching requests from:", API_URL);
    const response = await axios.get(API_URL);
    console.log("API Response:", response.data);
    dispatch({ type: "SET_REQUESTS", payload: response.data });
  } catch (err) {
    console.error("Error fetching requests:", err);
  }
};