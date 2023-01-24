/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import chunk from "lodash/chunk";
import { safe } from "../lib/fp";
import { Seed, Seeder } from "./types";

export { performSeed };

async function performSeed<T>(seeder: Seeder<T>) {
  const seed: Seed<T> = await getSeed(seeder);

  for (const batch of chunk(seed.data)) {
    await Promise.all(
      batch.map((datum) =>
        safe(async () => {
          await seed.seeder(datum);
        })
      )
    );
  }
}

async function getSeed<T>(seeder: Seeder<T>) {
  if (typeof seeder === "function") {
    return seeder();
  }
  return seeder;
}
