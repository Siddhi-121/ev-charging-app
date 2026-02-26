import axios from "axios";

const API = "http://localhost:5000/api";

export const getStations = () => axios.get(`${API}/stations`);
export const updateStationStatus = (id, status) =>
  axios.put(`${API}/stations/${id}/status`, { status });

export const getBookings = () => axios.get(`${API}/bookings`);
export const createBooking = (data) => axios.post(`${API}/bookings`, data);

export const startSession = (data) => axios.post(`${API}/sessions/start`, data);
export const endSession = (id, kwh) =>
  axios.put(`${API}/sessions/${id}/end`, { kwh_delivered: kwh });

export const loginUser = (data) => axios.post(`${API}/users/login`, data);
export const registerUser = (data) => axios.post(`${API}/users/register`, data);