import { createMermaidDiagram, ChartType } from "./summary-theme.js";
import { BookStatus, NewBook } from "./new-book.js";
import {
  mAverageDays,
  mMostReadMonth,
  mGenre,
  mSameDay,
  mAverageLength,
  mTopAuthors,
  mTags,
  mFormat,
} from "./summary-markdown.js";
import {
  capitalize,
  DateTypes,
  parseISO8601Duration,
  secondsToHms,
} from "./utils.js";

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
  const endDate = dateType.summaryEndDate
    ? dateType.summaryEndDate.slice(0, 4)
    : "";

  const markdownLines = [
    `# ${title}`,
    bookTitleLine,
    ...(endDate
      ? [
          yearReviewSummary(library, endDate),
          createGenrePieChart(library, endDate),
          createBooksByMonthChart(library, endDate),
          createBooksByMonthPagesChart(library, endDate),
          createdBooksByMonthHoursChart(library, endDate),
          yearOverYear(library),
          createYearBarChart(library),
        ]
      : []),
  ];

  return markdownLines.filter(Boolean).join("\n\n");
}

function parseSecondsToHours(seconds: number): number {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = seconds % 60;
  const totalHours = hours + minutes / 60 + secondsLeft / 3600;
  // round to 1 decimal place
  return Math.round(totalHours * 10) / 10;
}

function createdBooksByMonthHoursChart(books: NewBook[], year: string): string {
  const booksThisYear = bBooksThisYear(books, year);
  const booksWithDuration = booksThisYear.filter(
    (b) => b.durationSeconds && b.durationSeconds > 0
  );
  if (booksWithDuration.length === 0) return "";
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const barData = months.map((month) => {
    const booksInMonth = booksWithDuration.filter((b) =>
      b.dateFinished?.startsWith(`${year}-${month}`)
    );
    return booksInMonth.reduce(
      (total, book) => total + parseSecondsToHours(book.durationSeconds ?? 0),
      0
    );
  });
  const longest = Math.max(...barData);

  const data = {
    title: "Hours by month",
    xAxisLabel: "Month",
    xAxisData: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    yAxisLabel: "Book hours",
    yAxisData: `0 --> ${longest}`,
    barData,
  };

  return createMermaidDiagram(ChartType.XYChart, data, "bar"); // specify "bar" or "line" as needed
}

function createBooksByMonthPagesChart(books: NewBook[], year: string): string {
  const booksThisYear = bBooksThisYear(books, year);
  const booksWithPages = booksThisYear.filter(
    (b) => b.pageCount && b.pageCount > 0
  );
  if (booksWithPages.length === 0) return "";
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const barData = months.map((month) => {
    const booksInMonth = booksWithPages.filter((b) =>
      b.dateFinished?.startsWith(`${year}-${month}`)
    );
    return booksInMonth.reduce(
      (total, book) => total + (book.pageCount ?? 0),
      0
    );
  });
  const mostPages = Math.max(...barData);

  const data = {
    title: "Pages by month",
    xAxisLabel: "Month",
    xAxisData: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    yAxisLabel: "Book pages",
    yAxisData: `0 --> ${mostPages}`,
    barData,
  };

  return createMermaidDiagram(ChartType.XYChart, data, "bar"); // specify "bar" or "line" as needed
}

function createBooksByMonthChart(books: NewBook[], year: string): string {
  const booksThisYear = bBooksThisYear(books, year);
  const groupByMonth = bGroupByMonth(booksThisYear);
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const barData = months.map((month) => groupByMonth[month] || 0);
  const mostReadMonth = Math.max(...barData);

  const data = {
    title: "By month",
    xAxisLabel: "Month",
    xAxisData: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    yAxisLabel: "Books read",
    yAxisData: `0 --> ${mostReadMonth}`,
    barData,
  };

  return createMermaidDiagram(ChartType.XYChart, data, "bar"); // specify "bar" or "line" as needed
}

function createGenrePieChart(books, year): string {
  const booksThisYear = bBooksThisYear(books, year);
  const genres = findTopItems(booksThisYear, "categories", toLowerCase);
  if (genres.length === 0) return "";
  const data = genres
    .map((genre) => `\t"${genre.name}": ${genre.count}`)
    .join("\n");
  return createMermaidDiagram(ChartType.Pie, {
    title: "By genre",
    data,
  });
}

function createYearBarChart(books: NewBook[]): string {
  const years = getUniqueYears(books).sort();
  if (years.length < 2) return "";
  const bookCounts = years.map((year) => bBooksThisYear(books, year).length);
  const maxCount = Math.max(...bookCounts);

  const data = {
    title: "By year",
    xAxisLabel: "Year",
    xAxisData: years.map((year) => Number(year)),
    yAxisLabel: "Books read",
    yAxisData: `0 --> ${maxCount}`,
    barData: bookCounts,
  };

  return createMermaidDiagram(ChartType.XYChart, data, "bar"); // specify "bar" or "line" as needed
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
  const longestBookByPageCount = booksByPageCount[0] || undefined;
  const shortestBookByPageCount =
    booksByPageCount[booksByPageCount.length - 1] || undefined;
  const booksByDuration = sortBooksByDuration(booksThisYear);
  const longestBookByDuration = booksByDuration[0] || undefined;
  const shortestBookByDuration =
    booksByDuration[booksByDuration.length - 1] || undefined;
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
  const bookLengthsByPageCount = booksThisYear
    .map((b) => b.pageCount)
    .filter((f) => f);
  const averageBookLengthByPages =
    bookLengthsByPageCount.length > 0
      ? Math.round(average(bookLengthsByPageCount))
      : undefined;
  const totalPages = bookLengthsByPageCount.reduce(
    (total: number, book: number) => book + total,
    0
  );
  const bookLengthsByDuration = booksThisYear
    .map((b) => b.durationSeconds)
    .filter((f) => f);
  const averageBookLengthByDuration =
    bookLengthsByDuration.length > 0
      ? Math.round(average(bookLengthsByDuration))
      : undefined;
  const totalTime = bookLengthsByDuration.reduce(
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
      longestBookByPageCount: simpleData(longestBookByPageCount),
      shortestBookByPageCount: simpleData(shortestBookByPageCount),
      longestBookByDuration: simpleData(longestBookByDuration),
      shortestBookByDuration: simpleData(shortestBookByDuration),
      averageBookLengthByPages,
      averageBookLengthByDuration: secondsToHms(averageBookLengthByDuration),
      totalTime: secondsToHms(totalTime),
      totalPages,
    },
    tags,
  };
}

function simpleData(book) {
  if (!book) return;
  // istanbul ignore next
  return {
    title: `“${book.title}”`,
    authors: book.authors?.join(", ") || "",
    length: book.pageCount ?? book.durationHours ?? 0,
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
        length: number | string;
      }[];
    };
  };
  topGenres?: { name: string; count: number }[];
  topFormats?: { name: string; count: number }[];
  tags?: { name: string; count: number }[];
  length?: {
    longestBookByPageCount:
      | {
          title: string;
          authors: string;
          length: number | string;
        }
      | undefined;
    shortestBookByPageCount:
      | {
          title: string;
          authors: string;
          length: number | string;
        }
      | undefined;
    longestBookByDuration:
      | {
          title: string;
          authors: string;
          length: number | string;
        }
      | undefined;
    shortestBookByDuration:
      | {
          title: string;
          authors: string;
          length: number | string;
        }
      | undefined;
    averageBookLengthByPages: number | undefined;
    averageBookLengthByDuration: string | undefined;
    totalTime: string;
    totalPages: number | undefined;
  };
};

function bBooksThisYear(books: NewBook[], year: string) {
  return books
    .filter((f) => f.dateFinished?.startsWith(year))
    .map((b) => ({
      ...b,
      format: b.format?.toLowerCase(),
      ...(b.duration && {
        durationSeconds: parseISO8601Duration(b.duration),
        durationHours: secondsToHms(parseISO8601Duration(b.duration)),
      }),
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

function sortBooksByDuration(booksThisYear): NewBook[] {
  // istanbul ignore next
  return booksThisYear
    .filter((book) => book.durationSeconds !== undefined)
    .sort((a, b) => b.durationSeconds - a.durationSeconds);
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
