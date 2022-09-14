/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import chunk from "lodash/chunk";
import { safe } from "../lib/fp";
import { Seed } from "./types";

export { performSeed };

async function performSeed<T>(seed: Seed<T>) {
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
