import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "@mui/material";
import { CometChat } from "@cometchat-pro/chat";
import { useNavigate } from "react-router-dom";


const CandidCard = ({ pic, name, desc }) => {
  const navigate=useNavigate();
  return (
    <Card sx={{ maxWidth: 346 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={pic}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          contributors: {desc}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => {
            name && (window.location.href = `https://github.com/${name}`);
          }}
        >
          Show Profile
        </Button>
        <Button
          size="small"
          onClick={async() => {
            try{
            let messg=CometChat.TextMessage(name,"Hi",CometChat.RECEIVER_TYPE.USER)
          const{d}=await CometChat.sendMessage(messg)
          navigate('/chat')

            }
            catch(error)
            {
              alert(`Sorry ${name} has not Siggned Up to this site `)
            }
          }}
        >
          Start Chat
        </Button>
      </CardActions>
    </Card>
  );
};

export default CandidCard;
