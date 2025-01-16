import React, { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { PhotoCamera, Edit, Add } from "@mui/icons-material";
import * as Yup from "yup";
import { ImageInput } from "../../common-components/Inputs/ImageInput";
import { postRequest } from "../../services/apiService";
import { useNavigate } from "react-router-dom";
import { FoodsContext } from "../layout/layout";

const regex = /^[a-zA-Z]+$/
const validationSchema = Yup.object().shape({
  foodName: Yup.string().matches(/^[a-zA-Z]+$/, 'Food name is required and Only alphabetical characters are allowed'),
  foodType: Yup.string().required("Food Type is required"),
  foodCategory: Yup.string().required("Food Category is required"),
  courseType: Yup.string().required("Course Type is required"),
  //image: Yup.mixed().required("Image is required"),
  finalPrice: Yup.number().required("Price is required and it has to be number"),
  description: Yup.string().required("Description is required"),
});

const AddFoodPage = () => {
  const { foods, setLoader } = useContext(FoodsContext);
  const { refetchFoods } = useContext(FoodsContext);
  const navigate = useNavigate();
  const initialValues = {
    foodName: "",
    foodType: "",
    foodCategory: "",
    courseType: "",
    image: "",
    description: "",
    extraFoods: [],
  };

  const createFood = (payload, setSubmitting) => {
    console.log("payload",payload)
    // setLoader(true);
    postRequest("/foods", payload).then((res) => {
      if (res?.data) {
        // setLoader(false);
        setSubmitting(false);
        refetchFoods();
        navigate(-1);
      }
    });
  };

  const handleSubmit = (values, { setSubmitting }) => {
    createFood(values, setSubmitting);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10px",
      }}
    >
      <div style={{ width: "400px" }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            bgcolor: "rgba(128, 128, 128, 0.5)",
            color: "black",
            py: 1,
            marginBottom: "10px",
          }}
        >
          Add Food
        </Typography>

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <Field name="image">
                {({ field }) => (
                  <ImageInput
                    field={field}
                    setFieldValue={setFieldValue}
                    imagePreview={field.value}
                  />
                )}
              </Field>
              <ErrorMessage
                name="image"
                component="div"
                style={{ color: "red", marginBottom: "1rem" }}
              />
              <Field
                as={TextField}
                name="foodName"
                label="Food Name"
                fullWidth
                margin="normal"
              />
              <ErrorMessage
                name="foodName"
                component="div"
                style={{ color: "red", marginBottom: "1rem" }}
              />
              <Field
                as={TextField}
                name="finalPrice"
                label="Price"
                fullWidth
                margin="normal"
              />
              <ErrorMessage
                name="finalPrice"
                component="div"
                style={{ color: "red", marginBottom: "1rem" }}
              />
              <Field
                as={TextField}
                name="foodType"
                label="Food Type"
                fullWidth
                margin="normal"
              />
              <ErrorMessage
                name="foodType"
                component="div"
                style={{ color: "red", marginBottom: "1rem" }}
              />
              <Field
                as={TextField}
                name="foodCategory"
                label="Food Category"
                fullWidth
                margin="normal"
              />
              <ErrorMessage
                name="foodCategory"
                component="div"
                style={{ color: "red", marginBottom: "1rem" }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="course-type-label">Course Type</InputLabel>
                <Field
                  as={Select}
                  name="courseType"
                  labelId="course-type-label"
                >
                  <MenuItem value="Starter">Starter</MenuItem>
                  <MenuItem value="Main Course">Main Course</MenuItem>
                  <MenuItem value="Dessert">Dessert</MenuItem>
                  <MenuItem value="Bread">Bread</MenuItem>
                  <MenuItem value="Drink">Drink</MenuItem>
                </Field>
              </FormControl>
              <ErrorMessage
                name="courseType"
                component="div"
                style={{ color: "red", marginBottom: "1rem" }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="extra-foods-label">Extra Foods</InputLabel>
                <Field
                  as={Select}
                  name="extraFoods"
                  labelId="extra-foods-label"
                  multiple
                >
                  {foods?.map((item) => (
                    <MenuItem key={item?._id} value={item?._id}>
                      {item?.foodName}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
              <Field
                as={TextField}
                name="description"
                label="Description"
                multiline
                rows={4}
                fullWidth
                margin="normal"
              />
              <ErrorMessage
                name="description"
                component="div"
                style={{ color: "red", marginBottom: "1rem" }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                style={{ marginTop: 20 }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddFoodPage;
