import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { useEffect } from "react";
import Spinner from "./Spinner";

function ProtectedRoute() {
  const { user, userIsLoading } = useAuth();
  const navigate = useNavigate();
  useEffect(
    function () {
      if (!userIsLoading && !user) {
        navigate("/signin");
      }
    },
    [user, userIsLoading, navigate],
  );
  if (userIsLoading || !user) {
    return <Spinner />;
  }
  return (
    <>
      <Outlet />
    </>
  );
}

export default ProtectedRoute;
