import { exportVariable, getInput, setFailed } from "@actions/core";
import * as github from "@actions/github";
import isbn from "node-isbn";
import returnWriteFile from "./write-file";
import getBook from "./get-book";
import { isDate } from "./utils";
import { finishedBook } from "./finished-book";

export type Dates = {
  dateAdded: string | undefined;
  dateStarted: string | undefined;
  dateFinished: string | undefined;
};

export type BookInputs = {
  dateStarted: string | undefined;
  dateFinished: string | undefined;
  notes?: string;
  bookIsbn: string;
  providers: string[];
};

export async function read() {
  try {
    // Get inputs
    const payload = github.context.payload.inputs as BookInputs;
    // Validate inputs
    if (!payload) return setFailed("Missing `inputs`");
    if (!payload.bookIsbn) return setFailed("Missing `bookIsbn` in payload");
    const { bookIsbn, dateFinished, dateStarted, notes } = payload;
    if (dateFinished && !isDate(dateFinished))
      return setFailed(`Invalid \`dateFinished\` in payload: ${dateFinished}`);
    if (dateStarted && !isDate(dateStarted))
      return setFailed(`Invalid \`dateStarted\` in payload: ${dateStarted}`);
    // Set inputs
    const fileName: string = getInput("readFileName");
    const providers = getInput("providers")
      ? getInput("providers").split(",")
      : isbn._providers;

    let bookStatus;

    // Set book status
    if (dateStarted && !dateFinished) bookStatus = "started";
    if (dateFinished) bookStatus = "finished";
    if (!dateFinished && !dateStarted) bookStatus = "want to read";

    const dates = {
      dateAdded:
        bookStatus === "want to read"
          ? new Date().toISOString().slice(0, 10)
          : undefined,
      dateStarted: dateStarted || undefined,
      dateFinished: dateFinished || undefined,
    };

    exportVariable("BookStatus", bookStatus);

    // Check if book already exists in library
    const bookExists = await finishedBook({
      fileName,
      bookIsbn,
      dates,
      notes,
      bookStatus,
    });

    const library =
      bookExists == false
        ? await getBook(
            {
              notes,
              bookIsbn,
              dates,
              providers,
              bookStatus,
            },
            fileName
          )
        : bookExists;

    await returnWriteFile(fileName, library);
  } catch (error) {
    setFailed(error.message);
  }
}

export default read();
