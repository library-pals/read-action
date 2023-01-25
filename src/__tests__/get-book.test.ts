import getBook from "../get-book";
import { exportVariable } from "@actions/core";
import { promises, readFileSync } from "fs";
import book from "./fixture.json";
import isbn from "node-isbn";
import * as core from "@actions/core";

const books = readFileSync("./_data/read.json", "utf-8");
const dateFinished = "2020-09-12";

jest.mock("@actions/core");

const defaultOptions = {
  readFileName: "_data/read.yml",
  requiredMetadata: "title,pageCount,authors,description",
  timeZone: "America/New_York",
};

describe("getBook", () => {
  beforeEach(() => {
    jest
      .spyOn(core, "getInput")
      .mockImplementation((v) => defaultOptions[v] || undefined);
  });

  test("works", async () => {
    jest.spyOn(isbn, "resolve").mockResolvedValueOnce(book);
    jest.spyOn(promises, "readFile").mockResolvedValueOnce(books);
    await getBook({
      dates: {
        dateAdded: undefined,
        dateStarted: undefined,
        dateFinished,
      },
      bookIsbn: "9780525658184",
      providers: ["google"],
      bookStatus: "finished",
      fileName: "_data/read.yml",
    });
    expect(exportVariable.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "BookTitle",
          "Transcendent Kingdom",
        ],
        [
          "BookThumbOutput",
          "book-9780525658184.png",
        ],
        [
          "BookThumb",
          "https://books.google.com/books/content?id=ty19yQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
        ],
      ]
    `);
    jest.spyOn(promises, "readFile").mockResolvedValueOnce(books);
    expect(
      await getBook({
        dates: {
          dateAdded: undefined,
          dateStarted: undefined,
          dateFinished,
        },
        bookIsbn: "9780525658184",
        providers: ["google"],
        bookStatus: "finished",
        fileName: "_data/read.yml",
      })
    ).toMatchSnapshot();
  });
  test("fails", async () => {
    jest
      .spyOn(isbn, "resolve")
      .mockRejectedValue(new Error("Request failed with status code 401"));
    await expect(
      getBook({
        dates: {
          dateAdded: undefined,
          dateStarted: undefined,
          dateFinished,
        },
        bookIsbn: "9780525658184",
        providers: ["google"],
        bookStatus: "finished",
        fileName: "_data/read.json",
      })
    ).rejects.toMatchInlineSnapshot(
      `[Error: Book (9780525658184) not found. Request failed with status code 401]`
    );
  });
});
