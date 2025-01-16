import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  Typography,
  Box,
  TextField,
  Paper,
  IconButton,
} from "@mui/material";
import "./UsersPage.css";
import { deleteRequest, getRequest } from "../../services/apiService";
import { useNavigate } from "react-router-dom";
import { Delete } from "@mui/icons-material";

const UsersPage = () => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);

  const fetchAllUsers = () => {
    getRequest("/users").then((res) => {
      setUserList(res?.data);
    });
  };

  const handleDelete = (id) => {
    deleteRequest(`/users/${id}`).then((res) => {
      if (res?.data) {
        fetchAllUsers();
      }
    });
  }

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // console.log("filtered  users: = ", userOrders, "total orders = ", orders)

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      ></Box>
      <Typography>
        {" "}
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate("/signup?isFromManager=true")}
        >
          Add User
        </Button>
      </Typography>
      {userList?.length ? (
        <Paper sx={{ overflow: "auto" }}>
          <Table>
            <TableHead sx={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role type</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList?.map((user) => (
                <TableRow key={user?._id}>
                  <TableCell>
                    {user?.first_name} {user?.last_name}
                  </TableCell>
                  <TableCell>{user?.role_type}</TableCell>
                  <TableCell>{user?.email}</TableCell>
                  <TableCell>{user?.mobile_number}</TableCell>
                  <TableCell>
                    {" "}
                    <IconButton
                      onClick={() => handleDelete(user._id)}
                      aria-label="delete"
                      sx={{ marginRight: 1 }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : (
        <>Users are not available</>
      )}
    </>
  );
};

export default UsersPage;
