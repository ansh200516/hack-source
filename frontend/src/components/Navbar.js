// src/components/Navbar.js
// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HamburgerMenuIcon } from '@radix-ui/react-icons'; // Correct Radix Icon
import { AuthContext } from '../contexts/AuthContext';
import { Button } from './shadcn/Button';
// src/components/Navbar.js
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          Home
        </Link>
        <div className="space-x-4 flex items-center">
          {/* <Link to="/devpost" className="text-gray-300 hover:text-white">
            Devpost
          </Link>
          <Link to="/devfolio" className="text-gray-300 hover:text-white">
            Devfolio
          </Link>
          <Link to="/unstop" className="text-gray-300 hover:text-white">
            Unstop
          </Link>
          <Link to="/hack2skill" className="text-gray-300 hover:text-white">
            Hack2skill
          </Link> */}
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-gray-300 hover:text-white">
                  Admin
                </Link>
              )}
              <Button onClick={handleLogout} className="text-gray-300 hover:text-white">
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login" className="text-gray-300 hover:text-white">
              Admin
            </Link>
          )}
          {/* Example Icon Usage */}
          <button className="text-gray-300 hover:text-white focus:outline-none">
            <HamburgerMenuIcon />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;