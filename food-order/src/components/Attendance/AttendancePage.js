import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { getRequest } from "../../services/apiService";
import PaymentModal from "../../common-components/Modals/PaymentModal/PaymentModal";
import { FoodsContext } from "../layout/layout";

const AttendancePage = () => {
  const { userDetails, setLoader } = useContext(FoodsContext);
  const [attendanceList, setAttendanceList] = useState([]);
  const tableList = attendanceList?.filter(
    (item) => item?.user_id === userDetails?._id
  );

  const totalAmount = tableList.reduce(
    (acc, order) => acc + Number(order.salary),
    0
  );

  const getAllAttendance = () => {
    getRequest("/worktracks").then((res) => {
      if (res?.data) {
        setAttendanceList(res?.data);
      }
    });
  };

  useEffect(() => {
    getAllAttendance();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {userDetails?.role_type === "employee" && (
          <Typography variant="h6">
            Total Salary: ${totalAmount ? totalAmount.toFixed(2) : 0}
          </Typography>
        )}
      </Box>
      {tableList?.length ? (
        <Paper sx={{ overflow: "auto" }}>
          <Table>
            <TableHead sx={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Clock In</TableCell>
                <TableCell>Clock Out</TableCell>
                <TableCell>Worked Hours</TableCell>
                {userDetails?.role_type === "employee" && (
                  <>
                    {" "}
                    <TableCell>Salary</TableCell>
                    <TableCell>Bonus</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableList.map((order) => (
                <TableRow key={order.clockIn}>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    {order?.clockIn
                      ? new Date(order.clockIn)?.toLocaleTimeString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {order?.clockOut
                      ? new Date(order.clockOut)?.toLocaleTimeString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {order?.totalHours ? order?.totalHours : 0}
                    {` `}Hours
                  </TableCell>
                  {userDetails?.role_type === "employee" && (
                    <>
                      {" "}
                      <TableCell>
                        ${order?.salary ? order?.salary : 0}
                      </TableCell>
                      <TableCell>
                        {order?.bonus
                          ? parseFloat(order.bonus).toFixed(2)
                          : "-"}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : (
        <>Attendance is not available</>
      )}
    </>
  );
};

export default AttendancePage;
