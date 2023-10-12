import React, { useEffect } from "react";
import { Card, CardContent, Avatar, Typography } from "@mui/material";

const ContactCard = ({ contact ,curruser}) => {
  const cardStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "16px",
  };

  const avatarStyle = {
    width: "40px",
    height: "40px",
    marginRight: "16px",
  };
 
  let parts = contact.conversationId.split("_")
    let desired_part= parts[0]==curruser?parts[2]:parts[0]
  
  return (
    <Card style={cardStyle} elevation={4}>
      <Avatar style={avatarStyle} alt={contact.conversationId} src={contact.avatarUrl} />
      <CardContent>
        <Typography variant="h6" component="div">
          {desired_part}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
