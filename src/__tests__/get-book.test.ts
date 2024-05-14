import getBook from "../get-book";
import { promises, readFileSync } from "fs";
import book from "./fixture.json";
import Isbn from "@library-pals/isbn";
import * as core from "@actions/core";

const books = readFileSync("./_data/read.json", "utf-8");
const dateFinished = "2020-09-12";

jest.mock("@actions/core");
jest.mock("@library-pals/isbn");

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
    // Mock the implementation of the resolve method
    (Isbn.prototype.resolve as jest.Mock).mockResolvedValue(book);

    jest.spyOn(promises, "readFile").mockResolvedValueOnce(books);
    expect(
      await getBook({
        dateType: {
          dateFinished,
        },
        bookIsbn: "9780525658184",
        providers: ["google"],
        bookStatus: "finished",
        filename: "_data/read.yml",
      })
    ).toMatchInlineSnapshot(`
      {
        "authors": [
          "Yaa Gyasi",
        ],
        "categories": [
          "Fiction",
        ],
        "dateFinished": "2020-09-12",
        "description": "A novel about faith, science, religion, and family that tells the deeply moving portrait of a family of Ghanaian immigrants ravaged by depression and addiction and grief, narrated by a fifth year candidate in neuroscience at Stanford school of medicine studying the neural circuits of reward seeking behavior in mice…",
        "isbn": "9780525658184",
        "link": "https://books.google.com/books/about/Transcendent_Kingdom.html?hl=&id=MvaNEAAAQBAJ",
        "pageCount": 288,
        "printType": "BOOK",
        "status": "finished",
        "thumbnail": "https://books.google.com/books/content?id=MvaNEAAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
        "title": "Transcendent Kingdom",
      }
    `);
  });
});
