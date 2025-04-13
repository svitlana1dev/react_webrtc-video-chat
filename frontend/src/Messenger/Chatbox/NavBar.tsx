import { useDispatch } from "react-redux";
import closeIcon from "../../resources/images/close-icon.svg";
import { removeChatbox } from "../messengerSlice";

const ChatboxLabel = ({ username }: { username: string }) => {
  return <p className="chatbox_nav_bar_label">{username}</p>;
};

const CloseButton = ({ socketId }: { socketId: string }) => {
  const dispatch = useDispatch();

  const handleCloseChatbox = () => {
    dispatch(removeChatbox(socketId));
  };

  return (
    <div className="chatbox_close_icon_container">
      <img
        src={closeIcon}
        alt="close"
        className="chatbox_close_icon_img"
        onClick={handleCloseChatbox}
      />
    </div>
  );
};

export const NavBar = ({
  username,
  socketId,
}: {
  username: string;
  socketId: string;
}) => {
  return (
    <div className="chatbox_nav_bar_container">
      <ChatboxLabel username={username} />
      <CloseButton socketId={socketId} />
    </div>
  );
};
