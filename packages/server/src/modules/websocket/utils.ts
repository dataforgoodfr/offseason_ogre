import { z } from "zod";
import { Socket, SocketData } from "./types";

export { getSocketData };

function getSocketData(socket: Socket): SocketData {
  const userSchema = z.object({
    id: z.number(),
    country: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    isTeacher: z.boolean(),
  });
  return z.object({ gameId: z.number(), user: userSchema }).parse(socket.data);
}
