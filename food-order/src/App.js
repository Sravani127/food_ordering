import "./App.css";
import Routers from "./routes/routers";
import React, { createContext, useEffect, useState } from "react";
import { getRequest } from "./services/apiService";

export const DataContext = createContext();

function App() {
  const [foods, setFoods] = useState();
  const [userDetails, setUserDetails] = useState({
    authToken: localStorage.getItem("authToken"),
    userId: localStorage.getItem("authToken"),
    isAdmin: localStorage.getItem("isAdmin"),
  });

  return (
    <DataContext.Provider
      value={{ userDetails, setUserDetails, foods, setFoods }}
    >
      <div>
        <Routers />
      </div>
    </DataContext.Provider>
  );
}

export default App;
