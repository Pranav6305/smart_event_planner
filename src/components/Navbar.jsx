// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logOut } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="bg-indigo-700 shadow-xl fixed w-full z-20 top-0">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <Link to="/">
          {/* STYLED: Larger, bolder text with hover effect */}
          <h1 className="text-white text-2xl font-extrabold tracking-wide hover:text-indigo-200 transition duration-300">
            Smart Planner
          </h1>
        </Link>
        {user ? (
          <div className="flex items-center space-x-4">
            {/* STYLED: Highlighted button for the main action */}
            <Link
              to="/addevent"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-300 shadow-md"
            >
              Add New Event
            </Link>
            {/* Optional: Show user email and use a subtle border for logout */}
            <p className="text-indigo-200 text-sm hidden sm:block">
              {user?.email}
            </p>
            <button
              onClick={handleLogout}
              className="text-white hover:text-red-300 font-medium px-3 py-1 rounded border border-white hover:border-red-300 transition duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              to="/login"
              className="text-white hover:text-indigo-200 font-medium transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-300 shadow-md"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
