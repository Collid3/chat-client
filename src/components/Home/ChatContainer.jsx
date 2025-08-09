import React, { useContext, useEffect } from "react";
import ChatContext from "../../context/ChatContext";
import MessageSkeleton from "./Skeletons/MessageSkeleton";
import ChatHeader from "./chat/ChatHeader";
import Messages from "./chat/Messages";
import MessageInput from "./chat/MessageInput";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    loadingMessages,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useContext(ChatContext);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  if (!loadingMessages)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <Messages messages={messages} selectedUser={selectedUser} />
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
