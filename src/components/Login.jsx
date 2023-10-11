import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import { AiOutlineWarning } from "react-icons/ai";

import { useAuth } from "../contexts/AuthContext";

function Login() {
  const [login, setLogin] = useState("user");
  const [password, setPassword] = useState("user");
  const { user, message, isLoading, login: signin, clearMessages } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
    clearMessages();
  }, [user, navigate, clearMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    signin(login, password);
  };

  return (
    <div className="mt-10 flex items-center justify-center">
      <div className="w-full max-w-md rounded bg-white p-4 shadow-md md:p-8">
        <p className="mb-4 text-center text-2xl font-semibold text-violet-700">
          Login
        </p>
        {message && (
          <div className="mb-4 flex items-center rounded border border-red-400 bg-red-100 px-4 py-2 text-red-700">
            <IconContext.Provider value={{ className: "w-6 h-6 mr-2" }}>
              <AiOutlineWarning /> {message}
            </IconContext.Provider>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="login" className="block font-medium text-gray-600">
              Username or email
            </label>
            <input
              type="text"
              id="login"
              name="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="mt-1 w-full rounded border p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border p-2"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded bg-violet-500 px-4 py-2 text-white hover:bg-violet-700 focus:outline-none"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
