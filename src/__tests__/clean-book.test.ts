import cleanBook from "../clean-book";
import book from "./fixture.json";
import * as core from "@actions/core";

const dateFinished = "2020-09-12";

describe("cleanBook", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("cleanBook", () =>
    expect(
      cleanBook(
        {
          dates: {
            dateAdded: undefined,
            dateStarted: undefined,
            dateFinished,
          },
          notes: "I loved it!",
          bookIsbn: "0525658181",
          providers: [],
          bookStatus: "finished",
          fileName: "_data/read.yml",
        },
        book
      )
    ).toMatchSnapshot());

  it("cleanBook with rating", () =>
    expect(
      cleanBook(
        {
          dates: {
            dateAdded: undefined,
            dateStarted: undefined,
            dateFinished,
          },
          notes: "I loved it!",
          bookIsbn: "0525658181",
          providers: [],
          bookStatus: "finished",
          rating: "⭐️⭐️⭐️⭐️⭐️",
        },
        book
      )
    ).toMatchSnapshot());

  it("cleanBook, no date", () =>
    expect(
      cleanBook(
        {
          dates: {
            dateAdded: undefined,
            dateStarted: undefined,
            dateFinished: undefined,
          },
          notes: "I loved it!",
          bookIsbn: "0525658181",
          providers: [],
          bookStatus: "finished",
          fileName: "_data/read.yml",
        },
        book
      )
    ).toMatchSnapshot());

  it("cleanBook, missing `authors`", () => {
    const exportVariableSpy = jest.spyOn(core, "exportVariable");
    const warningSpy = jest.spyOn(core, "warning");
    cleanBook(
      {
        dates: {
          dateAdded: undefined,
          dateStarted: "2022-01-01",
          dateFinished: undefined,
        },
        bookIsbn: "1234597890",
        providers: [],
        bookStatus: "started",
        fileName: "_data/read.yml",
      },
      {
        title: "Book Title",
        publishedDate: "2013",
        industryIdentifiers: [],
        pageCount: 584,
        printType: "BOOK",
        categories: [],
        imageLinks: {},
        previewLink: "https://openlibrary.org/books/BookTitle",
        infoLink: "https://openlibrary.org/books/BookTitle",
        publisher: "Publisher Name",
        language: "en",
      }
    );
    expect(warningSpy.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Book does not have authors, description",
      ]
    `);
    expect(exportVariableSpy.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "BookNeedsReview",
          true,
        ],
        [
          "BookMissingMetadata",
          "authors, description",
        ],
        [
          "BookIsbn",
          "1234597890",
        ],
      ]
    `);
  });

  it("cleanBook, missing `description`", () => {
    const warningSpy = jest.spyOn(core, "warning");
    const exportVariableSpy = jest.spyOn(core, "exportVariable");
    cleanBook(
      {
        dates: {
          dateAdded: undefined,
          dateStarted: "2022-01-01",
          dateFinished: undefined,
        },
        bookIsbn: "1234597890",
        providers: [],
        bookStatus: "started",
        fileName: "_data/read.yml",
      },
      {
        title: "Book Title",
        authors: ["Author Name"],
        publishedDate: "2013",
        industryIdentifiers: [],
        pageCount: 584,
        printType: "BOOK",
        categories: [],
        imageLinks: {},
        previewLink: "https://openlibrary.org/books/BookTitle",
        infoLink: "https://openlibrary.org/books/BookTitle",
        publisher: "Publisher Name",
        language: "en",
      }
    );
    expect(warningSpy.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Book does not have description",
      ]
    `);
    expect(exportVariableSpy.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "BookNeedsReview",
          true,
        ],
        [
          "BookMissingMetadata",
          "description",
        ],
        [
          "BookIsbn",
          "1234597890",
        ],
      ]
    `);
  });

  it("cleanBook, missing authors, pageCount, description", () => {
    const warningSpy = jest.spyOn(core, "warning");
    const exportVariableSpy = jest.spyOn(core, "exportVariable");
    cleanBook(
      {
        dates: {
          dateAdded: undefined,
          dateStarted: "2022-01-01",
          dateFinished: undefined,
        },
        bookIsbn: "1234597890",
        providers: [],
        bookStatus: "started",
        fileName: "_data/read.yml",
      },
      {
        title: "Book Title",
        publishedDate: "2013",
        industryIdentifiers: [],
        pageCount: 0,
        printType: "BOOK",
        categories: [],
        imageLinks: {},
        previewLink: "https://openlibrary.org/books/BookTitle",
        infoLink: "https://openlibrary.org/books/BookTitle",
        publisher: "Publisher Name",
        language: "en",
      }
    );
    expect(warningSpy.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Book does not have pageCount, authors, description",
      ]
    `);
    expect(exportVariableSpy.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "BookNeedsReview",
          true,
        ],
        [
          "BookMissingMetadata",
          "pageCount, authors, description",
        ],
        [
          "BookIsbn",
          "1234597890",
        ],
      ]
    `);
  });
});
