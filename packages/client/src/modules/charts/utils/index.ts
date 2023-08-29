import sumBy from "lodash/sumBy";
import { StackedBarsBar, StackedBarsStackData } from "../StackedBars";

export { buildStack };

function buildStack({
  bars,
  label,
}: {
  bars: StackedBarsBar[];
  label: string;
}): StackedBarsStackData {
  return {
    label,
    total: sumBy(bars, "total"),
    bars,
  };
}
