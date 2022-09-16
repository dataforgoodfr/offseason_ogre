import { Server, Socket as SocketLib } from "socket.io";
import { User } from "../users/types";

export { Server, Socket, SocketData };

// TODO: type the socket
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ListenEvents = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EmitEvents = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ServerSideEvents = any;
type SocketData = {
  gameId: number;
  user: User;
};

type Socket = SocketLib<ListenEvents, EmitEvents, ServerSideEvents, SocketData>;
