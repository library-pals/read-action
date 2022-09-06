import { getInput, setFailed, info } from "@actions/core";
import * as github from "@actions/github";
import isbn from "node-isbn";
import { CleanBook } from "./clean-book";
import returnWriteFile from "./write-file";
import getBook, { BookOptions } from "./get-book";

async function read() {
  try {
    const { dateFinished, bookIsbn, notes } = github.context.payload
      .client_payload as BookOptions;
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
