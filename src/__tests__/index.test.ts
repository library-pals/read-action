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
    description:
      "NEW YORK TIMES BESTSELLER • “It’s Lovecraft meets the Brontës in Latin America, and after a slow-burn start Mexican Gothic gets seriously weird.”—The Guardian IN DEVELOPMENT AS A HULU ORIGINAL LIMITED SERIES PRODUCED BY KELLY RIPA AND MARK CONSUELOS • FINALIST FOR THE LOCUS AWARD • NOMINATED FOR THE BRAM STOKER AWARD • NAMED ONE OF THE BEST BOOKS OF THE YEAR BY The New Yorker • Vanity Fair • NPR • The Washington Post • Tordotcom • Marie Claire • Vox • Mashable • Men’s Health • Library Journal • Book Riot • LibraryReads An isolated mansion. A chillingly charismatic aristocrat. And a brave socialite drawn to expose their treacherous secrets. . . . From the author of Gods of Jade and Shadow comes “a terrifying twist on classic gothic horror” (Kirkus Reviews) set in glamorous 1950s Mexico. After receiving a frantic letter from her newly-wed cousin begging for someone to save her from a mysterious doom, Noemí Taboada heads to High Place, a distant house in the Mexican countryside. She’s not sure what she will find—her cousin’s husband, a handsome Englishman, is a stranger, and Noemí knows little about the region. Noemí is also an unlikely rescuer: She’s a glamorous debutante, and her chic gowns and perfect red lipstick are more suited for cocktail parties than amateur sleuthing. But she’s also tough and smart, with an indomitable will, and she is not afraid: Not of her cousin’s new husband, who is both menacing and alluring; not of his father, the ancient patriarch who seems to be fascinated by Noemí; and not even of the house itself, which begins to invade Noemi’s dreams with visions of blood and doom. Her only ally in this inhospitable abode is the family’s youngest son. Shy and gentle, he seems to want to help Noemí, but might also be hiding dark knowledge of his family’s past. For there are many secrets behind the walls of High Place. The family’s once colossal wealth and faded mining empire kept them from prying eyes, but as Noemí digs deeper she unearths stories of violence and madness. And Noemí, mesmerized by the terrifying yet seductive world of High Place, may soon find it impossible to ever leave this enigmatic house behind. “It’s as if a supernatural power compels us to turn the pages of the gripping Mexican Gothic.”—The Washington Post “Mexican Gothic is the perfect summer horror read, and marks Moreno-Garcia with her hypnotic and engaging prose as one of the genre’s most exciting talents.”—Nerdist “A period thriller as rich in suspense as it is in lush ’50s atmosphere.”—Entertainment Weekly",
    industryIdentifiers: [
      { type: "ISBN_13", identifier: "9780525620792" },
      { type: "ISBN_10", identifier: "0525620796" },
    ],
    pageCount: 320,
    printType: "BOOK",
    categories: ["Fiction"],
    imageLinks: {
      smallThumbnail:
        "https://books.google.com/books/content?id=ksKyDwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
      thumbnail:
        "https://books.google.com/books/content?id=ksKyDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    },
    language: "en",
    canonicalVolumeLink:
      "https://play.google.com/store/books/details?id=ksKyDwAAQBAJ",
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
            "canonicalVolumeLink": "https://play.google.com/store/books/details?id=ksKyDwAAQBAJ",
            "categories": [
              "Fiction",
            ],
            "dateFinished": "2021-09-26",
            "description": "NEW YORK TIMES BESTSELLER • “It’s Lovecraft meets the Brontës in Latin America, and after a slow-burn start Mexican Gothic gets seriously weird.”—The Guardian IN DEVELOPMENT AS A HULU ORIGINAL LIMITED SERIES PRODUCED BY KELLY RIPA AND MARK CONSUELOS • FINALIST FOR THE LOCUS AWARD • NOMINATED FOR THE BRAM STOKER AWARD • NAMED ONE OF THE BEST BOOKS OF THE YEAR BY The New Yorker • Vanity Fair • NPR • The Washington Post • Tordotcom • Marie Claire • Vox • Mashable • Men’s Health • Library Journal • Book Riot • LibraryReads An isolated mansion. A chillingly charismatic aristocrat. And a brave socialite drawn to expose their treacherous secrets. . . . From the author of Gods of Jade and Shadow comes “a terrifying twist on classic gothic horror” (Kirkus Reviews) set in glamorous 1950s Mexico. After receiving a frantic letter from her newly-wed cousin begging for someone to save her from a mysterious doom, Noemí Taboada heads to High Place, a distant house in the Mexican countryside. She’s not sure what she will find—her cousin’s husband, a handsome Englishman, is a stranger, and Noemí knows little about the region. Noemí is also an unlikely rescuer: She’s a glamorous debutante, and her chic gowns and perfect red lipstick are more suited for cocktail parties than amateur sleuthing. But she’s also tough and smart, with an indomitable will, and she is not afraid: Not of her cousin’s new husband, who is both menacing and alluring; not of his father, the ancient patriarch who seems to be fascinated by Noemí; and not even of the house itself, which begins to invade Noemi’s dreams with visions of blood and doom. Her only ally in this inhospitable abode is the family’s youngest son. Shy and gentle, he seems to want to help Noemí, but might also be hiding dark knowledge of his family’s past. For there are many secrets behind the walls of High Place. The family’s once colossal wealth and faded mining empire kept them from prying eyes, but as Noemí digs deeper she unearths stories of violence and madness. And Noemí, mesmerized by the terrifying yet seductive world of High Place, may soon find it impossible to ever leave this enigmatic house behind. “It’s as if a supernatural power compels us to turn the pages of the gripping Mexican Gothic.”—The Washington Post “Mexican Gothic is the perfect summer horror read, and marks Moreno-Garcia with her hypnotic and engaging prose as one of the genre’s most exciting talents.”—Nerdist “A period thriller as rich in suspense as it is in lush ’50s atmosphere.”—Entertainment Weekly",
            "imageLinks": {
              "smallThumbnail": "https://books.google.com/books/content?id=ksKyDwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
              "thumbnail": "https://books.google.com/books/content?id=ksKyDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
            },
            "industryIdentifiers": [
              {
                "identifier": "9780525620792",
                "type": "ISBN_13",
              },
              {
                "identifier": "0525620796",
                "type": "ISBN_10",
              },
            ],
            "isbn": "9780525620792",
            "language": "en",
            "pageCount": 320,
            "printType": "BOOK",
            "publishedDate": "2020-06-30",
            "title": "Mexican Gothic",
          },
          {
            "authors": [
              "Raven Leilani",
            ],
            "canonicalVolumeLink": "https://books.google.com/books/about/Luster.html?hl=&id=eJ06zQEACAAJ",
            "dateFinished": "2022-01-18",
            "description": "Sharp, comic, disruptive, tender, Raven Leilani's debut novel, Luster, sees a young black woman fall into art and someone else's open marriage. Edie is stumbling her way through her twenties--sharing a subpar apartment in Bushwick, clocking in and out of her admin job, making a series of inappropriate sexual choices. She's also, secretly, haltingly, figuring her way into life as an artist. And then she meets Eric, a digital archivist with a family in New Jersey, including an autopsist wife who has agreed to an open marriage--with rules. As if navigating the constantly shifting landscapes of contemporary sexual manners and racial politics weren't hard enough, Edie finds herself unemployed and falling into Eric's family life, his home. She becomes a hesitant friend to his wife and a de facto role model to his adopted daughter. Edie is the only black woman who young Akila knows. Razor sharp, darkly comic, sexually charged, socially disruptive, Luster is a portrait of a young woman trying to make her sense of her life in a tumultuous era. It is also a haunting, aching description of how hard it is to believe in your own talent and the unexpected influences that bring us into ourselves along the way.",
            "imageLinks": {
              "smallThumbnail": "https://books.google.com/books/content?id=eJ06zQEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
              "thumbnail": "https://books.google.com/books/content?id=eJ06zQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
            },
            "industryIdentifiers": [
              {
                "identifier": "0385696000",
                "type": "ISBN_10",
              },
              {
                "identifier": "9780385696005",
                "type": "ISBN_13",
              },
            ],
            "isbn": "9780385696005",
            "language": "en",
            "pageCount": 240,
            "printType": "BOOK",
            "publishedDate": "2020-08-04",
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
