import { useDispatch } from "react-redux";
import { addChatbox } from "../../Messenger/messengerSlice";
import chatIcon from "../../resources/images/chat-icon.svg";

export const ChatButton = ({
  socketId,
  username,
}: {
  socketId: string;
  username: string;
}) => {
  const dispatch = useDispatch();

  const handleAddChatbox = () => {
    dispatch(
      addChatbox({
        username,
        socketId,
      })
    );
  };

  return (
    <img
      src={chatIcon}
      className="map_page_card_img"
      onClick={handleAddChatbox}
    ></img>
  );
};
