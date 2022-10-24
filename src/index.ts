import { exportVariable, getInput, setFailed } from "@actions/core";
import * as github from "@actions/github";
import isbn from "node-isbn";
import returnWriteFile from "./write-file";
import getBook from "./get-book";
import { isDate } from "./utils";
import { checkOutBook } from "./checkout-book";
import { BookStatus } from "./clean-book";

export type Dates = {
  dateAdded: string | undefined;
  dateStarted: string | undefined;
  dateFinished: string | undefined;
};

export type BookPayload = {
  dateStarted: string | undefined;
  dateFinished: string | undefined;
  notes?: string;
  bookIsbn: string;
  rating?: string;
  tags?: string;
};

export type ActionInputs = {
  readFileName: string;
  providers: string[];
  rating?: string;
  timeZone: string;
};

export type BookParams = {
  fileName: string;
  bookIsbn: BookPayload["bookIsbn"];
  dates: Dates;
  notes?: BookPayload["notes"];
  bookStatus: BookStatus;
  providers?: ActionInputs["providers"];
  rating?: ActionInputs["rating"];
  tags?: string[];
};

export async function read() {
  try {
    // Get book payload
    const payload = github.context.payload.inputs as BookPayload;
    // Validate payload
    validatePayload(payload);
    const { bookIsbn, dateFinished, dateStarted, notes, rating, tags } =
      payload;
    // Set inputs
    const fileName: ActionInputs["readFileName"] = getInput("readFileName");
    const providers: ActionInputs["providers"] = getInput("providers")
      ? getInput("providers").split(",")
      : isbn._providers;

    const bookStatus = getBookStatus(dateStarted, dateFinished);
    exportVariable("BookStatus", bookStatus);
    const dates = getDates(bookStatus, dateStarted, dateFinished);
    const bookParams: BookParams = {
      fileName,
      bookIsbn,
      dates,
      notes,
      bookStatus,
      rating,
      providers,
      ...(tags && { tags: tags.split(",") }),
    };

    // Check if book already exists in library
    const bookExists = await checkOutBook(bookParams);
    const library =
      bookExists == false ? await getBook(bookParams) : bookExists;

    await returnWriteFile(fileName, library);
  } catch (error) {
    setFailed(error.message);
  }
}

export default read();

function localDate() {
  // "fr-ca" will result YYYY-MM-DD formatting
  const dateFormat = new Intl.DateTimeFormat("fr-ca", {
    dateStyle: "short",
    timeZone: getInput("timeZone"),
  });
  return dateFormat.format(new Date());
}

function getBookStatus(
  dateStarted: Dates["dateStarted"],
  dateFinished: Dates["dateFinished"]
): BookStatus {
  // Set book status
  if (dateStarted && !dateFinished) return "started";
  if (dateFinished) return "finished";
  return "want to read";
}

function getDates(
  bookStatus: BookStatus,
  dateStarted: Dates["dateStarted"],
  dateFinished: Dates["dateFinished"]
): {
  dateAdded: string | undefined;
  dateStarted: string | undefined;
  dateFinished: string | undefined;
} {
  return {
    dateAdded: bookStatus === "want to read" ? localDate() : undefined,
    dateStarted: dateStarted || undefined,
    dateFinished: dateFinished || undefined,
  };
}

function validatePayload(payload: BookPayload): void {
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
