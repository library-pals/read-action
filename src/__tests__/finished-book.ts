import { finishedBook } from "../finished-book";
import { promises } from "fs";

const mockReadFile = JSON.stringify([
  {
    isbn: "9780374719760",
    dateStarted: "2020-11-20",
    dateFinished: "2020-11-22",
    title: "Uncanny Valley",
  },
  {
    isbn: "9780525620792",
    dateStarted: "2021-09-26",
    title: "Mexican Gothic",
  },
]);

describe("finishedBook", () => {
  it("works", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValue(mockReadFile);
    return expect(
      finishedBook({
        fileName: "my-library.yml",
        bookIsbn: "9780525620792",
        dateFinished: "2022-02-02",
      })
    ).resolves.toMatchInlineSnapshot(`
              [
                {
                  "dateFinished": "2020-11-22",
                  "dateStarted": "2020-11-20",
                  "isbn": "9780374719760",
                  "title": "Uncanny Valley",
                },
                {
                  "dateFinished": "2022-02-02",
                  "dateStarted": "2021-09-26",
                  "isbn": "9780525620792",
                  "notes": undefined,
                  "title": "Mexican Gothic",
                },
              ]
            `);
  });

  it("does not find book", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValue(mockReadFile);
    return expect(
      finishedBook({
        fileName: "my-library.yml",
        bookIsbn: "12345",
        dateFinished: "2022-02-02",
      })
    ).resolves.toBe(false);
  });

  it("no library", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValue(`[]`);
    return expect(
      finishedBook({
        fileName: "my-library.yml",
        bookIsbn: "12345",
        dateFinished: "2022-02-02",
      })
    ).resolves.toBe(false);
  });
});
