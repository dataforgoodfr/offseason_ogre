import { getDaysTo2050 } from "../../../lib/time";
import { MaterialsType } from "../../../utils/types";
import { productionConstants } from "..";
import { FRANCE } from "../constants/country";
import { ProductionDatum } from "../../persona/production";
import { sumFor } from "../../persona/utils";

export { computeMaterials };

export interface MaterialsDatum {
  name: MaterialsType;
  value: number;
}

const sumTo2050 = (
  results: {
    type: string;
    value: number;
  }[],
  material: MaterialsType
) => {
  return sumFor(results, material) * getDaysTo2050() * FRANCE.population || 0;
};

const computeMaterials = (production: ProductionDatum[]): MaterialsDatum[] => {
  const results = production
    .map((prod: ProductionDatum) => {
      const prodConstants = Object.values(productionConstants).find(
        (prodConfig) => prodConfig.name === prod.name
      );
      return [
        {
          type: "concrete",
          value: (prodConstants?.concretePerUnit || 0) * prod.value,
        },
        {
          type: "steel",
          value: (prodConstants?.steelPerUnit || 0) * prod.value,
        },
        {
          type: "cement",
          value: (prodConstants?.cementPerUnit || 0) * prod.value,
        },
        {
          type: "glass",
          value: (prodConstants?.glassPerUnit || 0) * prod.value,
        },
      ];
    })
    .flat();

  return [
    {
      name: "concrete",
      value: sumTo2050(results, "concrete"),
    },
    {
      name: "steel",
      value: sumTo2050(results, "steel"),
    },
    {
      name: "cement",
      value: sumTo2050(results, "cement"),
    },
    {
      name: "glass",
      value: sumTo2050(results, "glass"),
    },
  ];
};
