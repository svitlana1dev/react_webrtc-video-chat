import { useSelector } from "react-redux";

import Chatbox from "./Chatbox/Chatbox";

import "./Messenger.css";

export const Messenger = () => {
  const chatboxes = useSelector((state) => state.messenger.chatboxes);

  return (
    <div className="messenger_container">
      {chatboxes.map((chatbox: any) => (
        <Chatbox
          key={chatbox.socketId}
          socketId={chatbox.socketId}
          username={chatbox.username}
        />
      ))}
    </div>
  );
};
