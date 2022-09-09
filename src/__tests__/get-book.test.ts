import getBook from "../get-book";
import { exportVariable } from "@actions/core";
import { promises, readFileSync } from "fs";
import book from "./fixture.json";
import isbn from "node-isbn";

const books = readFileSync("./_data/read.json", "utf-8");
const dateFinished = "2020-09-12";

jest.mock("@actions/core");

describe("getBook", () => {
  test("works", async () => {
    jest.spyOn(isbn, "resolve").mockResolvedValueOnce(book);
    jest.spyOn(promises, "readFile").mockResolvedValueOnce(books);
    await getBook(
      { dateFinished, bookIsbn: "9780525658184", providers: ["google"] },
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
        { dateFinished, bookIsbn: "9780525658184", providers: ["google"] },
        "_data/read.yml"
      )
    ).toMatchSnapshot();
  });
  test("fails", async () => {
    jest.spyOn(isbn, "resolve").mockRejectedValue({ message: "Error!" });
    await expect(
      getBook(
        { dateFinished, bookIsbn: "9780525658184", providers: ["google"] },
        "_data/read.json"
      )
    ).rejects.toMatchInlineSnapshot(`[Error: Error!]`);
  });
});
