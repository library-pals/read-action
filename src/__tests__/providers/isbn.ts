import { getIsbn } from "../../providers/isbn";
import { promises, readFileSync } from "fs";
import book from "../fixture.json";
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

describe("getIsbn", () => {
  beforeEach(() => {
    jest
      .spyOn(core, "getInput")
      .mockImplementation((v) => defaultOptions[v] || undefined);
  });

  test("works", async () => {
    process.env.GOOGLE_BOOKS_API_KEY = "test-api-key";
    (Isbn.prototype.resolve as jest.Mock).mockResolvedValue(book);

    jest.spyOn(promises, "readFile").mockResolvedValueOnce(books);
    await getIsbn({
      dateType: {
        dateFinished,
      },
      inputIdentifier: "9780525658184",
      providers: ["google"],
      bookStatus: "finished",
      filename: "_data/read.yml",
      setImage: false,
    });
    expect(Isbn.prototype.resolve).toHaveBeenCalledWith("9780525658184", {
      params: { key: "test-api-key" },
    });
  });
  test("works without API key", async () => {
    delete process.env.GOOGLE_BOOKS_API_KEY;
    (Isbn.prototype.resolve as jest.Mock).mockResolvedValue(book);

    await getIsbn({
      dateType: { dateFinished },
      inputIdentifier: "9780525658184",
      providers: ["google"],
      bookStatus: "finished",
      filename: "_data/read.yml",
      setImage: false,
    });
    expect(Isbn.prototype.resolve).toHaveBeenCalledWith(
      "9780525658184",
      undefined
    );
  });
  test("works with API key but non-Google provider", async () => {
    process.env.GOOGLE_BOOKS_API_KEY = "test-api-key";
    (Isbn.prototype.resolve as jest.Mock).mockResolvedValue(book);

    await getIsbn({
      dateType: { dateFinished },
      inputIdentifier: "9780525658184",
      providers: ["openlibrary"],
      bookStatus: "finished",
      filename: "_data/read.yml",
      setImage: false,
    });
    expect(Isbn.prototype.resolve).toHaveBeenCalledWith(
      "9780525658184",
      undefined
    );
  });
  test("snapshot", async () => {
    process.env.GOOGLE_BOOKS_API_KEY = "test-api-key";
    (Isbn.prototype.resolve as jest.Mock).mockResolvedValue(book);

    expect(
      await getIsbn({
        dateType: {
          dateFinished,
        },
        inputIdentifier: "9780525658184",
        providers: ["google"],
        bookStatus: "finished",
        filename: "_data/read.yml",
        setImage: false,
      })
    ).toMatchInlineSnapshot(`
      {
        "authors": [
          "Yaa Gyasi",
        ],
        "categories": [
          "Fiction",
          "Fiction / Literary",
          "Fiction / Family Life / Siblings",
          "Fiction / African American & Black / General",
        ],
        "dateFinished": "2020-09-12",
        "description": "A novel about faith, science, religion, and family that tells the deeply moving portrait of a family of Ghanaian immigrants ravaged by depression and addiction and grief, narrated by a fifth year candidate in neuroscience at Stanford school of medicine studying the neural circuits of reward seeking behavior in mice…",
        "format": "book",
        "identifier": "9780525658184",
        "identifiers": {
          "isbn": "9780525658184",
        },
        "language": "en",
        "link": "https://books.google.com/books/about/Transcendent_Kingdom.html?hl=&id=CONSTANT_ID",
        "pageCount": 288,
        "publishedDate": "2020-09-01",
        "status": "finished",
        "thumbnail": "https://books.google.com/books/publisher/content?id=CONSTANT_ID&printsec=frontcover&img=1&zoom=1&source=gbs_api",
        "title": "Transcendent Kingdom",
      }
    `);
  });
  test("fails", async () => {
    (Isbn.prototype.resolve as jest.Mock).mockRejectedValue(
      new Error("Request failed with status")
    );
    await expect(
      getIsbn({
        dateType: {
          dateAdded: undefined,
          dateStarted: undefined,
          dateFinished,
        },
        inputIdentifier: "9780525658184",
        providers: ["google"],
        bookStatus: "finished",
        filename: "_data/read.json",
        setImage: false,
      })
    ).rejects.toMatchInlineSnapshot(
      `[Error: Book (9780525658184) not found. Request failed with status]`
    );
  });
});
