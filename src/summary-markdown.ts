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
  return [
    `- **Month with most books:** ${dates.mostReadMonth.month} (${
      dates.mostReadMonth.count
    } book${s(dates.mostReadMonth.count)})
- **Month with least books:** ${dates.leastReadMonth.month} (${
      dates.leastReadMonth.count
    } book${s(dates.leastReadMonth.count)})`,
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
  return [
    `- **Started and finished on the same day:** ${
      dates.finishedInOneDay.count
    } book${s(dates.finishedInOneDay.count)}, ${and(
      dates.finishedInOneDay.books.map(
        (book) => `${book.title} by ${book.authors}`
      )
    )}`,
  ];
}

export function mAverageLength({ length }: YearReview) {
  if (!length || !length.averageBookLength) return [];
  return [
    `- **Average book length:** ${length.averageBookLength} pages
- **Longest book:** ${length.longestBook.pageCount} pages, ${length.longestBook.title} by ${length.longestBook.authors}
- **Shortest book:** ${length.shortestBook.pageCount} pages, ${length.shortestBook.title} by ${length.shortestBook.authors}`,
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
