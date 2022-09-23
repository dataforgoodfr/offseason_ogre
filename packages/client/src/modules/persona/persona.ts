import { consumption, ConsumptionDatum } from "./consumption";
import { production, ProductionDatum } from "./production";

export { persona };
export type { Persona };

interface Persona {
  budget: number;
  carbonFootprint: number;
  actionPoints: number;
  points: number;
  consumption: readonly ConsumptionDatum[];
  production: ProductionDatum[];
}

const persona: Persona = {
  budget: 13.7,
  carbonFootprint: 32.73,
  actionPoints: 0,
  points: 0,
  consumption,
  production,
};
