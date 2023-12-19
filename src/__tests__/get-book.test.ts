import getBook from "../get-book";
import { promises, readFileSync } from "fs";
import book from "./fixture.json";
import isbn from "node-isbn";
import * as core from "@actions/core";

const books = readFileSync("./_data/read.json", "utf-8");
const dateFinished = "2020-09-12";

jest.mock("@actions/core");

const defaultOptions = {
  filename: "_data/read.yml",
  "required-metadata": "title,pageCount,authors,description",
  "time-zone": "America/New_York",
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
    expect(
  await getBook({
    dates: {
      dateAdded: undefined,
      dateStarted: undefined,
      dateFinished
    },
    bookIsbn: "9780525658184",
    providers: ["google"],
    bookStatus: "finished",
    fileName: "_data/read.yml"
  })
).toMatchInlineSnapshot(`
{
  "authors": [
    "Yaa Gyasi",
  ],
  "categories": [
    "Fiction",
  ],
  "description": "A novel about faith, science, religion, and family that tells the deeply moving portrait of a family of Ghanaian immigrants ravaged by depression and addiction and grief, narrated by a fifth year candidate in neuroscience at Stanford school of medicine studying the neural circuits of reward seeking behavior in mice…",
  "isbn": "9780525658184",
  "language": "en",
  "link": "https://books.google.com/books/about/Transcendent_Kingdom.html?hl=&id=ty19yQEACAAJ",
  "pageCount": 288,
  "printType": "BOOK",
  "publishedDate": "2020",
  "status": "finished",
  "thumbnail": "https://books.google.com/books/content?id=ty19yQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
  "title": "Transcendent Kingdom",
}
`);
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
