import React, { useContext, useEffect, useRef } from "react";
import AuthContext from "../../../context/AuthContext";

const Messages = ({ messages, selectedUser }) => {
  const { me } = useContext(AuthContext);
  const messageEndRef = useRef();

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message._id}
          className={`chat ${
            message.senderId === me._id ? "chat-end" : "chat-start"
          }`}
          ref={messageEndRef}
        >
          <div className=" chat-image avatar">
            <div className="size-10 rounded-full border">
              <img
                src={
                  message.senderId === me._id
                    ? me.profilePicture || "/avatar.png"
                    : selectedUser.profilePicture || "/avatar.png"
                }
                alt="profile pic"
              />
            </div>
          </div>
          <div className="chat-header mb-1">
            <time className="text-xs opacity-50 ml-1">
              {formatMessageTime(message.createdAt)}
            </time>
          </div>
          <div className="chat-bubble flex flex-col">
            {message.image && (
              <img
                src={message.image}
                alt="Attachment"
                className="sm:max-w-[200px] rounded-md mb-2"
              />
            )}
            {message.text && <p>{message.text}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
