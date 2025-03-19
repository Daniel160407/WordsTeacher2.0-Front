import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = Cookies.get("token");

const getAxiosInstance = async (url, requestType, body) => {
  switch (requestType) {
    case "get":
      return await axios.get(`${API_BASE_URL}${url}`, {
        headers: { Authorization: `${token || ""}` },
      });
    case "post":
      return await axios.post(`${API_BASE_URL}${url}`, body ? body : "", {
        headers: { Authorization: `${token || ""}` },
      });
    case "put":
      return await axios.put(`${API_BASE_URL}${url}`, body ? body : "", {
        headers: { Authorization: `${token || ""}` },
      });
    case "delete":
      return await axios.delete(`${API_BASE_URL}${url}`, {
        headers: { Authorization: `${token || ""}` },
      });
    default:
      throw new Error(`Unsupported request type: ${requestType}`);
  }
};

export default getAxiosInstance;
