import { Socket as SocketLib } from "socket.io";
import { User } from "../users/types";

export { Socket };

type ListenEvents = any;
type EmitEvents = any;
type ServerSideEvents = any;
type SocketData = { user: User };

type Socket = SocketLib<ListenEvents, EmitEvents, ServerSideEvents, SocketData>;
