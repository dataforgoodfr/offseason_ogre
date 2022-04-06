import http from "../http-common";
import IPlayerData from "../types/player.type";

// CRUD operations for player data
class PlayerDataService
{
  getAll() {
    return http.get<Array<IPlayerData>>("/players")
  }

  get(id : number) {
    return http.get<IPlayerData>(`players/${id}`)
  }

  create(data : IPlayerData) {
    return http.put<IPlayerData>("players", data)
  }

  update(data : IPlayerData, id : number) {
    return http.post<any>(`players/${id}`, data)
  }

  delete(id : number) {
    return http.delete<any>(`players/${id}`)
  }

  deleteAll() {
    return http.delete<any>(`players`);
  }
} export default new PlayerDataService;
