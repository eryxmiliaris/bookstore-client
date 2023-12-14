import axios from "axios";
import { API_BASE_URL } from "../constants/appConstants";

const instance = axios.create({
  withCredentials: true,
  baseURL: API_BASE_URL,
});

export default instance;
