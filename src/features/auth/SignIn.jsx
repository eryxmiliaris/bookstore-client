import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";
import Form from "../../components/Form";
import MessageResponse from "../../components/MessageResponse";

function SignIn() {
  const { user, message, isLoading, signin, clearMessages } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
    clearMessages();
  }, [user, navigate, clearMessages]);

  const handleSubmit = (data) => {
    const { login, password } = data;
    signin(login, password);
  };

  return (
    <div className="mt-10 flex items-center justify-center">
      <div className="w-full max-w-md rounded bg-white p-4 shadow-md md:p-8">
        <p className="mb-4 text-center text-2xl font-semibold text-violet-700">
          Sign in
        </p>

        <MessageResponse message={message} />

        <Form
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitButtonText="Sign in"
          submitButtonLoadingText="Signing in..."
        >
          <Form.Input
            fieldName="login"
            labelText="Username or email"
            validation={{ required: "This field is required" }}
          />

          <Form.Input
            fieldName="password"
            labelText="Password"
            type="password"
            validation={{ required: "This field is required" }}
          />
        </Form>

        <p className="mt-2 flex justify-between italic opacity-75">
          <Link to="/forgot">Forgot passsword?</Link>
          <Link to="/signup">Don&apos;t have an account?</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
