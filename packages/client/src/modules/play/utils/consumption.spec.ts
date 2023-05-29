import { ActionNames } from "../../../utils/types";
import { ConsumptionDatum } from "../../persona/consumption";
import {
  consumptionFood,
  consumptionGrey,
  consumptionGreyNumeric,
  consumptionGreyOther,
  consumptionGreyTransport,
  DAYS_IN_YEAR,
  numericEquipment,
  transportCoeffs,
} from "../../persona/consumption/constants";
import { getCarAgeCoeff } from "../../persona/consumption/utils";
import {
  carAges,
  carEnergies,
  formValues,
  PersoForm,
  Question,
} from "../Personalization/models/form";
import { availableActions } from "../playerActions/constants/actions";
import { computeNewConsumptionData } from "./consumption";

interface Test {
  name: string;
  setup: {
    personalization: any;
    performedActions: ActionNames[];
  };
  expected: {
    consumptionData: Pick<ConsumptionDatum, "type" | "name" | "value">[];
  };
}

const runTests = (tests: Test[]) => {
  tests.forEach((test: Test) => {
    it(test.name, () => {
      const defaultPersonalization = Object.assign(
        {},
        ...formValues.map((question: Question) => ({
          [question.name]: question.defaultValue,
        }))
      );

      const personalization: PersoForm = {
        ...defaultPersonalization,
        ...test.setup.personalization,
      };

      const beforeData = computeNewConsumptionData([], personalization);

      const performedActions: ActionNames[] = test.setup.performedActions;

      const newData = computeNewConsumptionData(
        performedActions,
        personalization
      );

      test.expected.consumptionData.forEach(({ type, name, value }) => {
        expect(
          newData.filter((data) => data.type === type && data.name === name)[0]
            .value
        ).toBeCloseTo(value, 10);
      });

      expect(
        beforeData.filter(
          (b) =>
            !test.expected.consumptionData.some(
              ({ type, name, value }) => b.type === type && b.name === name
            )
        )
      ).toEqual(
        newData.filter(
          (n) =>
            !test.expected.consumptionData.some(
              ({ type, name, value }) => n.type === type && n.name === name
            )
        )
      );
    });
  });
};

describe("consumtion", () => {
  describe("single action", () => {
    const TESTS: Test[] = [
      {
        name: `should ${availableActions.REDUCE_PLANE_HALF}`,
        setup: {
          personalization: { planeDistance: DAYS_IN_YEAR * 2 * 100 },
          performedActions: [availableActions.REDUCE_PLANE_HALF],
        },
        expected: {
          consumptionData: [
            {
              type: "fossil",
              name: "plane",
              value: 100 * transportCoeffs.PLANE,
            },
          ],
        },
      },
      {
        name: `should ${availableActions.REDUCE_PLANE_HALF} if plane 0`,
        setup: {
          personalization: { planeDistance: 0 },
          performedActions: [availableActions.REDUCE_PLANE_HALF],
        },
        expected: {
          consumptionData: [{ type: "fossil", name: "plane", value: 0 }],
        },
      },
      {
        name: `should ${availableActions.LOCAL_CONSUMPTION}`,
        setup: {
          personalization: { eatingLocal: false, clothingQuantity: true },
          performedActions: [availableActions.LOCAL_CONSUMPTION],
        },
        expected: {
          consumptionData: [
            {
              type: "grey",
              name: "greyTransport",
              value:
                consumptionGreyTransport.GLOBAL *
                (1 - consumptionGreyTransport.LOCAL_TRUE),
            },
            {
              type: "grey",
              name: "greyOther",
              value:
                consumptionGreyOther.OTHER_GLOBAL *
                (1 - consumptionGreyOther.LOCAL_TRUE),
            },
          ],
        },
      },
      {
        name: `should ${availableActions.LOCAL_CONSUMPTION} - nothing happens`,
        setup: {
          personalization: { eatingLocal: true, clothingQuantity: true },
          performedActions: [availableActions.LOCAL_CONSUMPTION],
        },
        expected: {
          consumptionData: [],
        },
      },
      {
        name: `should ${availableActions.REDUCE_CLOTHING_HALF}`,
        setup: {
          personalization: { eatingLocal: false, clothingQuantity: true },
          performedActions: [availableActions.REDUCE_CLOTHING_HALF],
        },
        expected: {
          consumptionData: [
            {
              type: "grey",
              name: "greyTransport",
              value:
                consumptionGreyTransport.GLOBAL *
                (1 - consumptionGreyTransport.CLOTHING_FALSE),
            },
            {
              type: "grey",
              name: "greyOther",
              value:
                consumptionGreyOther.OTHER_GLOBAL *
                (1 - consumptionGreyOther.CLOTHING_FALSE),
            },
          ],
        },
      },
      {
        name: `should ${availableActions.REDUCE_CLOTHING_HALF} - nothing happens`,
        setup: {
          personalization: { eatingLocal: false, clothingQuantity: false },
          performedActions: [availableActions.REDUCE_CLOTHING_HALF],
        },
        expected: {
          consumptionData: [],
        },
      },
      {
        name: `should ${availableActions.REDUCE_NUMERIC}`,
        setup: {
          personalization: { numericEquipment: true },
          performedActions: [availableActions.REDUCE_NUMERIC],
        },
        expected: {
          consumptionData: [
            {
              type: "renewable",
              name: "brownGoods",
              value: numericEquipment.NO,
            },
            {
              type: "grey",
              name: "greyNumeric",
              value:
                consumptionGreyNumeric.EQUIPMENT_GLOBAL *
                  consumptionGreyNumeric.EQUIPMENT_FALSE *
                  1.5 +
                consumptionGreyNumeric.WEB_GLOBAL,
            },
          ],
        },
      },
      {
        name: `should ${availableActions.REDUCE_NUMERIC} - nothing happens`,
        setup: {
          personalization: { numericEquipment: false },
          performedActions: [availableActions.REDUCE_NUMERIC],
        },
        expected: {
          consumptionData: [],
        },
      },
      {
        name: `should ${availableActions.STOP_MILK}`,
        setup: {
          personalization: { eatingDairies: true, eatingZeroWaste: true },
          performedActions: [availableActions.STOP_MILK],
        },
        expected: {
          consumptionData: [
            { type: "mixte", name: "food", value: consumptionFood.GLOBAL },
          ],
        },
      },
      {
        name: `should ${availableActions.STOP_MILK} - nothing happens`,
        setup: {
          personalization: { eatingDairies: false, eatingZeroWaste: true },
          performedActions: [availableActions.STOP_MILK],
        },
        expected: {
          consumptionData: [],
        },
      },
      {
        name: `should ${availableActions.STOP_EGGS}`,
        setup: {
          personalization: { eatingEggs: true, eatingZeroWaste: true },
          performedActions: [availableActions.STOP_EGGS],
        },
        expected: {
          consumptionData: [
            { type: "mixte", name: "food", value: consumptionFood.GLOBAL },
          ],
        },
      },
      {
        name: `should ${availableActions.STOP_EGGS} - nothing happens`,
        setup: {
          personalization: { eatingEggs: false, eatingZeroWaste: true },
          performedActions: [availableActions.STOP_EGGS],
        },
        expected: {
          consumptionData: [],
        },
      },

      {
        name: `should ${availableActions.STOP_CANS}`,
        setup: {
          personalization: { eatingTinDrink: 12, eatingZeroWaste: true },
          performedActions: [availableActions.STOP_CANS],
        },
        expected: {
          consumptionData: [
            { type: "mixte", name: "food", value: consumptionFood.GLOBAL },
          ],
        },
      },
      {
        name: `should ${availableActions.STOP_CANS} - nothing happens`,
        setup: {
          personalization: { eatingTinDrink: 0, eatingZeroWaste: true },
          performedActions: [availableActions.STOP_CANS],
        },
        expected: {
          consumptionData: [],
        },
      },

      {
        name: `should ${availableActions.STOP_MEAT}`,
        setup: {
          personalization: { eatingMeat: true, eatingZeroWaste: true },
          performedActions: [availableActions.STOP_MEAT],
        },
        expected: {
          consumptionData: [
            { type: "mixte", name: "food", value: consumptionFood.GLOBAL },
          ],
        },
      },
      {
        name: `should ${availableActions.STOP_MEAT} - nothing happens`,
        setup: {
          personalization: { eatingMeat: false, eatingZeroWaste: true },
          performedActions: [availableActions.STOP_MEAT],
        },
        expected: {
          consumptionData: [],
        },
      },
      {
        name: `should ${availableActions.ZERO_WASTE}`,
        setup: {
          personalization: { eatingZeroWaste: false },
          performedActions: [availableActions.ZERO_WASTE],
        },
        expected: {
          consumptionData: [
            { type: "mixte", name: "food", value: consumptionFood.GLOBAL },
          ],
        },
      },
      {
        name: `should ${availableActions.ZERO_WASTE} - nothing happens`,
        setup: {
          personalization: { eatingZeroWaste: true },
          performedActions: [availableActions.ZERO_WASTE],
        },
        expected: {
          consumptionData: [],
        },
      },
      {
        name: `should ${availableActions.REDUCE_TRAIN_HALF}`,
        setup: {
          personalization: { trainDistance: DAYS_IN_YEAR * 2 * 100 },
          performedActions: [availableActions.REDUCE_TRAIN_HALF],
        },
        expected: {
          consumptionData: [
            {
              type: "renewable",
              name: "train",
              value: 100 * transportCoeffs.TRAIN,
            },
          ],
        },
      },
      {
        name: `should ${availableActions.REDUCE_TRAIN_HALF} - nothing happens`,
        setup: {
          personalization: { trainDistance: 0 },
          performedActions: [availableActions.REDUCE_TRAIN_HALF],
        },
        expected: {
          consumptionData: [],
        },
      },
      {
        name: `should ${availableActions.ECO_DRIVING}`,
        setup: {
          personalization: {
            car: true,
            carEnergy: carEnergies.ESSENCE,
            numberAdults: 2,
            numberKids: 0,
            carConsumption: transportCoeffs.MEAN_FOSSIL_CAR_CONSUMPTION * 100,
            carDistanceAlone: DAYS_IN_YEAR * 100,
            carDistanceHoushold: DAYS_IN_YEAR * 200,
            carDistanceCarsharing: 0,
          },
          performedActions: [availableActions.ECO_DRIVING],
        },
        expected: {
          consumptionData: [
            {
              type: "fossil",
              name: "fossilCar",
              value:
                transportCoeffs.MEAN_FOSSIL_CAR_CONSUMPTION *
                transportCoeffs.FOSSIL_CAR *
                100 *
                2 *
                0.9,
            },
          ],
        },
      },
      {
        name: `should ${availableActions.ECO_DRIVING} - when not car and just carsharing`,
        setup: {
          personalization: {
            car: false,
            carEnergy: carEnergies.ESSENCE,
            numberAdults: 2,
            numberKids: 0,
            carConsumption: 10,
            carDistanceAlone: DAYS_IN_YEAR * 100,
            carDistanceHoushold: DAYS_IN_YEAR * 200,
            carDistanceCarsharing: DAYS_IN_YEAR * 550,
          },
          performedActions: [availableActions.ECO_DRIVING],
        },
        expected: {
          consumptionData: [
            {
              type: "fossil",
              name: "fossilCar",
              value:
                transportCoeffs.MEAN_FOSSIL_CAR_CONSUMPTION *
                transportCoeffs.FOSSIL_CAR *
                550 *
                0.9,
            },
          ],
        },
      },
      {
        name: `should ${availableActions.ECO_DRIVING} - nothing happens`,
        setup: {
          personalization: {
            car: true,
            carEnergy: carEnergies.ESSENCE,
            numberAdults: 2,
            numberKids: 0,
            carConsumption: 7,
            carDistanceAlone: 0,
            carDistanceHouseHold: 0,
          },
          performedActions: [availableActions.ECO_DRIVING],
        },
        expected: {
          consumptionData: [],
        },
      },
      {
        name: `should ${availableActions.REDUCE_CAR_20}`,
        setup: {
          personalization: {
            car: true,
            carEnergy: carEnergies.ESSENCE,
            numberAdults: 2,
            numberKids: 0,
            carConsumption: transportCoeffs.MEAN_FOSSIL_CAR_CONSUMPTION * 100,
            carDistanceAlone: DAYS_IN_YEAR * 100,
            carDistanceHoushold: DAYS_IN_YEAR * 200,
            carDistanceCarsharing: 0,
          },
          performedActions: [availableActions.REDUCE_CAR_20],
        },
        expected: {
          consumptionData: [
            {
              type: "fossil",
              name: "fossilCar",
              value:
                transportCoeffs.MEAN_FOSSIL_CAR_CONSUMPTION *
                transportCoeffs.FOSSIL_CAR *
                100 *
                2 *
                0.8,
            },
          ],
        },
      },
      {
        name: `should ${availableActions.REDUCE_CAR_20} - when not car and just carsharing`,
        setup: {
          personalization: {
            car: false,
            carEnergy: carEnergies.ESSENCE,
            numberAdults: 2,
            numberKids: 0,
            carConsumption: 10,
            carDistanceAlone: DAYS_IN_YEAR * 100,
            carDistanceHoushold: DAYS_IN_YEAR * 200,
            carDistanceCarsharing: DAYS_IN_YEAR * 550,
          },
          performedActions: [availableActions.REDUCE_CAR_20],
        },
        expected: {
          consumptionData: [
            {
              type: "fossil",
              name: "fossilCar",
              value:
                transportCoeffs.MEAN_FOSSIL_CAR_CONSUMPTION *
                transportCoeffs.FOSSIL_CAR *
                550 *
                0.8,
            },
          ],
        },
      },
      {
        name: `should ${availableActions.REDUCE_CAR_20} - nothing happens`,
        setup: {
          personalization: {
            car: true,
            carEnergy: carEnergies.ESSENCE,
            numberAdults: 2,
            numberKids: 0,
            carConsumption: 7,
            carDistanceAlone: 0,
            carDistanceHouseHold: 0,
          },
          performedActions: [availableActions.REDUCE_CAR_20],
        },
        expected: {
          consumptionData: [],
        },
      },
      {
        name: `should ${availableActions.ELECTRIC_CAR}`,
        setup: {
          personalization: {
            car: true,
            carEnergy: carEnergies.ESSENCE,
            numberAdults: 2,
            numberKids: 0,
            carConsumption: transportCoeffs.MEAN_FOSSIL_CAR_CONSUMPTION * 100,
            carDistanceAlone: DAYS_IN_YEAR * 100,
            carDistanceHoushold: DAYS_IN_YEAR * 200,
            carDistanceCarsharing: 0,
          },
          performedActions: [availableActions.ELECTRIC_CAR],
        },
        expected: {
          consumptionData: [
            { type: "fossil", name: "fossilCar", value: 0 },
            {
              type: "renewable",
              name: "electricCar",
              value: transportCoeffs.ELECTRIC_CAR * 200,
            },
            { type: "grey", name: "greyCar", value: consumptionGrey.CAR * 1.2 },
          ],
        },
      },
      {
        name: `should ${availableActions.ELECTRIC_CAR} - when not car and just carsharing`,
        setup: {
          personalization: {
            car: false,
            carEnergy: carEnergies.ESSENCE,
            numberAdults: 2,
            numberKids: 0,
            carConsumption: 10,
            carDistanceAlone: DAYS_IN_YEAR * 100,
            carDistanceHoushold: DAYS_IN_YEAR * 200,
            carDistanceCarsharing: DAYS_IN_YEAR * 550,
          },
          performedActions: [availableActions.ELECTRIC_CAR],
        },
        expected: {
          consumptionData: [],
        },
      },
      {
        name: `should ${availableActions.ELECTRIC_CAR} - nothing happens`,
        setup: {
          personalization: {
            car: true,
            carEnergy: carEnergies.ELECTRICITE,
            numberAdults: 2,
            numberKids: 0,
            carConsumption: 7,
            carDistanceAlone: 0,
            carDistanceHouseHold: 0,
          },
          performedActions: [availableActions.ELECTRIC_CAR],
        },
        expected: {
          consumptionData: [],
        },
      },
      {
        name: `should ${availableActions.KEEP_CAR_15}`,
        setup: {
          personalization: {
            carAge: carAges.MOINS_5,
            car: true,
            carEnergy: carEnergies.ESSENCE,
          },
          performedActions: [availableActions.KEEP_CAR_15],
        },
        expected: {
          consumptionData: [
            {
              type: "grey",
              name: "greyCar",
              value: consumptionGrey.CAR * getCarAgeCoeff(carAges.PLUS_15),
            },
          ],
        },
      },
      {
        name: `should ${availableActions.KEEP_CAR_15} - nothing happens`,
        setup: {
          personalization: {
            carAge: carAges.PLUS_15,
          },
          performedActions: [availableActions.KEEP_CAR_15],
        },
        expected: {
          consumptionData: [],
        },
      },

      //TODO Adapt tests with new consumption computing system - see commits
      // bc89b55b664bb4e900d00cb7d06f944b23e3daf0 & e3702e9c709de30d691ca232f2cc79681d017b52 for tests
    ];

    runTests(TESTS);
  });
});
