import { exportVariable, getInput, setFailed } from "@actions/core";
import * as github from "@actions/github";
import isbn from "node-isbn";
import returnWriteFile from "./write-file";
import getBook, { BookOptions } from "./get-book";
import { isDate } from "./utils";
import { finishedBook } from "./finished-book";

export async function read() {
  try {
    // Get inputs
    const payload = github.context.payload.inputs as BookOptions;
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

    // Set book status
    if (dateStarted && !dateFinished) exportVariable("BookStatus", "started");
    if ((!dateFinished && !dateStarted) || dateFinished)
      exportVariable("BookStatus", "finished");

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
