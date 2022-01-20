import cleanBook from "../clean-book";
import book from "./fixture.json";

const date = "2020-09-12";

it("cleanBook", () =>
  expect(
    cleanBook(
      {
        date,
        body: "I loved it!",
        bookIsbn: "0525658181",
        providers: [],
      },

      book
    )
  ).toMatchSnapshot());
