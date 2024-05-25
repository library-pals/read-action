import { read } from "../index";
import * as github from "@actions/github";
import * as core from "@actions/core";
import returnWriteFile from "../write-file";
import { promises, readFileSync } from "fs";
import ogs from "open-graph-scraper";

jest.mock("open-graph-scraper");

import result_5004990 from "./libby/5004990-result.json";
const html_5004990 = readFileSync(
  "./src/__tests__/libby/5004990-html.html",
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
            identifier: "https://share.libbyapp.com/title/5004990",
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
              "Raven Leilani",
            ],
            "categories": [
              "Fiction",
              "African American Fiction",
              "Literature",
              "Historical Fiction",
            ],
            "dateAdded": "2022-10-01",
            "description": "AN INSTANT NEW YORK TIMES BESTSELLER A New York Times Notable Book of the YearWINNER of the NBCC John Leonard Prize, the Kirkus Prize, the Center for Fiction First Novel Prize, the Dylan Thomas Prize, and the VCU Cabell First Novelist AwardOne of Barack Obama’s Favorite Books of 2020 A BEST BOOK OF THE YEAR: NPR, The New York Times Book Review, O Magazine, Vanity Fair, Los Angeles Times, Glamour, Shondaland,...",
            "format": "ebook",
            "identifier": "5004990",
            "identifiers": {
              "isbn": "9780374910334",
              "libby": "5004990",
            },
            "image": "book-5004990.png",
            "link": "https://share.libbyapp.com/title/5004990",
            "publishedDate": "2020-08-04",
            "publisher": "Farrar, Straus and Giroux",
            "status": "want to read",
            "thumbnail": "https://img2.od-cdn.com/ImageType-100/2390-1/{AC83A465-D32D-46B4-A70E-EFD2F0E2F7F6}Img100.jpg",
            "title": "Luster",
          },
        ],
      ]
    `);
  });

  test("added to started", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValue(
      JSON.stringify([
        {
          authors: ["Raven Leilani"],
          categories: [
            "Fiction",
            "African American Fiction",
            "Literature",
            "Historical Fiction",
          ],
          dateAdded: "2022-10-01",
          description:
            "AN INSTANT NEW YORK TIMES BESTSELLER A New York Times Notable Book of the YearWINNER of the NBCC John Leonard Prize, the Kirkus Prize, the Center for Fiction First Novel Prize, the Dylan Thomas Prize, and the VCU Cabell First Novelist AwardOne of Barack Obama’s Favorite Books of 2020 A BEST BOOK OF THE YEAR: NPR, The New York Times Book Review, O Magazine, Vanity Fair, Los Angeles Times, Glamour, Shondaland,...",
          format: "ebook",
          identifier: "5004990",
          identifiers: {
            isbn: "9780374910334",
            libby: "5004990",
          },
          image: "book-5004990.png",
          link: "https://share.libbyapp.com/title/5004990",
          publishedDate: "2020-08-04",
          publisher: "Farrar, Straus and Giroux",
          status: "want to read",
          thumbnail:
            "https://img2.od-cdn.com/ImageType-100/2390-1/{AC83A465-D32D-46B4-A70E-EFD2F0E2F7F6}Img100.jpg",
          title: "Luster",
        },
      ])
    );
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier: "https://share.libbyapp.com/title/5004990",
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
              "Raven Leilani",
            ],
            "categories": [
              "Fiction",
              "African American Fiction",
              "Literature",
              "Historical Fiction",
            ],
            "dateAbandoned": undefined,
            "dateAdded": "2022-10-01",
            "dateFinished": undefined,
            "dateStarted": "2022-10-02",
            "description": "AN INSTANT NEW YORK TIMES BESTSELLER A New York Times Notable Book of the YearWINNER of the NBCC John Leonard Prize, the Kirkus Prize, the Center for Fiction First Novel Prize, the Dylan Thomas Prize, and the VCU Cabell First Novelist AwardOne of Barack Obama’s Favorite Books of 2020 A BEST BOOK OF THE YEAR: NPR, The New York Times Book Review, O Magazine, Vanity Fair, Los Angeles Times, Glamour, Shondaland,...",
            "format": "ebook",
            "identifier": "5004990",
            "identifiers": {
              "isbn": "9780374910334",
              "libby": "5004990",
            },
            "image": "book-5004990.png",
            "link": "https://share.libbyapp.com/title/5004990",
            "publishedDate": "2020-08-04",
            "publisher": "Farrar, Straus and Giroux",
            "status": "started",
            "thumbnail": "https://img2.od-cdn.com/ImageType-100/2390-1/{AC83A465-D32D-46B4-A70E-EFD2F0E2F7F6}Img100.jpg",
            "title": "Luster",
          },
        ],
      ]
    `);
  });

  test("started to finished", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValue(
      JSON.stringify([
        {
          authors: ["Raven Leilani"],
          categories: [
            "Fiction",
            "African American Fiction",
            "Literature",
            "Historical Fiction",
          ],
          dateAbandoned: undefined,
          dateAdded: "2022-10-01",
          dateFinished: undefined,
          dateStarted: "2022-10-02",
          description:
            "AN INSTANT NEW YORK TIMES BESTSELLER A New York Times Notable Book of the YearWINNER of the NBCC John Leonard Prize, the Kirkus Prize, the Center for Fiction First Novel Prize, the Dylan Thomas Prize, and the VCU Cabell First Novelist AwardOne of Barack Obama’s Favorite Books of 2020 A BEST BOOK OF THE YEAR: NPR, The New York Times Book Review, O Magazine, Vanity Fair, Los Angeles Times, Glamour, Shondaland,...",
          format: "ebook",
          identifier: "5004990",
          identifiers: {
            isbn: "9780374910334",
            libby: "5004990",
          },
          image: "book-5004990.png",
          link: "https://share.libbyapp.com/title/5004990",
          publishedDate: "2020-08-04",
          publisher: "Farrar, Straus and Giroux",
          status: "started",
          thumbnail:
            "https://img2.od-cdn.com/ImageType-100/2390-1/{AC83A465-D32D-46B4-A70E-EFD2F0E2F7F6}Img100.jpg",
          title: "Luster",
        },
      ])
    );
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier: "https://share.libbyapp.com/title/5004990",
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
              "Raven Leilani",
            ],
            "categories": [
              "Fiction",
              "African American Fiction",
              "Literature",
              "Historical Fiction",
            ],
            "dateAbandoned": undefined,
            "dateAdded": "2022-10-01",
            "dateFinished": "2022-10-03",
            "dateStarted": "2022-10-02",
            "description": "AN INSTANT NEW YORK TIMES BESTSELLER A New York Times Notable Book of the YearWINNER of the NBCC John Leonard Prize, the Kirkus Prize, the Center for Fiction First Novel Prize, the Dylan Thomas Prize, and the VCU Cabell First Novelist AwardOne of Barack Obama’s Favorite Books of 2020 A BEST BOOK OF THE YEAR: NPR, The New York Times Book Review, O Magazine, Vanity Fair, Los Angeles Times, Glamour, Shondaland,...",
            "format": "ebook",
            "identifier": "5004990",
            "identifiers": {
              "isbn": "9780374910334",
              "libby": "5004990",
            },
            "image": "book-5004990.png",
            "link": "https://share.libbyapp.com/title/5004990",
            "publishedDate": "2020-08-04",
            "publisher": "Farrar, Straus and Giroux",
            "rating": "⭐️⭐️⭐️⭐️⭐️",
            "status": "finished",
            "thumbnail": "https://img2.od-cdn.com/ImageType-100/2390-1/{AC83A465-D32D-46B4-A70E-EFD2F0E2F7F6}Img100.jpg",
            "title": "Luster",
          },
        ],
      ]
    `);
  });
});
