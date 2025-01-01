import { BookStatus, NewBook } from "./new-book";
import {
  mAverageDays,
  mMostReadMonth,
  mGenre,
  mSameDay,
  mAverageLength,
  mTopAuthors,
  mTags,
  mFormat,
} from "./summary-markdown";
import { capitalize, DateTypes } from "./utils";

export function summaryMarkdown(
  library: NewBook[],
  dateType: DateTypes,
  bookStatus: BookStatus
): string {
  const { BookTitle } = process.env;
  const isSummary = bookStatus === "summary";
  const title = isSummary ? "Reading summary" : "Updated library";
  const bookTitleLine = !isSummary
    ? `${capitalize(bookStatus)}: “${BookTitle}”`
    : "";
  const yearReview = dateType.summaryEndDate
    ? yearReviewSummary(library, dateType.summaryEndDate.slice(0, 4))
    : "";
  const yearComparison = dateType.summaryEndDate ? yearOverYear(library) : "";
  const markdownLines = [
    `# ${title}`,
    bookTitleLine,
    yearReview,
    yearComparison,
  ];
  return markdownLines.filter(Boolean).join("\n\n");
}

export function yearOverYear(books: NewBook[]): string {
  const years = getUniqueYears(books);
  if (years.length < 2) return "";

  const allYearsData = years
    .map((year) => yearReview(books, year))
    .filter(Boolean) as YearReview[];
  const table = generateYearComparisonTable(allYearsData);

  return `## Year over year

| Year | Books read |
| ---: | ---: |
${table}`.trim();
}

function getUniqueYears(books: NewBook[]): string[] {
  return Array.from(
    new Set(books.map((b) => b.dateFinished?.slice(0, 4)).filter(Boolean))
  ) as string[];
}

function generateYearComparisonTable(allYearsData: YearReview[]): string {
  return allYearsData
    .map((yearData) => `| ${yearData.year} | ${yearData.count} |`)
    .sort((a, b) => {
      const aYear = parseInt(a.split("|")[1].trim());
      const bYear = parseInt(b.split("|")[1].trim());
      return bYear - aYear;
    })
    .join("\n");
}

export function yearReviewSummary(books: NewBook[], year: string) {
  const obj = yearReview(books, year);
  if (obj === undefined) return undefined;
  const summary = [
    "",
    `## ${year} reading summary`,
    "",
    `- **Total books:** ${obj.count}`,
    ...mAverageDays(obj),
    ...mMostReadMonth(obj),
    ...mGenre(obj),
    ...mFormat(obj),
    ...mSameDay(obj),
    ...mAverageLength(obj),
    ...mTopAuthors(obj),
    ...mTags(obj),
  ];
  return summary.join("\n");
}

export function yearReview(
  books: NewBook[],
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
  const booksByPageCount = sortBooksByPageCount(booksThisYear);
  const longestBook = booksByPageCount[0] || undefined;
  const shortestBook =
    booksByPageCount[booksByPageCount.length - 1] || undefined;
  const topGenres = findTopItems(booksThisYear, "categories", toLowerCase);
  const topFormats = findTopItems(booksThisYear, "format");
  const groupByMonth = bGroupByMonth(booksThisYear);
  const mostReadMonth = getKeyFromBiggestValue(groupByMonth);
  const leastReadMonth = getKeyFromSmallestValue(groupByMonth);
  const finishedInOneDay = booksThisYear.filter(
    (b) => b.dateStarted === b.dateFinished
  );
  const topAuthors = findTopItems(booksThisYear, "authors");
  const averageFinishTime = average(
    booksThisYear.filter((b) => b.finishTime).map((b) => b.finishTime)
  );
  const bookLengths = booksThisYear.map((b) => b.pageCount).filter((f) => f);
  const averageBookLength =
    bookLengths.length > 0 ? Math.round(average(bookLengths)) : undefined;
  const totalPages = bookLengths.reduce(
    (total: number, book: number) => book + total,
    0
  );
  const tags = findTopItems(booksThisYear, "tags");

  // istanbul ignore next
  return {
    year,
    count,
    topAuthors,
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
        books:
          finishedInOneDay.length > 0
            ? finishedInOneDay.map(simpleData).filter((b) => b !== undefined)
            : [],
      },
    },
    topGenres,
    topFormats,
    length: {
      longestBook: simpleData(longestBook),
      shortestBook: simpleData(shortestBook),
      averageBookLength,
      totalPages,
    },
    tags,
  };
}

function simpleData(book: NewBook) {
  if (!book) return;
  return {
    title: `“${book.title}”`,
    authors: book.authors?.join(", "),
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
  topAuthors?: { name: string; count: number }[];
  dates?: {
    averageFinishTime: number;
    mostReadMonth: { month: string; count: number };
    leastReadMonth: { month: string; count: number };
    finishedInOneDay: {
      count: number;
      books: {
        title: string | undefined;
        authors: string | undefined;
        pageCount: number | undefined;
      }[];
    };
  };
  topGenres?: { name: string; count: number }[];
  topFormats?: { name: string; count: number }[];
  tags?: { name: string; count: number }[];
  length?: {
    longestBook:
      | {
          title: string | undefined;
          authors: string | undefined;
          pageCount: number | undefined;
        }
      | undefined;
    shortestBook:
      | {
          title: string | undefined;
          authors: string | undefined;
          pageCount: number | undefined;
        }
      | undefined;
    averageBookLength: number | undefined;
    totalPages: number | undefined;
  };
};

function bBooksThisYear(books: NewBook[], year: string) {
  return books
    .filter((f) => f.dateFinished?.startsWith(year))
    .map((b) => ({
      ...b,
      format: b.format?.toLowerCase(),
      finishTime:
        b.dateFinished !== undefined && b.dateStarted !== undefined
          ? Math.floor(
              (Date.parse(b.dateFinished) - Date.parse(b.dateStarted)) /
                86400000
            )
          : undefined,
    }));
}

function sortBooksByPageCount(booksThisYear: NewBook[]): NewBook[] {
  // istanbul ignore next
  return booksThisYear
    .filter((book) => book.pageCount !== undefined && book.pageCount > 0)
    .sort((a, b) => (b.pageCount ?? 0) - (a.pageCount ?? 0));
}

function bGroupByMonth(booksThisYear: NewBook[]) {
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

function findTopItems(
  booksThisYear: NewBook[],
  key: string,
  valueTransform?
): { name: string; count: number }[] {
  const items = booksThisYear
    .map((book) => book[key])
    .flat()
    .filter((f) => f)
    .map((f) => (valueTransform ? valueTransform(f) : f))
    .reduce((obj, item: string) => {
      if (!obj[item]) obj[item] = 0;
      obj[item]++;
      return obj;
    }, {});
  const itemsArr = Object.keys(items)
    .map((a) => ({ name: a, count: items[a] }))
    .filter((f) => f.count > 1);
  return itemsArr.sort((a, b) => b.count - a.count).slice(0, 3);
}

function toLowerCase(s: string) {
  return s.toLowerCase().trim();
}
