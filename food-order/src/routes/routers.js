import React, { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddFoodPage from "../components/AddFoodComponent/AddlFoodPage";
import AttendancePage from "../components/Attendance/AttendancePage";
import CartComponent from "../components/CartComponent/CartComponent";
import EditFoodPage from "../components/EditFoodComponent";
import HomePage from "../components/home/HomePage";
import Login from "../components/login/login";
import MenuPage from "../components/MenuComponent/MenuPage";
import OrderPage from "../components/OrderComponent/OrderPage";
import OrdersList from "../components/OrderComponent/OrdersPage";
import Signup from "../components/signup/signup";
import UsersPage from "../components/Users/UsersPage";
import ViewOrder from "../components/ViewOrder/ViewOrderPage";
import ProtectedRoutes from "./authentication";

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="home" element={<HomePage />} />
          <Route path="add-food" element={<AddFoodPage />} />
          <Route path="edit-food" element={<EditFoodPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="cart" element={<CartComponent />} />
          <Route path="order" element={<OrderPage />} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="view-food" element={<ViewOrder />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
