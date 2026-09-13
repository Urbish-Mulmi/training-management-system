// initilize api mounting to enable backend communication
// Objective
  // set up axios and conection to backend 

import axios from 'axios'  ;
const port = 4000
const baseURL = `http://localhost:${port}/api`

const api = axios.create({
  baseURL: baseURL,
  withCredentials:true,
});

export default api
