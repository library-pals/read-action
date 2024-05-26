import { read } from "../index";
import * as github from "@actions/github";
import * as core from "@actions/core";
import returnWriteFile from "../write-file";
import { promises, readFileSync } from "fs";
import ogs from "open-graph-scraper";

jest.mock("open-graph-scraper");

import result_9781797176888 from "./librofm/9781797176888-result.json";
const html_9781797176888 = readFileSync(
  "./src/__tests__/librofm/9781797176888-html.html",
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
      result: result_9781797176888,
      html: html_9781797176888,
    });
    jest.spyOn(promises, "readFile").mockResolvedValue();
    jest.useFakeTimers().setSystemTime(new Date("2022-10-01T12:00:00"));
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier:
              "https://libro.fm/audiobooks/9781797176888-the-ministry-of-time",
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
              "Kaliane Bradley",
            ],
            "dateAdded": "2022-10-01",
            "description": "“This summer’s hottest debut.” —Cosmopolitan • “Witty, sexy escapist fiction [that] packs a substantial punch...It’s a smart, gripping work that’s also a feast for the senses...Fresh and thrilling.” —Los Angeles Times • “Electric...I loved every second.” —Emily Henry “Utterly winning...Imagine if The Time Traveler’s Wife had an affair with A Gentleman in Moscow...Readers, I envy you: There’s a smart, witty novel in your future.” —Ron Charles, The Washington Post A time travel romance, a spy thriller, a workplace comedy, and an ingenious exploration of the nature of power and the potential for love to change it all: Welcome to The Ministry of Time, the exhilarating debut novel by Kaliane Bradley.In the near future, a civil servant is offered the salary of her dreams and is, shortly afterward, told what project she’ll be working on. A recently established government ministry is gathering “expats” from across history to establish whether time travel is feasible—for the body, but also for the fabric of space-time. She is tasked with working as a “bridge”: living with, assisting, and monitoring the expat known as “1847” or Commander Graham Gore. As far as history is concerned, Commander Gore died on Sir John Franklin’s doomed 1845 expedition to the Arctic, so he’s a little disoriented to be living with an unmarried woman who regularly shows her calves, surrounded by outlandish concepts such as “washing machines,” “Spotify,” and “the collapse of the British Empire.” But with an appetite for discovery, a seven-a-day cigarette habit, and the support of a charming and chaotic cast of fellow expats, he soon adjusts. Over the next year, what the bridge initially thought would be, at best, a horrifically uncomfortable roommate dynamic, evolves into something much deeper. By the time the true shape of the Ministry’s project comes to light, the bridge has fallen haphazardly, fervently in love, with consequences she never could have imagined. Forced to confront the choices that brought them together, the bridge must finally reckon with how—and whether she believes—what she does next can change the future. An exquisitely original and feverishly fun fusion of genres and ideas, The Ministry of Time asks: What does it mean to defy history, when history is living in your house? Kaliane Bradley’s answer is a blazing, unforgettable testament to what we owe each other in a changing world.",
            "format": "audiobook",
            "identifier": "9781797176888",
            "identifiers": {
              "isbn": "9781797176888",
              "librofm": "9781797176888",
            },
            "image": "book-9781797176888.png",
            "link": "https://libro.fm/audiobooks/9781797176888-the-ministry-of-time",
            "publishedDate": "2024-05-07",
            "publisher": "Simon & Schuster Audio",
            "status": "want to read",
            "thumbnail": "https://covers.libro.fm/9781797176888_1120.jpg",
            "title": "The Ministry of Time",
          },
        ],
      ]
    `);
  });

  test("added to started", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValue(
      JSON.stringify([
        {
          authors: ["Kaliane Bradley"],
          dateAdded: "2022-10-01",
          description:
            "NEW YORK TIMES BESTSELLER A GOOD MORNING AMERICA BOOK CLUB PICK “This summer’s hottest debut.” —Cosmopolitan • “Witty, sexy escapist fiction [that] packs a substantial punch...It’s a smart, gripping work that’s also a feast for the senses...Fresh and thrilling.” —Los Angeles Times • “Electric...I loved every second.” —Emily Henry “Utterly winning...Imagine if The Time Traveler’s Wife had an affair with A Gentleman in Moscow...Readers, I envy you: There’s a smart, witty novel in your future.” —Ron Charles, The Washington Post A time travel romance, a spy thriller, a workplace comedy, and an ingenious exploration of the nature of power and the potential for love to change it all: Welcome to The Ministry of Time, the exhilarating debut novel by Kaliane Bradley.In the near future, a civil servant is offered the salary of her dreams and is, shortly afterward, told what project she’ll be working on. A recently established government ministry is gathering “expats” from across history to establish whether time travel is feasible—for the body, but also for the fabric of space-time. She is tasked with working as a “bridge”: living with, assisting, and monitoring the expat known as “1847” or Commander Graham Gore. As far as history is concerned, Commander Gore died on Sir John Franklin’s doomed 1845 expedition to the Arctic, so he’s a little disoriented to be living with an unmarried woman who regularly shows her calves, surrounded by outlandish concepts such as “washing machines,” “Spotify,” and “the collapse of the British Empire.” But with an appetite for discovery, a seven-a-day cigarette habit, and the support of a charming and chaotic cast of fellow expats, he soon adjusts. Over the next year, what the bridge initially thought would be, at best, a horrifically uncomfortable roommate dynamic, evolves into something much deeper. By the time the true shape of the Ministry’s project comes to light, the bridge has fallen haphazardly, fervently in love, with consequences she never could have imagined. Forced to confront the choices that brought them together, the bridge must finally reckon with how—and whether she believes—what she does next can change the future. An exquisitely original and feverishly fun fusion of genres and ideas, The Ministry of Time asks: What does it mean to defy history, when history is living in your house? Kaliane Bradley’s answer is a blazing, unforgettable testament to what we owe each other in a changing world.",
          format: "audiobook",
          identifier: "9781797176888",
          identifiers: {
            isbn: "9781797176888",
            librofm: "9781797176888",
          },
          image: "book-9781797176888.png",
          link: "https://libro.fm/audiobooks/9781797176888-the-ministry-of-time",
          publishedDate: "2024-05-07",
          publisher: "Simon & Schuster Audio",
          status: "want to read",
          thumbnail: "https://covers.libro.fm/9781797176888_1120.jpg",
          title: "The Ministry of Time",
        },
      ])
    );
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier:
              "https://libro.fm/audiobooks/9781797176888-the-ministry-of-time",
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
              "Kaliane Bradley",
            ],
            "dateAbandoned": undefined,
            "dateAdded": "2022-10-01",
            "dateFinished": undefined,
            "dateStarted": "2022-10-02",
            "description": "NEW YORK TIMES BESTSELLER A GOOD MORNING AMERICA BOOK CLUB PICK “This summer’s hottest debut.” —Cosmopolitan • “Witty, sexy escapist fiction [that] packs a substantial punch...It’s a smart, gripping work that’s also a feast for the senses...Fresh and thrilling.” —Los Angeles Times • “Electric...I loved every second.” —Emily Henry “Utterly winning...Imagine if The Time Traveler’s Wife had an affair with A Gentleman in Moscow...Readers, I envy you: There’s a smart, witty novel in your future.” —Ron Charles, The Washington Post A time travel romance, a spy thriller, a workplace comedy, and an ingenious exploration of the nature of power and the potential for love to change it all: Welcome to The Ministry of Time, the exhilarating debut novel by Kaliane Bradley.In the near future, a civil servant is offered the salary of her dreams and is, shortly afterward, told what project she’ll be working on. A recently established government ministry is gathering “expats” from across history to establish whether time travel is feasible—for the body, but also for the fabric of space-time. She is tasked with working as a “bridge”: living with, assisting, and monitoring the expat known as “1847” or Commander Graham Gore. As far as history is concerned, Commander Gore died on Sir John Franklin’s doomed 1845 expedition to the Arctic, so he’s a little disoriented to be living with an unmarried woman who regularly shows her calves, surrounded by outlandish concepts such as “washing machines,” “Spotify,” and “the collapse of the British Empire.” But with an appetite for discovery, a seven-a-day cigarette habit, and the support of a charming and chaotic cast of fellow expats, he soon adjusts. Over the next year, what the bridge initially thought would be, at best, a horrifically uncomfortable roommate dynamic, evolves into something much deeper. By the time the true shape of the Ministry’s project comes to light, the bridge has fallen haphazardly, fervently in love, with consequences she never could have imagined. Forced to confront the choices that brought them together, the bridge must finally reckon with how—and whether she believes—what she does next can change the future. An exquisitely original and feverishly fun fusion of genres and ideas, The Ministry of Time asks: What does it mean to defy history, when history is living in your house? Kaliane Bradley’s answer is a blazing, unforgettable testament to what we owe each other in a changing world.",
            "format": "audiobook",
            "identifier": "9781797176888",
            "identifiers": {
              "isbn": "9781797176888",
              "librofm": "9781797176888",
            },
            "image": "book-9781797176888.png",
            "link": "https://libro.fm/audiobooks/9781797176888-the-ministry-of-time",
            "publishedDate": "2024-05-07",
            "publisher": "Simon & Schuster Audio",
            "status": "started",
            "thumbnail": "https://covers.libro.fm/9781797176888_1120.jpg",
            "title": "The Ministry of Time",
          },
        ],
      ]
    `);
  });

  test("started to finished", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValue(
      JSON.stringify([
        {
          authors: ["Kaliane Bradley"],
          dateAbandoned: undefined,
          dateAdded: "2022-10-01",
          dateFinished: undefined,
          dateStarted: "2022-10-02",
          description:
            "NEW YORK TIMES BESTSELLER A GOOD MORNING AMERICA BOOK CLUB PICK “This summer’s hottest debut.” —Cosmopolitan • “Witty, sexy escapist fiction [that] packs a substantial punch...It’s a smart, gripping work that’s also a feast for the senses...Fresh and thrilling.” —Los Angeles Times • “Electric...I loved every second.” —Emily Henry “Utterly winning...Imagine if The Time Traveler’s Wife had an affair with A Gentleman in Moscow...Readers, I envy you: There’s a smart, witty novel in your future.” —Ron Charles, The Washington Post A time travel romance, a spy thriller, a workplace comedy, and an ingenious exploration of the nature of power and the potential for love to change it all: Welcome to The Ministry of Time, the exhilarating debut novel by Kaliane Bradley.In the near future, a civil servant is offered the salary of her dreams and is, shortly afterward, told what project she’ll be working on. A recently established government ministry is gathering “expats” from across history to establish whether time travel is feasible—for the body, but also for the fabric of space-time. She is tasked with working as a “bridge”: living with, assisting, and monitoring the expat known as “1847” or Commander Graham Gore. As far as history is concerned, Commander Gore died on Sir John Franklin’s doomed 1845 expedition to the Arctic, so he’s a little disoriented to be living with an unmarried woman who regularly shows her calves, surrounded by outlandish concepts such as “washing machines,” “Spotify,” and “the collapse of the British Empire.” But with an appetite for discovery, a seven-a-day cigarette habit, and the support of a charming and chaotic cast of fellow expats, he soon adjusts. Over the next year, what the bridge initially thought would be, at best, a horrifically uncomfortable roommate dynamic, evolves into something much deeper. By the time the true shape of the Ministry’s project comes to light, the bridge has fallen haphazardly, fervently in love, with consequences she never could have imagined. Forced to confront the choices that brought them together, the bridge must finally reckon with how—and whether she believes—what she does next can change the future. An exquisitely original and feverishly fun fusion of genres and ideas, The Ministry of Time asks: What does it mean to defy history, when history is living in your house? Kaliane Bradley’s answer is a blazing, unforgettable testament to what we owe each other in a changing world.",
          format: "audiobook",
          identifier: "9781797176888",
          identifiers: {
            isbn: "9781797176888",
            librofm: "9781797176888",
          },
          image: "book-9781797176888.png",
          link: "https://libro.fm/audiobooks/9781797176888-the-ministry-of-time",
          publishedDate: "2024-05-07",
          publisher: "Simon & Schuster Audio",
          status: "started",
          thumbnail: "https://covers.libro.fm/9781797176888_1120.jpg",
          title: "The Ministry of Time",
        },
      ])
    );
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier:
              "https://libro.fm/audiobooks/9781797176888-the-ministry-of-time",
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
              "Kaliane Bradley",
            ],
            "dateAbandoned": undefined,
            "dateAdded": "2022-10-01",
            "dateFinished": "2022-10-03",
            "dateStarted": "2022-10-02",
            "description": "NEW YORK TIMES BESTSELLER A GOOD MORNING AMERICA BOOK CLUB PICK “This summer’s hottest debut.” —Cosmopolitan • “Witty, sexy escapist fiction [that] packs a substantial punch...It’s a smart, gripping work that’s also a feast for the senses...Fresh and thrilling.” —Los Angeles Times • “Electric...I loved every second.” —Emily Henry “Utterly winning...Imagine if The Time Traveler’s Wife had an affair with A Gentleman in Moscow...Readers, I envy you: There’s a smart, witty novel in your future.” —Ron Charles, The Washington Post A time travel romance, a spy thriller, a workplace comedy, and an ingenious exploration of the nature of power and the potential for love to change it all: Welcome to The Ministry of Time, the exhilarating debut novel by Kaliane Bradley.In the near future, a civil servant is offered the salary of her dreams and is, shortly afterward, told what project she’ll be working on. A recently established government ministry is gathering “expats” from across history to establish whether time travel is feasible—for the body, but also for the fabric of space-time. She is tasked with working as a “bridge”: living with, assisting, and monitoring the expat known as “1847” or Commander Graham Gore. As far as history is concerned, Commander Gore died on Sir John Franklin’s doomed 1845 expedition to the Arctic, so he’s a little disoriented to be living with an unmarried woman who regularly shows her calves, surrounded by outlandish concepts such as “washing machines,” “Spotify,” and “the collapse of the British Empire.” But with an appetite for discovery, a seven-a-day cigarette habit, and the support of a charming and chaotic cast of fellow expats, he soon adjusts. Over the next year, what the bridge initially thought would be, at best, a horrifically uncomfortable roommate dynamic, evolves into something much deeper. By the time the true shape of the Ministry’s project comes to light, the bridge has fallen haphazardly, fervently in love, with consequences she never could have imagined. Forced to confront the choices that brought them together, the bridge must finally reckon with how—and whether she believes—what she does next can change the future. An exquisitely original and feverishly fun fusion of genres and ideas, The Ministry of Time asks: What does it mean to defy history, when history is living in your house? Kaliane Bradley’s answer is a blazing, unforgettable testament to what we owe each other in a changing world.",
            "format": "audiobook",
            "identifier": "9781797176888",
            "identifiers": {
              "isbn": "9781797176888",
              "librofm": "9781797176888",
            },
            "image": "book-9781797176888.png",
            "link": "https://libro.fm/audiobooks/9781797176888-the-ministry-of-time",
            "publishedDate": "2024-05-07",
            "publisher": "Simon & Schuster Audio",
            "rating": "⭐️⭐️⭐️⭐️⭐️",
            "status": "finished",
            "thumbnail": "https://covers.libro.fm/9781797176888_1120.jpg",
            "title": "The Ministry of Time",
          },
        ],
      ]
    `);
  });
});
