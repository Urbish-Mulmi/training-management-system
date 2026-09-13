import api from "./apiInstance.js";

//(Axios Success:
// res.data → backend response body, whereas re is variable that holds api call

// Axios Error:
// error.response → server response object
// error.response.data → backend error body)
// where response is axios built in property

export const signUpUser = async (info) => {
  try {
    const res = await api.post("/users/register", info);
    console.log("Sign up success:", res.data.message);
    return res.data;
  } catch (error) {

    console.error("Sign up error", error.response?.data ||  error.message);

    throw error;
  }
};


export const logInUser = async (data) => {
  try {
    const res = await api.post("/users/login", data);
    console.log("Login success:", res.data);
    return res.data;
  } catch (error) {
    console.error("Login error", error.response?.data || error.message);
    throw error;
  }
};

export const logOutUser = async ()=>{
  try {
    const res = await api.post('/users/logoutUser');
    console.log("logout Sucess:", res.data)
    return res.data.message

  } catch (error) {
    console.error("Logout error: ",error.response?.data.message || error.message)
    throw error;
    
  }
}

