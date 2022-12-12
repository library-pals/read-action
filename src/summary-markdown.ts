import { YearReview } from "./summary";

export function s(num: number) {
  return num === 1 ? "" : "s";
}

export function and(array: string[]) {
  const lf = new Intl.ListFormat("en");
  return lf.format(array);
}

export function mAverageDays(obj: YearReview) {
  return obj.dates && obj.dates.averageFinishTime
    ? [
        `- **Average days to finish:** ${obj.dates.averageFinishTime.toFixed(
          1
        )}`,
      ]
    : [];
}

export function mMostReadMonth(obj: YearReview) {
  return obj.dates &&
    obj.dates.mostReadMonth.count !== obj.dates.leastReadMonth.count
    ? [
        `- **Month with most books:** ${obj.dates.mostReadMonth.month} (${
          obj.dates.mostReadMonth.count
        } book${s(obj.dates.mostReadMonth.count)})
- **Month with least books:** ${obj.dates.leastReadMonth.month} (${
          obj.dates.leastReadMonth.count
        } book${s(obj.dates.leastReadMonth.count)})`,
      ]
    : [];
}

export function mGenre(obj: YearReview) {
  return obj.topGenres
    ? [
        `- **Top genre${s(obj.topGenres.length)}:** ${and(
          obj.topGenres.map((g) => `${g.genre} (${g.count} book${s(g.count)})`)
        )}`,
      ]
    : [];
}

export function mSameDay(obj: YearReview) {
  return obj.dates && obj.dates.finishedInOneDay.count
    ? [
        `- **Started and finished on the same day:** ${
          obj.dates.finishedInOneDay.count
        } book${s(obj.dates.finishedInOneDay.count)}, ${and(
          obj.dates.finishedInOneDay.books.map(
            (book) => `${book.title} by ${book.authors}`
          )
        )}`,
      ]
    : [];
}

export function mAverageLength(obj: YearReview) {
  return obj.length && obj.length.averageBookLength
    ? [
        `- **Average book length:** ${obj.length.averageBookLength} pages
- **Longest book:** ${obj.length.longestBook.pageCount} pages, ${obj.length.longestBook.title} by ${obj.length.longestBook.authors}
- **Shortest book:** ${obj.length.shortestBook.pageCount} pages, ${obj.length.shortestBook.title} by ${obj.length.shortestBook.authors}`,
      ]
    : [];
}

export function mTopAuthors(obj: YearReview) {
  return obj.topAuthors && obj.topAuthors.length > 0
    ? [
        `- **Top author${s(obj.topAuthors.length)}:** ${and(
          obj.topAuthors.map(
            ({ author, count }) => `${author} (${count} book${s(count)})`
          )
        )}`,
      ]
    : [];
}

export function mTags(obj: YearReview) {
  return obj.tags && obj.tags.length > 0
    ? [
        `- **Tags:** ${obj.tags
          .map(({ tag, count }) => `${count} book${s(count)} with “${tag}”`)
          .join(", ")}`,
      ]
    : [];
}
