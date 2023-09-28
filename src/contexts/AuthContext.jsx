import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import customAxios from "../util/axios";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [errorList, setErrorList] = useState(null);
  const navigate = useNavigate();

  useEffect(function () {
    const fetchData = async function () {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/auth/user",
          {
            withCredentials: true,
          },
        );
        setMessage("");
        setUser(response.data);
      } catch (error) {
        setUser(null);
        // setMessage(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const login = async function (username, password) {
    setIsLoading(true);
    try {
      const response = await customAxios.post("/auth/signin", {
        username,
        password,
      });
      setUser(response.data);
      setMessage("");
      navigate("/profile");
      toast.success("You were logged in!");
    } catch (error) {
      setUser(null);
      setMessage(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async function (username, email, password) {
    setIsLoading(true);
    setSuccess(false);
    try {
      const response = await customAxios.post("/auth/signup", {
        username,
        email,
        password,
      });
      setMessage(response.data.message);
      setSuccess(true);
      setErrorList(null);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorList(error.response.data.errors);
        setMessage(error.response.data.message);
      } else {
        console.error("Registration failed:", error.response.data);
        setMessage(error.response.data.message);
        setSuccess(false);
        setErrorList(null);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const logout = async function () {
    await customAxios.post("/auth/signout");
    setUser(null);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const clearMessages = useCallback(function () {
    setMessage("");
    setErrorList(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        message,
        success,
        errorList,
        login,
        register,
        logout,
        clearMessages,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("This context was used outside of provider");
  return context;
}

export { AuthProvider, useAuth };
