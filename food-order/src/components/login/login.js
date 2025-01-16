import React, { useContext } from "react";
import {
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  CssBaseline,
  Link,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Input from "../../common-components/Inputs/Input";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../App";
import axios from "axios";
import "./login.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUserDetails } = useContext(DataContext);

  const onSubmit = (values, { setSubmitting, setFieldError }) => {
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    axios
      .post(`http://localhost:3001/login`, values, options)
      .then(({ data }) => {
        if (data?.status === 401) {
          setFieldError("password", "Invalid Credentials");
        } else if (data?.token) {
          localStorage.setItem("authToken", data?.token);
          localStorage.setItem("user_id", data?.user?._id);
          localStorage.setItem("isAdmin", data?.user?.admin);
          setUserDetails({
            authToken: data?.token,
            userId: data?.user?._id,
          });

          setTimeout(() => {
            navigate("/home");
          }, 1000);
        }
        setSubmitting(false);
      })
      .catch((error) => {
        if (error.response) {
          const { data } = error.response;
          if (data && data.error) {
            setFieldError("password", data.error);
          }
        }
        setSubmitting(false);
      });
  };

  return (
    <Container
      maxWidth={100}
      component="main"
      sx={{
        backgroundImage:
          "url('https://cdn.pixabay.com/photo/2019/03/11/09/58/ikea-4048225_1280.jpg')",
        height: "100vh",
        padding: 0,
        width: "100%",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <CssBaseline />
      <Grid alignItems={"center"} container sx={{ height: "100%" }}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 4,
              width: "80%",
              backgroundColor: "rgba(169,169,169,0.5)",
            }}
          >
            <Typography variant="h4" gutterBottom>
              Welcome to Our Food Ordering App!
            </Typography>
            <Typography variant="body1" align="center">
              Order delicious food from our restaurant for store pickup or home
              delivery. We offer a wide variety of tasty dishes to satisfy your
              cravings!
            </Typography>
          </Paper>
        </Grid>
        {/* Right Side Login Form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 4,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 4,
              width: "80%",
              backgroundColor: "rgba(169,169,169,0.5)",
            }}
          >
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .required("Email Address is required")
                  .email("Email seems to be invalid, please try again"),
                password: Yup.string()
                  .required("Password is required")
                  .min(8, "Password must be at least 8 characters")
                  .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                    "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
                  ),
              })}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Typography variant="h4" align="center" gutterBottom>
                    Food Order
                  </Typography>
                  <Field
                    component={Input}
                    name="email"
                    type="email"
                    label="Email"
                    fullWidth
                    autoFocus
                    margin="normal"
                  />
                  <Field
                    component={Input}
                    name="password"
                    type="password"
                    label="Password"
                    fullWidth
                    margin="normal"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{ mt: 2, borderRadius: "15px" }}
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                  <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Grid item>
                      <Link href="/signup" variant="body2">
                        Don't have an account? Sign Up
                      </Link>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
