import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";

import Form from "../../components/Form";
import MessageResponse from "../../components/MessageResponse";

function SignUp() {
  const { user, isLoading, message, errorList, signup, clearMessages } =
    useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
    clearMessages();
  }, [user, navigate, clearMessages]);

  const handleSubmit = (data) => {
    const { username, email, password, birthDate } = data;
    signup(username, email, password, birthDate);
  };

  return (
    <div className="mt-10 flex items-center justify-center bg-violet-100">
      <div className="w-full max-w-md rounded bg-white p-4 shadow-md md:p-8">
        <p className="mb-4 text-center text-2xl font-semibold text-violet-700">
          Sign up
        </p>

        <MessageResponse message={message} />

        <Form
          onSubmit={handleSubmit}
          submitButtonText="Sign up"
          submitButtonLoadingText="Signing up..."
          isLoading={isLoading}
        >
          <Form.Input
            fieldName="username"
            labelText="Username"
            validation={{
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
            }}
          />

          <Form.Input
            fieldName="email"
            labelText="Email"
            validation={{
              required: "This field is required",
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Email is not valid",
              },
            }}
          />

          <Form.DateInput
            fieldName="birthDate"
            labelText="Birth date"
            maxDate={new Date()}
            validation={{ required: "Birth date is required" }}
          />

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

        <p className="mt-2 italic opacity-75">
          <Link to="/signin">Already have an account?</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
