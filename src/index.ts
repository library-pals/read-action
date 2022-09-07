import { getInput, setFailed } from "@actions/core";
import * as github from "@actions/github";
import isbn from "node-isbn";
import { CleanBook } from "./clean-book";
import returnWriteFile from "./write-file";
import getBook, { BookOptions } from "./get-book";
import { isDate } from "./utils";

export async function read() {
  try {
    const payload = github.context.payload.client_payload as BookOptions;
    if (!payload) return setFailed("Missing `client_payload`");
    if (!payload.bookIsbn) return setFailed("Missing `bookIsbn` in payload");
    const { bookIsbn, dateFinished, notes } = payload;
    if (dateFinished && !isDate(dateFinished))
      return setFailed("Invalid `dateFinished` in payload");
    const fileName: string = getInput("readFileName");
    const providers = getInput("providers")
      ? getInput("providers").split(",")
      : isbn._providers;
    const bookMetadata = (await getBook(
      { notes, bookIsbn, dateFinished, providers },
      fileName
    )) as CleanBook[];
    await returnWriteFile(fileName, bookMetadata);
  } catch (error) {
    setFailed(error.message);
  }
}

export default read();
