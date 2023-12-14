import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";
import Form from "../../components/Form";
import MessageResponse from "../../components/MessageResponse";

function ForgotPassword() {
  const { user, message, forgotPassword, isLoading, clearMessages } = useAuth();

  const handleSubmit = (data) => {
    forgotPassword(data.email);
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

        <MessageResponse message={message} />

        <Form
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitButtonText="Reset"
          submitButtonLoadingText="Sending request.."
        >
          <Form.Input fieldName="email" labelText="Email" />
        </Form>
      </div>
    </div>
  );
}

export default ForgotPassword;
