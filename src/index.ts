"use strict";

import { getInput, exportVariable, setFailed } from "@actions/core";
import * as github from "@actions/github";
import isbn from "node-isbn";
import { CleanBook } from "./clean-book";
import returnWriteFile from "./write-file";
import getBook from "./get-book";
import titleParser from "./title-parser";

async function read() {
  try {
    if (!github.context.payload.issue) {
      throw new Error("Cannot find GitHub issue");
    }
    const { title, number, body } = github.context.payload.issue;
    exportVariable("IssueNumber", number);
    const { bookIsbn, date } = titleParser(title);
    if (!bookIsbn)
      throw new Error(`Cannot find book ISBN from given input" ${title}`);
    const fileName: string = getInput("readFileName");
    const providers = getInput("providers")
      ? getInput("providers").split(",")
      : isbn._providers;
    const bookMetadata = (await getBook(
      { date, body, bookIsbn, providers },
      fileName
    )) as CleanBook[];
    await returnWriteFile(fileName, bookMetadata);
  } catch (error) {
    setFailed(error.message);
  }
}

export default read();
