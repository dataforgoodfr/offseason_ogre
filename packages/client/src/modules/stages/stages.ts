export { stages };
export type { StageType, Action, Stage };

type StageType = "consumption" | "production";

interface Action {
  name: string;
  actionPointCost: number;
  financialCost: number;
  category: string;
}

interface Stage {
  title: string;
  step: number;
  available_points: number;
  StageType: StageType;
}

const stages = [...getStageInformation()] as Stage[];

function getStageInformation(): Stage[] {
  const stages: Stage[] = [
    {
      step: 1,
      title: "Choix de consommation 1",
      available_points: 12,
      StageType: "consumption",
    },
    {
      step: 2,
      title: "Choix de production 1",
      available_points: 12,
      StageType: "production",
    },
    {
      step: 3,
      title: "Choix de consommation 2",
      available_points: 12,
      StageType: "consumption",
    },
    {
      step: 4,
      title: "Choix de production 2",
      available_points: 12,
      StageType: "production",
    },
  ];
  return stages;
}
