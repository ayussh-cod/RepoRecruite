import "./App.css";
import Homepage from "./Component/Homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Gittoken from "./Component/Gittoken";
import Searchcandids from "./Component/Searchcandids"
import Chat from "./Component/Chat"
import { useEffect } from "react";
import Navbar from "./NavBar";
const { CometChat } = require("@cometchat-pro/chat");


function App() {
  useEffect(() => {
    let appID = "2461196004879add";
    let region = "in";
    let appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .autoEstablishSocketConnection(true)
      .build();
    CometChat.init(appID, appSetting).then(
      () => {
        console.log("Initialization completed successfully");
      },
      (error) => {
        console.log("Initialization failed with error:", error);
      }
    );
    
  }, []);
  return (
 
      <Router>
        <Navbar/>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route exact path="/githubauthorized" element={<Gittoken />} />
          <Route exact path="/search" element={<Searchcandids />} />
          <Route exact path="/chat" element={<Chat />} />
        </Routes>
      </Router>

  );
}

export default App;
