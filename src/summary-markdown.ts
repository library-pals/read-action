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
    `- **Average days to finish:** ${dates.averageFinishTime.toFixed(1)}`,
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

export function mSameDay({ dates }: YearReview) {
  if (!dates || !dates.finishedInOneDay.count) return [];
  const { count, books } = dates.finishedInOneDay;
  return [
    `- **Started and finished on the same day:** ${count} book${s(
      count
    )}, ${and(books.map((book) => `${book.title} by ${book.authors}`))}`,
  ];
}

export function mAverageLength({ length }: YearReview) {
  if (!length || !length.averageBookLength) return [];
  const { averageBookLength, longestBook, shortestBook } = length;
  return [
    `- **Average book length:** ${averageBookLength} pages`,
    `- **Longest book:** ${longestBook.pageCount} pages, ${longestBook.title} by ${longestBook.authors}`,
    `- **Shortest book:** ${shortestBook.pageCount} pages, ${shortestBook.title} by ${shortestBook.authors}`,
  ];
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
