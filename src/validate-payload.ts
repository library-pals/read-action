import { setFailed } from "@actions/core";
import { isDate, isIsbn } from "./utils";
import { BookPayload } from "./index";
import { BookStatus } from "./clean-book";

export function validatePayload(payload: BookPayload): void {
  if (!payload || !payload["identifier"]) {
    setFailed("Missing `identifier` in payload");
  }

  if (
    !(
      payload["identifier"].startsWith("https://share.libbyapp.com/") ||
      payload["identifier"].startsWith("https://libro.fm/") ||
      isIsbn(payload["identifier"])
    )
  ) {
    setFailed(
      `Invalid \`identifier\` in payload: ${payload["identifier"]}. Must be an ISBN or start with "https://share.libbyapp.com/"`
    );
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
