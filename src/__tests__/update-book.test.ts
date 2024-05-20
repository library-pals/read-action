import { updateBook } from "../update-book";

jest.mock("@actions/core");

const library = [
  {
    isbn: "9780374719760",
    dateStarted: "2020-11-20",
    dateFinished: "2020-11-22",
    title: "Uncanny Valley",
    status: "finished",
  },
  {
    isbn: "9780525620792",
    dateStarted: "2021-09-26",
    title: "Mexican Gothic",
    notes: "Recommended by my sister.",
    status: "started",
  },
];

describe("updateBook", () => {
  it("works", async () => {
    return expect(
      updateBook(
        {
          filename: "my-library.yml",
          bookIsbn: "9780525620792",
          dateType: {
            dateFinished: "2022-02-02",
          },
          bookStatus: "finished",
          setImage: false,
          providers: [],
        },
        library
      )
    ).resolves.toMatchInlineSnapshot(`
              [
                {
                  "dateFinished": "2020-11-22",
                  "dateStarted": "2020-11-20",
                  "isbn": "9780374719760",
                  "title": "Uncanny Valley",
                },
                {
                  "dateAbandoned": undefined,
                  "dateAdded": undefined,
                  "dateFinished": "2022-02-02",
                  "dateStarted": "2021-09-26",
                  "isbn": "9780525620792",
                  "notes": "Recommended by my sister.",
                  "status": "finished",
                  "title": "Mexican Gothic",
                },
              ]
            `);
  });

  it("works, notes", async () => {
    const library = [
      {
        isbn: "9780525620792",
        dateStarted: "2021-09-26",
        title: "Mexican Gothic",
        tags: ["recommend"],
      },
    ];
    return expect(
      updateBook(
        {
          filename: "my-library.yml",
          bookIsbn: "9780525620792",
          dateType: {
            dateFinished: "2022-02-02",
          },
          notes: "Great read",
          bookStatus: "finished",
          setImage: false,
          providers: [],
        },
        library
      )
    ).resolves.toMatchInlineSnapshot(`
              [
                {
                  "dateAbandoned": undefined,
                  "dateAdded": undefined,
                  "dateFinished": "2022-02-02",
                  "dateStarted": "2021-09-26",
                  "isbn": "9780525620792",
                  "notes": "Great read",
                  "status": "finished",
                  "tags": [
                    "recommend",
                  ],
                  "title": "Mexican Gothic",
                },
              ]
            `);
  });

  it("works, append notes", async () => {
    return expect(
      updateBook(
        {
          filename: "my-library.yml",
          bookIsbn: "9780525620792",
          tags: [""],
          dateType: {
            dateFinished: "2022-02-02",
          },
          notes: "Great read",
          bookStatus: "finished",
          setImage: false,
          providers: [],
        },
        library
      )
    ).resolves.toMatchInlineSnapshot(`
              [
                {
                  "dateFinished": "2020-11-22",
                  "dateStarted": "2020-11-20",
                  "isbn": "9780374719760",
                  "title": "Uncanny Valley",
                },
                {
                  "dateAbandoned": undefined,
                  "dateAdded": undefined,
                  "dateFinished": "2022-02-02",
                  "dateStarted": "2021-09-26",
                  "isbn": "9780525620792",
                  "notes": "Recommended by my sister.

              Great read",
                  "status": "finished",
                  "tags": [
                    "",
                  ],
                  "title": "Mexican Gothic",
                },
              ]
            `);
  });

  it("does not find book", async () => {
    return expect(
      updateBook(
        {
          filename: "my-library.yml",
          bookIsbn: "12345",
          dateType: {
            dateFinished: "2022-02-02",
          },
          bookStatus: "finished",
          setImage: false,
          providers: [],
        },
        library
      )
    ).resolves.toMatchInlineSnapshot(`
              [
                {
                  "dateFinished": "2020-11-22",
                  "dateStarted": "2020-11-20",
                  "isbn": "9780374719760",
                  "title": "Uncanny Valley",
                },
                {
                  "dateStarted": "2021-09-26",
                  "isbn": "9780525620792",
                  "notes": "Recommended by my sister.",
                  "title": "Mexican Gothic",
                },
              ]
            `);
  });

  it("no library", async () => {
    const library = [];
    return expect(
      updateBook(
        {
          filename: "my-library.yml",
          bookIsbn: "12345",
          dateType: {
            dateFinished: "2022-02-02",
          },
          bookStatus: "finished",
          setImage: false,
          providers: [],
        },
        library
      )
    ).resolves.toMatchInlineSnapshot(`[]`);
  });
});
