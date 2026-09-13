import api from "./apiInstance"
// axios api handling:
// success: response.data.
// error: error.response.data
export const getMe = async()=>{
  try {
    const res =await  api.get('/users/get-me')
    console.log("Get user success: ", res.data.message)
    console.log("Get user complete data: ", res.data)
    return res.data;
    
  } catch (error) {
     console.error(error.response?.data || "Error in profile fetching")
    throw error;
  }
}

// api axios has success and error
// success has res.data.etc
// error has error.response.data

export const getAllUser = async (role) => {
  try {
    const res = await api.get("/users/get-all-user", {
      params: role ? { role } : {},
    });

    console.log("Fetching users:", res.data);

    return res.data;
  } catch (error) {
    console.error(
      "Get users error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// axios api has : success and error 
// successs:
//  const res = api call;
// console.log(res.data)
// return res.data

// catch(error){
// console.log(error.response.data)}


export const deleteUser = async(id)=>{
  try {
    const res = await api.delete(`/users/${id}/delete-user`)
    console.log("delete sucess: ",res.data);
    return res.data;
    
  } catch (error) {
    console.error("Delete failed: ", error.response)
    throw error;
    
  }
}

export const roleUpdateUser = async (id, role) => {
  try {
    const res = await api.patch(`/users/${id}/update-role`, { role })
    console.log("role update success :", res.data);
    return res.data;
  } catch (error) {
    console.error(
      'error occur in role update:',
      error.response?.data?.error || error.response?.data?.message || error.message
    )
    throw error;
  }
}
