import { getDaysTo2050 } from "../../../lib/time";
import { MaterialsType, ProductionTypes } from "../../../utils/types";
import { productionConstants } from "..";
import { FRANCE } from "../constants/country";
import { ProductionDatum } from "../../persona/production";
import { sumFor } from "../../persona/utils";

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
  return (
    (sumFor(results, material) * getDaysTo2050() * (FRANCE.population || 0)) /
    1000
  );
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
          prodType: prodConstants?.type || "",
          value: (prodConstants?.concretePerUnit || 0) * prod.value,
        },
        {
          type: "steel",
          prodType: prodConstants?.type || "",
          value: (prodConstants?.steelPerUnit || 0) * prod.value,
        },
        {
          type: "cement",
          prodType: prodConstants?.type || "",
          value: (prodConstants?.cementPerUnit || 0) * prod.value,
        },
        {
          type: "glass",
          prodType: prodConstants?.type || "",
          value: (prodConstants?.glassPerUnit || 0) * prod.value,
        },
      ];
    })
    .flat();

  const productionTypes = results
    .filter((result) => result.value !== 0)
    .map((result) => result.prodType)
    .filter(
      (value, index, array) => array.indexOf(value) === index
    ) as ProductionTypes[];

  return productionTypes.flatMap((prodType) => {
    const filteredResults = results.filter(
      (material) => material.prodType === prodType
    );
    return [
      {
        name: "concrete",
        value: sumTo2050(filteredResults, "concrete"),
        type: prodType,
      },
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
