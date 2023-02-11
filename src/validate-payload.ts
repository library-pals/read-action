import { setFailed } from "@actions/core";
import { isDate } from "./utils";
import { BookPayload } from "./index";

export function validatePayload(payload: BookPayload): void {
  if (!payload || !payload["isbn"]) {
    setFailed("Missing `isbn` in payload");
  }

  if (payload["date-finished"] && !isDate(payload["date-finished"])) {
    setFailed(
      `Invalid \`date-finished\` in payload: ${payload["date-finished"]}`
    );
  }

  if (payload["date-started"] && !isDate(payload["date-started"])) {
    setFailed(
      `Invalid \`date-started\` in payload: ${payload["date-started"]}`
    );
  }
}
