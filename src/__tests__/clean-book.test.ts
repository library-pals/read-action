import cleanBook from "../clean-book";
import book from "./fixture.json";
import bookSomeMetadata from "./fixture-some-metadata.json";

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

  it("cleanBook, some metadata", () =>
    expect(
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
        bookSomeMetadata
      )
    ).toMatchSnapshot());
});
