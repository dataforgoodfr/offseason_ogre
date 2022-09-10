import { Server, Socket as SocketLib } from "socket.io";
import { User } from "../users/types";

export { Server, Socket };

type ListenEvents = any;
type EmitEvents = any;
type ServerSideEvents = any;
type SocketData = { user: User };

type Socket = SocketLib<ListenEvents, EmitEvents, ServerSideEvents, SocketData>;
