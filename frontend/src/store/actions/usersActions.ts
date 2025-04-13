import { store } from "../store";
import { setOnlineUsers, removeDisconnectedUser } from "../../MapPage/mapSlice";

export const onlineUsersHandler = (socketId: string, usersData: any) => {
  store.dispatch(
    setOnlineUsers(
      usersData.map((user: any) => {
        if (user.socketId === socketId) {
          user.myself = true;
        }
        return user;
      })
    )
  );
};

export const userDisconnectedHandler = (socketId: string) => {
  store.dispatch(removeDisconnectedUser(socketId));
};
