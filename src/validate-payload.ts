import { setFailed } from "@actions/core";
import { isDate } from "./utils";
import { BookPayload } from "./index";

export function validatePayload(payload: BookPayload): void {
  if (!payload) return setFailed("Missing `inputs`");
  if (!payload.bookIsbn) return setFailed("Missing `bookIsbn` in payload");
  if (payload.dateFinished && !isDate(payload.dateFinished))
    return setFailed(
      `Invalid \`dateFinished\` in payload: ${payload.dateFinished}`
    );
  if (payload.dateStarted && !isDate(payload.dateStarted))
    return setFailed(
      `Invalid \`dateStarted\` in payload: ${payload.dateStarted}`
    );
}
