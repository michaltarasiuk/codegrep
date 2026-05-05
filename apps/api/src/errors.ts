import * as errore from "errore";

export class UnauthorizedError extends errore.createTaggedError({
  name: "UnauthorizedError",
  message: "Unauthorized",
}) {}

export class NotFoundError extends errore.createTaggedError({
  name: "NotFoundError",
  message: "$resource $id not found",
}) {}

export class UpsertFailedError extends errore.createTaggedError({
  name: "UpsertFailedError",
  message: "Failed to upsert $resource",
}) {}

export class GithubUpstreamError extends errore.createTaggedError({
  name: "GithubUpstreamError",
  message: "GitHub API request failed",
}) {}
