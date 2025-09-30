import { useRef, useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector, useDispatch } from "react-redux";
import { setQuery } from "../../reduxTookit/slices/searchSlice";

function SearchBox() {
  const dispatch = useDispatch();
  const query = useSelector((state) => state.search.query);
  const controllers = useSelector((state) => state.search.controllers);
  const [inputValue, setInputValue] = useState(query);

  const debounceRef = useRef(null);
  if (!controllers.searchBox) return null;

  const flushDebounce = (value) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    dispatch(setQuery(value));
    controllers.searchBox.updateText(value);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      dispatch(setQuery(value));
      controllers.searchBox.updateText(value);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      flushDebounce(inputValue);
      controllers.searchBox.submit();
    }
  };

  return (
    <TextField
      fullWidth
      placeholder="Search - Air India, Indigo, or SpiceJet"
      value={inputValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            {inputValue && (
              <IconButton
                size="small"
                onClick={() => {
                  setInputValue("");
                  flushDebounce(""); 
                }}
              >
                <ClearIcon />
              </IconButton>
            )}
          </InputAdornment>
        ),
      }}
    />
  );
}

export default SearchBox;
