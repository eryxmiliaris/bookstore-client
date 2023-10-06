import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-violet-500 px-4 py-4">
      <div className="container mx-auto flex items-center justify-between px-2 lg:max-w-5xl ">
        <Link to="/" className="text-2xl font-semibold text-white">
          Bookstore
        </Link>
        <div className="space-x-4">
          {!user ? (
            <>
              <Link to="/login" className="text-white hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="text-white hover:text-gray-300">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="text-white hover:text-gray-300">
                Profile
              </Link>
              <Link to="/user" className="text-white hover:text-gray-300">
                User
              </Link>
              {user?.roles?.includes("ROLE_ADMIN") && (
                <Link to="/admin" className="text-white hover:text-gray-300">
                  Admin
                </Link>
              )}
              <button
                className="text-white hover:text-gray-300"
                onClick={() => logout()}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
