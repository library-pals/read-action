import { YearReview } from "./summary";

export function s(num: number) {
  return num === 1 ? "" : "s";
}

export function and(array: string[]) {
  const lf = new Intl.ListFormat("en");
  return lf.format(array);
}

export function mAverageDays({ dates }: YearReview) {
  if (!dates || !dates.averageFinishTime) return [];
  return [
    `- **Average read time:** ${dates.averageFinishTime.toFixed(1)} days`,
  ];
}

export function mMostReadMonth({ dates }: YearReview) {
  if (!dates || dates.mostReadMonth.count == dates.leastReadMonth.count)
    return [];
  const { mostReadMonth, leastReadMonth } = dates;
  return [
    `- **Month with most books:** ${mostReadMonth.month} (${
      mostReadMonth.count
    } book${s(mostReadMonth.count)})`,
    `- **Month with least books:** ${leastReadMonth.month} (${
      leastReadMonth.count
    } book${s(leastReadMonth.count)})`,
  ];
}

export function mGenre({ topGenres }: YearReview) {
  if (!topGenres || topGenres.length === 0) return [];
  return [
    `- **Top genre${s(topGenres.length)}:** ${and(
      topGenres.map(({ name, count }) => `${name} (${count} book${s(count)})`)
    )}`,
  ];
}

export function mFormat({ topFormats }: YearReview) {
  if (!topFormats || topFormats.length === 0) return [];
  return [
    `- **Top format${s(topFormats.length)}:** ${and(
      topFormats.map(({ name, count }) => `${name} (${count} book${s(count)})`)
    )}`,
  ];
}

export function mSameDay({ dates }: YearReview) {
  if (!dates || !dates.finishedInOneDay.count) return [];
  const { count, books } = dates.finishedInOneDay;
  return [
    `- **Read in a day:** ${and(
      books.map((book) => `${book.title} by ${book.authors}`)
    )} (${count} book${s(count)})`,
  ];
}

export function mAverageLength({ length }: YearReview): string[] {
  if (!length) return [];

  const result: string[] = [
    ...(length.averageBookLengthByPages
      ? [
          `- **Average book page length:** ${length.averageBookLengthByPages.toLocaleString()}`,
        ]
      : []),
  ];

  addBookLength(
    result,
    "Longest book by page count",
    length.longestBookByPageCount
  );
  addBookLength(
    result,
    "Shortest book by page count",
    length.shortestBookByPageCount
  );

  if (length.totalPages) {
    result.push(
      `- **Total pages read:** ${length.totalPages.toLocaleString()}`
    );
  }

  if (length.averageBookLengthByDuration) {
    result.push(
      `- **Average book length by duration:** ${length.averageBookLengthByDuration}`
    );
  }

  addBookDuration(
    result,
    "Longest book by duration",
    length.longestBookByDuration
  );
  addBookDuration(
    result,
    "Shortest book by duration",
    length.shortestBookByDuration
  );

  if (length.totalTime) {
    result.push(`- **Total hours read:** ${length.totalTime}`);
  }

  return result;
}

function addBookLength(
  result: string[],
  label: string,
  book?: { title: string; authors: string; length: number | string }
) {
  if (book) {
    result.push(
      `- **${label}:** ${book.title} by ${book.authors} (${book.length} pages)`
    );
  }
}

function addBookDuration(
  result: string[],
  label: string,
  book?: { title: string; authors: string; length: number | string }
) {
  if (book) {
    result.push(
      `- **${label}:** ${book.title} by ${book.authors} (${book.length})`
    );
  }
}

export function mTopAuthors({ topAuthors }: YearReview) {
  if (!topAuthors || topAuthors.length === 0) return [];
  return [
    `- **Top author${s(topAuthors.length)}:** ${and(
      topAuthors.map(({ name, count }) => `${name} (${count} book${s(count)})`)
    )}`,
  ];
}

export function mTags({ tags }: YearReview) {
  if (!tags || tags.length === 0) return [];
  return [
    `- **Top tag${s(tags.length)}:** ${and(
      tags.map(({ name, count }) => `${name} (${count} book${s(count)})`)
    )}`,
  ];
}
