export class UnauthorizedError extends Error {
  readonly _tag = "UnauthorizedError";

  constructor() {
    super("Unauthorized");
  }
}

export class NotFoundError extends Error {
  readonly _tag = "NotFoundError";
  readonly resource: string;
  readonly resourceId: string;

  constructor({ resource, id }: { resource: string; id: string }) {
    super(`${resource} ${id} not found`);
    this.resource = resource;
    this.resourceId = id;
  }
}

export class CreateFailedError extends Error {
  readonly _tag = "CreateFailedError";
  readonly resource: string;

  constructor({ resource }: { resource: string }) {
    super(`Failed to create ${resource}`);
    this.resource = resource;
  }
}
