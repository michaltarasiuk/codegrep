import * as errore from "errore";

export class UnauthorizedError extends errore.createTaggedError({
  name: "UnauthorizedError",
  message: "Unauthorized",
}) {}

export class NotFoundError extends errore.createTaggedError({
  name: "NotFoundError",
  message: "$resource $id not found",
}) {}

export class CreateFailedError extends errore.createTaggedError({
  name: "CreateFailedError",
  message: "Failed to create $resource",
}) {}

export class NoUserMessageError extends errore.createTaggedError({
  name: "NoUserMessageError",
  message: "No user message found",
}) {}
