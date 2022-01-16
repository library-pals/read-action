import { setFailed, exportVariable } from "@actions/core";
import { promises, readFileSync } from "fs";
import {
  cleanBook,
  addBook,
  removeWrappedQuotes,
  titleParser,
  isIsbn,
  isDate,
  toYaml,
  sortByDate,
  getBook,
  returnReadFile,
  returnWriteFile,
  toJson,
} from "../utils";
//import yaml from "js-yaml";
import book from "./fixture.json";
import isbn from "node-isbn";

const books = readFileSync("./_data/read.yml", "utf-8");

jest.mock("@actions/core");

const date = "2020-09-12";

it("cleanBook", () =>
  expect(
    cleanBook(
      {
        date,
        body: "I loved it!",
        bookIsbn: "0525658181",
      },

      book
    )
  ).toMatchSnapshot());

describe("addBook", () => {
  test("works", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValueOnce(books);
    expect(
      await addBook(
        {
          date,
          body: "Amazing!",
          bookIsbn: "0525658181",
        },

        book,
        "_data/read.yml"
      )
    ).toMatchSnapshot();
    expect(exportVariable).toHaveBeenNthCalledWith(
      1,
      "BookThumbOutput",
      "book-0525658181.png"
    );
    expect(exportVariable).toHaveBeenNthCalledWith(
      2,
      "BookThumb",
      "https://books.google.com/books/content?id=ty19yQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
    );
  });

  test("works, no images", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValueOnce(books);
    expect(
      await addBook(
        {
          date,
          body: "Amazing!",
          bookIsbn: "0525658181",
        },

        {
          ...book,
          imageLinks: {},
        },

        "_data/read.yml"
      )
    ).toMatchSnapshot();
    expect(exportVariable).not.toHaveBeenNthCalledWith(
      1,
      "BookThumbOutput",
      "book-0525658181.png"
    );
    expect(exportVariable).not.toHaveBeenNthCalledWith(
      2,
      "BookThumb",
      "https://books.google.com/books/content?id=ty19yQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
    );
  });

  test("works, empty file", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValueOnce("");
    expect(
      await addBook(
        {
          date,
          body: "Brilliant!",
          bookIsbn: "0525658181",
        },

        book,
        "_data/read.yml"
      )
    ).toMatchSnapshot();
  });
});

it("toYaml", async () => {
  jest.spyOn(promises, "readFile").mockResolvedValueOnce(books);
  expect(
    toYaml(
      await addBook(
        {
          date,
          body: "Amazing!",
          bookIsbn: "0525658181",
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

describe("titleParser", () => {
  const today = new Date().toISOString().slice(0, 10);
  test("works", () => {
    expect(titleParser("1234567890")).toEqual({
      bookIsbn: "1234567890",
      date: today,
    });
    expect(titleParser("1234567890 ")).toEqual({
      bookIsbn: "1234567890",
      date: today,
    });
    expect(titleParser("1234567890123")).toEqual({
      bookIsbn: "1234567890123",
      date: today,
    });
    expect(titleParser("1234567890 2020-01-12")).toEqual({
      bookIsbn: "1234567890",
      date: "2020-01-12",
    });
    expect(titleParser("1234567890123 2020-01-12")).toEqual({
      bookIsbn: "1234567890123",
      date: "2020-01-12",
    });
    expect(titleParser("1234567890123 abcde")).toEqual({
      bookIsbn: "1234567890123",
      date: today,
    });
  });
  test("fails", () => {
    expect(titleParser("12345678901234 abcde")).toEqual({
      bookIsbn: undefined,
      date: today,
    });
    expect(setFailed).toHaveBeenCalledWith(
      "ISBN is not valid: 12345678901234 abcde"
    );
  });
});

it("isDate", () => {
  expect(isDate("abcde")).toEqual(false);
  expect(isDate("2020-09-12")).toEqual(true);
  expect(isDate("2020")).toEqual(false);
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

describe("getBook", () => {
  test("works", async () => {
    jest.spyOn(isbn, "resolve").mockResolvedValueOnce(book);
    jest.spyOn(promises, "readFile").mockResolvedValueOnce(books);
    await getBook(
      { bookIsbn: "9780525658184", providers: ["google"] },
      "_data/read.yml"
    );
    expect(exportVariable).toHaveBeenNthCalledWith(
      1,
      "BookTitle",
      "Transcendent Kingdom"
    );
    expect(exportVariable).toHaveBeenNthCalledWith(
      2,
      "BookThumbOutput",
      "book-9780525658184.png"
    );
    expect(exportVariable).toHaveBeenNthCalledWith(
      3,
      "BookThumb",
      "https://books.google.com/books/content?id=ty19yQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
    );
    jest.spyOn(promises, "readFile").mockResolvedValueOnce(books);
    expect(
      await getBook(
        { bookIsbn: "9780525658184", providers: ["google"] },
        "_data/read.yml"
      )
    ).toMatchSnapshot();
  });
  test("fails", async () => {
    jest.spyOn(isbn, "resolve").mockRejectedValue({ message: "Error!" });
    await expect(
      getBook(
        { bookIsbn: "9780525658184", providers: ["google"] },
        "_data/read.yml"
      )
    ).rejects.toMatchInlineSnapshot(`[Error: Error!]`);
  });
});

describe("returnReadFile", () => {
  test("works", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValueOnce("Hello world");
    expect(await returnReadFile("myfile.yml")).toEqual("Hello world");
  });
  test("fails", async () => {
    jest.spyOn(promises, "readFile").mockRejectedValue("Error");
    await returnReadFile("myfile.yml");
    expect(setFailed).toHaveBeenCalledWith("Error");
  });
});

describe("returnWriteFile", () => {
  test("works", async () => {
    jest.spyOn(promises, "writeFile").mockResolvedValueOnce();
    await returnWriteFile("myfile.yml", books);
    expect(promises.writeFile).toHaveBeenCalled();
  });
  test("fails", async () => {
    jest.spyOn(promises, "writeFile").mockRejectedValue("Error");
    await returnWriteFile("myfile.yml");
    expect(setFailed).toHaveBeenCalledWith("Error");
  });
});

describe("toJson", () => {
  test("works", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValueOnce("- title: my title");
    expect(await toJson("myfile.yml")).toEqual([{ title: "my title" }]);
  });
  test("fails", async () => {
    jest
      .spyOn(promises, "readFile")
      .mockResolvedValueOnce("- title: my: title");
    await toJson("myfile.yml");
    expect(setFailed).toHaveBeenCalledWith(
      expect.stringContaining("bad indentation of a mapping entry")
    );
  });
});
