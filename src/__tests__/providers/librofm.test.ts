import { getLibrofm, parseResult } from "../../providers/librofm";
import { BookParams } from "../..";
import ogs from "open-graph-scraper";

jest.mock("open-graph-scraper");

describe("librofm", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getLibrofm", () => {
    it("should return a book when ogs returns valid data", async () => {
      const bookParams: BookParams = {
        inputIdentifier: "https://libro.fm/audiobooks/9781797176888",
        dateType: {},
        bookStatus: "started",
        filename: "test.json",
        providers: [],
        rating: "Test Rating",
        tags: ["Test Tag"],
        setImage: true,
        notes: "Test Notes",
      };

      ogs.mockResolvedValue({
        result: {
          success: true,
          ogTitle: "Test Book",
          ogDescription: "Test Description",
          ogImage: [{ url: "test-image-url" }],
        },
      });

      const result = await getLibrofm(bookParams);

      expect(result).toMatchInlineSnapshot(`
        {
          "authors": undefined,
          "description": "Test Description",
          "format": undefined,
          "identifier": "9781797176888",
          "identifiers": {
            "librofm": "9781797176888",
          },
          "image": "book-9781797176888.png",
          "link": "https://libro.fm/audiobooks/9781797176888",
          "notes": "Test Notes",
          "publishedDate": undefined,
          "publisher": undefined,
          "rating": "Test Rating",
          "status": "started",
          "tags": [
            "Test Tag",
          ],
          "thumbnail": "test-image-url",
          "title": "Test Book",
        }
      `);
    });

    it("should return a book", async () => {
      const bookParams: BookParams = {
        inputIdentifier: "https://libro.fm/audiobooks/",
        dateType: {},
        bookStatus: "started",
        filename: "test.json",
        providers: [],
        rating: "Test Rating",
        tags: ["Test Tag"],
        setImage: true,
        notes: "Test Notes",
      };

      ogs.mockResolvedValue({
        result: {
          success: true,
          ogTitle: "Test Book",
          ogDescription: "Test Description",
        },
      });

      const result = await getLibrofm(bookParams);

      expect(result).toMatchInlineSnapshot(`
        {
          "authors": undefined,
          "description": "Test Description",
          "format": undefined,
          "identifier": "https://libro.fm/audiobooks/",
          "identifiers": {
            "librofm": "https://libro.fm/audiobooks/",
          },
          "image": "book-https://libro.fm/audiobooks/.png",
          "link": "https://libro.fm/audiobooks/",
          "notes": "Test Notes",
          "publishedDate": undefined,
          "publisher": undefined,
          "rating": "Test Rating",
          "status": "started",
          "tags": [
            "Test Tag",
          ],
          "thumbnail": "",
          "title": "Test Book",
        }
      `);
    });
    it("should throw an error when ogs fails", async () => {
      const bookParams: BookParams = {
        inputIdentifier: "https://libro.fm/audiobooks/9781797176888",
        dateType: {},
        bookStatus: "started",
        filename: "test.json",
        providers: [],
        rating: "Test Rating",
        tags: ["Test Tag"],
        setImage: true,
        notes: "Test Notes",
      };

      ogs.mockRejectedValueOnce(new Error("Test Error"));

      await expect(
        getLibrofm(bookParams)
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Cannot read properties of undefined (reading 'error')"`
      );
    });
  });

  describe("parseResult", () => {
    it("should return parsed book data when jsonLD is present", () => {
      const result = {
        jsonLD: [
          {
            bookFormat: "another format",
            name: "Test Book",
            description: "Test Description",
            isbn: "1234567890",
            image: "test-image-url",
            author: [{ name: "Test Author" }],
            publisher: "Test Publisher",
            datePublished: "2022-01-01",
          },
        ],
      };

      const parsedResult = parseResult(result);

      expect(parsedResult).toMatchInlineSnapshot(`
        {
          "authors": [
            "Test Author",
          ],
          "description": "Test Description",
          "format": "another format",
          "isbn": "1234567890",
          "publishedDate": "2022-01-01",
          "publisher": "Test Publisher",
          "thumbnail": "test-image-url",
          "title": "Test Book",
        }
      `);
    });

    it("should return parsed book data when jsonLD is not present", () => {
      const result = {
        ogTitle: "Test Book",
        ogDescription: "Test Description",
        ogImage: [{ url: "test-image-url" }],
      };

      const parsedResult = parseResult(result);

      expect(parsedResult).toMatchInlineSnapshot(`
        {
          "authors": undefined,
          "description": "Test Description",
          "format": undefined,
          "isbn": undefined,
          "publishedDate": undefined,
          "publisher": undefined,
          "thumbnail": "test-image-url",
          "title": "Test Book",
        }
      `);
    });
  });
});
