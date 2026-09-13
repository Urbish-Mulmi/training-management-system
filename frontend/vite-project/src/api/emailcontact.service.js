import api from "./apiInstance.js"

export const sendContactMessage = (formData) => {
  return api.post("/contact/send-message", formData);
};