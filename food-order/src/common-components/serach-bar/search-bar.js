// SearchBar.js
import React, { useContext, useState } from "react";
import { TextField, Button, IconButton, Autocomplete } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./search-bar.css";
import { useNavigate } from "react-router-dom";
import { FoodsContext } from "../../components/layout/layout";

const SearchBar = () => {
  const { foods } = useContext(FoodsContext);
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);

  const getMatchingOptions = (inputValue) => {
    return foods
      ?.map((item) => ({ label: item?.foodName, value: item?.foodName }))
      ?.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
  };

  const handleInputChange = (event, newInputValue) => {
    setOptions(newInputValue ? getMatchingOptions(newInputValue) : []);
  };

  const handleSearch = (value) => {
    navigate(`/menu?foodname=${value}`);
  };

  return (
    <div className="search-wrapper">
      <Autocomplete
        freeSolo
        options={options}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Foods"
            InputProps={{
              ...params.InputProps,
              style: { backgroundColor: "white", width: "300px" }, // Customize input styles here
              // onFocus: (e) => (e.target.labels[0].style.display = "none"), // Hide label when focused
              // endAdornment: null, // Remove end adornment (e.g., down arrow icon)
            }}
            variant="outlined"
            defaultValue={"option1"}
            onChange={(e) => handleInputChange(e, e.target.value)}
          />
        )}
        onChange={(event, value) => {
          if (value) {
            handleSearch(value.label);
          }
        }}
      />
    </div>
  );
};

export default SearchBar;
