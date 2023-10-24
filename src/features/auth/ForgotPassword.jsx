import { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { AiOutlineWarning } from "react-icons/ai";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const { user, message, forgotPassword, isLoading, clearMessages } = useAuth();

  const handleSubmit = async function (e) {
    e.preventDefault();
    forgotPassword(email);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
    clearMessages();
  }, [user, navigate, clearMessages]);

  return (
    <div className="mt-10 flex items-center justify-center">
      <div className="w-full max-w-md rounded bg-white p-4 shadow-md md:p-8">
        <p className="mb-4 text-center text-2xl font-semibold text-violet-700">
          Reset password
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
            <label htmlFor="email" className="block font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border p-2"
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending request..." : "Reset"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
