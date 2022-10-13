import cleanBook from "../clean-book";
import book from "./fixture.json";

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
        },
        book
      )
    ).toMatchSnapshot());
});
