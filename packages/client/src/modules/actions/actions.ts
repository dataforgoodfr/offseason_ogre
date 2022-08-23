import { availableActions } from "../play/playerActions/constants/actions";

export { actionHelpCards };
export type { ActionWithHelpCard };

interface ActionWithHelpCard {
  name: string;
  helpCardLink: string;
}

const actionHelpCards: ActionWithHelpCard[] = [
  {
    name: availableActions.REDUCE_PLANE_HALF,
    helpCardLink:
      "https://drive.google.com/file/d/1o8og6uawrINEJKj55vndLjxSnHBTO731/view?usp=sharing",
  },
  {
    name: availableActions.LOCAL_CONSUMPTION,
    helpCardLink:
      "https://drive.google.com/file/d/1314uo7ir07rpqAsz7fCfyTCXmjip69Jn/view?usp=sharing",
  },
  {
    name: availableActions.REDUCE_CLOTHING_HALF,
    helpCardLink:
      "https://drive.google.com/file/d/1c00purj7qEyHKZcGNdqOxDqXM_Koxhbq/view?usp=sharing",
  },
  {
    name: availableActions.REDUCE_NUMERIC,
    helpCardLink:
      "https://drive.google.com/file/d/1_CEiKPAlSqnRrwHCM_J19O-ucwg6hluV/view?usp=sharing",
  },
  {
    name: availableActions.STOP_MILK,
    helpCardLink:
      "https://drive.google.com/file/d/1Ivyl3ZtLYPJL6qlEgRqFPj3gbq5aL4m7/view?usp=sharing",
  },
  {
    name: availableActions.STOP_EGGS,
    helpCardLink:
      "https://drive.google.com/file/d/1YZ31Sc048Gz4YPl9WZ3BTh81LFSR1nkP/view?usp=sharing",
  },
  {
    name: availableActions.STOP_CANS,
    helpCardLink:
      "https://drive.google.com/file/d/1FTlgA5K4Oj529DaC9WEMhcjea6vxIB4d/view?usp=sharing",
  },
  {
    name: availableActions.STOP_MEAT,
    helpCardLink:
      "https://drive.google.com/file/d/10vFPVtlJaQByCi1LJNLiZUoKQwAnpGfM/view?usp=sharing",
  },
  {
    name: availableActions.ZERO_WASTE,
    helpCardLink:
      "https://drive.google.com/file/d/1Ll9VaqNQpYss9hbjzVwQHNPel-3w1HsL/view?usp=sharing",
  },
  {
    name: availableActions.REDUCE_TRAIN_HALF,
    helpCardLink:
      "https://drive.google.com/file/d/1qIn1WGJ3vmx0f1X26Q6tRbmdrrUYqo4r/view?usp=sharing",
  },
  {
    name: availableActions.ECO_DRIVING,
    helpCardLink:
      "https://drive.google.com/file/d/1dU53aruZq6HOL1HobmJPokV51aeejw5G/view",
  },
  {
    name: availableActions.REDUCE_CAR_20,
    helpCardLink:
      "https://drive.google.com/file/d/1hLnapQjnsYWg8sKRufi1fi4izn_UFXEI/view",
  },
  {
    name: availableActions.ELECTRIC_CAR,
    helpCardLink:
      "https://drive.google.com/file/d/1g4PS6TGYgDnsVlZwgCu38u6FUbTZle1l/view",
  },
  {
    name: availableActions.KEEP_CAR_15,
    helpCardLink:
      "https://drive.google.com/file/d/1RKoo_seg5pyQf0YDLIYLGtNOnu_eEHI0/view?usp=sharing",
  },
];
