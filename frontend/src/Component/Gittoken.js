import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Gittoken = () => {
  const navigate = useNavigate();
    const fetchdata = async (code) => {
      const queryParams = {
        code: code,
      };

      try {
        const response = await axios.get(
          "http://localhost:5000/githubauthorized",
          {
            params: queryParams,
          }
        );

        if (response.data !== "error") {
           
          localStorage.setItem("usertoken", JSON.stringify(response));
         
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const f=async()=>{
    if (code) {
      await fetchdata(code)
      navigate('/search')
    } else {
      navigate("/");
    }
  }
   f();
  }, []);

  return <div></div>;
};

export default Gittoken;
