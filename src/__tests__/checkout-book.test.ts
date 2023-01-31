import { checkOutBook } from "../checkout-book";

jest.mock("@actions/core");

const library = [
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
    notes: "Recommended by my sister.",
  },
];

describe("checkOutBook", () => {
  it("works", () => {
    expect(
      checkOutBook(
        {
          fileName: "my-library.yml",
          bookIsbn: "9780525620792",
          dates: {
            dateAdded: undefined,
            dateStarted: undefined,
            dateFinished: "2022-02-02",
          },
          bookStatus: "finished",
        },
        library
      )
    ).toBeTruthy();
  });

  it("works, notes", () => {
    const library = [
      {
        isbn: "9780525620792",
        dateStarted: "2021-09-26",
        title: "Mexican Gothic",
        tags: ["recommend"],
      },
    ];

    expect(
      checkOutBook(
        {
          fileName: "my-library.yml",
          bookIsbn: "9780525620792",
          dates: {
            dateAdded: undefined,
            dateStarted: undefined,
            dateFinished: "2022-02-02",
          },

          notes: "Great read",
          bookStatus: "finished",
        },
        library
      )
    ).toBeTruthy();
  });

  it("works, append notes", () => {
    expect(
      checkOutBook(
        {
          fileName: "my-library.yml",
          bookIsbn: "9780525620792",
          tags: [""],
          dates: {
            dateAdded: undefined,
            dateStarted: undefined,
            dateFinished: "2022-02-02",
          },

          notes: "Great read",
          bookStatus: "finished",
        },
        library
      )
    ).toBeTruthy();
  });

  it("does not find book", () => {
    expect(
      checkOutBook(
        {
          fileName: "my-library.yml",
          bookIsbn: "12345",
          dates: {
            dateAdded: undefined,
            dateStarted: undefined,
            dateFinished: "2022-02-02",
          },
          bookStatus: "finished",
        },
        library
      )
    ).toBeFalsy();
  });

  it("no library", () => {
    const library = [];
    expect(
      checkOutBook(
        {
          fileName: "my-library.yml",
          bookIsbn: "12345",
          dates: {
            dateAdded: undefined,
            dateStarted: undefined,
            dateFinished: "2022-02-02",
          },
          bookStatus: "finished",
        },
        library
      )
    ).toBeFalsy();
  });
});
