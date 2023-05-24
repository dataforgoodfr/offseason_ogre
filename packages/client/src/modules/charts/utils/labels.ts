import { t } from "i18next";
import { MaterialsType, MetalsType } from "../../../utils/types";

export const buildLabel = (
  type: "materials" | "metals",
  name: MaterialsType | MetalsType
) => {
  if (type === "materials") {
    return t(`graph.${type}.${name as MaterialsType}`);
  }
  return t(`graph.${type}.${name as MetalsType}`);
};
