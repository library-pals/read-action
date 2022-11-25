import yearReview, { yearReviewSummary } from "../tools/year-review";
import books from "../../_data/read.json";

describe("yearReviewSummary", () => {
  it("works", () => {
    const result = yearReview(books, 2022);
    expect(yearReviewSummary(result)).toMatchInlineSnapshot(`
      "In 2022, I read 111 books.

      On average, I finished a book in about 2.1 days.

      I read the most books in September when I read 15 books and the least amount of books in April when I read 6.

      The genre I read the most was fiction.

      I started and finished 2 books on the same day, “Companion Piece” by Ali Smith and “A Psalm for the Wild-Built” by Becky Chambers.

      On average, the books I read were around 306 pages. The longest book I read was 678 pages,“Caste” by Isabel Wilkerson, and the shortest was 93 pages, “We Had to Remove This Post” by Hanna Bervoets.

      My most popular author was Emily St. John Mandel, I read 6 books by this author.

      I tagged 40 books with “recommend.” I tagged 1 book with “content warning.”"
    `);
  });

  it("works, 2021", () => {
    const result = yearReview(books, 2021);
    expect(yearReviewSummary(result)).toMatchInlineSnapshot(`
      "In 2021, I read 69 books.

      I read the most books in May when I read 9 books and the least amount of books in March when I read 3.

      The genre I read the most was fiction.

      On average, the books I read were around 285 pages. The longest book I read was 480 pages,“Salt, Fat, Acid, Heat” by Samin Nosrat, and the shortest was 31 pages, “The Malleability of Blackness” by Bersabel Tadesse.

      My most popular author was Ottessa Moshfegh, I read 3 books by this author.

      I tagged 25 books with “recommend.”"
    `);
  });

  it("works, 2020", () => {
    const result = yearReview(books, 2020);
    expect(yearReviewSummary(result)).toMatchInlineSnapshot(`
      "In 2020, I read 22 books.

      I read the most books in February when I read 3 books and the least amount of books in June when I read 1.

      The genre I read the most was fiction.

      On average, the books I read were around 256 pages. The longest book I read was 368 pages,“I'll Be Gone in the Dark” by Michelle McNamara, and the shortest was 59 pages, “Practical Pair Programming” by Jason Garber.

      My most popular author was Roxane Gay, I read 2 books by this author.

      I tagged 13 books with “recommend.”"
    `);
  });
});

describe("yearReview", () => {
  it("works", () => {
    const result = yearReview(books, 2022);
    expect(result).toMatchInlineSnapshot(`
      {
        "categories": {
          "mostReadCategory": "Fiction",
        },
        "count": 111,
        "dates": {
          "averageFinishTime": 2.066666666666667,
          "finishedInOneDay": {
            "books": [
              {
                "authors": "Ali Smith",
                "isbn": "9780593316382",
                "pageCount": 170,
                "title": "“Companion Piece”",
              },
              {
                "authors": "Becky Chambers",
                "isbn": "9781250236227",
                "pageCount": 102,
                "title": "“A Psalm for the Wild-Built”",
              },
            ],
            "count": 2,
          },
          "leastReadMonth": {
            "count": 6,
            "month": "April",
          },
          "mostReadMonth": {
            "count": 15,
            "month": "September",
          },
        },
        "length": {
          "averageBookLength": 306,
          "longestBook": {
            "authors": "Isabel Wilkerson",
            "isbn": "9781432885168",
            "pageCount": 678,
            "title": "“Caste”",
          },
          "shortestBook": {
            "authors": "Hanna Bervoets",
            "isbn": "9780358622345",
            "pageCount": 93,
            "title": "“We Had to Remove This Post”",
          },
        },
        "popularAuthor": {
          "count": 6,
          "popularAuthor": "Emily St. John Mandel",
        },
        "tags": {
          "content warning": 1,
          "recommend": 40,
        },
        "year": 2022,
      }
    `);
  });
});
