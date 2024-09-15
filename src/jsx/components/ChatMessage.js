import React from "react";
import dayjs from "dayjs";
import { styled } from "@mui/material";
import { useAuthContext } from "../../services/useAuthContext";

const MessageHeader = styled("div")`
  display: flex;
  justify-content: space-between;

  .sender {
    display: block;
    margin-bottom: 4px;
  }
`;

const MessageContainer = styled("div")`
  padding: 15px 20px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border-radius: 8px;

  .text {
    flex: 1;
  }

  .timestamp {
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 10px;
  }

  .square-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const ChatMessage = (data) => {
  const { USER } = useAuthContext();

  const isMyMessage = data?.myParticipationId === data?.participant_id;
  const formatMessage = (msg) => {
    const words = msg.split(' ');
    let formattedMessage = [];
    
    for (let i = 0; i < words.length; i += 8) {
      formattedMessage.push(words.slice(i, i + 8).join(' '));
    }
    
    return formattedMessage.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isMyMessage ? "flex-end" : "flex-start",
        marginBottom: "10px",
      }}
    >
      <MessageContainer
        style={{
          backgroundColor: isMyMessage ? "#007bff" : "#f1f0f0",
          color: isMyMessage ? "white" : "black",
          padding: "10px",
          borderRadius: "15px",
          maxWidth: "60%",
          wordWrap: "break-word",
          textAlign: "left",
          position: "relative",
        }}
      >
        <div className="text" style={{ whiteSpace: 'pre-wrap', marginBottom:"10px"}}>
          {formatMessage(data?.message)}
        </div>
        <span
          style={{
            fontSize: "10px",
            color: isMyMessage ? "#ffffff99" : "#00000099",
            position: "absolute",
            bottom: "5px",
            right: "10px",
          }}
        >
          {dayjs(data.timestamp).format("HH:mm")}
        </span>
      </MessageContainer>
    </div>
  );
};

export default ChatMessage;
