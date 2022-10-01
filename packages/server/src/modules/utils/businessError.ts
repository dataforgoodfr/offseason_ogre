import _ from "lodash";

export { businessErrors, BusinessError, createBusinessError };

const businessErrors = {
  GAME_ALREADY_STARTED: "GAME_ALREADY_STARTED",
  GAME_NOT_FOUND: "GAME_NOT_FOUND",
  USER_ALREADY_JOINED_GAME: "USER_ALREADY_JOINED_GAME",
  UNEXPECTED: "UNEXPECTED",
} as const;

const errorsConfig = {
  GAME_ALREADY_STARTED: {
    message: "Can't join game that already started",
  },
  GAME_NOT_FOUND: {
    message: "Could not find game with id {id}",
  },
  USER_ALREADY_JOINED_GAME: {
    message: "User {userId} already joined game {gameId}",
  },
  UNEXPECTED: {
    message: "An unexpected error occured",
  },
} as const;

interface ErrorInterpolations {
  GAME_ALREADY_STARTED: undefined;
  GAME_NOT_FOUND: { id: number };
  USER_ALREADY_JOINED_GAME: { userId: number; gameId: number };
  UNEXPECTED: undefined;
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
