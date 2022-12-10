import { CleanBook } from "./clean-book";

function s(num: number) {
  return num === 1 ? "" : "s";
}

export function yearReviewSummary(obj: YearReview | undefined) {
  if (obj === undefined) return undefined;
  const moreThanOne = obj.count > 1;
  const summary = [
    `- **Total books:** ${obj.count}`,

    ...(obj.dates && obj.dates.averageFinishTime && moreThanOne
      ? [
          `- **Average days to finish:** ${obj.dates.averageFinishTime.toFixed(
            1
          )}`,
        ]
      : []),

    ...(obj.dates &&
    obj.dates.mostReadMonth.count !== obj.dates.leastReadMonth.count
      ? [
          `- **Month with most books:** ${obj.dates.mostReadMonth.month} (${
            obj.dates.mostReadMonth.count
          } book${s(obj.dates.mostReadMonth.count)})
- **Month with least books:** ${obj.dates.leastReadMonth.month} (${
            obj.dates.leastReadMonth.count
          } book${s(obj.dates.leastReadMonth.count)})`,
        ]
      : []),

    ...(obj.categories?.mostReadCategory && moreThanOne
      ? [
          `- **Most popular genre:** ${obj.categories.mostReadCategory.toLowerCase()}`,
        ]
      : []),

    ...(obj.dates && obj.dates.finishedInOneDay.count
      ? [
          `- **Started and finished on the same day:** ${
            obj.dates.finishedInOneDay.count
          } book${s(obj.dates.finishedInOneDay.count)}, ${and(
            obj.dates.finishedInOneDay.books.map(
              (book) => `${book.title} by ${book.authors}`
            )
          )}`,
        ]
      : []),
    ...(obj.length && obj.length.averageBookLength && moreThanOne
      ? [
          `- **Average book length:** ${obj.length.averageBookLength} pages
- **Longest book:** ${obj.length.longestBook.pageCount} pages, ${obj.length.longestBook.title} by ${obj.length.longestBook.authors}
- **Shortest book:** ${obj.length.shortestBook.pageCount} pages, ${obj.length.shortestBook.title} by ${obj.length.shortestBook.authors}`,
        ]
      : []),
    ...(obj.popularAuthor && obj.popularAuthor.count > 1 && moreThanOne
      ? [
          `- **Most popular author:** ${obj.popularAuthor.popularAuthor} (${obj.popularAuthor.count} books)`,
        ]
      : []),
    ...(obj.tags && Object.keys(obj.tags).length > 0
      ? [
          `- **Tags:** ${Object.keys(obj.tags)
            .map(
              (tag) => `${obj.tags[tag]} book${s(obj.tags[tag])} with “${tag}”`
            )
            .join(", ")}`,
        ]
      : []),
  ];
  return summary.join("\n");
}

export default function yearReview(
  books: CleanBook[],
  year: string
): YearReview | undefined {
  if (books.length === 0) return undefined;
  const booksThisYear = books
    .filter((f) => f.dateFinished?.startsWith(year))
    .map((b) => ({
      ...b,
      finishTime:
        b.dateFinished !== undefined && b.dateStarted !== undefined
          ? Math.floor(
              (Date.parse(b.dateFinished) - Date.parse(b.dateStarted)) /
                86400000
            )
          : undefined,
    }))
    .sort((a, b) =>
      b.pageCount && a.pageCount ? b.pageCount - a.pageCount : -1
    );

  const count = booksThisYear.length;
  if (count === 0) return undefined;
  if (count < 5)
    return {
      year,
      count,
    };

  const longestBook = booksThisYear[0];
  const shortestBook = booksThisYear[count - 1];

  const categories = groupBy(booksThisYear, "categories");

  const mostReadCategory = getKeyFromBiggestValue(categories);

  // month with most books read
  const groupByMonth = groupBy(
    booksThisYear.map((b) => {
      const match =
        b.dateFinished && b.dateFinished.match(/\d\d\d\d-(\d\d)-\d\d/);
      return {
        ...b,
        ...(b.dateFinished &&
          match && {
            dateFinished: match[1],
          }),
      };
    }),
    "dateFinished"
  );

  const mostReadMonth = getKeyFromBiggestValue(groupByMonth);
  const leastReadMonth = getKeyFromSmallestValue(groupByMonth);

  const monthToWord = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December",
  };

  // same date start finish
  const finishedInOneDay = booksThisYear.filter(
    (b) => b.dateStarted === b.dateFinished
  );

  // popular author
  const authors = groupBy(booksThisYear, "authors");
  const popularAuthor = getKeyFromBiggestValue(authors);

  // average finish tme
  const averageFinishTime = average(
    booksThisYear.filter((b) => b.finishTime).map((b) => b.finishTime)
  );

  const bookLengths = booksThisYear.map((b) => b.pageCount).filter((f) => f);
  // average book length
  const averageBookLength =
    bookLengths.length > 0 ? Math.round(average(bookLengths)) : undefined;

  // tags
  const tags = booksThisYear
    .filter((book) => book.tags !== undefined)
    .map((book) => book.tags)
    .flat()
    .reduce((obj, k: string) => {
      if (!obj[k]) obj[k] = 0;
      obj[k]++;
      return obj;
    }, {});

  return {
    year,
    count,
    popularAuthor: {
      popularAuthor,
      count: authors[popularAuthor],
    },
    dates: {
      averageFinishTime,
      mostReadMonth: {
        month: monthToWord[mostReadMonth],
        count: booksThisYear.filter((f) =>
          f.dateFinished?.startsWith(`${year}-${mostReadMonth}`)
        ).length,
      },
      leastReadMonth: {
        month: monthToWord[leastReadMonth],
        count: booksThisYear.filter((f) =>
          f.dateFinished?.startsWith(`${year}-${leastReadMonth}`)
        ).length,
      },
      finishedInOneDay: {
        count: finishedInOneDay.length,
        books: finishedInOneDay.map(simpleData),
      },
    },
    categories: {
      mostReadCategory,
    },
    length: {
      longestBook: simpleData(longestBook),
      shortestBook: simpleData(shortestBook),
      averageBookLength,
    },
    tags,
  };
}

function simpleData(book: CleanBook) {
  return {
    title: `“${book.title}”`,
    authors: book.authors?.join(", "),
    isbn: book.isbn,
    pageCount: book.pageCount,
  };
}

function getKeyFromBiggestValue(object) {
  return Object.keys(object).reduce((a, b) => (object[a] > object[b] ? a : b));
}

function getKeyFromSmallestValue(object) {
  return Object.keys(object).reduce((a, b) => (object[a] > object[b] ? b : a));
}

function groupBy(array, key) {
  return array
    .filter((b) => b[key])
    .map((b) => b[key])
    .reduce((obj, k) => {
      if (!obj[k]) obj[k] = 0;
      obj[k]++;
      return obj;
    }, {});
}

const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

export type YearReview = {
  year: string;
  count: number;
  popularAuthor?: { popularAuthor: string; count: any };
  dates?: {
    averageFinishTime: number;
    mostReadMonth: { month: any; count: number };
    leastReadMonth: { month: any; count: number };
    finishedInOneDay: {
      count: number;
      books: {
        title: string | undefined;
        authors: string | undefined;
        isbn: string;
        pageCount: number | undefined;
      }[];
    };
  };
  categories?: {
    mostReadCategory: string;
  };
  tags?: any;
  length?: {
    longestBook: {
      title: string | undefined;
      authors: string | undefined;
      isbn: string;
      pageCount: number | undefined;
    };
    shortestBook: {
      title: string | undefined;
      authors: string | undefined;
      isbn: string;
      pageCount: number | undefined;
    };
    averageBookLength: number | undefined;
  };
};

function and(array: string[]) {
  const lf = new Intl.ListFormat("en");
  return lf.format(array);
}
