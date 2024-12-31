import { setFailed, info } from "@actions/core";
import { isDate, isIsbn } from "./utils";
import { BookPayload } from "./index";
import { BookStatus } from "./new-book";

const validPrefixes = [
  "https://share.libbyapp.com/",
  "https://libro.fm/",
  "https://books.apple.com/",
];

export function validatePayload(payload: BookPayload): void {
  if (!payload) {
    setFailed("Missing payload");
    return;
  }

  info(`Validating payload: ${JSON.stringify(payload, null, 2)}`);

  if (payload["book-status"] === "summary") {
    return;
  }

  if (!payload["identifier"]) {
    setFailed("Missing `identifier` in payload");
  }

  const { identifier } = payload;

  if (
    !validPrefixes.some((prefix) => identifier.startsWith(prefix)) &&
    !isIsbn(identifier)
  ) {
    setFailed(
      `Invalid \`identifier\` in payload: ${identifier}. Must be an ISBN or start with one of the following: ${validPrefixes.join(", ")}`
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
