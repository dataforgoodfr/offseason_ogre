export { stages };
export type { phase, Action, Stage };

type phase = "consumption" | "production";

interface Action {
  name: string;
  points: number;
  cost: number;
  category: string;
}

interface Stage {
  title: string;
  step: number;
  available_points: number;
  // actions: Action[],
  phase: phase;
}

const stages = [...getStageInformation()] as Stage[];

function getStageInformation(): Stage[] {
  const stages: Stage[] = [
    {
      step: 1,
      title: "Choix de consommation 1",
      available_points: 12,
      phase: "consumption",
    },
    {
      step: 2,
      title: "Choix de production 1",
      available_points: 12,
      phase: "production",
    },
    {
      step: 3,
      title: "Choix de consommation 2",
      available_points: 12,
      phase: "consumption",
    },
    {
      step: 4,
      title: "Choix de production 2",
      available_points: 12,
      phase: "production",
    },
  ];
  return stages;
}
