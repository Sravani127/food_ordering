import React, { useContext, useState } from "react";
import {
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  CssBaseline,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Input from "../../common-components/Inputs/Input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DataContext } from "../../App";
import axios from "axios";
import {
  getRequest,
  patchRequest,
  postRequest,
} from "../../services/apiService";
import { ImageInput } from "../../common-components/Inputs/ImageInput";

const validationSchema = Yup.object({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  mobile_number: Yup.string()
    .required("Mobile Number is required")
    .matches(/^\d{10}$/, "Mobile Number must be exactly 10 digits"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be atsetToken least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
    ),
  confirm_password: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match")
    .nullable(),
  dob: Yup.mixed().required("Date of Birth is required"),
});

export default function LoginPage() {
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search);
  const isFromManager = queryParam.get("isFromManager");
  const [referUserDetails, setReferUserDetails] = useState({});

  const initialValues = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    email: "",
    password: "",
    confirm_password: "",
    profileImage: "",
    salary: "",
    dob: "",
    refer_id: "",
  };

  const navigate = useNavigate();

  const getUserDetails = (userId) => {
    getRequest(`/user/${userId}`).then((res) => {
      setReferUserDetails(res?.data?.user);
    });
  };

  const onHandleSubmit = (values) => {
    const newValues = {
      ...values,
      salary: values?.salary?.length ? values?.salary : 10,
    };
    postRequest("/signup", { ...newValues }).then(async (res) => {
      if (values?.refer_id) {
        await patchRequest(`/users/${values?.refer_id}`, {
          loyalty_points: 200 + (Number(referUserDetails?.loyalty_points) || 0),
        });
      }
      !isFromManager ? navigate("/login") : navigate(-1);
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
            marginTop={0}
            elevation={3}
            sx={{
              padding: 4,
              width: "80%",
              backgroundColor: "rgba(169,169,169,0.5)",
            }}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onHandleSubmit}
            >
              {({ setFieldValue, errors }) => (
                <Form>
                  <Typography variant="h4" align="center" gutterBottom>
                    My Food Order
                  </Typography>
                  <Field name="profileImage">
                    {({ field }) => (
                      <ImageInput
                        field={field}
                        setFieldValue={setFieldValue}
                        imagePreview={field.value}
                      />
                    )}
                  </Field>
                  <FormHelperText error={true}>
                    {errors?.profileImage}
                  </FormHelperText>
                  <Field
                    label="First Name"
                    autoFocus
                    type="text"
                    id="first_name"
                    name="first_name"
                    component={Input}
                    fullWidth
                    margin="normal"
                  />
                  <Field
                    component={Input}
                    label="Last Name"
                    type="text"
                    id="last_name"
                    name="last_name"
                    fullWidth
                    margin="normal"
                  />
                  <Field
                    component={Input}
                    label="Mobile Number"
                    maxLength={10}
                    onKeyPress={(e) => {
                      if (
                        !(
                          (e.charCode >= "48" && e.charCode <= "57") ||
                          e.charCode === "46"
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                    type="text"
                    id="mobile_number"
                    name="mobile_number"
                    fullWidth
                    margin="normal"
                  />
                  <Field
                    component={Input}
                    label="Email Address"
                    type="email"
                    id="email"
                    name="email"
                    fullWidth
                    margin="normal"
                  />
                  <Field
                    component={Input}
                    label="Password"
                    type="password"
                    id="password"
                    name="password"
                    fullWidth
                    margin="normal"
                  />
                  <Field
                    component={Input}
                    label="Confirm Password"
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    fullWidth
                    margin="normal"
                  />
                  {isFromManager && (
                    <Field
                      component={Input}
                      label="Salary Per Hour"
                      type="text"
                      id="salary"
                      name="salary"
                      fullWidth
                      margin="normal"
                    />
                  )}
                  <Field
                    component={Input}
                    label="Refer ID"
                    type="text"
                    id="refer_id"
                    name="refer_id"
                    onChange={(e) => {
                      setFieldValue("refer_id", e.target.value);
                      getUserDetails(e.target.value);
                    }}
                    fullWidth
                    margin="normal"
                  />
                  {isFromManager && (
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="course-type-label">Role Type</InputLabel>
                      <Field
                        as={Select}
                        name="role_type"
                        labelId="course-type-label"
                      >
                        <MenuItem value="manager">Manager</MenuItem>
                        <MenuItem value="employee">Employee</MenuItem>
                      </Field>
                    </FormControl>
                  )}
                  <Field
                    component={Input}
                    label="Date Of Birth"
                    type="date"
                    id="dob"
                    name="dob"
                    fullWidth
                    margin="normal"
                  />
                  {isFromManager ? (
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      Add User
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      fullWidth
                      sx={{ mt: 2, borderRadius: "15px" }}
                    >
                      Signup
                    </Button>
                  )}
                  <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Grid item>
                      {!isFromManager && (
                        <>
                          Already have an account?{" "}
                          <Link to="/login">Login</Link>
                        </>
                      )}
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
