import { CleanBook } from "./clean-book";
import {
  mAverageDays,
  mMostReadMonth,
  mGenre,
  mSameDay,
  mAverageLength,
  mPopularAuthor,
  mTags,
} from "./summary-markdown";

export default function yearReviewSummary(books: CleanBook[], year: string) {
  const obj = yearReview(books, year);
  if (obj === undefined) return undefined;
  const summary = [
    `- **Total books:** ${obj.count}`,
    ...mAverageDays(obj),
    ...mMostReadMonth(obj),
    ...mGenre(obj),
    ...mSameDay(obj),
    ...mAverageLength(obj),
    ...mPopularAuthor(obj),
    ...mTags(obj),
  ];
  return summary.join("\n");
}

export function yearReview(
  books: CleanBook[],
  year: string
): YearReview | undefined {
  if (books.length === 0) return undefined;
  const booksThisYear = bBooksThisYear(books, year);
  const count = booksThisYear.length;
  if (count === 0) return undefined;
  if (count < 5) {
    return {
      year,
      count,
    };
  }
  const longestBook = booksThisYear[0];
  const shortestBook = booksThisYear[count - 1];
  const topGenres = bTopGenres(booksThisYear);
  const groupByMonth = bGroupByMonth(booksThisYear);
  const mostReadMonth = getKeyFromBiggestValue(groupByMonth);
  const leastReadMonth = getKeyFromSmallestValue(groupByMonth);
  const finishedInOneDay = booksThisYear.filter(
    (b) => b.dateStarted === b.dateFinished
  );
  const authors = groupBy(booksThisYear, "authors");
  const popularAuthor = getKeyFromBiggestValue(authors);
  const averageFinishTime = average(
    booksThisYear.filter((b) => b.finishTime).map((b) => b.finishTime)
  );
  const bookLengths = booksThisYear.map((b) => b.pageCount).filter((f) => f);
  const averageBookLength =
    bookLengths.length > 0 ? Math.round(average(bookLengths)) : undefined;
  const tags = bTags(booksThisYear);

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
    topGenres,
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
  topGenres?: { genre: string; count: number }[];
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

function bBooksThisYear(books: CleanBook[], year: string) {
  return books
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
}

function bGroupByMonth(booksThisYear: CleanBook[]) {
  return groupBy(
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
}

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

function bTags(booksThisYear: CleanBook[]) {
  return booksThisYear
    .filter((book) => book.tags !== undefined)
    .map((book) => book.tags)
    .flat()
    .reduce((obj, k: string) => {
      if (!obj[k]) obj[k] = 0;
      obj[k]++;
      return obj;
    }, {});
}

function bTopGenres(booksThisYear: CleanBook[]) {
  const categories = booksThisYear
    .map((book) => book.categories)
    .flat()
    .map((f) => f?.toLowerCase())
    .reduce((obj, cat: string) => {
      if (!obj[cat]) obj[cat] = 0;
      obj[cat]++;
      return obj;
    }, {});
  return Object.keys(categories)
    .map((cat) => ({ genre: cat, count: categories[cat] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 2);
}
