import { getLibby, parseLibbyPage } from "../../providers/libby";
import ogs from "open-graph-scraper";
import { readFileSync } from "fs";

import resultsAudiobook from "./libby/9575390-result.json";
const resultHtmlAudiobook = readFileSync(
  "./src/__tests__/providers/libby/9575390-html.html",
  "utf8"
);

import resultsEbook from "./libby/10217112-result.json";
const resultHtmlEbook = readFileSync(
  "./src/__tests__/providers/libby/10217112-html.html",
  "utf8"
);

jest.mock("open-graph-scraper");

describe("getLibby", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return book metadata when ogs succeeds, without html", async () => {
    ogs.mockResolvedValue({
      result: {
        success: true,
        ogTitle: "Test Title",
        ogDescription: "Test Description",
        ogImage: [{ url: "Test Image URL" }],
        bookReleaseDate: "Test Release Date",
        customMetaTags: {
          authors: ["Test Author"],
        },
      },
      html: "",
    });

    const result = await getLibby({
      inputIdentifier: "test",
      dateType: {},
      bookStatus: "started",
      filename: "test.json",
      providers: [],
      rating: "Test Rating",
      tags: ["Test Tag"],
      setImage: true,
      notes: "Test Notes",
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "authors": [
          "Test Author",
        ],
        "description": "Test Description",
        "identifier": "test",
        "identifiers": {
          "libby": "test",
        },
        "image": "book-test.png",
        "link": "test",
        "notes": "Test Notes",
        "publishedDate": "Test Release Date",
        "rating": "Test Rating",
        "status": "started",
        "tags": [
          "Test Tag",
        ],
        "thumbnail": "Test Image URL",
        "title": "Test Title",
      }
    `);
  });

  it("should return book metadata when ogs succeeds with html", async () => {
    ogs.mockResolvedValue({
      result: resultsAudiobook,
      html: resultHtmlAudiobook,
    });

    const result = await getLibby({
      inputIdentifier: "https://share.libbyapp.com/title/9575390",
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
          "Costanza Casati",
        ],
        "categories": [
          "Fiction",
          "Literature",
          "Mythology",
          "Historical Fiction",
        ],
        "description": "Monarch. Mother. Murderer. Magnificent. You were born to a king, but you marry a tyrant. You stand by helplessly as he sacrifices your child to placate the gods. You watch him wage war on a foreign shore, and you comfort yourself with violent thoughts of your own. Because this was not the first offense against you. This was not the life you ever deserved. And this will not be your undoing. Slowly, you plot. When y...",
        "format": "audiobook",
        "identifier": "9575390",
        "identifiers": {
          "libby": "9575390",
        },
        "image": "book-9575390.png",
        "link": "https://share.libbyapp.com/title/9575390",
        "publishedDate": "2023-05-02",
        "publisher": "Recorded Books, Inc.",
        "status": "started",
        "tags": [
          "Test Tag",
        ],
        "thumbnail": "https://img2.od-cdn.com/ImageType-100/1694-1/{28ED6EE0-D071-4C51-9059-7BBE9EAA33DC}IMG100.JPG",
        "title": "Clytemnestra",
      }
    `);
  });

  it("should return book metadata when ogs succeeds with html (ebook)", async () => {
    ogs.mockResolvedValue({
      result: resultsEbook,
      html: resultHtmlEbook,
    });

    const result = await getLibby({
      inputIdentifier: "https://share.libbyapp.com/title/9575390",
      dateType: {},
      bookStatus: "started",
      setImage: true,
      filename: "test.json",
      providers: [],
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "authors": [
          "Kaliane Bradley",
        ],
        "categories": [
          "Fiction",
          "Literature",
          "Romance",
          "Science Fiction",
        ],
        "description": "NEW YORK TIMES BESTSELLER  This summer’s hottest debut. - Cosmopolitan • “Witty, sexy escapist fiction [that] packs a substantial punch...It’s a smart, gripping work that’s also a feast for the senses...Fresh and thrilling.” - Los Angeles Times • “Electric...I loved every second.” - Emily HenryUtterly winning...Imagine if The Time Traveler’s Wife had an affair with A Gent...",
        "format": "ebook",
        "identifier": "9575390",
        "identifiers": {
          "isbn": "9781668045169",
          "libby": "9575390",
        },
        "image": "book-9575390.png",
        "link": "https://share.libbyapp.com/title/9575390",
        "publishedDate": "2024-05-07",
        "publisher": "Avid Reader Press / Simon & Schuster",
        "status": "started",
        "thumbnail": "https://img2.od-cdn.com/ImageType-100/0439-1/{7F19308B-74E6-41AD-8B9D-3943B4829D54}IMG100.JPG",
        "title": "The Ministry of Time",
      }
    `);
  });

  it("should throw an error when ogs throws an error", async () => {
    const error = new Error("Test error");
    ogs.mockImplementation(() => {
      throw error;
    });

    await expect(
      getLibby({ inputIdentifier: "test" })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to get book from Libby: Error: Test error"`
    );
  });

  it("should return book metadata when ogs succeeds, missing some data", async () => {
    ogs.mockResolvedValue({
      result: {
        success: true,
        ogTitle: "Test Title",
        ogDescription: "Test Description",
        bookReleaseDate: "Test Release Date",
      },
      html: `<h2 class="share-category">Library</h2><table class='share-table-1d'><tr><th></th><td></td></tr></table>`,
    });

    const result = await getLibby({
      inputIdentifier: "test",
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
        "description": "Test Description",
        "identifier": "test",
        "identifiers": {
          "libby": "test",
        },
        "image": "book-test.png",
        "link": "test",
        "publishedDate": "Test Release Date",
        "status": "started",
        "tags": [
          "Test Tag",
        ],
        "thumbnail": "",
        "title": "Test Title",
      }
    `);
  });

  it("should return book metadata when ogs succeeds, table data", async () => {
    ogs.mockResolvedValue({
      result: {
        success: true,
        ogTitle: "Test Title",
        ogDescription: "Test Description",
        bookReleaseDate: "Test Release Date",
      },
      html: `<table class='share-table-1d'><tr><th>Subjects</th><td></td></tr></table>`,
    });

    const result = await getLibby({
      inputIdentifier: "test",
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
        "description": "Test Description",
        "identifier": "test",
        "identifiers": {
          "libby": "test",
        },
        "image": "book-test.png",
        "link": "test",
        "publishedDate": "Test Release Date",
        "status": "started",
        "tags": [
          "Test Tag",
        ],
        "thumbnail": "",
        "title": "Test Title",
      }
    `);
  });
});

describe("parseLibbyPage", () => {
  it("should parse HTML and return shareCategory and htmlData", () => {
    const html = `
      <html>
        <body>
          <div class="share-category">Audiobook</div>
          <table class="share-table-1d">
            <tr>
              <th>Subjects</th>
              <td>Test, Data</td>
            </tr>
            <tr>
              <th>Publisher</th>
              <td>Test Publisher</td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const result = parseLibbyPage(html);

    expect(result).toMatchInlineSnapshot(`
      {
        "categories": [
          "Test",
          "Data",
        ],
        "format": "audiobook",
        "publisher": "Test Publisher",
      }
    `);
  });

  it("should parse HTML and return shareCategory and htmlData with some missing data", () => {
    const html = `
      <html>
        <body>
          <div class="share-category">Test Category</div>
          <table class="share-table-1d">
            <tr>
              <th>Subjects</th>
            </tr>
          </table>
        </body>
      </html>
    `;

    const result = parseLibbyPage(html);

    expect(result).toMatchInlineSnapshot(`{}`);
  });

  it("should parse HTML and return undefined shareCategory and htmlData", () => {
    const html = `
      <html>
        <body>
        </body>
      </html>
    `;

    const result = parseLibbyPage(html);

    expect(result).toMatchInlineSnapshot(`{}`);
  });
});
