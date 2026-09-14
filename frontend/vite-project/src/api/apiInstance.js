// initilize api mounting to enable backend communication
// Objective
  // set up axios and conection to backend 

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export default api;