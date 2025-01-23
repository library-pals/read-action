import { isDate, isIsbn } from "./utils.js";
import { BookPayload } from "./index.js";
import { BookStatus } from "./new-book.js";

const validPrefixes = [
  "https://share.libbyapp.com/",
  "https://libro.fm/",
  "https://books.apple.com/",
];

export function validatePayload(payload: BookPayload): {
  success: boolean;
  message: string;
} {
  if (!payload) {
    return { success: false, message: "Missing payload" };
  }

  if (payload["book-status"] === "summary") {
    return { success: true, message: "Valid payload" };
  }

  if (!payload["identifier"]) {
    return { success: false, message: "Missing `identifier` in payload" };
  }

  const { identifier } = payload;

  if (
    !validPrefixes.some((prefix) => identifier.startsWith(prefix)) &&
    !isIsbn(identifier)
  ) {
    return {
      success: false,
      message: `Invalid \`identifier\` in payload: ${identifier}. Must be an ISBN or start with one of the following: ${validPrefixes.join(", ")}`,
    };
  }

  if (payload["date"] && !isDate(payload["date"])) {
    return {
      success: false,
      message: `Invalid \`date\` in payload: ${payload["date"]}`,
    };
  }

  if (!payload["book-status"] || !isBookStatus(payload["book-status"])) {
    return {
      success: false,
      message: `Invalid \`book-status\` in payload: "${payload["book-status"]}". Choose from: "want to read", "started", "finished", "abandoned"`,
    };
  }

  // Make sure duration is in HH:MM format
  if (payload["duration"] && !/^\d{1,2}:\d{2}$/.test(payload["duration"])) {
    return {
      success: false,
      message: `Invalid \`duration\` in payload: ${payload["duration"]}. Must be in HH:MM format, example: "08:30" is 8 hours and 30 minutes`,
    };
  }

  return { success: true, message: "Valid payload" };
}

function isBookStatus(status: string): status is BookStatus {
  return ["want to read", "started", "finished", "abandoned"].includes(status);
}
