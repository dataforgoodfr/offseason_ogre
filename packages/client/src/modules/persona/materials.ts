import { getDaysTo2050 } from "../../lib/time";
import { MaterialsType } from "../../utils/types";
import { productionConstants } from "../play";
import { FRANCE } from "../play/constants/country";
import { ProductionDatum } from "./production";
import { sumForNumber } from "./utils";

export { computeMaterials };

export interface MaterialsDatum {
  name: MaterialsType;
  value: number;
}

const computeMaterials = (production: ProductionDatum[]): MaterialsDatum[] => {
  const results = production
    .map((prod: ProductionDatum) => {
      const prodConstants = Object.values(productionConstants).find(
        (value) => value.name == prod.name
      );
      return [
        { type: "concrete", value: prodConstants?.concretePerUnit || 0 },
        { type: "steel", value: prodConstants?.steelPerUnit || 0 },
        { type: "cement", value: prodConstants?.cementPerUnit || 0 },
        { type: "glass", value: prodConstants?.glassPerUnit || 0 },
      ];
    })
    .flat();

  return [
    {
      name: "concrete",
      value:
        sumForNumber(results, "concrete") *
          getDaysTo2050() *
          FRANCE.population || 0,
    },
    {
      name: "steel",
      value:
        sumForNumber(results, "steel") * getDaysTo2050() * FRANCE.population ||
        0,
    },
    {
      name: "cement",
      value:
        sumForNumber(results, "cement") * getDaysTo2050() * FRANCE.population ||
        0,
    },
    {
      name: "glass",
      value:
        sumForNumber(results, "glass") * getDaysTo2050() * FRANCE.population ||
        0,
    },
  ];
};
