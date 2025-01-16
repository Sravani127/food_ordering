import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Button, Modal, Box, Typography, Divider } from "@mui/material";
import "./TopBar.css"; // Import the CSS file
import SearchBar from "../serach-bar/search-bar";
import { FoodsContext } from "../../components/layout/layout";
import { putRequest } from "../../services/apiService";
import { calculateBonus, calculateOrdersBonus } from "../../Utils/Utils";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LogoutIcon from "@mui/icons-material/Logout";
import ProfileModal from "./ProfileModal";
import HistoryIcon from "@mui/icons-material/History";

const TopBar = () => {
  const {
    cartItems,
    userDetails,
    todayWorkTracks,
    workTrackData,
    userOrders,
    updateUser,
  } = useContext(FoodsContext);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProfileDetailsModal, setShowProfileDetailsModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
    setShowLogoutModal(false);
  };

  const updateAttendance = async () => {
    const currentDate = new Date();
    const currentTime = new Date();
    const clockInTime = new Date(todayWorkTracks.clockIn).getTime(); // Convert clockIn to Date object
    const currentTimeMillis = new Date(currentDate).getTime(); // Convert currentTime to Date object

    const difference = currentTimeMillis - clockInTime;
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const payload = {
      ...todayWorkTracks,
      clockOut: currentTime,
      totalHours: hours,
      salary:
        Math.floor(hours * todayWorkTracks?.salaryPerHour) +
        calculateBonus(workTrackData) +
        calculateOrdersBonus(userOrders),
      bonus: calculateBonus(workTrackData) + calculateOrdersBonus(userOrders),
    };

    putRequest(`/worktracks/${todayWorkTracks?._id}`, payload).then((res) => {
      if (res?.data) {
        logout();
      }
    });
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
  };

  const handleViewProfile = () => {
    setShowProfileDetailsModal(true);
    setShowProfileModal(false);
  };

  const handleCloseProfileDetailsModal = () => {
    setShowProfileDetailsModal(false);
  };

  const handleLogoutModalOpen = () => {
    handleCloseProfileModal();
    setShowLogoutModal(true);
  };

  const handleLogoutModalClose = () => {
    setShowLogoutModal(false);
  };

  const handleLogout = () => {
    if (userDetails?.role_type) {
      updateAttendance();
    } else {
      logout();
    }
  };

  const handleOrders = () => {
    navigate("/orders");
    handleCloseProfileModal();
  };
  const handleSalary = () => {
    navigate("/attendance");
    handleCloseProfileModal();
  };

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <ul>
          <li className={isActive("/home")}>
            <Link to="/home">Home</Link>
          </li>
          <li className={isActive("/menu")}>
            <Link to="/menu">Menu</Link>
          </li>
          <li className={isActive("/cart")}>
            <Link to="/cart">
              Cart{" "}
              {cartItems?.length > 0 && (
                <sup style={{ color: "green" }}>
                  ({cartItems?.length}
                  {cartItems?.length > 1 ? " items" : " item"})
                </sup>
              )}
            </Link>
          </li>
          {userDetails?.role_type === "manager" && (
            <li className={isActive("/add-food")}>
              <Link to="/add-food">Add Food</Link>
            </li>
          )}
          <li className={isActive("/orders")}>
            <Link to="/orders">All Orders</Link>
          </li>
          {userDetails?.role_type && (
            <li className={isActive("/attendance")}>
              <Link to="/attendance">Attendance</Link>
            </li>
          )}
          {userDetails?.role_type === "manager" && (
            <li className={isActive("/users")}>
              <Link to="/users">Users</Link>
            </li>
          )}
        </ul>
      </div>
      <div className="top-bar-middle">
        <SearchBar />
      </div>
      <div className="top-bar-right">
        <div className="profile-and-bonus">
          {!userDetails?.role_type && (
            <div className="top-bar-bonus-points">
              Loyalty Points:{" "}
              {Math.floor(userDetails?.loyalty_points ? userDetails?.loyalty_points : 0)}
            </div>
          )}
          <div className="profile-picture" onClick={handleProfileClick}>
            <Avatar alt="Profile" src={userDetails?.profileImage} />
          </div>
        </div>
      </div>
      <Modal open={showProfileModal} onClose={handleCloseProfileModal}>
        <Box
          sx={{
            position: "absolute",
            top: "8%",
            right: "-85px",
            transform: "translateX(-50%)",
            textAlign: "center",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            borderRadius: "8px",
          }}
        >
          <Button startIcon={<AccountCircleIcon />} onClick={handleViewProfile}>
            View Profile
          </Button>
          <Divider />
          <Button startIcon={<ShoppingBagIcon />} onClick={handleOrders}>
            Your Orders
          </Button>
          <Divider />
          {userDetails?.role_type === "employee" && (
            <Button startIcon={<HistoryIcon />} onClick={handleSalary}>
              Salary History
            </Button>
          )}
          <Divider />
          <Button startIcon={<LogoutIcon />} onClick={handleLogoutModalOpen}>
            Logout
          </Button>
        </Box>
      </Modal>
      <ProfileModal
        showProfileDetailsModal={showProfileDetailsModal}
        handleCloseProfileDetailsModal={handleCloseProfileDetailsModal}
        userDetails={userDetails}
        updateUser={updateUser}
      />
      <Modal open={showLogoutModal} onClose={handleLogoutModalClose}>
        <Box
          sx={{
            position: "absolute",
            bottom: "50%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "200px",
            textAlign: "center",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Are you sure you want to logout?
          </Typography>
          <Button onClick={handleLogout}>Logout</Button>
          <Button onClick={handleLogoutModalClose}>Cancel</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default TopBar;
