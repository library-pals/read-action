import yearReview, { yearReviewSummary } from "../summary";
import books from "../../_data/read.json";
import lotsOfBooks from "./books.json";

describe("yearReviewSummary", () => {
  it("works", () => {
    const result = yearReview(books, "2022");
    expect(yearReviewSummary(result)).toMatchInlineSnapshot(`
      "In 2022, I read 3 books.

      On average, I finished a book in about 1.0 day.

      I read the most books in September when I read 2 books and the least amount of books in January when I read 1.

      The genre I read the most was fiction.

      On average, the books I read were around 258 pages. The longest book I read was 336 pages,“Woman of Light” by Kali Fajardo-Anstine, and the shortest was 206 pages, “Ain't I a Woman” by bell hooks.

      My most popular author was bell hooks, I read 1 books by this author.

      "
    `);
  });

  it("no books", () => {
    const result = yearReview([], "2022");
    expect(yearReviewSummary(result)).toMatchInlineSnapshot(`undefined`);
  });

  it("no books, this year", () => {
    const result = yearReview(lotsOfBooks, "2021");
    expect(yearReviewSummary(result)).toMatchInlineSnapshot(`undefined`);
  });

  it("no pagecount", () => {
    const result = yearReview(
      [
        {
          isbn: "9780698175174",
          dateFinished: "2022-01-05",
          dateStarted: "2022-01-05",
          title: "Noor",
          authors: ["Nnedi Okorafor"],
          publishedDate: "2021-11-16",
          printType: "BOOK",
          categories: ["Fiction"],
          language: "en",
        },
        {
          isbn: "9780698175174",
          dateFinished: "2022-01-05",
          dateStarted: "2022-01-06",
          title: "Noor",
          authors: ["Nnedi Okorafor"],
          publishedDate: "2021-11-16",
          printType: "BOOK",
          categories: ["Fiction"],
          language: "en",
        },
      ],
      "2022"
    );
    expect(yearReviewSummary(result)).toMatchInlineSnapshot(`
      "In 2022, I read 2 books.

      On average, I finished a book in about -1.0 days.

      The genre I read the most was fiction.

      I started and finished 1 book on the same day, “Noor” by Nnedi Okorafor.

      On average, the books I read were around NaN pages. The longest book I read was undefined pages,“Noor” by Nnedi Okorafor, and the shortest was undefined pages, “Noor” by Nnedi Okorafor.

      My most popular author was Nnedi Okorafor, I read 2 books by this author.

      "
    `);
  });

  it("works, lots", () => {
    const result = yearReview(lotsOfBooks, "2022");
    expect(yearReviewSummary(result)).toMatchInlineSnapshot(`
      "In 2022, I read 13 books.

      I read the most books in January when I read 12 books and the least amount of books in February when I read 1.

      The genre I read the most was fiction.

      I started and finished 1 book on the same day, “Noor” by Nnedi Okorafor.

      On average, the books I read were around 303 pages. The longest book I read was 678 pages,“Caste” by Isabel Wilkerson, and the shortest was 100 pages, “You Should Write a Book” by Katel LeDû, Lisa Maria Marquis.

      My most popular author was Katel LeDû,Lisa Maria Marquis, I read 1 books by this author.

      I tagged 3 books with “recommend.”"
    `);
  });

  it("works, 2021", () => {
    const result = yearReview(books, "2021");
    expect(yearReviewSummary(result)).toMatchInlineSnapshot(`
      "In 2021, I read 2 books.

      The genre I read the most was fiction.

      On average, the books I read were around 432 pages. The longest book I read was 544 pages,“Black Futures” by Kimberly Drew, Jenna Wortham, and the shortest was 320 pages, “Mexican Gothic” by Silvia Moreno-Garcia.

      My most popular author was Silvia Moreno-Garcia, I read 1 books by this author.

      "
    `);
  });

  it("works, 2020", () => {
    const result = yearReview(books, "2020");
    expect(yearReviewSummary(result)).toMatchInlineSnapshot(`
      "In 2020, I read 2 books.

      The genre I read the most was biography & autobiography.

      On average, the books I read were around 264 pages. The longest book I read was 288 pages,“Uncanny Valley” by Anna Wiener, and the shortest was 240 pages, “Luster” by Raven Leilani.

      My most popular author was Raven Leilani, I read 1 books by this author.

      "
    `);
  });
});

describe("yearReview", () => {
  it("works", () => {
    const result = yearReview(books, "2022");
    expect(result).toMatchInlineSnapshot(`
      {
        "categories": {
          "mostReadCategory": "Fiction",
        },
        "count": 3,
        "dates": {
          "averageFinishTime": 1,
          "finishedInOneDay": {
            "books": [],
            "count": 0,
          },
          "leastReadMonth": {
            "count": 1,
            "month": "January",
          },
          "mostReadMonth": {
            "count": 2,
            "month": "September",
          },
        },
        "length": {
          "averageBookLength": 258,
          "longestBook": {
            "authors": "Kali Fajardo-Anstine",
            "isbn": "9780525511342",
            "pageCount": 336,
            "title": "“Woman of Light”",
          },
          "shortestBook": {
            "authors": "bell hooks",
            "isbn": "9781317588610",
            "pageCount": 206,
            "title": "“Ain't I a Woman”",
          },
        },
        "popularAuthor": {
          "count": 1,
          "popularAuthor": "bell hooks",
        },
        "tags": {},
        "year": "2022",
      }
    `);
  });

  it("one book", () => {
    const result = yearReview(
      [
        {
          authors: ["Raven Leilani"],
          dateAdded: "2022-10-01",
          dateFinished: "2022-10-05",
          dateStarted: "2022-10-02",
          description:
            "Sharp, comic, disruptive, tender, Raven Leilani's debut novel, Luster, sees a young black woman fall into art and someone else's open marriage. Edie is stumbling her way through her twenties--sharing a subpar apartment in Bushwick, clocking in and out of her admin job, making a series of inappropriate sexual choices. She's also, secretly, haltingly, figuring her way into life as an artist. And then she meets Eric, a digital archivist with a family in New Jersey, including an autopsist wife who has agreed to an open marriage--with rules. As if navigating the constantly shifting landscapes of contemporary sexual manners and racial politics weren't hard enough, Edie finds herself unemployed and falling into Eric's family life, his home. She becomes a hesitant friend to his wife and a de facto role model to his adopted daughter. Edie is the only black woman who young Akila knows. Razor sharp, darkly comic, sexually charged, socially disruptive, Luster is a portrait of a young woman trying to make her sense of her life in a tumultuous era. It is also a haunting, aching description of how hard it is to believe in your own talent and the unexpected influences that bring us into ourselves along the way.",
          isbn: "9780385696005",
          language: "en",
          link: "https://books.google.com/books/about/Luster.html?hl=&id=eJ06zQEACAAJ",
          pageCount: 240,
          printType: "BOOK",
          publishedDate: "2020-08-04",
          status: "started",
          thumbnail:
            "https://books.google.com/books/content?id=eJ06zQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
          title: "Luster",
        },
      ],
      "2022"
    );
    expect(result).toMatchInlineSnapshot(`
      {
        "count": 1,
        "year": "2022",
      }
    `);

    expect(yearReviewSummary(result)).toMatchInlineSnapshot(
      `"In 2022, I read 1 book."`
    );
  });
});
