export function s(num: number) {
  return num === 1 ? "" : "s";
}

export function and(array: string[]) {
  const lf = new Intl.ListFormat("en");
  return lf.format(array);
}

export function mAverageDays(obj) {
  return obj.dates && obj.dates.averageFinishTime
    ? [
        `- **Average days to finish:** ${obj.dates.averageFinishTime.toFixed(
          1
        )}`,
      ]
    : [];
}

export function mMostReadMonth(obj) {
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

export function mLeastReadMonth(obj) {
  return obj.categories?.mostReadCategory
    ? [
        `- **Most popular genre:** ${obj.categories.mostReadCategory.toLowerCase()}`,
      ]
    : [];
}

export function mSameDay(obj) {
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

export function mAverageLength(obj) {
  return obj.length && obj.length.averageBookLength
    ? [
        `- **Average book length:** ${obj.length.averageBookLength} pages
- **Longest book:** ${obj.length.longestBook.pageCount} pages, ${obj.length.longestBook.title} by ${obj.length.longestBook.authors}
- **Shortest book:** ${obj.length.shortestBook.pageCount} pages, ${obj.length.shortestBook.title} by ${obj.length.shortestBook.authors}`,
      ]
    : [];
}

export function mPopularAuthor(obj) {
  return obj.popularAuthor && obj.popularAuthor.count > 1
    ? [
        `- **Most popular author:** ${obj.popularAuthor.popularAuthor} (${obj.popularAuthor.count} books)`,
      ]
    : [];
}

export function mTags(obj) {
  return obj.tags && Object.keys(obj.tags).length > 0
    ? [
        `- **Tags:** ${Object.keys(obj.tags)
          .map(
            (tag) => `${obj.tags[tag]} book${s(obj.tags[tag])} with “${tag}”`
          )
          .join(", ")}`,
      ]
    : [];
}
