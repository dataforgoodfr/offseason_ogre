import { database } from "../../../database";

export { update };

async function update(profile: any) {
  return database.personalization.upsert({
    where: { id: profile.id },
    update: profile,
    create: profile,
  });
}
