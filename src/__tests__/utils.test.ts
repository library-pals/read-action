import { promises, readFileSync } from "fs";
import { removeWrappedQuotes, isIsbn, toYaml, sortByDate } from "../utils";

import book from "./fixture.json";
import addBook from "../add-book";

const books = readFileSync("./_data/read.yml", "utf-8");

jest.mock("@actions/core");

const dateFinished = "2020-09-12";

it("toYaml", async () => {
  jest.spyOn(promises, "readFile").mockResolvedValueOnce(books);
  expect(
    toYaml(
      await addBook(
        {
          dateFinished,
          notes: "Amazing!",
          bookIsbn: "0525658181",
          providers: [],
        },
        book,
        "_data/read.yml"
      )
    )
  ).toMatchSnapshot();
});

it("removeWrappedQuotes", () => {
  expect(removeWrappedQuotes("hello")).toBe("hello");
  expect(removeWrappedQuotes('"hello"')).toBe("hello");
  expect(removeWrappedQuotes('this says "hello".')).toBe('this says "hello".');
  expect(removeWrappedQuotes('"this part will get cut off"--')).toBe(
    "this part will get cut off…"
  );
});

it("isIsbn", () => {
  expect(isIsbn("1234567890")).toEqual(true);
  expect(isIsbn("1234567890123")).toEqual(true);
  expect(isIsbn("123456789012")).toEqual(false);
  expect(isIsbn("12345678901234")).toEqual(false);
  expect(isIsbn("1")).toEqual(false);
});

it("sortByDate", () => {
  expect(
    sortByDate([
      { dateFinished: "2020-01-01" },
      { dateFinished: "1900-01-01" },
      { dateFinished: "2020-11-01" },
    ])
  ).toEqual([
    { dateFinished: "1900-01-01" },
    { dateFinished: "2020-01-01" },
    { dateFinished: "2020-11-01" },
  ]);
});
