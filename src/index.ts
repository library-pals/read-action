"use strict";

import { getInput, exportVariable, setFailed } from "@actions/core";
import * as github from "@actions/github";
import isbn from "node-isbn";
import { titleParser, getBook, writeFile } from "./utils.js";

async function read() {
  try {
    if (!github.context.payload.issue) {
      throw new Error("Cannot find GitHub issue");
    }
    const { title, number, body } = github.context.payload.issue;
    const { bookIsbn, date } = titleParser(title);
    const fileName = getInput("readFileName");
    const providers = getInput("providers")
      ? getInput("providers").split(",")
      : isbn._providers;
    exportVariable("IssueNumber", number);
    const bookMetadata = await getBook(
      { date, body, bookIsbn, providers },
      fileName
    );
    await writeFile(fileName, bookMetadata);
  } catch (error) {
    setFailed(error.message);
  }
}

export default read();
