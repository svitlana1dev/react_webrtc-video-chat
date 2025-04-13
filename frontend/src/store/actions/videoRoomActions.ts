import { v4 as uuid } from "uuid";
import { store } from "../store";
import {
  setInRoom,
  setRooms,
} from "../../realtimeCommunication/videoRoomsSlice";
import * as socketConn from "../../socketConnection/socketConnection";
import {
  getAccessToLocalStream,
  getPeerId,
  disconnect,
} from "../../realtimeCommunication/webRTCHandler";

export const createVideoRoom = async () => {
  const success = await getAccessToLocalStream();

  if (success) {
    const newRoomId = uuid();

    store.dispatch(setInRoom(newRoomId));

    socketConn.createVideoRoom({
      peerId: getPeerId(),
      newRoomId,
    });
  }
};

export const joinVideoRoom = async (roomId: string) => {
  const success = await getAccessToLocalStream();

  if (success) {
    store.dispatch(setInRoom(roomId));

    socketConn.joinVideoRoom({
      roomId,
      peerId: getPeerId(),
    });
  }
};

export const videoRoomsListHandler = (videoRooms: any) => {
  store.dispatch(setRooms(videoRooms));
};

export const leaveVideoRoom = (roomId: string) => {
  disconnect();
  socketConn.leaveVideoRoom({
    roomId,
  });

  store.dispatch(setInRoom(false));
};
