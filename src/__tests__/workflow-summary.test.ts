import { read } from "../index";
import * as github from "@actions/github";
import * as core from "@actions/core";
import returnWriteFile from "../write-file";
import { promises } from "fs";

jest.mock("@actions/core", () => {
  return {
    ...jest.requireActual("@actions/core"),
    setFailed: jest.fn(),
    getInput: jest.fn(),
    warning: jest.fn(),
    summary: {
      addRaw: () => ({
        write: jest.fn(),
      }),
    },
  };
});

jest.mock("../write-file");

const defaultOptions = {
  filename: "my-library.json",
  "required-metadata": "title,pageCount,authors,description,thumbnail",
  "time-zone": "America/New_York",
  providers: "google",
  "thumbnail-width": "128",
  "set-image": "true",
};

describe("workflow", () => {
  beforeEach(() => {
    jest
      .spyOn(core, "getInput")
      .mockImplementation((v) => defaultOptions[v] || undefined);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("summary", async () => {
    jest
      .spyOn(promises, "readFile")
      .mockResolvedValue(JSON.stringify(bookFixture));
    const summarySpy = jest.spyOn(core.summary, "addRaw");
    jest.useFakeTimers().setSystemTime(new Date("2024-12-31T12:00:00"));
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            "book-status": "summary",
          },
        },
      },
    });
    await read();
    expect(setFailedSpy).not.toHaveBeenCalled();
    expect(summarySpy.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "# Reading summary


      ## 2024 reading summary

      - **Total books:** 10
      - **Average read time:** 11.0 days
      - **Average book page length:** 230
      - **Longest book by page count:** “Book 9” by Author 9 (350 pages)
      - **Shortest book by page count:** “Book 1” by Author 1 (100 pages)
      - **Total pages read:** 1,150
      - **Average book length by duration:** 5 hours, 31 minutes
      - **Longest book by duration:** “Book 4” by Author 4 (7 hours, 45 minutes)
      - **Shortest book by duration:** “Book 6” by Author 6 (3 hours, 20 minutes)
      - **Total hours read:** 27 hours, 35 minutes

      ## Year over year

      | Year | Books read |
      | ---: | ---: |
      | 2024 | 10 |
      | 2023 | 7 |

      \`\`\`mermaid
      xychart-beta
        title "Books read per year"
        x-axis [2023, 2024]
        y-axis "Books Read" 0 --> 10
        bar [7, 10]
      \`\`\`",
      ]
    `);
    expect(returnWriteFile.mock.calls[0]).toMatchInlineSnapshot(`undefined`);
  });
});

export const bookFixture = [
  {
    title: "Book 1",
    authors: ["Author 1"],
    pageCount: 100,
    description: "Description 1",
    thumbnail: "http://example.com/book1.jpg",
    dateStarted: "2024-01-01",
    dateFinished: "2024-01-10",
  },
  {
    title: "Book 2",
    authors: ["Author 2"],
    duration: "PT5H30M", // 5 hours 30 minutes
    description: "Description 2",
    thumbnail: "http://example.com/book2.jpg",
    dateStarted: "2024-02-01",
    dateFinished: "2024-02-05",
  },
  {
    title: "Book 3",
    authors: ["Author 3"],
    pageCount: 300,
    description: "Description 3",
    thumbnail: "http://example.com/book3.jpg",
    dateStarted: "2024-03-01",
    dateFinished: "2024-03-15",
  },
  {
    title: "Book 4",
    authors: ["Author 4"],
    duration: "PT7H45M", // 7 hours 45 minutes
    description: "Description 4",
    thumbnail: "http://example.com/book4.jpg",
    dateStarted: "2024-04-01",
    dateFinished: "2024-04-10",
  },
  {
    title: "Book 5",
    authors: ["Author 5"],
    pageCount: 150,
    description: "Description 5",
    thumbnail: "http://example.com/book5.jpg",
    dateStarted: "2024-05-01",
    dateFinished: "2024-05-20",
  },
  {
    title: "Book 6",
    authors: ["Author 6"],
    duration: "PT3H20M", // 3 hours 20 minutes
    description: "Description 6",
    thumbnail: "http://example.com/book6.jpg",
    dateStarted: "2024-06-01",
    dateFinished: "2024-06-05",
  },
  {
    title: "Book 7",
    authors: ["Author 7"],
    pageCount: 250,
    description: "Description 7",
    thumbnail: "http://example.com/book7.jpg",
    dateStarted: "2024-07-01",
    dateFinished: "2024-07-15",
  },
  {
    title: "Book 8",
    authors: ["Author 8"],
    duration: "PT6H10M", // 6 hours 10 minutes
    description: "Description 8",
    thumbnail: "http://example.com/book8.jpg",
    dateStarted: "2024-08-01",
    dateFinished: "2024-08-10",
  },
  {
    title: "Book 9",
    authors: ["Author 9"],
    pageCount: 350,
    description: "Description 9",
    thumbnail: "http://example.com/book9.jpg",
    dateStarted: "2024-09-01",
    dateFinished: "2024-09-20",
  },
  {
    title: "Book 10",
    authors: ["Author 10"],
    duration: "PT4H50M", // 4 hours 50 minutes
    description: "Description 10",
    thumbnail: "http://example.com/book10.jpg",
    dateStarted: "2024-10-01",
    dateFinished: "2024-10-10",
  },
  // Add data for previous years
  {
    title: "Book 11",
    authors: ["Author 11"],
    pageCount: 200,
    description: "Description 11",
    thumbnail: "http://example.com/book11.jpg",
    dateStarted: "2023-01-01",
    dateFinished: "2023-01-10",
  },
  {
    title: "Book 12",
    authors: ["Author 12"],
    duration: "PT5H", // 5 hours
    description: "Description 12",
    thumbnail: "http://example.com/book12.jpg",
    dateStarted: "2023-02-01",
    dateFinished: "2023-02-05",
  },
  {
    title: "Book 13",
    authors: ["Author 13"],
    pageCount: 400,
    description: "Description 13",
    thumbnail: "http://example.com/book13.jpg",
    dateStarted: "2023-03-01",
    dateFinished: "2023-03-15",
  },
  {
    title: "Book 14",
    authors: ["Author 14"],
    duration: "PT8H", // 8 hours
    description: "Description 14",
    thumbnail: "http://example.com/book14.jpg",
    dateStarted: "2023-04-01",
    dateFinished: "2023-04-10",
  },
  {
    title: "Book 15",
    authors: ["Author 15"],
    pageCount: 250,
    description: "Description 15",
    thumbnail: "http://example.com/book15.jpg",
    dateStarted: "2023-05-01",
    dateFinished: "2023-05-20",
  },
  {
    title: "Book 16",
    authors: ["Author 16"],
    duration: "PT3H", // 3 hours
    description: "Description 16",
    thumbnail: "http://example.com/book16.jpg",
    dateStarted: "2023-06-01",
    dateFinished: "2023-06-05",
  },
  {
    title: "Book 17",
    authors: ["Author 17"],
    pageCount: 300,
    description: "Description 17",
    thumbnail: "http://example.com/book17.jpg",
    dateStarted: "2023-07-01",
    dateFinished: "2023-07-15",
  },
];
