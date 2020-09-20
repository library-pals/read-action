"use strict";

const core = require("@actions/core");
const github = require("@actions/github");
const isbn = require("node-isbn");
const { titleParser, getBook, writeFile } = require("./utils");

async function read() {
  try {
    const { title, number, body } = github.context.payload.issue;
    const { bookIsbn, date } = titleParser(title);
    const fileName = core.getInput("readFileName") || "_data/read.yml";
    const providers = core.getInput("providers")
      ? core.getInput("providers").split(",")
      : isbn._providers;
    console.log("providers", providers);
    core.exportVariable("IssueNumber", number);
    const bookMetadata = await getBook(
      { date, body, bookIsbn, providers },
      fileName
    );
    await writeFile(fileName, bookMetadata);
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = read();
