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
          dateFinished,
          notes: "I loved it!",
          bookIsbn: "0525658181",
          providers: [],
        },
        book
      )
    ).toMatchSnapshot());

  it("cleanBook, no date", () =>
    expect(
      cleanBook(
        {
          dateFinished: undefined,
          notes: "I loved it!",
          bookIsbn: "0525658181",
          providers: [],
        },
        book
      )
    ).toMatchSnapshot());
});
