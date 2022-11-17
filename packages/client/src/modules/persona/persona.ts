import { ConsumptionDatum, getConsumptionFromProfile } from "./consumption";
import { production, ProductionDatum } from "./production";

export { buildInitialPersona };
export type { Persona };

interface Persona {
  budget: number;
  carbonFootprint: number;
  actionPoints: number;
  points: number;
  consumption: readonly ConsumptionDatum[];
  production: ProductionDatum[];
}

const buildInitialPersona: (profile: any) => Persona = (profile: any) => {
  const consumption = getConsumptionFromProfile(profile);

  const persona: Persona = {
    budget: 13.7,
    carbonFootprint: 32.73,
    actionPoints: 0,
    points: 0,
    consumption,
    production,
  };

  return persona;
};
