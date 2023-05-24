import {
  MaterialsType,
  MetalsType,
  ProductionTypes,
  TeamAction,
} from "../../../utils/types";
import { materials, metals, productionConstants } from "..";
import { ProductionDatum } from "../../persona/production";
import { sumFor } from "../../persona/utils";
import { filterOutDuplicates } from "../../common/utils";

export { computeMaterials, computeMetals };

export interface PhysicalResourceNeedDatum {
  name: MaterialsType | MetalsType;
  type: ProductionTypes;
  value: number;
}

const sumTo2050 = (
  results: {
    type: string;
    value: number;
  }[],
  resource: MaterialsType | MetalsType
) => {
  return sumFor(results, resource);
};

const computePhysicalResources = (
  production: ProductionDatum[],
  performedTeamActions: TeamAction[],
  resourcesTypes: MaterialsType[] | MetalsType[],
  type: "materials" | "metals"
): PhysicalResourceNeedDatum[] => {
  const results = production
    .map((prod: ProductionDatum) => {
      const prodConstants = Object.values(productionConstants).find(
        (prodConfig) => prodConfig.name === prod.name
      );
      const powerNeed =
        performedTeamActions.find(
          (teamAction: TeamAction) => teamAction.action.name === prod.name
        )?.action.powerNeededKWh || 0;
      return resourcesTypes.map((resourceType: MaterialsType | MetalsType) => ({
        type: resourceType,
        prodType: prodConstants?.type || "",
        value:
          ((prodConstants &&
            prodConstants[type][resourceType as MaterialsType & MetalsType]) ||
            0) *
          prod.value *
          powerNeed,
      }));
    })
    .flat();

  const productionTypes = results
    .filter((result) => result.value !== 0)
    .map((result) => result.prodType)
    .filter(filterOutDuplicates) as ProductionTypes[];

  return productionTypes.flatMap((prodType) => {
    const filteredResults = results.filter(
      (resource) => resource.prodType === prodType
    );
    return resourcesTypes.map((resource: MaterialsType | MetalsType) => ({
      name: resource,
      value: sumTo2050(filteredResults, resource),
      type: prodType,
    }));
  });
};

const computeMaterials = (
  production: ProductionDatum[],
  performedTeamActions: TeamAction[]
): PhysicalResourceNeedDatum[] => {
  return computePhysicalResources(
    production,
    performedTeamActions,
    Object.values(materials),
    "materials"
  );
};

const computeMetals = (
  production: ProductionDatum[],
  performedTeamActions: TeamAction[]
): PhysicalResourceNeedDatum[] => {
  return computePhysicalResources(
    production,
    performedTeamActions,
    Object.values(metals),
    "metals"
  );
};
