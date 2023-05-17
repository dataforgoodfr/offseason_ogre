import {
  MaterialsType,
  ProductionTypes,
  TeamAction,
} from "../../../utils/types";
import { productionConstants } from "..";
import { ProductionDatum } from "../../persona/production";
import { sumFor } from "../../persona/utils";
import { filterOutDuplicates } from "../../common/utils";

export { computeMaterials };

export interface MaterialsDatum {
  name: MaterialsType;
  type: ProductionTypes;
  value: number;
}

const sumTo2050 = (
  results: {
    type: string;
    value: number;
  }[],
  material: MaterialsType
) => {
  return sumFor(results, material);
};

const computeMaterials = (
  production: ProductionDatum[],
  performedTeamActions: TeamAction[]
): MaterialsDatum[] => {
  const results = production
    .map((prod: ProductionDatum) => {
      const prodConstants = Object.values(productionConstants).find(
        (prodConfig) => prodConfig.name === prod.name
      );
      const powerNeed =
        performedTeamActions.find(
          (teamAction: TeamAction) => teamAction.action.name === prod.name
        )?.action.powerNeededKWh || 0;
      return [
        {
          type: "steel",
          prodType: prodConstants?.type || "",
          value: (prodConstants?.steelPerUnit || 0) * prod.value * powerNeed,
        },
        {
          type: "cement",
          prodType: prodConstants?.type || "",
          value: (prodConstants?.cementPerUnit || 0) * prod.value * powerNeed,
        },
        {
          type: "glass",
          prodType: prodConstants?.type || "",
          value: (prodConstants?.glassPerUnit || 0) * prod.value * powerNeed,
        },
      ];
    })
    .flat();

  const productionTypes = results
    .filter((result) => result.value !== 0)
    .map((result) => result.prodType)
    .filter(filterOutDuplicates) as ProductionTypes[];

  return productionTypes.flatMap((prodType) => {
    const filteredResults = results.filter(
      (material) => material.prodType === prodType
    );
    return [
      {
        name: "steel",
        value: sumTo2050(filteredResults, "steel"),
        type: prodType,
      },
      {
        name: "cement",
        value: sumTo2050(filteredResults, "cement"),
        type: prodType,
      },
      {
        name: "glass",
        value: sumTo2050(filteredResults, "glass"),
        type: prodType,
      },
    ];
  });
};
