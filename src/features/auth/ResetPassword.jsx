import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";
import Form from "../../components/Form";
import MessageResponse from "../../components/MessageResponse";

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

  const handleSubmit = (data) => {
    resetPassword(resetToken, data.password);
  };

  return (
    <div className="mt-10 flex items-center justify-center">
      <div className="w-full max-w-md rounded bg-white p-4 shadow-md md:p-8">
        <p className="mb-4 text-center text-2xl font-semibold text-violet-700">
          Reset password
        </p>

        <MessageResponse message={message} />

        <Form
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitButtonText="Reset"
          submitButtonLoadingText="Resetting..."
        >
          <Form.Input
            fieldName="password"
            labelText="Password"
            type="password"
            validation={{
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
            }}
            errorList={errorList}
          />

          <Form.ConfirmPasswordInput />
        </Form>
      </div>
    </div>
  );
}

export default ResetPassword;
