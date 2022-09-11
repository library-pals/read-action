import { getInput, setFailed } from "@actions/core";
import * as github from "@actions/github";
import isbn from "node-isbn";
import returnWriteFile from "./write-file";
import getBook, { BookOptions } from "./get-book";
import { isDate } from "./utils";
import { finishedBook } from "./finished-book";

export async function read() {
  try {
    // Get client_payload
    const payload = github.context.payload.client_payload as BookOptions;
    // Validate client_payload
    if (!payload) return setFailed("Missing `client_payload`");
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

    // Check if book already exists in library
    const bookExists = await finishedBook({
      fileName,
      bookIsbn,
      dateFinished,
      notes,
    });

    const library =
      bookExists == false
        ? await getBook(
            { notes, bookIsbn, dateStarted, dateFinished, providers },
            fileName
          )
        : bookExists;

    await returnWriteFile(fileName, library);
  } catch (error) {
    setFailed(error.message);
  }
}

export default read();
