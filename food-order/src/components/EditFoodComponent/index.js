import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getRequest } from "../../services/apiService";
import EditFood from "./EditFoodPage";

const EditFoodPage = () => {
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search);
  const foodId = queryParam.get("id");

  const [foodDetails, setFoodDetails] = useState();
  console.log("id", foodId);
  const getFoodDetails = () => {
    getRequest(`/foods/${foodId}`).then((res) => {
      setFoodDetails(res?.data?.food);
    });
  };

  useEffect(() => {
    getFoodDetails();
  }, []);
  if (foodDetails) {
    return <EditFood foodDetails={foodDetails} foodId={foodId} />;
  }
};

export default EditFoodPage;
