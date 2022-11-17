import { database } from "../../../database";

export { update, create };

async function update(profileId: number, profile: any) {
  return database.personalization.update({
    where: { id: profileId },
    data: profile,
  });
}

async function create(profile: any) {
  return database.personalization.create({
    data: profile,
  });
}
