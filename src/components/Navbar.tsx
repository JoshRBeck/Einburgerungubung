import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/auth-context";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="bg-surface text-text border-b border-border shadow-sm">
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            className="text-lg font-semibold text-accent hover:underline"
          >
            BürgerApp
          </Link>
        </div>

        {/* Desktop nav */}
        <ul className="hidden md:flex space-x-4 items-center">
          {user ? (
            <>
              <li>
                <Link to="/account" className="text-sm">
                  {user.email}
                </Link>
              </li>
              <li>
                <button
                  className="bg-wrong-500 text-white px-4 py-2 rounded-lg hover:bg-wrong-500/80 transition-colors"
                  onClick={() => signOut(auth)}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/signup"
                  className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="bg-muted text-white px-4 py-2 rounded-lg hover:bg-muted-hover transition-colors"
                >
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-text focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {user ? (
            <>
              <Link to="/account" className="text-sm">
                {user.email}
              </Link>
              <button
                className="block w-full bg-wrong-500 text-white py-2 rounded-lg hover:bg-wrong-500/80 transition-colors"
                onClick={() => {
                  signOut(auth);
                  setMenuOpen(false);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="block w-full text-center bg-accent text-white py-2 rounded-lg hover:bg-accent-hover transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="block w-full text-center bg-muted text-white py-2 rounded-lg hover:bg-muted-hover transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;