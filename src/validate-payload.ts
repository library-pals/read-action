import { setFailed } from "@actions/core";
import { isDate } from "./utils";
import { BookPayload } from "./index";

export function validatePayload(payload: BookPayload): void {
  if (!payload) return setFailed("Missing `inputs`");
  if (!payload["isbn"]) return setFailed("Missing `bookIsbn` in payload");
  if (payload["date-finished"] && !isDate(payload["date-finished"]))
    return setFailed(
      `Invalid \`dateFinished\` in payload: ${payload["date-finished"]}`
    );
  if (payload["date-started"] && !isDate(payload["date-started"]))
    return setFailed(
      `Invalid \`dateStarted\` in payload: ${payload["date-started"]}`
    );
}
