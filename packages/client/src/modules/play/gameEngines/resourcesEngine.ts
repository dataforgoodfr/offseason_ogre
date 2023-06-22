import {
  MaterialsType,
  MetalsType,
  ProductionAction,
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

const computeMaterials = (
  production: ProductionDatum[],
  performedTeamActions: TeamAction[],
  productionActionById: Record<number, ProductionAction>
): PhysicalResourceNeedDatum[] => {
  return computePhysicalResources(
    production,
    performedTeamActions,
    productionActionById,
    Object.values(materials),
    "materials"
  );
};

const computeMetals = (
  production: ProductionDatum[],
  performedTeamActions: TeamAction[],
  productionActionById: Record<number, ProductionAction>
): PhysicalResourceNeedDatum[] => {
  return computePhysicalResources(
    production,
    performedTeamActions,
    productionActionById,
    Object.values(metals),
    "metals"
  );
};

const computePhysicalResources = (
  production: ProductionDatum[],
  performedTeamActions: TeamAction[],
  productionActionById: Record<number, ProductionAction>,
  resourcesTypes: MaterialsType[] | MetalsType[],
  type: "materials" | "metals"
): PhysicalResourceNeedDatum[] => {
  const results = production
    .map((prod: ProductionDatum) => {
      const prodConstants = Object.values(productionConstants).find(
        (prodConfig) => prodConfig.name === prod.name
      );
      const teamAction = performedTeamActions.find(
        (teamAction: TeamAction) =>
          productionActionById[teamAction.actionId]?.name === prod.name
      );
      const productionAction =
        productionActionById[teamAction?.actionId || -1] || {};
      const powerNeed = productionAction.powerNeededKWh || 0;
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
      value: sumFor(filteredResults, resource),
      type: prodType,
    }));
  });
};
