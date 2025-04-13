import { v4 as uuid } from "uuid";
import { addChatbox, addChatMessage } from "../../Messenger/messengerSlice";
import { store } from "../store";
import * as socketConn from "../../socketConnection/socketConnection";

export const sendChatMessage = (receiverSocketId: string, content: any) => {
  const message = {
    content,
    receiverSocketId,
    id: uuid(),
  };

  socketConn.sendChatMessage(message);

  store.dispatch(
    addChatMessage({
      socketId: receiverSocketId,
      content: content,
      myMessage: true,
      id: message.id,
    })
  );
};

export const chatMessageHandler = (messageData: any) => {
  store.dispatch(
    addChatMessage({
      socketId: messageData.senderSocketId,
      content: messageData.content,
      myMessage: false,
      id: messageData.id,
    })
  );

  openChatboxIfClosed(messageData.senderSocketId);
};

const openChatboxIfClosed = (socketId: string) => {
  const chatbox = store
    .getState()
    .messenger.chatboxes.find((c: any) => c.socketId === socketId);

  const username = store
    .getState()
    .map.onlineUsers.find((user: any) => user.socketId === socketId)?.username;

  if (!chatbox) {
    store.dispatch(addChatbox({ socketId, username }));
  }
};
