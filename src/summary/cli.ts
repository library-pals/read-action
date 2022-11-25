#!/usr/bin/env node
import { readFileSync } from "fs";
import meow from "meow";
import yearReview, { yearReviewSummary } from "./index.js";

const cli = meow(
  `
	Usage
	  $ read-action-summary

	Options
	  --year, -y  Year
    --readFile, -r Path to library file

	Examples
	  $ read-action-summary -y 2022 -r _data/read.json
`,
  {
    importMeta: import.meta,
    flags: {
      year: {
        type: "string",
        alias: "y",
      },
      readFile: {
        type: "string",
        default: "_data/read.json",
        alias: "r",
      },
    },
  }
);

const books = JSON.parse(readFileSync(cli.flags.readFile, "utf-8"));

const reviewObj = yearReview(books, cli.flags.year || "2022");

console.log(yearReviewSummary(reviewObj));
