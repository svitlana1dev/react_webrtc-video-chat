import { NavBar } from "./NavBar";
import { Messages } from "./Messages";
import { NewMessage } from "./NewMessage";

export const Chatbox = (props: any) => {
  const { socketId } = props;

  return (
    <div className="chatbox_container">
      <NavBar {...props} />
      <Messages socketId={socketId} />
      <NewMessage socketId={socketId} />
    </div>
  );
};
