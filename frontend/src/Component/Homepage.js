import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Homepage = () => {
  const clientId = process.env.REACT_APP_CLIENT_ID;
  useEffect(() => {
    if (clientId) {
    
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}`;
    } else {
      console.error("REACT_APP_CLIENT_ID is not defined.");
    }
  }, []);

  return <div>{/* Your component content */}</div>;
};

export default Homepage;
