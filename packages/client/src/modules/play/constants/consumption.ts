export { carbonPerKwh };

const carbonPerKwh = {
  FOSSIL_CAR: 272,
  PLANE: 258,
  FOSSIL_HEATING: 252,
  PUBLIC_SERVICE: 233,
  GREY_HOUSE: 283,
  GREY_TRANSPORT: 283,
  GREY_OTHER: 283,
  GREY_NUMERIC: 0.01,
  GREY_CAR: 0.01,
} as const;
