import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { DataContext } from "../App";
import Layout from "../components/layout/layout";

function ProtectedRoutes() {
  const { userDetails } = useContext(DataContext);

  if ( userDetails?.authToken) {
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  } else {
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoutes;
