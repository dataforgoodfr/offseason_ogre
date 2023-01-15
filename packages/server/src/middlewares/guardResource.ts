import { Role, RoleName, User } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import invariant from "tiny-invariant";
import { getUserRequesting } from "../lib/express";
import { logger } from "../logger";

export { guardResource };

/**
 * If multiple options are specified, they are treated as a logical OR.
 */
type GuardOptions = {
  /**
   * User can access resource if their role is listed.
   *
   * Role `"*"` means `any role`.
   */
  roles?: (RoleName | "*")[];
  /**
   * User can access resource if they own the resource.
   */
  ownership?: {
    /**
     * Verify ownership from request data.
     */
    fromRequest: {
      source: "body" | "params";
      path: string;
    };
  };
};

type GuardCheck = (
  options: GuardOptions,
  user: User & { role: Role },
  request: Request
) => GuardCheckResult;

type GuardCheckResult = {
  success: boolean;
};

const checkRole: GuardCheck = (
  { roles = ["*"] }: GuardOptions,
  user: User & { role: Role }
): GuardCheckResult => {
  if (roles.includes("*")) {
    return {
      success: true,
    };
  }

  if (!roles.includes(user?.role?.name)) {
    return {
      success: false,
    };
  }

  return {
    success: true,
  };
};

const checkOwnership: GuardCheck = (
  { ownership }: GuardOptions,
  user: User & { role: Role },
  request: Request
): GuardCheckResult => {
  if (!ownership) {
    return {
      success: true,
    };
  }

  try {
    const ownerId = parseInt(
      get(
        request,
        `${ownership.fromRequest.source}.${ownership.fromRequest.path}`
      ),
      10
    );
    return {
      success: user.id === ownerId,
    };
  } catch (err) {
    logger.error(err);
    return {
      success: false,
    };
  }
};

const CHECKS: GuardCheck[] = [checkRole, checkOwnership];

function guardResource(options: GuardOptions) {
  return (request: Request, response: Response, next: NextFunction) => {
    const user = getUserRequesting(response);

    invariant(
      user,
      `User can't access resource because they are not authenticated`
    );

    const accessGranted = CHECKS.map(
      (check) => check(options, user, request).success
    ).some(Boolean);

    if (!accessGranted) {
      throw new Error(
        `User ${
          user.id
        } does not have access to resource ${formatRequestedResource(request)}`
      );
    }

    next();
  };
}

function formatRequestedResource(request: Request) {
  return `${request.method} ${request.originalUrl}`;
}
