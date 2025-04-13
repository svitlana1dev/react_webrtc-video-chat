import * as socketConn from "../../socketConnection/socketConnection";

export const proceedWithLogin = (data: any) => {
  socketConn.login(data);
};
