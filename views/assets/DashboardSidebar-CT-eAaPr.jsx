import React, { useEffect, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { FaDatabase } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { IoPerson } from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { IoPersonOutline } from "react-icons/io5";

export const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const login = localStorage.getItem("forcastToken");
    if (!login) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    setSelectedTab(location.pathname);
  }, [location]);

  return (
    <nav className="h-screen w-full bg-[#683999] bg-opacity-40 flex flex-col justify-between">
      <div className="w-full">
        <div className="py-2">
          <img
            src="img/landing_page_img/companies-logos/focast1-ezgif.com-gif-maker.gif"
            width={180}
            alt="FocastIQ"
            className="mx-auto"
          />
        </div>
        <div className="navbar-content overflow-y-auto mt-6">
          <ul className="space-y-3 px-4">
            <Link
              to="/dashboard"
              onClick={() => setSelectedTab("/dashboard")}
              className={`group flex items-center py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-[#683999] ${
                selectedTab === "/dashboard" ? "bg-[#683999]" : ""
              }`}
            >
              <span className="text-xl text-gray-500">
                <MdDashboard
                  style={{
                    fill: selectedTab === "/dashboard" ? "#ffffff" : "gray",
                  }}
                  size={25}
                  className="group-hover:fill-white" // Icon turns white on hover
                />
              </span>
              <span
                className={`ml-4 font-medium ${
                  selectedTab === "/dashboard"
                    ? "text-[#ffffff]"
                    : "text-gray-600"
                } group-hover:text-white`} // Text turns white on hover
              >
                Dashboard
              </span>
            </Link>

            {/* Data Visualization Link */}
            <Link
              to="/dataVisualization"
              onClick={() => setSelectedTab("/dataVisualization")}
              className={`group flex items-center py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-[#683999]  ${
                selectedTab === "/dataVisualization" ? "bg-[#683999]" : ""
              }`}
            >
              <span className="text-xl text-gray-500">
                <FaDatabase
                  style={{
                    fill:
                      selectedTab === "/dataVisualization" ? "#ffffff" : "gray",
                  }}
                  size={20}
                  className="group-hover:fill-white"
                />
              </span>
              <span
                className={`ml-4 font-medium ${
                  selectedTab === "/dataVisualization"
                    ? "text-[#ffffff]"
                    : "text-gray-600"
                } group-hover:text-white`}
              >
                CSV Data
              </span>
            </Link>
          </ul>
        </div>
      </div>

      {/* Bottom Profile and Logout Section */}
      <div className=" p-6 mt-auto rounded-t-lg ">
        <div className="flex bg-[#683999] flex-col p-4 rounded-xl items-center">
          {/* Profile Icon */}
          <div className="mb-4">
            <IoPersonOutline size={35} style={{ stroke: "white" }} />
          </div>
          <div className="text-center">
            <div className="font-semibold text-white">
              {localStorage.getItem("user_name")}
            </div>
            <div className="text-sm text-white">
              {localStorage.getItem("user_email")}
            </div>
          </div>

          <button
            className="mt-6 bg-black  bg-opacity-70 text-white py-2 px-8 rounded-lg flex items-center"
            onClick={logout}
          >
            <HiOutlineLogout
              size={20}
              className="mr-2"
              style={{ stroke: "white" }}
            />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
