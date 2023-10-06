import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

function Profile() {
  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(
    function () {
      if (!user) {
        navigate("/");
      }
    },
    [user, navigate],
  );

  return (
    <div className="container mx-auto max-w-3xl p-4">
      <p className="mb-4 text-center text-2xl font-semibold text-violet-700">
        Profile
      </p>
      <div className="mb-4">
        <p className="font-medium text-gray-800">Username:</p>
        <p className="text-gray-600">{user?.username}</p>
      </div>
      <div className="mb-4">
        <p className="font-medium text-gray-800">Email:</p>
        <p className="text-gray-600">{user?.email}</p>
      </div>
      <div className="mb-4">
        <p className="font-medium text-gray-800">Roles:</p>
        <p className="text-gray-600">{user?.roles.join(", ")}</p>
      </div>
    </div>
  );
}

export default Profile;
