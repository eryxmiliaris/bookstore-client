import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-violet-500 px-4 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-semibold text-white">
          Bookstore
        </Link>
        <ul className="flex space-x-4">
          {!user ? (
            <>
              <li>
                <Link to="/login" className="text-white hover:text-gray-300">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-white hover:text-gray-300">
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/profile" className="text-white hover:text-gray-300">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/user" className="text-white hover:text-gray-300">
                  User
                </Link>
              </li>
              {user?.roles?.includes("ROLE_ADMIN") && (
                <li>
                  <Link to="/admin" className="text-white hover:text-gray-300">
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <Link
                  className="text-white hover:text-gray-300"
                  onClick={() => logout()}
                >
                  Logout
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
