import api from "./apiInstance.js"
export const verifyInvitation = async (token) => {
  try {
    const res = await api.get(`/invitation/verify?token=${token}`);
    
    return res.data;
  } catch (error) {
    console.error("Error occurred", error.response?.data || error.message);
    
    throw error;
    
  }
};