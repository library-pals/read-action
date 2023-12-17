import {
  removeWrappedQuotes,
  isIsbn,
  sortByDate,
  isDate,
  getBookStatus,
} from "../utils";

jest.mock("@actions/core");

it("removeWrappedQuotes", () => {
  expect(removeWrappedQuotes("hello")).toBe("hello");
  expect(removeWrappedQuotes('"hello"')).toBe("hello");
  expect(removeWrappedQuotes('this says "hello".')).toBe('this says "hello".');
  expect(removeWrappedQuotes('"this part will get cut off"--')).toBe(
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
      dateStarted: "2020-01-01",
      dateAbandoned: "2020-01-03",
    })
  ).toEqual("abandoned");
  expect(
    getBookStatus({
      dateStarted: "2020-01-01",
      dateFinished: "2020-01-02",
    })
  ).toEqual("finished");
  expect(
    getBookStatus({
      dateStarted: "2020-01-01",
    })
  ).toEqual("started");
  expect(getBookStatus({})).toEqual("want to read");
});
