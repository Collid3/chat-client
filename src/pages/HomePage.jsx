import React, { useContext } from "react";
import ChatContext from "../context/ChatContext";
import Sidebar from "../components/Home/Sidebar";
import NoChatSelected from "../components/Home/NoChatSelected";
import ChatContainer from "../components/Home/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
