import { read } from "../index";
import * as github from "@actions/github";
import * as core from "@actions/core";
import returnWriteFile from "../write-file";
import { promises, readFileSync } from "fs";
import ogs from "open-graph-scraper";

jest.mock("open-graph-scraper");

import result_5004990 from "./providers/apple-books/id1719188959-result.json";
const html_5004990 = readFileSync(
  "./src/__tests__/providers/apple-books/id1719188959-html.html",
  "utf8"
);

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

  test("want to read", async () => {
    ogs.mockResolvedValue({
      result: result_5004990,
      html: html_5004990,
    });
    jest.spyOn(promises, "readFile").mockResolvedValue();
    jest.useFakeTimers().setSystemTime(new Date("2022-10-01T12:00:00"));
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier: "https://books.apple.com/us/audiobook/id1719188959",
            "book-status": "want to read",
          },
        },
      },
    });
    await read();
    expect(setFailedSpy).not.toHaveBeenCalled();
    expect(returnWriteFile.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "my-library.json",
        [
          {
            "authors": [
              "Paul Lynch",
            ],
            "categories": [
              "Fiction",
            ],
            "dateAdded": "2022-10-01",
            "description": "A fearless portrait of a society on the brink as a mother faces a terrible choice, from Booker-winning author Paul Lynch. Winner of the Booker Prize 2023 On a dark, wet evening in Dublin, scientist and mother of four Eilish Stack answers her front door to find the GNSB on her step. Two officers fr…",
            "duration": "PT8H32M40S",
            "format": "audiobook",
            "identifier": "id1719188959",
            "identifiers": {
              "apple": "id1719188959",
            },
            "image": "book-id1719188959.png",
            "language": undefined,
            "link": "https://books.apple.com/us/audiobook/id1719188959",
            "publishedDate": "2023-12-01T00:00:00.000Z",
            "status": "want to read",
            "thumbnail": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/c9/e7/03/c9e703da-1349-dc0a-77d9-5f9c9c300bf5/9781038662170_FrontCover_Trade_DD.jpg/1200x630wp.png",
            "title": "Prophet Song (Unabridged)",
          },
        ],
      ]
    `);
  });

  test("added to started", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValue(
      JSON.stringify([
        {
          authors: ["Paul Lynch"],
          categories: ["Fiction"],
          dateAdded: "2022-10-01",
          description:
            "A fearless portrait of a society on the brink as a mother faces a terrible choice, from Booker-winning author Paul Lynch. Winner of the Booker Prize 2023 On a dark, wet evening in Dublin, scientist and mother of four Eilish Stack answers her front door to find the GNSB on her step. Two officers fr…",
          format: "audiobook",
          identifier: "id1719188959",
          identifiers: {
            apple: "id1719188959",
          },
          image: "book-id1719188959.png",
          language: undefined,
          link: "https://books.apple.com/us/audiobook/id1719188959",
          publishedDate: "2023-12-01T00:00:00.000Z",
          status: "want to read",
          thumbnail:
            "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/c9/e7/03/c9e703da-1349-dc0a-77d9-5f9c9c300bf5/9781038662170_FrontCover_Trade_DD.jpg/1200x630wp.png",
          title: "Prophet Song (Unabridged)",
        },
      ])
    );
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier: "https://books.apple.com/us/audiobook/id1719188959",
            "book-status": "started",
            date: "2022-10-02",
          },
        },
      },
    });
    await read();
    expect(setFailedSpy).not.toHaveBeenCalled();
    expect(returnWriteFile.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "my-library.json",
        [
          {
            "authors": [
              "Paul Lynch",
            ],
            "categories": [
              "Fiction",
            ],
            "dateAbandoned": undefined,
            "dateAdded": "2022-10-01",
            "dateFinished": undefined,
            "dateStarted": "2022-10-02",
            "description": "A fearless portrait of a society on the brink as a mother faces a terrible choice, from Booker-winning author Paul Lynch. Winner of the Booker Prize 2023 On a dark, wet evening in Dublin, scientist and mother of four Eilish Stack answers her front door to find the GNSB on her step. Two officers fr…",
            "format": "audiobook",
            "identifier": "id1719188959",
            "identifiers": {
              "apple": "id1719188959",
            },
            "image": "book-id1719188959.png",
            "link": "https://books.apple.com/us/audiobook/id1719188959",
            "publishedDate": "2023-12-01T00:00:00.000Z",
            "status": "started",
            "thumbnail": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/c9/e7/03/c9e703da-1349-dc0a-77d9-5f9c9c300bf5/9781038662170_FrontCover_Trade_DD.jpg/1200x630wp.png",
            "title": "Prophet Song (Unabridged)",
          },
        ],
      ]
    `);
  });

  test("started to finished", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValue(
      JSON.stringify([
        {
          authors: ["Paul Lynch"],
          categories: ["Fiction"],
          dateAbandoned: undefined,
          dateAdded: "2022-10-01",
          dateFinished: undefined,
          dateStarted: "2022-10-02",
          description:
            "A fearless portrait of a society on the brink as a mother faces a terrible choice, from Booker-winning author Paul Lynch. Winner of the Booker Prize 2023 On a dark, wet evening in Dublin, scientist and mother of four Eilish Stack answers her front door to find the GNSB on her step. Two officers fr…",
          format: "audiobook",
          identifier: "id1719188959",
          identifiers: {
            apple: "id1719188959",
          },
          image: "book-id1719188959.png",
          link: "https://books.apple.com/us/audiobook/id1719188959",
          publishedDate: "2023-12-01T00:00:00.000Z",
          status: "started",
          thumbnail:
            "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/c9/e7/03/c9e703da-1349-dc0a-77d9-5f9c9c300bf5/9781038662170_FrontCover_Trade_DD.jpg/1200x630wp.png",
          title: "Prophet Song (Unabridged)",
        },
      ])
    );
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier: "https://books.apple.com/us/audiobook/id1719188959",
            "book-status": "finished",
            date: "2022-10-03",
            rating: "⭐️⭐️⭐️⭐️⭐️",
          },
        },
      },
    });
    await read();

    expect(setFailedSpy).not.toHaveBeenCalled();
    expect(returnWriteFile.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "my-library.json",
        [
          {
            "authors": [
              "Paul Lynch",
            ],
            "categories": [
              "Fiction",
            ],
            "dateAbandoned": undefined,
            "dateAdded": "2022-10-01",
            "dateFinished": "2022-10-03",
            "dateStarted": "2022-10-02",
            "description": "A fearless portrait of a society on the brink as a mother faces a terrible choice, from Booker-winning author Paul Lynch. Winner of the Booker Prize 2023 On a dark, wet evening in Dublin, scientist and mother of four Eilish Stack answers her front door to find the GNSB on her step. Two officers fr…",
            "format": "audiobook",
            "identifier": "id1719188959",
            "identifiers": {
              "apple": "id1719188959",
            },
            "image": "book-id1719188959.png",
            "link": "https://books.apple.com/us/audiobook/id1719188959",
            "publishedDate": "2023-12-01T00:00:00.000Z",
            "rating": "⭐️⭐️⭐️⭐️⭐️",
            "status": "finished",
            "thumbnail": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/c9/e7/03/c9e703da-1349-dc0a-77d9-5f9c9c300bf5/9781038662170_FrontCover_Trade_DD.jpg/1200x630wp.png",
            "title": "Prophet Song (Unabridged)",
          },
        ],
      ]
    `);
  });
});
