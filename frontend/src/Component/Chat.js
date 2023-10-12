import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CometChat } from "@cometchat-pro/chat";
import { Box, Button, FormControl, Grid, IconButton, Input, InputBase, Paper, Stack, TextField, Typography } from "@mui/material";
import ContactCard from "./ContactCard";

import SendIcon from "@mui/icons-material/Send";
const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectconv, setselectconv] = useState();
  const [curruser, setcurruser] = useState();
  const [messages, setmessages] = useState();
  
  const navigate = useNavigate();
  const send = useRef();
  let UID;
  const authKey = process.env.REACT_APP_AUTH_KEY;
  console.log("authKey:", authKey);

  const createUser = async (UID) => {
    try {
      var user = new CometChat.User(UID);
      user.setName(UID);

      const createdUser = await CometChat.createUser(user, authKey);
      console.log("User created:", JSON.stringify(createdUser));
    } catch (error) {
      console.log("Error creating user:", error);
    }
  };

  const login = async () => {
    try {
      if (!localStorage.getItem("usertoken")) {
        navigate("/");
      } else {
        let t = JSON.parse(localStorage.getItem("usertoken")).data;
        const header = {
          "Content-Type": "Application/json",
        };
        const { data } = await axios.get("http://localhost:5000/loggedIn", {
          headers: header,
          params: { token: t },
        });
        UID = data.login;
        setcurruser(UID);
        createUser(UID);
      
        await CometChat.login(UID, authKey);
        console.log("Login Successful:", UID);
      }
    } catch (error) {
      console.log("Error during login:", error);
    }
  };

  const getConversations = async () => {
    try {
      const conversationRequest = new CometChat.ConversationsRequestBuilder()
        .setLimit(10)
        .build();
      const conv = await conversationRequest.fetchNext();
      setConversations(conv);
    } catch (error) {
      console.log("Error fetching conversations:", error);
    }
  };
  const get_message = async (user) => {
    let UID = user;
    let limit = 70;
    let messagesRequest = new CometChat.MessagesRequestBuilder()
      .setUID(UID)
      .setLimit(limit)
      .build();

    messagesRequest.fetchPrevious().then(
      (messages) => {
       
        
        setmessages(messages);
      },
      (error) => {
        console.log("Message fetching failed with error:", error);
      }
    );
  };
  const check = () => {
    if (localStorage.getItem("usertoken") == "") navigate("/");
  
  };
  const send_message = async () => {
    console.log(selectconv);
    let receiverID = selectconv;
    let messageText = send.current;
    let receiverType = CometChat.RECEIVER_TYPE.USER;
    let textMessage = new CometChat.TextMessage(
      receiverID,
      messageText,
      receiverType
    );

    const data = await CometChat.sendMessage(textMessage);

    await getConversations();
    let parts = await conversations[0].conversationId.split("_");
    let desired_part = parts[0] == curruser ? parts[2] : parts[0];
    await setselectconv(desired_part);
   
    await get_message(selectconv);
    
  };

  let listenerID = curruser;

  CometChat.addMessageListener(
    listenerID,
    new CometChat.MessageListener({
      onTextMessageReceived: async (textMessage) => {
        console.log("Text message received successfully", textMessage);
        await getConversations();
        if (conversations[0]) {
          console.log(conversations[0] && conversations[0].conversationId);
          let parts = conversations[0].conversationId.split("_");
          let desired_part = parts[0] == curruser ? parts[2] : parts[0];
          await setselectconv(desired_part);
          await get_message(selectconv);
        }
      },
      onMediaMessageReceived: (mediaMessage) => {
        console.log("Media message received successfully", mediaMessage);
      },
      onCustomMessageReceived: (customMessage) => {
        console.log("Custom message received successfully", customMessage);
      },
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      await check();
      await login(); 
      await getConversations();
    };

    fetchData();
  }, [messages]);

  return (
    <Box style={{ display: "flex", height: "100vh" }}>
      <Box
        style={{
          flex: "0 0 25%",
          borderRight: "1px solid #ccc",
          padding: "16px",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Contacts
        </Typography>
        <Stack spacing={1} sx={{ width: "100%" }}>
          {conversations.map((c) => (
            <Button
              onClick={async () => {
                let parts = await c.conversationId.split("_");
                let desired_part = parts[0] === curruser ? parts[2] : parts[0];
                setselectconv(desired_part);

                await get_message(desired_part);
              }}
            >
              <div key={c.conversationId} style={{ width: "90%" }}>
                <ContactCard contact={c} curruser={curruser} />
              </div>
            </Button>
          ))}
        </Stack>
      </Box>

      <div style={{ flex: "1", padding: "16px" }}>
        <Paper elevation={3} style={{ height: "84vh", overflowY: "auto" }}>
          {selectconv ? (
            <div>
              <Stack>
                {messages ? (
                  messages.map((m) => (
                    <div
                      key={m.data.id}
                      style={{
                        padding: "10px",
                        margin: "5px",
                        maxWidth: "70%",
                        borderRadius: "15px",
                        alignSelf:
                          m.data.entities.sender.entity.name === curruser
                            ? "flex-start"
                            : "flex-end",
                        backgroundColor:
                          m.data.entities.sender.entity.name === curruser
                            ? "#dcf8c6"
                            : "#e6e5e5",
                        color: "#333",
                        overflowWrap: "break-word",
                      }}
                    >
                      {m.data.text}
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </Stack>
            </div>
          ) : (
            <Typography>Pls select some Conversation</Typography>
          )}
        </Paper>
        <div
          style={{ marginTop: "20px", display: "flex", alignItems: "center" }}
        >
         
          <TextField
            fullWidth
            variant="outlined"
            label="Type your message"
            multiline={true}
            onChange={(e) => {
              send.current = e.target.value;
               
            }}
            
            style={{ width: "90%" }}
          />
          <IconButton
            color="primary"
            onClick={send_message}
            style={{ width: "10%" }}
          >
            <SendIcon />
          </IconButton>
        </div>
      </div>
    </Box>
  );
};


export default Chat;
