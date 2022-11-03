import { ActionNames } from "../../../utils/types";
import { ConsumptionDatum } from "../../persona/consumption";
import { Persona } from "../../persona/persona";
import { availableActions } from "../playerActions/constants/actions";
import { computeNewConsumptionData } from "./consumption";

interface Test {
  name: string;
  setup: {
    consumption: Pick<ConsumptionDatum, "type" | "name" | "value">[];
    performedActions: ActionNames[];
  };
  expected: {
    consumptionData: Pick<ConsumptionDatum, "type" | "name" | "value">[];
  };
}

const runTests = (tests: Test[]) => {
  tests.forEach((test) => {
    it(test.name, () => {
      const consumption: ConsumptionDatum[] = test.setup
        .consumption as ConsumptionDatum[];
      const performedActions: ActionNames[] = test.setup.performedActions;

      const newData = computeNewConsumptionData(
        { consumption } as unknown as Persona,
        performedActions
      );

      expect(newData).toEqual(test.expected.consumptionData);
    });
  });
};

describe("consumtion", () => {
  describe("single action", () => {
    const TESTS: Test[] = [
      {
        name: `should ${availableActions.REDUCE_PLANE_HALF}`,
        setup: {
          consumption: [{ type: "fossil", name: "plane", value: 10 }],
          performedActions: [availableActions.REDUCE_PLANE_HALF],
        },
        expected: {
          consumptionData: [{ type: "fossil", name: "plane", value: 5 }],
        },
      },
      {
        name: `should ${availableActions.TRANSPORT_STOP_PLANE}`,
        setup: {
          consumption: [{ type: "fossil", name: "plane", value: 10 }],
          performedActions: [availableActions.TRANSPORT_STOP_PLANE],
        },
        expected: {
          consumptionData: [{ type: "fossil", name: "plane", value: 0 }],
        },
      },
      {
        name: `should ${availableActions.LOCAL_CONSUMPTION}`,
        setup: {
          consumption: [
            { type: "grey", name: "greyOther", value: 10 },
            { type: "grey", name: "greyTransport", value: 10 },
          ],
          performedActions: [availableActions.LOCAL_CONSUMPTION],
        },
        expected: {
          consumptionData: [
            { type: "grey", name: "greyOther", value: 4.6 },
            { type: "grey", name: "greyTransport", value: 8.8 },
          ],
        },
      },
      {
        name: `should ${availableActions.REDUCE_CLOTHING_HALF}`,
        setup: {
          consumption: [
            { type: "grey", name: "greyOther", value: 10 },
            { type: "grey", name: "greyTransport", value: 10 },
          ],
          performedActions: [availableActions.REDUCE_CLOTHING_HALF],
        },
        expected: {
          consumptionData: [
            { type: "grey", name: "greyOther", value: 4.6 },
            { type: "grey", name: "greyTransport", value: 8.8 },
          ],
        },
      },
      {
        name: `should ${availableActions.REDUCE_NUMERIC}`,
        setup: {
          consumption: [{ type: "grey", name: "greyNumeric", value: 10 }],
          performedActions: [availableActions.REDUCE_NUMERIC],
        },
        expected: {
          consumptionData: [{ type: "grey", name: "greyNumeric", value: 7 }],
        },
      },
      {
        name: `should ${availableActions.STOP_MILK}`,
        setup: {
          consumption: [{ type: "mixte", name: "food", value: 10 }],
          performedActions: [availableActions.STOP_MILK],
        },
        expected: {
          consumptionData: [{ type: "mixte", name: "food", value: 8.5 }],
        },
      },
      {
        name: `should ${availableActions.STOP_EGGS}`,
        setup: {
          consumption: [{ type: "mixte", name: "food", value: 10 }],
          performedActions: [availableActions.STOP_EGGS],
        },
        expected: {
          consumptionData: [{ type: "mixte", name: "food", value: 9 }],
        },
      },
      {
        name: `should ${availableActions.STOP_MEAT}`,
        setup: {
          consumption: [{ type: "mixte", name: "food", value: 10 }],
          performedActions: [availableActions.STOP_MEAT],
        },
        expected: {
          consumptionData: [{ type: "mixte", name: "food", value: 6 }],
        },
      },
      {
        name: `should ${availableActions.ZERO_WASTE}`,
        setup: {
          consumption: [{ type: "mixte", name: "food", value: 10 }],
          performedActions: [availableActions.ZERO_WASTE],
        },
        expected: {
          consumptionData: [{ type: "mixte", name: "food", value: 6 }],
        },
      },
      {
        name: `should ${availableActions.REDUCE_TRAIN_HALF}`,
        setup: {
          consumption: [{ type: "renewable", name: "train", value: 10 }],
          performedActions: [availableActions.REDUCE_TRAIN_HALF],
        },
        expected: {
          consumptionData: [{ type: "renewable", name: "train", value: 5 }],
        },
      },
      {
        name: `should ${availableActions.DIGITAL_REDUCE_INTERNET_HALF}`,
        setup: {
          consumption: [{ type: "grey", name: "greyNumeric", value: 10 }],
          performedActions: [availableActions.DIGITAL_REDUCE_INTERNET_HALF],
        },
        expected: {
          consumptionData: [
            { type: "grey", name: "greyNumeric", value: 9.0325 },
          ],
        },
      },
      {
        name: `should ${availableActions.HOUSE_INSTALL_EFFICIENT_ELECTRIC_WOOD_HEATING_SYSTEM} with initial fossil heating`,
        setup: {
          consumption: [
            { type: "fossil", name: "fossilHeating", value: 10 },
            { type: "renewable", name: "noCarbonHeating", value: 0 },
          ],
          performedActions: [
            availableActions.HOUSE_INSTALL_EFFICIENT_ELECTRIC_WOOD_HEATING_SYSTEM,
          ],
        },
        expected: {
          consumptionData: [
            { type: "fossil", name: "fossilHeating", value: 0 },
            { type: "renewable", name: "noCarbonHeating", value: 4 },
          ],
        },
      },
      {
        name: `should ${availableActions.HOUSE_INSTALL_EFFICIENT_ELECTRIC_WOOD_HEATING_SYSTEM} with initial renewable heating`,
        setup: {
          consumption: [
            { type: "fossil", name: "fossilHeating", value: 0 },
            { type: "renewable", name: "noCarbonHeating", value: 10 },
          ],
          performedActions: [
            availableActions.HOUSE_INSTALL_EFFICIENT_ELECTRIC_WOOD_HEATING_SYSTEM,
          ],
        },
        expected: {
          consumptionData: [
            { type: "fossil", name: "fossilHeating", value: 0 },
            { type: "renewable", name: "noCarbonHeating", value: 4 },
          ],
        },
      },
      {
        name: `should ${availableActions.HOUSE_INSULATE_WALLS}`,
        setup: {
          consumption: [
            { type: "fossil", name: "fossilHeating", value: 10 },
            { type: "renewable", name: "noCarbonHeating", value: 10 },
          ],
          performedActions: [availableActions.HOUSE_INSULATE_WALLS],
        },
        expected: {
          consumptionData: [
            { type: "fossil", name: "fossilHeating", value: 7.5 },
            { type: "renewable", name: "noCarbonHeating", value: 7.5 },
          ],
        },
      },
      {
        name: `should ${availableActions.HOUSE_INSULATE_ROOF}`,
        setup: {
          consumption: [
            { type: "fossil", name: "fossilHeating", value: 10 },
            { type: "renewable", name: "noCarbonHeating", value: 10 },
          ],
          performedActions: [availableActions.HOUSE_INSULATE_ROOF],
        },
        expected: {
          consumptionData: [
            { type: "fossil", name: "fossilHeating", value: 7.5 },
            { type: "renewable", name: "noCarbonHeating", value: 7.5 },
          ],
        },
      },
      {
        name: `should ${availableActions.HOUSE_CHANGE_WOODWORK_WINDOWS}`,
        setup: {
          consumption: [
            { type: "fossil", name: "fossilHeating", value: 10 },
            { type: "renewable", name: "noCarbonHeating", value: 10 },
          ],
          performedActions: [availableActions.HOUSE_CHANGE_WOODWORK_WINDOWS],
        },
        expected: {
          consumptionData: [
            { type: "fossil", name: "fossilHeating", value: 9 },
            { type: "renewable", name: "noCarbonHeating", value: 9 },
          ],
        },
      },
      {
        name: `should ${availableActions.HOUSE_INSTALL_EFFICIENT_VENTILATION_SYSTEM}`,
        setup: {
          consumption: [
            { type: "fossil", name: "fossilHeating", value: 10 },
            { type: "renewable", name: "noCarbonHeating", value: 10 },
          ],
          performedActions: [
            availableActions.HOUSE_INSTALL_EFFICIENT_VENTILATION_SYSTEM,
          ],
        },
        expected: {
          consumptionData: [
            { type: "fossil", name: "fossilHeating", value: 8 },
            { type: "renewable", name: "noCarbonHeating", value: 8 },
          ],
        },
      },
      {
        name: `should ${availableActions.HOUSE_19_DEGREES_MAX}`,
        setup: {
          consumption: [
            { type: "fossil", name: "fossilHeating", value: 10 },
            { type: "renewable", name: "noCarbonHeating", value: 10 },
          ],
          performedActions: [availableActions.HOUSE_19_DEGREES_MAX],
        },
        expected: {
          consumptionData: [
            { type: "fossil", name: "fossilHeating", value: 8.6 },
            { type: "renewable", name: "noCarbonHeating", value: 8.6 },
          ],
        },
      },
      {
        name: `should ${availableActions.HOUSE_REDUCE_SIZE_HALF}`,
        setup: {
          consumption: [
            { type: "fossil", name: "fossilHeating", value: 10 },
            { type: "renewable", name: "noCarbonHeating", value: 10 },
          ],
          performedActions: [availableActions.HOUSE_REDUCE_SIZE_HALF],
        },
        expected: {
          consumptionData: [
            { type: "fossil", name: "fossilHeating", value: 5 },
            { type: "renewable", name: "noCarbonHeating", value: 5 },
          ],
        },
      },
      {
        name: `should ${availableActions.HOUSE_STOP_AIR_CONDITIONING}`,
        setup: {
          consumption: [
            { type: "renewable", name: "airConditionning", value: 10 },
          ],
          performedActions: [availableActions.HOUSE_STOP_AIR_CONDITIONING],
        },
        expected: {
          consumptionData: [
            { type: "renewable", name: "airConditionning", value: 0 },
          ],
        },
      },
      {
        name: `should ${availableActions.HOUSE_ONLY_LEDS}`,
        setup: {
          consumption: [{ type: "renewable", name: "light", value: 10 }],
          performedActions: [availableActions.HOUSE_ONLY_LEDS],
        },
        expected: {
          consumptionData: [{ type: "renewable", name: "light", value: 5 }],
        },
      },
      {
        name: `should ${availableActions.HOUSE_ONE_SHOWER_5_MINUTES_MAX}`,
        setup: {
          consumption: [{ type: "renewable", name: "cleanCook", value: 10 }],
          performedActions: [availableActions.HOUSE_ONE_SHOWER_5_MINUTES_MAX],
        },
        expected: {
          consumptionData: [
            { type: "renewable", name: "cleanCook", value: 9.3 },
          ],
        },
      },
      {
        name: `should ${availableActions.HOUSE_EFFICIENT_HOUSEHOLD_APPLIANCES}`,
        setup: {
          consumption: [{ type: "renewable", name: "cleanCook", value: 10 }],
          performedActions: [
            availableActions.HOUSE_EFFICIENT_HOUSEHOLD_APPLIANCES,
          ],
        },
        expected: {
          consumptionData: [
            { type: "renewable", name: "cleanCook", value: 6.18 },
          ],
        },
      },
      {
        name: `should ${availableActions.HOUSE_UNPLUNG_APPLIANCES_ON_STANDBY}`,
        setup: {
          consumption: [{ type: "renewable", name: "brownGoods", value: 10 }],
          performedActions: [
            availableActions.HOUSE_UNPLUNG_APPLIANCES_ON_STANDBY,
          ],
        },
        expected: {
          consumptionData: [
            { type: "renewable", name: "brownGoods", value: 9.4 },
          ],
        },
      },
      {
        name: `should ${availableActions.HOUSE_UNPLUNG_CHARGERS}`,
        setup: {
          consumption: [{ type: "renewable", name: "brownGoods", value: 10 }],
          performedActions: [availableActions.HOUSE_UNPLUNG_CHARGERS],
        },
        expected: {
          consumptionData: [
            { type: "renewable", name: "brownGoods", value: 9.99 },
          ],
        },
      },
      {
        name: `should ${availableActions.ELECTRIC_CAR} with initial fossil car`,
        setup: {
          consumption: [
            { type: "fossil", name: "fossilCar", value: 10 },
            { type: "renewable", name: "electricCar", value: 0 },
            { type: "grey", name: "greyCar", value: 10 },
          ],
          performedActions: [availableActions.ELECTRIC_CAR],
        },
        expected: {
          consumptionData: [
            { type: "fossil", name: "fossilCar", value: 0 },
            { type: "renewable", name: "electricCar", value: 10 },
            { type: "grey", name: "greyCar", value: 12 },
          ],
        },
      },
      {
        name: `should ${availableActions.ELECTRIC_CAR} with initial electric car`,
        setup: {
          consumption: [
            { type: "fossil", name: "fossilCar", value: 0 },
            { type: "renewable", name: "electricCar", value: 10 },
            { type: "grey", name: "greyCar", value: 10 },
          ],
          performedActions: [availableActions.ELECTRIC_CAR],
        },
        expected: {
          consumptionData: [
            { type: "fossil", name: "fossilCar", value: 0 },
            { type: "renewable", name: "electricCar", value: 10 },
            { type: "grey", name: "greyCar", value: 12 },
          ],
        },
      },
      {
        name: `should ${availableActions.ECO_DRIVING}`,
        setup: {
          consumption: [
            { type: "fossil", name: "fossilCar", value: 10 },
            { type: "renewable", name: "electricCar", value: 10 },
          ],
          performedActions: [availableActions.ECO_DRIVING],
        },
        expected: {
          consumptionData: [
            { type: "fossil", name: "fossilCar", value: 9 },
            { type: "renewable", name: "electricCar", value: 9 },
          ],
        },
      },
      {
        name: `should ${availableActions.REDUCE_CAR_20}`,
        setup: {
          consumption: [
            { type: "fossil", name: "fossilCar", value: 10 },
            { type: "renewable", name: "electricCar", value: 10 },
          ],
          performedActions: [availableActions.REDUCE_CAR_20],
        },
        expected: {
          consumptionData: [
            { type: "fossil", name: "fossilCar", value: 8 },
            { type: "renewable", name: "electricCar", value: 8 },
          ],
        },
      },
      {
        name: `should ${availableActions.KEEP_CAR_15}`,
        setup: {
          consumption: [{ type: "grey", name: "greyCar", value: 30 }],
          performedActions: [availableActions.KEEP_CAR_15],
        },
        expected: {
          consumptionData: [{ type: "grey", name: "greyCar", value: 2 }],
        },
      },
    ];

    runTests(TESTS);
  });

  describe("multiple actions", () => {
    const TESTS: Test[] = [
      {
        name: `should handle food actions`,
        setup: {
          consumption: [{ type: "mixte", name: "food", value: 20 }],
          performedActions: [
            availableActions.STOP_MILK,
            availableActions.STOP_EGGS,
            availableActions.STOP_MEAT,
            availableActions.ZERO_WASTE,
          ],
        },
        expected: {
          consumptionData: [{ type: "mixte", name: "food", value: 9.5 }],
        },
      },
      {
        name: `should handle plane actions`,
        setup: {
          consumption: [{ type: "fossil", name: "plane", value: 10 }],
          performedActions: [
            availableActions.REDUCE_PLANE_HALF,
            availableActions.TRANSPORT_STOP_PLANE,
          ],
        },
        expected: {
          consumptionData: [{ type: "fossil", name: "plane", value: 0 }],
        },
      },
      {
        name: `should handle fossil heating actions`,
        setup: {
          consumption: [
            { type: "fossil", name: "fossilHeating", value: 100 },
            { type: "renewable", name: "noCarbonHeating", value: 100 },
          ],
          performedActions: [
            availableActions.HOUSE_INSULATE_WALLS,
            availableActions.HOUSE_INSULATE_ROOF,
            availableActions.HOUSE_CHANGE_WOODWORK_WINDOWS,
            availableActions.HOUSE_INSTALL_EFFICIENT_VENTILATION_SYSTEM,
            availableActions.HOUSE_19_DEGREES_MAX,
            availableActions.HOUSE_REDUCE_SIZE_HALF,
          ],
        },
        expected: {
          consumptionData: [
            { type: "fossil", name: "fossilHeating", value: 17.415 },
            { type: "renewable", name: "noCarbonHeating", value: 17.415 },
          ],
        },
      },
      {
        name: `should handle fossil heating actions with ${availableActions.HOUSE_INSTALL_EFFICIENT_ELECTRIC_WOOD_HEATING_SYSTEM}`,
        setup: {
          consumption: [
            { type: "fossil", name: "fossilHeating", value: 100 },
            { type: "renewable", name: "noCarbonHeating", value: 100 },
          ],
          performedActions: [
            availableActions.HOUSE_INSULATE_WALLS,
            availableActions.HOUSE_INSULATE_ROOF,
            availableActions.HOUSE_CHANGE_WOODWORK_WINDOWS,
            availableActions.HOUSE_INSTALL_EFFICIENT_VENTILATION_SYSTEM,
            availableActions.HOUSE_19_DEGREES_MAX,
            availableActions.HOUSE_REDUCE_SIZE_HALF,
            availableActions.HOUSE_INSTALL_EFFICIENT_ELECTRIC_WOOD_HEATING_SYSTEM,
          ],
        },
        expected: {
          consumptionData: [
            { type: "fossil", name: "fossilHeating", value: 0 },
            {
              type: "renewable",
              name: "noCarbonHeating",
              value: 6.965999999999999,
            },
          ],
        },
      },
      {
        name: `should handle car actions`,
        setup: {
          consumption: [
            { type: "fossil", name: "fossilCar", value: 100 },
            { type: "renewable", name: "electricCar", value: 100 },
            { type: "grey", name: "greyCar", value: 100 },
          ],
          performedActions: [
            availableActions.ECO_DRIVING,
            availableActions.REDUCE_CAR_20,
            availableActions.KEEP_CAR_15,
          ],
        },
        expected: {
          consumptionData: [
            { type: "fossil", name: "fossilCar", value: 72 },
            { type: "renewable", name: "electricCar", value: 72 },
            { type: "grey", name: "greyCar", value: 72 },
          ],
        },
      },
      {
        name: `should handle car actions with ${availableActions.ELECTRIC_CAR} with initial fossil car`,
        setup: {
          consumption: [
            { type: "fossil", name: "fossilCar", value: 100 },
            { type: "renewable", name: "electricCar", value: 0 },
            { type: "grey", name: "greyCar", value: 100 },
          ],
          performedActions: [
            availableActions.ELECTRIC_CAR,
            availableActions.ECO_DRIVING,
            availableActions.REDUCE_CAR_20,
            availableActions.KEEP_CAR_15,
          ],
        },
        expected: {
          consumptionData: [
            { type: "fossil", name: "fossilCar", value: 0 },
            { type: "renewable", name: "electricCar", value: 72 },
            { type: "grey", name: "greyCar", value: 92 },
          ],
        },
      },
      {
        name: `should handle car actions with ${availableActions.ELECTRIC_CAR} with initial electric car`,
        setup: {
          consumption: [
            { type: "fossil", name: "fossilCar", value: 0 },
            { type: "renewable", name: "electricCar", value: 100 },
            { type: "grey", name: "greyCar", value: 100 },
          ],
          performedActions: [
            availableActions.ELECTRIC_CAR,
            availableActions.ECO_DRIVING,
            availableActions.REDUCE_CAR_20,
            availableActions.KEEP_CAR_15,
          ],
        },
        expected: {
          consumptionData: [
            { type: "fossil", name: "fossilCar", value: 0 },
            { type: "renewable", name: "electricCar", value: 72 },
            { type: "grey", name: "greyCar", value: 92 },
          ],
        },
      },
      {
        name: `should handle actions on grey energy`,
        setup: {
          consumption: [
            { type: "grey", name: "greyOther", value: 20 },
            { type: "grey", name: "greyTransport", value: 20 },
            { type: "grey", name: "greyNumeric", value: 20 },
          ],
          performedActions: [
            availableActions.LOCAL_CONSUMPTION,
            availableActions.REDUCE_CLOTHING_HALF,
            availableActions.REDUCE_NUMERIC,
            availableActions.DIGITAL_REDUCE_INTERNET_HALF,
          ],
        },
        expected: {
          consumptionData: [
            { type: "grey", name: "greyOther", value: 9.2 },
            { type: "grey", name: "greyTransport", value: 17.6 },
            { type: "grey", name: "greyNumeric", value: 16.0325 },
          ],
        },
      },
    ];

    runTests(TESTS);
  });
});
