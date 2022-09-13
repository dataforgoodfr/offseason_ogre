/* eslint-disable no-param-reassign */
import { Socket, SocketData } from "./types";

export { getSocketData };

function getSocketData(socket: Socket) {
  const keys: (keyof SocketData)[] = ["gameId", "user"];

  return keys.reduce(
    (data: SocketData, key: keyof SocketData) => {
      if (socket.data[key] == null) {
        throw new Error(`Socket data missing: ${key}`);
      }
      data[key] = socket.data[key] as any;
      return data;
    },

    {} as SocketData
  );
}
