import { Backdrop, Box, Button, Modal, Typography } from "@mui/material";
import React, {
  createContext,
  memo,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { DataContext } from "../../App";
import Loader from "../../common-components/Loader/Loader";
import TopBar from "../../common-components/TopBar/TopBar";
import { getRequest, postRequest, putRequest } from "../../services/apiService";
import "./layout.css";

export const FoodsContext = createContext();

const Layout = ({ children }) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  const loader = useSelector((state) => state.loader.isLoading);
  const [orders, setOrders] = useState([]);


  // const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const userId = localStorage.getItem("user_id");
  const { foods, setFoods } = useContext(DataContext);
  const [workTrackData, setWorkTrackData] = useState();

  const [cartItems, setCartItems] = useState([]);
  const [userDetails, setUserDetails] = useState();
  const [todayWorkTracks, setTodayWorkTracks] = useState();

  const userOrders = !userDetails?.role_type
  ? orders?.filter((item) => item?.user_id === userDetails?._id)
  : orders;

  const getAllOrders = () => {
    getRequest("/orders").then((res) => {
      if (res?.data) {
        setOrders(res?.data);
      }
    });
  };

  const getAllFoods = () => {
    // setLoader(true);
    getRequest("/foods").then((res) => {
      if (res?.data) {
        // setLoader(false);
        setFoods(res?.data);
      }
    });
  };

  const updateUser = (payload) => {
    putRequest(`/users/${userDetails?._id}`, {...userDetails,...payload}).then((res) => {
      if (res) {
        getUserDetails();
      }
    });
  };

  const getUserDetails = () => {
    // setLoader(true);
    getRequest(`/user/${userId}`).then((res) => {
      // setLoader(false);
      setUserDetails(res?.data?.user);
    });
  };

  const getAllWorkTracks = () => {
    // setLoader(true);
    if (userDetails?.role_type) {
      getRequest(`/worktracks`).then((res) => {
        if (res?.data) {
          setWorkTrackData(res?.data);
          // setLoader(false);
          const todayTracks = res?.data?.find(
            (track) => track.date === formattedDate && track.user_id === userId
          );
          if (!todayTracks?.clockIn) {
            setShowModal(true);
          }
          setTodayWorkTracks(todayTracks);
        }
      });
    }
  };

  const createAttendance = () => {
    const payload = {
      user_id: userDetails?._id,
      clockIn: currentDate,
      clockOut: "",
      totalHours: null,
      date: formattedDate,
      salaryPerHour: userDetails?.salary,
    };
    // setLoader(true);

    postRequest("/worktracks", payload).then((res) => {
      if (res?.data) {
        // setLoader(false);
        setShowModal(false);
        getAllWorkTracks();
      }
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (userDetails?._id) {
      getAllFoods();
      getAllWorkTracks();
    }
  }, [userDetails?._id]);

  useEffect(() => {
    getUserDetails()
    getAllOrders();
  }, []);

  const refetchFoods = () => getAllFoods();

  return (
    <div className="layout">
      <FoodsContext.Provider
        value={{
          foods,
          refetchFoods,
          cartItems,
          setCartItems,
          userDetails,
          todayWorkTracks,
          setOrders,
          orders,
          workTrackData,
          userOrders,
          getUserDetails,
          updateUser,
          getAllFoods
        }}
      >
        <TopBar />
        {loader && <Loader />}
        <>
          {" "}
          {userDetails?._id && (
            <div style={{ padding: "20px" }}>{foods && children}</div>
          )}
        </>
      </FoodsContext.Provider>

      <Modal open={showModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
          }}
        >
           <Typography id="payment-modal-title" variant="h6" gutterBottom>
            You are now clocked in for today, and your working hours are being
            calculated from the current time.
          </Typography>
          <Button variant="contained" color="success" onClick={createAttendance}>Ok</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Layout;
