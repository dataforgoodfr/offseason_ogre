export { areConditionsFulfilled };
export type { ConditionEngineCondition };

/**
 * Evaluate whether a set of conditions are fulfilled for a given set of data.
 *
 * @example
 *
 * const conditions = [
 *  {
 *    "isGameFinished": {
 *      _eq: true
 *    }
 *  },
 *  {
 *    "production.total": {
 *      _gte: {
 *        _ref: "consumption.total",
 *      },
 *    },
 *  },
 * ]
 *
 * const data = {
 *  "isGameFinished": true,
 *  "consumption.total": 25,
 *  "production.total": 100,
 * }
 *
 * areConditionsFulfilled(conditions, data); // true
 */
function areConditionsFulfilled<TData extends ConditionEngineInputData>(
  conditions: ConditionEngineCondition<keyof TData>[],
  data: TData
) {
  return conditions.every((condition) => {
    const [property, operator] = Object.entries(condition)[0];

    if (isOperator_Eq(operator)) {
      const comparisonValue = getComparisonValue(operator._eq, data);
      return data[property] === comparisonValue;
    }
    if (isOperator_Gte(operator)) {
      const comparisonValue = getComparisonValue(operator._gte, data);
      return data[property] >= comparisonValue;
    }
    if (isOperator_Lte(operator)) {
      const comparisonValue = getComparisonValue(operator._lte, data);
      return data[property] <= comparisonValue;
    }
    return false;
  });
}

/**
 * Get the comparison value.
 *
 * If the comparison value is a reference to another value in the dataset, the referenced value is returned.
 * Otherwise, the comparison value is returned as is.
 */
function getComparisonValue<TData extends ConditionEngineInputData>(
  comparisonValue: ComparisonValue<keyof TData>,
  data: TData
): ComparisonNative {
  if (isRefComparisonValue(comparisonValue)) {
    return data[comparisonValue._ref];
  }
  return comparisonValue;
}

function isRefComparisonValue<TKeys extends string | number | symbol = string>(
  comparisonValue: ComparisonValue<TKeys>
): comparisonValue is ComparisonRef<TKeys> {
  return ((comparisonValue as any) || {})?._ref != null;
}

function isOperator_Eq<TKeys extends string | number | symbol = string>(
  comparison: ComparisonOperator<TKeys>
): comparison is ComparisonOperator_Eq<TKeys> {
  return (comparison as any)._eq != null;
}

function isOperator_Gte<TKeys extends string | number | symbol = string>(
  comparison: ComparisonOperator<TKeys>
): comparison is ComparisonOperator_Gte<TKeys> {
  return (comparison as any)._gte != null;
}

function isOperator_Lte<TKeys extends string | number | symbol = string>(
  comparison: ComparisonOperator<TKeys>
): comparison is ComparisonOperator_Lte<TKeys> {
  return (comparison as any)._lte != null;
}

type ConditionEngineInputData<TKeys extends string | number | symbol = string> =
  Record<TKeys, number | string | boolean>;

type ConditionEngineCondition<TKeys extends string | number | symbol = string> =
  Record<TKeys, ComparisonOperator<TKeys>>;

type ComparisonOperator<TKeys extends string | number | symbol = string> =
  | ComparisonOperator_Eq<TKeys>
  | ComparisonOperator_Gte<TKeys>
  | ComparisonOperator_Lte<TKeys>;
type ComparisonOperator_Eq<TKeys extends string | number | symbol = string> = {
  _eq: ComparisonValue<TKeys>;
};
type ComparisonOperator_Gte<TKeys extends string | number | symbol = string> = {
  _gte: ComparisonValue<TKeys>;
};
type ComparisonOperator_Lte<TKeys extends string | number | symbol = string> = {
  _lte: ComparisonValue<TKeys>;
};

type ComparisonValue<TKeys extends string | number | symbol = string> =
  | ComparisonNative
  | ComparisonRef<TKeys>;
type ComparisonNative = number | string | boolean;
type ComparisonRef<TKeys extends string | number | symbol = string> = {
  _ref: TKeys;
};
