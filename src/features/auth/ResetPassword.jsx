import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IconContext } from "react-icons";
import { AiOutlineWarning } from "react-icons/ai";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");

  const navigate = useNavigate();

  if (resetToken == undefined) {
    navigate("/signin");
  }

  const { user, message, resetPassword, errorList, isLoading, clearMessages } =
    useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
    clearMessages();
  }, [user, navigate, clearMessages]);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    resetPassword(resetToken, data.password);
  };

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
        <form onSubmit={handleSubmit(onSubmit)}>
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
              <>
                {errorList.password.split(",").map((e) => (
                  <p key={e} className="mt-1 text-red-600">
                    {e}
                  </p>
                ))}
              </>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirm_password"
              className="block font-medium text-gray-600"
            >
              Confirm password
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              {...register("confirm_password", {
                required: "This field is required",
                validate: (value) => {
                  const { password } = getValues();
                  return password === value || "Passwords should match!";
                },
              })}
              className="mt-1 w-full rounded border p-2"
            />
            {errors.confirm_password && (
              <p className="mt-1 text-red-600">
                {errors.confirm_password.message}
              </p>
            )}
          </div>
          <Button>{isLoading ? "Reseting..." : "Reset"}</Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
