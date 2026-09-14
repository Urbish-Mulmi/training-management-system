// initilize api mounting to enable backend communication
// Objective
  // set up axios and conection to backend 

import axios from 'axios'  ;
const port = 4000
// for local development, use the following baseURL
// const baseURL = `http://localhost:${port}/api`
// for online deployment, use the following baseURL
const baseURL = "https://training-management-system-1uwq.onrender.com/api";

const api = axios.create({
  baseURL: baseURL,
  withCredentials:true,
});

export default api
