import { promises, readFileSync } from "fs";
import book from "./librofm/fixture-9781797176888.json";
import Isbn from "@library-pals/isbn";
import * as core from "@actions/core";
import { getLibrofm } from "../../providers/librofm";

const books = readFileSync("./_data/read.json", "utf-8");
const dateFinished = "2020-09-12";

jest.mock("@actions/core");
jest.mock("@library-pals/isbn");

const defaultOptions = {
  filename: "_data/read.yml",
  "required-metadata": "title,pageCount,authors,description",
  "time-zone": "America/New_York",
};

describe("getLibrofm", () => {
  beforeEach(() => {
    jest
      .spyOn(core, "getInput")
      .mockImplementation((v) => defaultOptions[v] || undefined);
  });

  test("works", async () => {
    (Isbn.prototype.resolve as jest.Mock).mockResolvedValue(book);

    jest.spyOn(promises, "readFile").mockResolvedValueOnce(books);
    expect(
      await getLibrofm({
        dateType: {
          dateFinished,
        },
        inputIdentifier: "9781797176888",
        providers: ["google"],
        bookStatus: "finished",
        filename: "_data/read.yml",
        setImage: false,
      })
    ).toMatchInlineSnapshot(`
      {
        "authors": [
          "Kaliane Bradley",
        ],
        "categories": [
          "Fiction",
          "Romance",
          "Science Fiction",
          "Fiction - Literary",
        ],
        "dateFinished": "2020-09-12",
        "description": "In the near future, a civil servant is offered the salary of her dreams and is, shortly afterward, told what project she’ll be working on. A recently established government ministry is gathering “expats” from across history to establish whether time travel is feasible—for the body, but also for the fabric of space-time. She is tasked with working as a “bridge”: living with, assisting, and monitoring the expat known as “1847” or Commander Graham Gore. As far as history is concerned, Commander Gore died on Sir John Franklin’s doomed 1845 expedition to the Arctic, so he’s a little disoriented to be living with an unmarried woman who regularly shows her calves, surrounded by outlandish concepts such as “washing machines,” “Spotify,” and “the collapse of the British Empire.” But with an appetite for discovery, a seven-a-day cigarette habit, and the support of a charming and chaotic cast of fellow expats, he soon adjusts. Over the next year, what the bridge initially thought would be, at best, a horrifically uncomfortable roommate dynamic, evolves into something much deeper. By the time the true shape of the Ministry’s project comes to light, the bridge has fallen haphazardly, fervently in love, with consequences she never could have imagined. Forced to confront the choices that brought them together, the bridge must finally reckon with how—and whether she believes—what she does next can change the future. An exquisitely original and feverishly fun fusion of genres and ideas, The Ministry of Time asks: What does it mean to defy history, when history is living in your house? Kaliane Bradley’s answer is a blazing, unforgettable testament to what we owe each other in a changing world.",
        "format": "audiobook",
        "identifier": "9781797176888",
        "identifiers": {
          "isbn": "9781797176888",
          "librofm": "9781797176888",
        },
        "language": "en",
        "link": "https://libro.fm/audiobooks/9781797176888",
        "publishedDate": "2024-05-07",
        "status": "finished",
        "thumbnail": "https://covers.libro.fm/9781797176888_1120.jpg",
        "title": "The Ministry of Time",
      }
    `);
  });

  test("fails", async () => {
    (Isbn.prototype.resolve as jest.Mock).mockRejectedValue(
      new Error("Request failed with status")
    );
    await expect(
      getLibrofm({
        dateType: {
          dateAdded: undefined,
          dateStarted: undefined,
          dateFinished,
        },
        inputIdentifier: "9781797176888",
        providers: ["google"],
        bookStatus: "finished",
        filename: "_data/read.json",
        setImage: false,
      })
    ).rejects.toMatchInlineSnapshot(
      `[Error: Failed to get book from Libro.fm: Book (9781797176888) not found. Request failed with status]`
    );
  });
});
