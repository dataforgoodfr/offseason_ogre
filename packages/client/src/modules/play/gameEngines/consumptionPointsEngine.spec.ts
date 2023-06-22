import { Action, ActionNames, PlayerActions } from "../../../utils/types";
import { PersoForm } from "../Personalization/models/form";
import { availableActions } from "../playerActions/constants/actions";
import { computeConsumptionPoints } from "./consumptionPointsEngine";

interface Test {
  name: keyof PersoForm | ActionNames;
  setup: {
    personalization?: PersoForm;
    performedPlayerAction?: PlayerActions[];
  };
  expected: {
    points: number;
  };
}

// TODO: rework `computeConsumptionPoints` to pass a custom configuration.
// Here it is a quick fix to handle the new `playContext` store structure.
const consumptionActionIdByName = Object.fromEntries(
  Object.values(availableActions).map((actionName, idx) => [
    actionName,
    idx + 1,
  ])
);
const consumptionActionById = Object.fromEntries(
  Object.values(availableActions).map((actionName, idx) => [
    idx + 1,
    { name: actionName } as unknown as Action,
  ])
);

describe("consumptionPointsEngine ", () => {
  describe("personalization", () => {
    const TESTS: Test[] = [
      {
        name: `clothingQuantity`,
        setup: {
          personalization: buildPersonalization({ clothingQuantity: false }),
        },
        expected: {
          points: 200,
        },
      },
      {
        name: `eatingDairies`,
        setup: {
          personalization: buildPersonalization({ eatingDairies: false }),
        },
        expected: {
          points: 100,
        },
      },
      {
        name: `eatingEggs`,
        setup: {
          personalization: buildPersonalization({ eatingEggs: false }),
        },
        expected: {
          points: 100,
        },
      },
      {
        name: `eatingLocal`,
        setup: {
          personalization: buildPersonalization({ eatingLocal: true }),
        },
        expected: {
          points: 200,
        },
      },
      {
        name: `eatingMeat`,
        setup: {
          personalization: buildPersonalization({ eatingMeat: false }),
        },
        expected: {
          points: 100,
        },
      },
      {
        name: `eatingVegan`,
        setup: {
          personalization: buildPersonalization({ eatingVegan: true }),
        },
        expected: {
          points: 400,
        },
      },
      {
        name: `eatingZeroWaste`,
        setup: {
          personalization: buildPersonalization({ eatingZeroWaste: true }),
        },
        expected: {
          points: 200,
        },
      },
      {
        name: `heatingTemperature`,
        setup: {
          personalization: buildPersonalization({ heatingTemperature: false }),
        },
        expected: {
          points: 200,
        },
      },
      {
        name: `heatPump`,
        setup: {
          personalization: buildPersonalization({ heatPump: true }),
        },
        expected: {
          points: 200,
        },
      },
      {
        name: `planeDistance`,
        setup: {
          personalization: buildPersonalization({ planeDistance: 0 }),
        },
        expected: {
          points: 400,
        },
      },
    ];

    runTests(
      TESTS,
      (test) => `should compute points based on personalization ${test.name}`
    );
  });

  describe("player actions", () => {
    const TESTS: Test[] = [
      {
        name: availableActions.ECO_DRIVING,
        setup: {
          performedPlayerAction: buildPlayerActions(
            availableActions.ECO_DRIVING
          ),
        },
        expected: {
          points: 200,
        },
      },
      {
        name: availableActions.HOUSE_19_DEGREES_MAX,
        setup: {
          personalization: buildPersonalization({ heatingTemperature: true }),
          performedPlayerAction: buildPlayerActions(
            availableActions.HOUSE_19_DEGREES_MAX
          ),
        },
        expected: {
          points: 200,
        },
      },
      {
        name: availableActions.HOUSE_CHANGE_WOODWORK_WINDOWS,
        setup: {
          performedPlayerAction: buildPlayerActions(
            availableActions.HOUSE_CHANGE_WOODWORK_WINDOWS
          ),
        },
        expected: {
          points: 300,
        },
      },
      {
        name: availableActions.HOUSE_EFFICIENT_HOUSEHOLD_APPLIANCES,
        setup: {
          performedPlayerAction: buildPlayerActions(
            availableActions.HOUSE_EFFICIENT_HOUSEHOLD_APPLIANCES
          ),
        },
        expected: {
          points: 100,
        },
      },
      {
        name: availableActions.HOUSE_INSTALL_EFFICIENT_ELECTRIC_WOOD_HEATING_SYSTEM,
        setup: {
          personalization: buildPersonalization({ heatPump: false }),
          performedPlayerAction: buildPlayerActions(
            availableActions.HOUSE_INSTALL_EFFICIENT_ELECTRIC_WOOD_HEATING_SYSTEM
          ),
        },
        expected: {
          points: 200,
        },
      },
      {
        name: availableActions.HOUSE_INSTALL_EFFICIENT_VENTILATION_SYSTEM,
        setup: {
          performedPlayerAction: buildPlayerActions(
            availableActions.HOUSE_INSTALL_EFFICIENT_VENTILATION_SYSTEM
          ),
        },
        expected: {
          points: 300,
        },
      },
      {
        name: availableActions.HOUSE_INSULATE_ROOF,
        setup: {
          performedPlayerAction: buildPlayerActions(
            availableActions.HOUSE_INSULATE_ROOF
          ),
        },
        expected: {
          points: 300,
        },
      },
      {
        name: availableActions.HOUSE_INSULATE_WALLS,
        setup: {
          performedPlayerAction: buildPlayerActions(
            availableActions.HOUSE_INSULATE_WALLS
          ),
        },
        expected: {
          points: 300,
        },
      },
      {
        name: availableActions.HOUSE_REDUCE_SIZE_HALF,
        setup: {
          performedPlayerAction: buildPlayerActions(
            availableActions.HOUSE_REDUCE_SIZE_HALF
          ),
        },
        expected: {
          points: 600,
        },
      },
      {
        name: availableActions.LOCAL_CONSUMPTION,
        setup: {
          personalization: buildPersonalization({ eatingLocal: false }),
          performedPlayerAction: buildPlayerActions(
            availableActions.LOCAL_CONSUMPTION
          ),
        },
        expected: {
          points: 200,
        },
      },
      {
        name: availableActions.REDUCE_CAR_20,
        setup: {
          performedPlayerAction: buildPlayerActions(
            availableActions.REDUCE_CAR_20
          ),
        },
        expected: {
          points: 300,
        },
      },
      {
        name: availableActions.REDUCE_CLOTHING_HALF,
        setup: {
          personalization: buildPersonalization({ clothingQuantity: true }),
          performedPlayerAction: buildPlayerActions(
            availableActions.REDUCE_CLOTHING_HALF
          ),
        },
        expected: {
          points: 200,
        },
      },
      {
        name: availableActions.REDUCE_NUMERIC,
        setup: {
          performedPlayerAction: buildPlayerActions(
            availableActions.REDUCE_NUMERIC
          ),
        },
        expected: {
          points: 200,
        },
      },
      {
        name: availableActions.REDUCE_PLANE_HALF,
        setup: {
          personalization: buildPersonalization({ planeDistance: 1000 }),
          performedPlayerAction: buildPlayerActions(
            availableActions.REDUCE_PLANE_HALF
          ),
        },
        expected: {
          points: 200,
        },
      },
      {
        name: availableActions.STOP_EGGS,
        setup: {
          personalization: buildPersonalization({ eatingEggs: true }),
          performedPlayerAction: buildPlayerActions(availableActions.STOP_EGGS),
        },
        expected: {
          points: 100,
        },
      },
      {
        name: availableActions.STOP_MEAT,
        setup: {
          personalization: buildPersonalization({ eatingMeat: true }),
          performedPlayerAction: buildPlayerActions(availableActions.STOP_MEAT),
        },
        expected: {
          points: 200,
        },
      },
      {
        name: availableActions.STOP_MILK,
        setup: {
          personalization: buildPersonalization({ eatingDairies: true }),
          performedPlayerAction: buildPlayerActions(availableActions.STOP_MILK),
        },
        expected: {
          points: 100,
        },
      },
      {
        name: availableActions.TRANSPORT_STOP_PLANE,
        setup: {
          performedPlayerAction: buildPlayerActions(
            availableActions.TRANSPORT_STOP_PLANE
          ),
        },
        expected: {
          points: 200,
        },
      },
      {
        name: availableActions.ZERO_WASTE,
        setup: {
          personalization: buildPersonalization({ eatingZeroWaste: false }),
          performedPlayerAction: buildPlayerActions(
            availableActions.ZERO_WASTE
          ),
        },
        expected: {
          points: 200,
        },
      },
    ];

    runTests(
      TESTS,
      (test) => `should compute points based on player action ${test.name}`
    );
  });
});

const runTests = (
  tests: Test[],
  testNameFormatter = (test: Test): string => test.name
) => {
  const STEP = Infinity;

  tests.forEach((test: Test) => {
    it(testNameFormatter(test), () => {
      const consumptionPoints = computeConsumptionPoints(
        test.setup.personalization || buildPersonalization(),
        test.setup.performedPlayerAction || buildPlayerActions(),
        consumptionActionById,
        STEP
      );

      expect(consumptionPoints).toEqual(test.expected.points);
    });
  });
};

function buildPersonalization(
  personalization: Partial<PersoForm> = {}
): PersoForm {
  return {
    clothingQuantity: true,
    eatingDairies: true,
    eatingEggs: true,
    eatingLocal: false,
    eatingMeat: true,
    eatingVegan: false,
    eatingZeroWaste: false,
    heatingTemperature: true,
    heatPump: false,
    planeDistance: 100,
    ...personalization,
  } as PersoForm;
}

function buildPlayerActions(
  ...performedActionNames: ActionNames[]
): PlayerActions[] {
  return performedActionNames.map(
    (actionName) =>
      ({
        actionId: consumptionActionIdByName[actionName],
        isPerformed: true,
      } as PlayerActions)
  );
}
