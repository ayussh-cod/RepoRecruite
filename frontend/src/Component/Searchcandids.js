import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import CandidCard from "./CandidCard";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Searchcandids = () => {
  const navigate=useNavigate();
  const [filter, setFilter] = useState("");
  const [candid, setCandid] = useState([]);
  const [type, settype] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage,setitemsPerPage] = useState(1); // Number of items to display per page
useEffect(() => {
  
  if (!localStorage.getItem("usertoken")) navigate("/");
}, []);
  const handleChange = (e) => {
    settype(e.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchClick = async () => {
    if (type === "Repository") {
      setitemsPerPage(12);
      const body = {
        token: JSON.parse(localStorage.getItem("usertoken")).data,
      };

      const { data } = await axios.post(
        "http://localhost:5000/repository",
        body,
        {
          params: { filter: filter, type: type },
        }
      );
     
      setCandid(data);
       console.log(candid);
     
      setCurrentPage(1);
    } else {
      const body = {
        token: JSON.parse(localStorage.getItem("usertoken")).data,
      };
      const { data } = await axios.post("http://localhost:5000/user", body, {
        params: { filter: filter },
      });
      
      setCandid(data);
         console.log(data);
      setCurrentPage(1);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  let displayedData = Array.isArray(candid)
    ? candid.slice(startIndex, endIndex)
    : [];
   
  const totalPages = Math.ceil(candid.length / itemsPerPage);

  return (
    <Container style={{ padding: "16px" }}>
      <Paper style={{ padding: "16px", marginBottom: "16px" }}>
        <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={12} style={{ display: "flex" }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              fullWidth
              onChange={(e) => {
                setFilter(e.target.value);
              }}
            />
            <FormControl style={{ minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">type</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={type}
                label="type"
                onChange={handleChange}
              >
                <MenuItem value={"User"}>User</MenuItem>
                <MenuItem value={"Repository"}>General</MenuItem>
              </Select>
            </FormControl>
            <Button
              onClick={handleSearchClick}
              variant="contained"
              style={{ marginLeft: "8px" }}
            >
              <SearchIcon />
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper style={{ padding: "16px" }}>
        <Grid container alignItems="center" justifyContent="center" spacing={5}>
          {displayedData.map((c) => (
            <Grid item xs={12} md={3} key={c.login}>
              <CandidCard
                key={c.login}
                pic={c.avatar_url}
                name={c.login}
                desc={c.contributions}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Grid container justifyContent="center" style={{ marginTop: "16px" }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Grid>
    </Container>
  );
};

export default Searchcandids;
