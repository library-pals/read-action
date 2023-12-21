import { setFailed } from "@actions/core";
import { isDate } from "./utils";
import { BookPayload } from "./index";
import { BookStatus } from "./clean-book";

export function validatePayload(payload: BookPayload): void {
  if (!payload || !payload["isbn"]) {
    setFailed("Missing `isbn` in payload");
  }

  if (payload["date"] && !isDate(payload["date"])) {
    setFailed(`Invalid \`date\` in payload: ${payload["date"]}`);
  }

  if (!payload["book-status"] || !isBookStatus(payload["book-status"])) {
    setFailed(
      `Invalid \`book-status\` in payload: "${payload["book-status"]}". Choose from: "want to read", "started", "finished", "abandoned"`
    );
  }
}

function isBookStatus(status: string): status is BookStatus {
  return ["want to read", "started", "finished", "abandoned"].includes(status);
}
