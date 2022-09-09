import { read } from "../index";
import * as github from "@actions/github";
import * as core from "@actions/core";
import returnWriteFile from "../write-file";
import { promises } from "fs";

const mockReadFile = JSON.stringify([
  {
    isbn: "9780525620792",
    dateFinished: "2021-09-26",
    title: "Mexican Gothic",
    authors: ["Silvia Moreno-Garcia"],
    publishedDate: "2020-06-30",
    description: "NEW YORK TIMES BESTSELLER",
    pageCount: 320,
    printType: "BOOK",
    categories: ["Fiction"],
    thumbnail:
      "https://books.google.com/books/content?id=ksKyDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    language: "en",
    link: "https://play.google.com/store/books/details?id=ksKyDwAAQBAJ",
  },
]);

jest.mock("@actions/core");
jest.mock("../write-file");

const goodPayload = {
  bookIsbn: "9780385696005",
};

describe("index", () => {
  beforeEach(() => {
    jest.spyOn(promises, "readFile").mockResolvedValue(mockReadFile);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("works", async () => {
    const exportVariableSpy = jest.spyOn(core, "exportVariable");
    const setFailedSpy = jest.spyOn(core, "setFailed");
    jest
      .spyOn(core, "getInput")
      .mockImplementationOnce(() => "my-library.json");
    jest.useFakeTimers().setSystemTime(new Date("2022-01-18").getTime());
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          client_payload: goodPayload,
        },
      },
    });
    await read();
    expect(exportVariableSpy).toHaveBeenNthCalledWith(1, "BookTitle", "Luster");
    expect(exportVariableSpy).toHaveBeenNthCalledWith(
      2,
      "BookThumbOutput",
      "book-9780385696005.png"
    );
    expect(setFailedSpy).not.toHaveBeenCalled();
    expect(returnWriteFile.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "my-library.json",
        [
          {
            "authors": [
              "Silvia Moreno-Garcia",
            ],
            "categories": [
              "Fiction",
            ],
            "dateFinished": "2021-09-26",
            "description": "NEW YORK TIMES BESTSELLER",
            "isbn": "9780525620792",
            "language": "en",
            "link": "https://play.google.com/store/books/details?id=ksKyDwAAQBAJ",
            "pageCount": 320,
            "printType": "BOOK",
            "publishedDate": "2020-06-30",
            "thumbnail": "https://books.google.com/books/content?id=ksKyDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
            "title": "Mexican Gothic",
          },
          {
            "authors": [
              "Raven Leilani",
            ],
            "dateFinished": "2022-01-18",
            "description": "Sharp, comic, disruptive, tender, Raven Leilani's debut novel, Luster, sees a young black woman fall into art and someone else's open marriage. Edie is stumbling her way through her twenties--sharing a subpar apartment in Bushwick, clocking in and out of her admin job, making a series of inappropriate sexual choices. She's also, secretly, haltingly, figuring her way into life as an artist. And then she meets Eric, a digital archivist with a family in New Jersey, including an autopsist wife who has agreed to an open marriage--with rules. As if navigating the constantly shifting landscapes of contemporary sexual manners and racial politics weren't hard enough, Edie finds herself unemployed and falling into Eric's family life, his home. She becomes a hesitant friend to his wife and a de facto role model to his adopted daughter. Edie is the only black woman who young Akila knows. Razor sharp, darkly comic, sexually charged, socially disruptive, Luster is a portrait of a young woman trying to make her sense of her life in a tumultuous era. It is also a haunting, aching description of how hard it is to believe in your own talent and the unexpected influences that bring us into ourselves along the way.",
            "isbn": "9780385696005",
            "language": "en",
            "link": "https://books.google.com/books/about/Luster.html?hl=&id=eJ06zQEACAAJ",
            "pageCount": 240,
            "printType": "BOOK",
            "publishedDate": "2020-08-04",
            "thumbnail": "https://books.google.com/books/content?id=eJ06zQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
            "title": "Luster",
          },
        ],
      ]
    `);
  });

  test("error, no payload", async () => {
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {},
      },
    });
    await read();
    expect(setFailedSpy).toHaveBeenCalledWith("Missing `client_payload`");
  });

  test("error, missing isbn", async () => {
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          client_payload: {
            dateFinished: "2021-09-26",
          },
        },
      },
    });
    await read();
    expect(setFailedSpy).toHaveBeenCalledWith("Missing `bookIsbn` in payload");
  });

  test("error, setFailed", async () => {
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          client_payload: goodPayload,
        },
      },
    });
    jest.spyOn(core, "getInput").mockImplementation(() => {
      throw new Error("test error");
    });
    await read();
    expect(setFailedSpy).toHaveBeenCalledWith("test error");
  });

  test("providers", async () => {
    jest
      .spyOn(core, "getInput")
      .mockImplementationOnce(() => "my-library.json");
    jest.spyOn(core, "getInput").mockImplementationOnce(() => "google");
    const inputSpy = jest.spyOn(core, "getInput");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          client_payload: goodPayload,
        },
      },
    });
    await read();
    expect(inputSpy).toHaveNthReturnedWith(2, "google");
  });

  test("good date", async () => {
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          client_payload: {
            ...goodPayload,
            dateFinished: "2022-02-02",
          },
        },
      },
    });
    await read();
    expect(setFailedSpy).not.toHaveBeenCalled();
  });

  test("error, bad date", async () => {
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          client_payload: {
            ...goodPayload,
            dateFinished: "1234",
          },
        },
      },
    });
    await read();
    expect(setFailedSpy).toHaveBeenCalledWith(
      "Invalid `dateFinished` in payload"
    );
  });
});
