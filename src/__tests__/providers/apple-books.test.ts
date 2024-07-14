import { getAppleBooks } from "../../providers/apple-books";
import ogs from "open-graph-scraper";

import resultsAudiobook from "./apple-books/id1442351802-result.json";
import resultsEbook from "./apple-books/id1268516837-result";

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
        "description": "&lt;b&gt;This #1 &lt;i&gt;New York Times &lt;/i&gt;bestseller is a "bold and subversive retelling of the goddess's story" that brilliantly reimagines the life of Circe, formidable sorceress of The Odyssey (Alexandra Alter, &lt;i&gt;The&lt;/i&gt;&lt;i&gt;New York Times&lt;/i&gt;).&lt;/b&gt;&lt;br /&gt;&lt;br /&gt; In the house of Helios, god of the sun and mi…",
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
        "description": "&lt;b&gt;This #1 &lt;i&gt;New York Times &lt;/i&gt;bestseller is a "bold and subversive retelling of the goddess's story" that brilliantly reimagines the life of Circe, formidable sorceress of The Odyssey (Alexandra Alter, &lt;i&gt;The&lt;/i&gt;&lt;i&gt;New York Times&lt;/i&gt;).&lt;/b&gt;&lt;br /&gt;&lt;br /&gt; In the house of Helios, god of the sun and mi…",
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
        "description": "&lt;b&gt;This #1 &lt;i&gt;New York Times &lt;/i&gt;bestseller is a "bold and subversive retelling of the goddess's story" that brilliantly reimagines the life of Circe, formidable sorceress of The Odyssey (Alexandra Alter, &lt;i&gt;The&lt;/i&gt;&lt;i&gt;New York Times&lt;/i&gt;).&lt;/b&gt;&lt;br /&gt;&lt;br /&gt; In the house of Helios, god of the sun and mi…",
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
