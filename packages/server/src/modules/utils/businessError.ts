import _ from "lodash";

export { BusinessError, createBusinessError };

type ErrorCode =
  | "GAME_ALREADY_STARTED"
  | "GAME_NOT_FOUND"
  | "TEAM_NOT_FOUND"
  | "UNEXPECTED"
  | "USER_ALREADY_EXISTS"
  | "USER_ALREADY_JOINED_GAME"
  | "USER_DOES_NOT_EXIST"
  | "USER_NOT_AUTHENTICATED"
  | "USER_NOT_AUTHORIZED";

const errorsConfig: { [k in ErrorCode]: any } = {
  GAME_ALREADY_STARTED: {
    message: "Can't join game that already started",
  },
  GAME_NOT_FOUND: {
    message: "Could not find game with {prop} {value}",
  },
  TEAM_NOT_FOUND: {
    message: "Could not find team with {prop} {value}",
  },
  UNEXPECTED: {
    message: "An unexpected error occured",
  },
  USER_ALREADY_EXISTS: {
    message: "User with email {email} already exists.",
  },
  USER_ALREADY_JOINED_GAME: {
    message: "User {userId} already joined game {gameId}",
  },
  USER_DOES_NOT_EXIST: {
    message: "User with email {email} does not exist.",
  },
  USER_NOT_AUTHENTICATED: {
    message: "User is not authenticated.",
  },
  USER_NOT_AUTHORIZED: {
    message: "User {userId} does not have access to resource {resource}.",
  },
} as const;

interface ErrorInterpolations {
  GAME_ALREADY_STARTED: undefined;
  GAME_NOT_FOUND: { prop: string; value: any };
  TEAM_NOT_FOUND: { prop: string; value: any };
  UNEXPECTED: undefined;
  USER_ALREADY_EXISTS: { email: string };
  USER_ALREADY_JOINED_GAME: { userId: number; gameId: number };
  USER_DOES_NOT_EXIST: { email: string };
  USER_NOT_AUTHENTICATED: undefined;
  USER_NOT_AUTHORIZED: { userId: number; ressource: string };
}

class BusinessError extends Error {
  public readonly code: ErrorCode = "UNEXPECTED";

  constructor(errorCodeOrMessage: ErrorCode | string, interpolations?: any) {
    const errorMessage = getErrorMessage(errorCodeOrMessage, interpolations);

    super(errorMessage);

    this.name = this.constructor.name;
    this.code = isErrorCode(errorCodeOrMessage)
      ? errorCodeOrMessage
      : "UNEXPECTED";
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
