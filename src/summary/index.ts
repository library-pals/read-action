import { CleanBook } from "../clean-book";

function s(num: number) {
  return num === 1 ? "" : "s";
}

export function yearReviewSummary(obj: YearReview) {
  const summary = [
    `In ${obj.year}, I read ${obj.count} books.`,
    ...(obj.dates.averageFinishTime
      ? [
          `On average, I finished a book in about ${obj.dates.averageFinishTime.toFixed(
            1
          )} day${s(obj.dates.averageFinishTime)}.`,
        ]
      : []),
    `I read the most books in ${obj.dates.mostReadMonth.month} when I read ${
      obj.dates.mostReadMonth.count
    } book${s(
      obj.dates.mostReadMonth.count
    )} and the least amount of books in ${
      obj.dates.leastReadMonth.month
    } when I read ${obj.dates.leastReadMonth.count}.`,
    `The genre I read the most was ${obj.categories.mostReadCategory.toLowerCase()}.`,
    ...(obj.dates.finishedInOneDay.count
      ? [
          `I started and finished ${obj.dates.finishedInOneDay.count} book${s(
            obj.dates.finishedInOneDay.count
          )} on the same day, ${and(
            obj.dates.finishedInOneDay.books.map(
              (book) => `${book.title} by ${book.authors}`
            )
          )}.`,
        ]
      : []),
    `On average, the books I read were around ${obj.length.averageBookLength} pages. The longest book I read was ${obj.length.longestBook.pageCount} pages,${obj.length.longestBook.title} by ${obj.length.longestBook.authors}, and the shortest was ${obj.length.shortestBook.pageCount} pages, ${obj.length.shortestBook.title} by ${obj.length.shortestBook.authors}.`,
    `My most popular author was ${obj.popularAuthor.popularAuthor}, I read ${obj.popularAuthor.count} books by this author.`,
    Object.keys(obj.tags)
      .map(
        (tag) =>
          `I tagged ${obj.tags[tag]} book${s(obj.tags[tag])} with “${tag}.”`
      )
      .join(" "),
  ];
  return summary.join("\n\n");
}

export default function yearReview(
  books: CleanBook[],
  year: string
): YearReview {
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

  // average book length
  const averageBookLength = Math.round(
    average(booksThisYear.map((b) => b.pageCount))
  );

  // tags
  const tags = booksThisYear
    .filter((book) => book.tags !== undefined)
    .map((book) => book.tags)
    .flat()
    .reduce((obj, k) => {
      if (!k) return obj;
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
  return Object.keys(object).reduce(function (a, b) {
    return object[a] > object[b] ? a : b;
  });
}

function getKeyFromSmallestValue(object) {
  return Object.keys(object).reduce(function (a, b) {
    return object[a] < object[b] ? a : b;
  });
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
  popularAuthor: { popularAuthor: string; count: any };
  dates: {
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
  categories: {
    mostReadCategory: string;
  };
  tags: any;
  length: {
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
    averageBookLength: number;
  };
};

function and(array: string[]) {
  const lf = new Intl.ListFormat("en");
  return lf.format(array);
}
