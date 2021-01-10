const {
  cleanBook,
  addBook,
  removeWrappedQuotes,
  titleParser,
  isIsbn,
  isDate,
  toYaml,
  sortByDate,
} = require("../src/utils");
const book = require("./fixture.json");

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

it("addBook", async () =>
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
  ).toMatchSnapshot());

it("toYaml", async () =>
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
  ).toMatchSnapshot());

it("removeWrappedQuotes", () => {
  expect(removeWrappedQuotes("hello")).toBe("hello");
  expect(removeWrappedQuotes('"hello"')).toBe("hello");
  expect(removeWrappedQuotes('this says "hello".')).toBe('this says "hello".');
  expect(removeWrappedQuotes('"this part will get cut off"--')).toBe(
    "this part will get cut off…"
  );
});

it("titleParser", () => {
  const today = new Date().toISOString().slice(0, 10);
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
