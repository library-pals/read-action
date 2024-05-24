import {
  formatDescription,
  isIsbn,
  sortByDate,
  isDate,
  getBookStatus,
} from "../utils";

jest.mock("@actions/core");
jest.useFakeTimers().setSystemTime(new Date("2023-12-01T12:00:00"));

it("removeWrappedQuotes", () => {
  expect(formatDescription("")).toBe("");
  expect(formatDescription("hello")).toBe("hello");
  expect(formatDescription('"hello"')).toBe("hello");
  expect(formatDescription('this says "hello".')).toBe('this says "hello".');
  expect(formatDescription('"this part will get cut off"--')).toBe(
    "this part will get cut off…"
  );
});

it("isIsbn", () => {
  expect(isIsbn("1234567890")).toEqual(true);
  expect(isIsbn("1234567890123")).toEqual(true);
  expect(isIsbn("123456789012")).toEqual(false);
  expect(isIsbn("12345678901234")).toEqual(false);
  expect(isIsbn("1")).toEqual(false);
});

it("isDate", () => {
  expect(isDate("abcde")).toEqual(false);
  expect(isDate("2020-09-12")).toEqual(true);
  expect(isDate("2020")).toEqual(false);
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

it("getBookStatus", () => {
  expect(
    getBookStatus({
      date: "2020-01-01",
      bookStatus: "abandoned",
    })
  ).toMatchInlineSnapshot(`
{
  "dateAbandoned": "2020-01-01",
}
`);
  expect(
    getBookStatus({
      date: "2020-01-01",
      bookStatus: "finished",
    })
  ).toMatchInlineSnapshot(`
{
  "dateFinished": "2020-01-01",
}
`);
  expect(
    getBookStatus({
      date: "2020-01-01",
      bookStatus: "started",
    })
  ).toMatchInlineSnapshot(`
{
  "dateStarted": "2020-01-01",
}
`);
  expect(
    getBookStatus({
      date: "2020-01-01",
      bookStatus: "want to read",
    })
  ).toMatchInlineSnapshot(`
{
  "dateAdded": "2020-01-01",
}
`);
  expect(
    getBookStatus({
      date: "2020-01-01",
    })
  ).toMatchInlineSnapshot(`
{
  "dateAdded": "2020-01-01",
}
`);
  expect(getBookStatus({})).toMatchInlineSnapshot(`
{
  "dateAdded": "2023-12-01",
}
`);
});
