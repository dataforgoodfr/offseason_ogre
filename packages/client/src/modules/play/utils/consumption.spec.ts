import { ActionNames } from "../../../utils/types";
import { ConsumptionDatum } from "../../persona/consumption";
import { DAYS_IN_YEAR } from "../../persona/consumption/constants";
import {
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
      const performedActions: ActionNames[] = test.setup.performedActions;

      const newData = computeNewConsumptionData(
        performedActions,
        personalization
      );

      test.expected.consumptionData.forEach(({ type, name, value }) => {
        expect(
          newData.filter((data) => data.type === type && data.name === name)[0]
            .value
        ).toEqual(value);
      });
    });
  });
};

describe("consumtion", () => {
  describe("single action", () => {
    const TESTS: Test[] = [
      {
        name: `should ${availableActions.REDUCE_PLANE_HALF}`,
        setup: {
          personalization: { planeDistance: DAYS_IN_YEAR * 200 },
          performedActions: [availableActions.REDUCE_PLANE_HALF],
        },
        expected: {
          consumptionData: [{ type: "fossil", name: "plane", value: 41 }],
        },
      },

      //TODO Adapt tests with new consumption computing system - see commits
      // bc89b55b664bb4e900d00cb7d06f944b23e3daf0 & e3702e9c709de30d691ca232f2cc79681d017b52 for tests
    ];

    runTests(TESTS);
  });
});
