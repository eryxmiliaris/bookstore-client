import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import customAxios from "../../util/axios";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userIsLoading, setUserIsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [errorList, setErrorList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setUserIsLoading(true);
    try {
      const response = await customAxios.get("/user/info");
      setMessage("");
      setUser(response.data);
      if (response.data.roles.includes("ROLE_ADMIN")) {
        setIsAdmin(true);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
      setUserIsLoading(false);
    }
  };

  const updateUserData = async (username, email, birthDate) => {
    setIsLoading(true);
    setSuccess(false);
    try {
      await customAxios.put(`/user/info`, {
        username,
        email,
        birthDate,
      });
      toast.success("User info has been successfully updated");
      setSuccess(true);
      fetchUserData();
    } catch (e) {
      toast.error("Error appeared: " + e.response.data.message);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signin = async (login, password) => {
    setIsLoading(true);
    try {
      const response = await customAxios.post("/auth/signin", {
        login,
        password,
      });
      setUser(response.data);
      setMessage("");
      toast.success("You were singed in!");
      window.location.replace("/profile");
    } catch (error) {
      setUser(null);
      setMessage(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username, email, password, birthDate) => {
    setIsLoading(true);
    setSuccess(false);
    try {
      await customAxios.post("/auth/signup", {
        username,
        email,
        password,
        birthDate,
      });
      // setMessage(response.data.message);
      toast.success("User registered successfully!");
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

  const signout = async () => {
    await customAxios.post("/auth/signout");
    setUser(null);
    toast.success("Signed out successfully!");
    window.location.replace("/");
  };

  const forgotPassword = async (email) => {
    setIsLoading(true);
    try {
      await customAxios.post(`/auth/forgot?email=${email}`);
      setMessage("");
      toast.success("Reset link was sent to given email!");
    } catch (error) {
      setMessage(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token, password) => {
    setIsLoading(true);
    try {
      await customAxios.post(`/auth/reset`, {
        token: token,
        password: password,
      });
      setMessage("");
      toast.success("Password has been successfully reset!");
      navigate("/signin");
    } catch (error) {
      setMessage(error.response.data.message);
      setErrorList(error.response.data.errors);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = useCallback(() => {
    setMessage("");
    setErrorList(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        userIsLoading,
        isLoading,
        message,
        success,
        errorList,
        signin,
        signup,
        forgotPassword,
        resetPassword,
        signout,
        clearMessages,
        updateUserData,
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
