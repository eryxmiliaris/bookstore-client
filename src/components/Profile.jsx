import { useAuth } from "../contexts/AuthContext";

function Profile() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto max-w-3xl p-4">
      <p className="mb-4 text-center text-2xl font-semibold text-violet-700">
        Profile
      </p>
      {user ? (
        <div className="mb-4">
          <p className="font-medium text-gray-800">Username:</p>
          <p className="text-gray-600">{user.username}</p>
        </div>
      ) : (
        <p className="mb-4 text-gray-600">No user information available.</p>
      )}
      {user && (
        <div className="mb-4">
          <p className="font-medium text-gray-800">Email:</p>
          <p className="text-gray-600">{user.email}</p>
        </div>
      )}
      {user && (
        <div className="mb-4">
          <p className="font-medium text-gray-800">Roles:</p>
          <p className="text-gray-600">{user.roles.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

export default Profile;
