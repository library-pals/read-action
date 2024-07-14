import { getAppleBooks } from "../../providers/apple-books";
import ogs from "open-graph-scraper";

import resultsAudiobook from "./apple-books/id1442351802-result.json";
import resultsEbook from "./apple-books/id1268516837-result";

import resultTimeWar from "./apple-books/id1470137739-result.json";

jest.mock("open-graph-scraper");

describe("getAppleBooks", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return book metadata", async () => {
    ogs.mockResolvedValue({
      result: resultsAudiobook,
    });

    const result = await getAppleBooks({
      inputIdentifier:
        "https://books.apple.com/us/audiobook/circe/id1442351802",
      dateType: {},
      bookStatus: "started",
      tags: ["Test Tag"],
      setImage: true,
      filename: "test.json",
      providers: [],
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "authors": [
          "Madeline Miller",
        ],
        "categories": [
          "Fiction",
        ],
        "description": "This #1 New York Times bestseller is a "bold and subversive retelling of the goddess's story" that brilliantly reimagines the life of Circe, formidable sorceress of The Odyssey (Alexandra Alter, The New York Times ). In the house of Helios, god of the sun and mi…",
        "format": "audiobook",
        "identifier": "id1442351802",
        "identifiers": {
          "apple": "id1442351802",
        },
        "image": "book-id1442351802.png",
        "language": undefined,
        "link": "https://books.apple.com/us/audiobook/circe/id1442351802",
        "publishedDate": "2018-04-10T00:00:00.000Z",
        "status": "started",
        "tags": [
          "Test Tag",
        ],
        "thumbnail": "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/a5/3e/4a/a53e4acc-e48e-5184-db00-568fb3cc1216/9781478975311.jpg/1200x630wp.png",
        "title": "Circe",
      }
    `);
  });

  it("should return book metadata, timewar", async () => {
    ogs.mockResolvedValue({
      result: resultTimeWar,
    });

    const result = await getAppleBooks({
      inputIdentifier:
        "https://books.apple.com/us/audiobook/this-is-how-you-lose-the-time-war-unabridged/id1470137739",
      dateType: {},
      bookStatus: "started",
      tags: ["Test Tag"],
      setImage: true,
      filename: "test.json",
      providers: [],
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "authors": [
          "Amal El-Mohtar",
          "Max Gladstone",
        ],
        "categories": [
          "Sci-Fi",
          "Fantasy",
        ],
        "description": "“[An] exquisitely crafted tale...Part epistolary romance, part mind-blowing science fiction adventure, this dazzling story unfolds bit by bit, revealing layers of meaning as it plays with cause and effect, wildly imaginative…",
        "format": "audiobook",
        "identifier": "id1470137739",
        "identifiers": {
          "apple": "id1470137739",
        },
        "image": "book-id1470137739.png",
        "language": undefined,
        "link": "https://books.apple.com/us/audiobook/this-is-how-you-lose-the-time-war-unabridged/id1470137739",
        "publishedDate": "2019-07-16T00:00:00.000Z",
        "status": "started",
        "tags": [
          "Test Tag",
        ],
        "thumbnail": "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/6c/5d/8c/6c5d8cd5-7c11-d20d-431d-9b41b7ff5ed6/9781508287056.jpg/1200x630wp.png",
        "title": "This Is How You Lose The Time War (Unabridged)",
      }
    `);
  });

  it("should return book metadata", async () => {
    ogs.mockResolvedValue({
      result: resultsEbook,
    });

    const result = await getAppleBooks({
      inputIdentifier:
        "https://books.apple.com/us/audiobook/circe/id1442351802",
      dateType: {},
      bookStatus: "started",
      tags: ["Test Tag"],
      setImage: true,
      filename: "test.json",
      providers: [],
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "authors": [
          "Madeline Miller",
        ],
        "categories": [
          "Historical Fiction",
          "Books",
          "Fiction &amp; Literature",
          "Literary Fiction",
          "Classics",
        ],
        "description": "This #1 New York Times bestseller is a "bold and subversive retelling of the goddess's story" that brilliantly reimagines the life of Circe, formidable sorceress of The Odyssey (Alexandra Alter, The New York Times ). In the house of Helios, god of the sun and mi…",
        "format": "book",
        "identifier": "id1442351802",
        "identifiers": {
          "apple": "id1442351802",
        },
        "image": "book-id1442351802.png",
        "language": "en-US",
        "link": "https://books.apple.com/us/audiobook/circe/id1442351802",
        "pageCount": 400,
        "publishedDate": "2018-04-10T00:00:00.000Z",
        "status": "started",
        "tags": [
          "Test Tag",
        ],
        "thumbnail": "https://is1-ssl.mzstatic.com/image/thumb/Publication113/v4/a4/fa/48/a4fa4887-5d06-88e8-77e0-5638afc376cd/9780316556330.jpg/1200x630wz.png",
        "title": "Circe",
      }
    `);
  });

  it("should return book metadata when missing some data", async () => {
    const modifiedResultsEbook = {
      ...resultsEbook,
      jsonLD: [
        {
          ...resultsEbook.jsonLD[0],
          author: undefined,
          genre: undefined,
        },
      ],
    };
    ogs.mockResolvedValue({
      result: modifiedResultsEbook,
    });

    const result = await getAppleBooks({
      inputIdentifier:
        "https://books.apple.com/us/audiobook/circe/id1442351802",
      dateType: {},
      bookStatus: "started",
      tags: ["Test Tag"],
      setImage: true,
      filename: "test.json",
      providers: [],
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "authors": [],
        "categories": [],
        "description": "This #1 New York Times bestseller is a "bold and subversive retelling of the goddess's story" that brilliantly reimagines the life of Circe, formidable sorceress of The Odyssey (Alexandra Alter, The New York Times ). In the house of Helios, god of the sun and mi…",
        "format": "book",
        "identifier": "id1442351802",
        "identifiers": {
          "apple": "id1442351802",
        },
        "image": "book-id1442351802.png",
        "language": "en-US",
        "link": "https://books.apple.com/us/audiobook/circe/id1442351802",
        "pageCount": 400,
        "publishedDate": "2018-04-10T00:00:00.000Z",
        "status": "started",
        "tags": [
          "Test Tag",
        ],
        "thumbnail": "https://is1-ssl.mzstatic.com/image/thumb/Publication113/v4/a4/fa/48/a4fa4887-5d06-88e8-77e0-5638afc376cd/9780316556330.jpg/1200x630wz.png",
        "title": "Circe",
      }
    `);
  });

  it("should return book metadata when missing schema", async () => {
    const modifiedResultsAudiobook = { ...resultsAudiobook };
    delete modifiedResultsAudiobook.jsonLD;
    ogs.mockResolvedValue({
      result: modifiedResultsAudiobook,
    });

    const result = await getAppleBooks({
      inputIdentifier:
        "https://books.apple.com/us/audiobook/circe/id1442351802",
      dateType: {},
      bookStatus: "started",
      tags: ["Test Tag"],
      setImage: true,
      filename: "test.json",
      providers: [],
      rating: "5",
      notes: "Test notes",
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "authors": [],
        "description": "Fiction · 2018",
        "identifier": "id1442351802",
        "identifiers": {
          "apple": "id1442351802",
        },
        "image": "book-id1442351802.png",
        "link": "https://books.apple.com/us/audiobook/circe/id1442351802",
        "notes": "Test notes",
        "publishedDate": undefined,
        "rating": "5",
        "status": "started",
        "tags": [
          "Test Tag",
        ],
        "thumbnail": "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/a5/3e/4a/a53e4acc-e48e-5184-db00-568fb3cc1216/9781478975311.jpg/1200x630wp.png",
        "title": "Circe",
      }
    `);
  });

  it("should throw an error when ogs throws an error", async () => {
    const error = new Error("Test error");
    ogs.mockImplementation(() => {
      throw error;
    });

    await expect(
      getAppleBooks({ inputIdentifier: "test" })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Cannot read properties of undefined (reading 'error')"`
    );
  });
});
