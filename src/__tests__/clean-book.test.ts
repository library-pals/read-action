import cleanBook from "../clean-book";
import book from "./fixture.json";

const date = "2020-09-12";

describe("cleanBook", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("cleanBook", () =>
    expect(
      cleanBook(
        {
          date,
          notes: "I loved it!",
          bookIsbn: "0525658181",
          providers: [],
        },
        book
      )
    ).toMatchSnapshot());

  jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));

  it("cleanBook, no date", () =>
    expect(
      cleanBook(
        {
          notes: "I loved it!",
          bookIsbn: "0525658181",
          providers: [],
        },
        book
      )
    ).toMatchSnapshot());
});
