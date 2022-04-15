export default interface IPlayerData {
  // should match backend db models
  id?: number | null; // à vérifier si ça rentre bien en base malgré les flottants
  adultsPerHousehold: number;
  childrenPerHousehold: number;
}
