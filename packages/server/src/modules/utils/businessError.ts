import _ from "lodash";

export { businessErrors, BusinessError, createBusinessError };

const businessErrors = {
  UNEXPECTED: "UNEXPECTED",
} as const;

const errorsConfig = {
  UNEXPECTED: {
    message: "An unexpected error occured",
  },
} as const;

interface ErrorInterpolations {
  UNEXPECTED: number;
}

type ErrorCode = typeof businessErrors[keyof typeof businessErrors];

class BusinessError extends Error {
  public readonly code: ErrorCode = businessErrors.UNEXPECTED;

  constructor(errorCodeOrMessage: ErrorCode | string, interpolations?: any) {
    const errorMessage = getErrorMessage(errorCodeOrMessage, interpolations);

    super(errorMessage);

    this.name = this.constructor.name;
    this.code = isErrorCode(errorCodeOrMessage)
      ? errorCodeOrMessage
      : businessErrors.UNEXPECTED;
  }
}

function getErrorMessage(
  errorCodeOrMessage: ErrorCode | string,
  interpolations: any
): string {
  if (isErrorCode(errorCodeOrMessage)) {
    return interpolateTemplate(
      errorsConfig[errorCodeOrMessage].message,
      interpolations
    );
  }

  return errorCodeOrMessage;
}

function isErrorCode(
  errorCodeOrMessage: ErrorCode | string
): errorCodeOrMessage is ErrorCode {
  return !!errorsConfig[errorCodeOrMessage as unknown as ErrorCode];
}

function interpolateTemplate(template: string, interpolations: any) {
  return _.template(template, {
    interpolate: /\{\s*(\S+)\s*\}/g,
  })(interpolations);
}

function createBusinessError(
  error: ErrorCode,
  interpolations?: ErrorInterpolations[ErrorCode]
): BusinessError;
function createBusinessError(str: string, interpolations?: any): BusinessError {
  return new BusinessError(str, interpolations);
}
