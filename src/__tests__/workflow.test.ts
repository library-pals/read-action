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

  test("want to read", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValue();
    jest.useFakeTimers().setSystemTime(new Date("2022-10-01T12:00:00"));
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier: "9781760983215",
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
              "Fiction / Literary",
              "Fiction / Cultural Heritage",
              "Fiction / African American & Black / General",
              "Fiction / Women",
              "Fiction / General",
            ],
            "dateAdded": "2022-10-01",
            "description": "'A taut, sharp, funny book about being young now. It's brutal-and brilliant.' Zadie Smith WINNER OF THE KIRKUS PRIZE FOR FICTION 2020 LONGLISTED FOR THE WOMEN'S PRIZE FOR FICTION 2021 Meet Edie. Edie is not okay. She's messing up in her dead-end admin job in her all white office, is sleeping with all the wrong men, and has failed at the only thing that meant anything to her, painting. No one seems to care that she doesn't really know what she's doing with her life beyond looking for her next hook-up. And then she meets Eric, a white, middle-aged archivist with a suburban family, including a wife who has sort-of-agreed to an open marriage and an adopted black daughter who doesn't have a single person in her life who can show her how to do her hair. As if navigating the constantly shifting landscape of sexual and racial politics as a young, black woman wasn't already hard enough, with nowhere else left to go, Edie finds herself falling headfirst into Eric's home and family. Razor sharp. provocatively page-turning and surprisingly tender, Luster is a painfully funny coming-of-age story told by a fresh new voice. ONE OF BARACK OBAMA'S FAVOURITE BOOKS OF 2020 PRAISE FOR LUSTER 'Remarkable, the most delicious novel I've read.' Candice Carty-Williams, bestselling author of Queenie 'Raven Leilani is a writer of unusual daring, with a voice that is unique and fully formed. There is humor, intelligence, emotion, and power in her work. I cannot think of a writer better suited to capture our contemporary moment.' Katie Kitamura, author of A Separation 'Among the most exciting releases of 2020-a lively, unforgettable coming-of-age story . . . Leilani brings painterly precision to each stunning sentence, making for an exacting, darkly comic story of a gifted yet wayward young woman learning to believe in her own talent.' Esquire 'Narrated with fresh and wry jadedness, Edie's every disappointment [is] rendered with a comic twist . . . Edie's life is a mess, her past is filled with sorrow, she's wasting her precious youth, and yet, reading about it all is a whole lot of fun.' Vogue 'Darkly funny with wicked insight . . . This keenly observed, dynamic debut is so cutting, it almost stings.' Elle 'I was blown away by this debut novel . . . It is exquisite.' Dolly Alderton, bestselling author of Everything I Know About Love 'Smart and satirical about everything from the gig economy to racism in publishing to the inner politics of families' Emma Donoghue, bestselling author of Room and The Pull of the Stars",
            "format": "book",
            "identifier": "9781760983215",
            "identifiers": {
              "isbn": "9781760983215",
            },
            "image": "book-9781760983215.png",
            "language": "en",
            "link": "https://books.google.com/books/about/Luster.html?hl=&id=CONSTANT_ID",
            "pageCount": 209,
            "publishedDate": "2020-11-13",
            "status": "want to read",
            "thumbnail": "https://books.google.com/books/publisher/content?id=CONSTANT_ID&printsec=frontcover&img=1&zoom=5&source=gbs_api&w=128",
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
          dateAdded: "2022-10-01",
          dateFinished: undefined,
          dateStarted: undefined,
          description:
            "Sharp, comic, disruptive, tender, Raven Leilani's debut novel, Luster, sees a young black woman fall into art and someone else's open marriage. Edie is stumbling her way through her twenties--sharing a subpar apartment in Bushwick, clocking in and out of her admin job, making a series of inappropriate sexual choices. She's also, secretly, haltingly, figuring her way into life as an artist. And then she meets Eric, a digital archivist with a family in New Jersey, including an autopsist wife who has agreed to an open marriage--with rules. As if navigating the constantly shifting landscapes of contemporary sexual manners and racial politics weren't hard enough, Edie finds herself unemployed and falling into Eric's family life, his home. She becomes a hesitant friend to his wife and a de facto role model to his adopted daughter. Edie is the only black woman who young Akila knows. Razor sharp, darkly comic, sexually charged, socially disruptive, Luster is a portrait of a young woman trying to make her sense of her life in a tumultuous era. It is also a haunting, aching description of how hard it is to believe in your own talent and the unexpected influences that bring us into ourselves along the way.",
          identifier: "9781760983215",
          language: "en",
          link: "https://books.google.com/books/about/Luster.html?hl=&id=eJ06zQEACAAJ",
          pageCount: 240,
          format: "BOOK",
          publishedDate: "2020-08-04",
          status: "want to read",
          thumbnail:
            "https://books.google.com/books/content?id=eJ06zQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
          title: "Luster",
        },
      ])
    );
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier: "9781760983215",
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
            "dateAbandoned": undefined,
            "dateAdded": "2022-10-01",
            "dateFinished": undefined,
            "dateStarted": "2022-10-02",
            "description": "Sharp, comic, disruptive, tender, Raven Leilani's debut novel, Luster, sees a young black woman fall into art and someone else's open marriage. Edie is stumbling her way through her twenties--sharing a subpar apartment in Bushwick, clocking in and out of her admin job, making a series of inappropriate sexual choices. She's also, secretly, haltingly, figuring her way into life as an artist. And then she meets Eric, a digital archivist with a family in New Jersey, including an autopsist wife who has agreed to an open marriage--with rules. As if navigating the constantly shifting landscapes of contemporary sexual manners and racial politics weren't hard enough, Edie finds herself unemployed and falling into Eric's family life, his home. She becomes a hesitant friend to his wife and a de facto role model to his adopted daughter. Edie is the only black woman who young Akila knows. Razor sharp, darkly comic, sexually charged, socially disruptive, Luster is a portrait of a young woman trying to make her sense of her life in a tumultuous era. It is also a haunting, aching description of how hard it is to believe in your own talent and the unexpected influences that bring us into ourselves along the way.",
            "format": "BOOK",
            "identifier": "9781760983215",
            "language": "en",
            "link": "https://books.google.com/books/about/Luster.html?hl=&id=CONSTANT_ID",
            "pageCount": 240,
            "publishedDate": "2020-08-04",
            "status": "started",
            "thumbnail": "https://books.google.com/books/content?id=CONSTANT_ID&printsec=frontcover&img=1&zoom=1&source=gbs_api",
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
          dateAdded: "2022-10-01",
          dateFinished: undefined,
          dateStarted: "2022-10-02",
          description:
            "Sharp, comic, disruptive, tender, Raven Leilani's debut novel, Luster, sees a young black woman fall into art and someone else's open marriage. Edie is stumbling her way through her twenties--sharing a subpar apartment in Bushwick, clocking in and out of her admin job, making a series of inappropriate sexual choices. She's also, secretly, haltingly, figuring her way into life as an artist. And then she meets Eric, a digital archivist with a family in New Jersey, including an autopsist wife who has agreed to an open marriage--with rules. As if navigating the constantly shifting landscapes of contemporary sexual manners and racial politics weren't hard enough, Edie finds herself unemployed and falling into Eric's family life, his home. She becomes a hesitant friend to his wife and a de facto role model to his adopted daughter. Edie is the only black woman who young Akila knows. Razor sharp, darkly comic, sexually charged, socially disruptive, Luster is a portrait of a young woman trying to make her sense of her life in a tumultuous era. It is also a haunting, aching description of how hard it is to believe in your own talent and the unexpected influences that bring us into ourselves along the way.",
          identifier: "9781760983215",
          language: "en",
          link: "https://books.google.com/books/about/Luster.html?hl=&id=eJ06zQEACAAJ",
          pageCount: 240,
          format: "BOOK",
          publishedDate: "2020-08-04",
          status: "started",
          thumbnail:
            "https://books.google.com/books/content?id=eJ06zQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
          title: "Luster",
        },
      ])
    );
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier: "9781760983215",
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
            "dateAbandoned": undefined,
            "dateAdded": "2022-10-01",
            "dateFinished": "2022-10-03",
            "dateStarted": "2022-10-02",
            "description": "Sharp, comic, disruptive, tender, Raven Leilani's debut novel, Luster, sees a young black woman fall into art and someone else's open marriage. Edie is stumbling her way through her twenties--sharing a subpar apartment in Bushwick, clocking in and out of her admin job, making a series of inappropriate sexual choices. She's also, secretly, haltingly, figuring her way into life as an artist. And then she meets Eric, a digital archivist with a family in New Jersey, including an autopsist wife who has agreed to an open marriage--with rules. As if navigating the constantly shifting landscapes of contemporary sexual manners and racial politics weren't hard enough, Edie finds herself unemployed and falling into Eric's family life, his home. She becomes a hesitant friend to his wife and a de facto role model to his adopted daughter. Edie is the only black woman who young Akila knows. Razor sharp, darkly comic, sexually charged, socially disruptive, Luster is a portrait of a young woman trying to make her sense of her life in a tumultuous era. It is also a haunting, aching description of how hard it is to believe in your own talent and the unexpected influences that bring us into ourselves along the way.",
            "format": "BOOK",
            "identifier": "9781760983215",
            "language": "en",
            "link": "https://books.google.com/books/about/Luster.html?hl=&id=CONSTANT_ID",
            "pageCount": 240,
            "publishedDate": "2020-08-04",
            "rating": "⭐️⭐️⭐️⭐️⭐️",
            "status": "finished",
            "thumbnail": "https://books.google.com/books/content?id=CONSTANT_ID&printsec=frontcover&img=1&zoom=1&source=gbs_api",
            "title": "Luster",
          },
        ],
      ]
    `);
  });

  test("missing thumbnail", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValue(JSON.stringify([]));
    const setFailedSpy = jest.spyOn(core, "setFailed");
    const exportVariableSpy = jest.spyOn(core, "exportVariable");

    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier: "9798374567144",
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
              "Nicola Sanders",
            ],
            "categories": [
              "Estranged families",
            ],
            "dateAdded": "2022-10-01",
            "description": "Someone inside your house wants you dead, but no one believes you...",
            "format": "book",
            "identifier": "9798374567144",
            "identifiers": {
              "isbn": "9798374567144",
            },
            "image": "book-9798374567144.png",
            "language": "en",
            "link": "https://books.google.com/books/about/Don_t_Let_Her_Stay.html?hl=&id=CONSTANT_ID",
            "publishedDate": "2023",
            "status": "want to read",
            "title": "Don't Let Her Stay",
          },
        ],
      ]
    `);
    expect(exportVariableSpy.mock.calls).toMatchInlineSnapshot(`[]`);
  });
});
