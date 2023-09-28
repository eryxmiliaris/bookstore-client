import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AiOutlineWarning, AiOutlineCheck } from "react-icons/ai";
import { IconContext } from "react-icons";

import { useAuth } from "../contexts/AuthContext";

function Register() {
  const {
    user,
    isLoading,
    message,
    success,
    errorList,
    register: signup,
    clearMessages,
  } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
    clearMessages();
  }, [user, navigate, clearMessages]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    signup(data.username, data.email, data.password);
  };

  return (
    <div className="mt-10 flex items-center justify-center bg-violet-100">
      <div className="w-full max-w-md rounded bg-white p-4 shadow-md md:p-8">
        <p className="mb-4 text-center text-2xl font-semibold text-violet-700">
          Registration
        </p>
        {message && (
          <div
            className={`bg-${success ? "green" : "red"}-100 text-${
              success ? "green" : "red"
            }-600 mb-4 flex items-center rounded p-2`}
          >
            <IconContext.Provider value={{ className: "w-6 h-6 mr-2" }}>
              {success ? <AiOutlineCheck /> : <AiOutlineWarning />}
            </IconContext.Provider>
            <p>{message}</p>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block font-medium text-gray-600"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              {...register("username", {
                required: "This field is required",
                minLength: {
                  value: 5,
                  message: "Username length should be at least 5",
                },
                maxLength: {
                  value: 20,
                  message: "Username length can't be longer than 20",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_-]{5,20}$/,
                  message:
                    "Username can only contain letters, numbers, hyphens, and underscores.",
                },
              })}
              className="mt-1 w-full rounded border p-2"
            />
            {errors.username && (
              <p className="mt-1 text-red-600">{errors.username.message}</p>
            )}
            {errorList && errorList.username && (
              <p className="mt-1 text-red-600">{errorList.username}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block font-medium text-gray-600">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              {...register("email", {
                required: "This field is required",
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Email is not valid.",
                },
              })}
              className="mt-1 w-full rounded border p-2"
            />
            {errors.email && (
              <p className="mt-1 text-red-600">{errors.email.message}</p>
            )}
            {errorList && errorList.email && (
              <p className="mt-1 text-red-600">{errorList.email}</p>
            )}
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
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 8,
                  message: "Password length should be at least 8",
                },
                maxLength: {
                  value: 30,
                  message: "Password length can't be longer than 30",
                },
                pattern: {
                  value:
                    /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,30}$/,
                  message:
                    "Password must contain at least one uppercase letter, one digit, and one special character.",
                },
              })}
              className="mt-1 w-full rounded border p-2"
            />
            {errors.password && (
              <p className="mt-1 text-red-600">{errors.password.message}</p>
            )}
            {errorList && errorList.password && (
              <p className="mt-1 text-red-600">{errorList.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded bg-violet-500 px-4 py-2 text-white hover:bg-violet-700 focus:outline-none"
          >
            {isLoading ? "Signing up..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
