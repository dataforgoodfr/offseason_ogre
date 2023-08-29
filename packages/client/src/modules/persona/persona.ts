import { PersoForm } from "../play/Personalization/models/form";
import { fillPersonalization } from "./utils";
import {
  computeCarbonProductionElectricMix,
  computeCarbonFootprint,
} from "../play/utils/carbonFootprint";
import { ConsumptionDatum, getConsumptionFromProfile } from "./consumption";
import { ProductionDatum } from "./production";
import { computeIntermediateValues } from "./consumption/computing";
import {
  computeMaterials,
  computeMetals,
  PhysicalResourceNeedDatum,
} from "../play/gameEngines/resourcesEngine";
import { ProductionAction, TeamAction } from "../../utils/types";
import { computeEnergyProduction } from "../play/utils/production";

export { buildInitialPersona };
export type { Persona };

interface Persona {
  budget: number;
  carbonFootprint: number;
  actionPoints: number;
  points: number;
  consumption: readonly ConsumptionDatum[];
  production: ProductionDatum[];
  productionDisplayed: ProductionDatum[];
  materials: PhysicalResourceNeedDatum[];
  materialsDisplayed: PhysicalResourceNeedDatum[];
  metals: PhysicalResourceNeedDatum[];
  metalsDisplayed: PhysicalResourceNeedDatum[];
}

const buildInitialPersona = (
  personalization: PersoForm,
  teamActions: TeamAction[],
  productionActionById: Record<number, ProductionAction>
): Persona => {
  const formattedPersonalization = fillPersonalization(personalization);
  const intermediateValues = computeIntermediateValues(
    formattedPersonalization
  );
  const consumption = getConsumptionFromProfile(
    formattedPersonalization,
    intermediateValues
  );

  const production: ProductionDatum[] = Object.values(productionActionById).map(
    (productionAction) => {
      return {
        name: productionAction.name,
        type: productionAction.type,
        carbonType: productionAction.carbonType,
        revealOnStep: productionAction.revealOnStep,
        value: computeEnergyProduction(
          productionAction,
          productionAction.defaultTeamValue
        ),
      };
    }
  );

  const productionDisplayed = production.filter((p) => !p.revealOnStep);

  const carbonProductionElectricMix =
    computeCarbonProductionElectricMix(production);
  const carbonFootprint = computeCarbonFootprint(
    carbonProductionElectricMix,
    consumption as ConsumptionDatum[]
  );

  const materials = computeMaterials(
    production,
    teamActions,
    productionActionById
  );
  const materialsDisplayed = computeMaterials(
    productionDisplayed,
    teamActions,
    productionActionById
  );
  const metals = computeMetals(production, teamActions, productionActionById);
  const metalsDisplayed = computeMetals(
    productionDisplayed,
    teamActions,
    productionActionById
  );

  const persona: Persona = {
    budget: 13.7,
    actionPoints: 0,
    points: 0,
    carbonFootprint,
    consumption,
    production,
    productionDisplayed,
    materials,
    materialsDisplayed,
    metals,
    metalsDisplayed,
  };

  return persona;
};
