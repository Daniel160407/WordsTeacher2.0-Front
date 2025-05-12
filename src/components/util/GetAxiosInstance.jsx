import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAxiosInstance = async (url, requestType, body) => {
  const token = Cookies.get("token");
  
  const config = {
    headers: {
      Authorization: token ? `${token}` : "",
    }
  };

  try {
    switch (requestType) {
      case "get":
        return await axios.get(`${API_BASE_URL}${url}`, config);
      case "post":
        return await axios.post(`${API_BASE_URL}${url}`, body || "", config);
      case "put":
        return await axios.put(`${API_BASE_URL}${url}`, body || "", config);
      case "delete":
        return await axios.delete(`${API_BASE_URL}${url}`, config);
      default:
        throw new Error(`Unsupported request type: ${requestType}`);
    }
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

export default getAxiosInstance;