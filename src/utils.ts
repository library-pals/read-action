import { BookParams } from ".";
import { getInput } from "@actions/core";
import { BookStatus, CleanBook } from "./clean-book";

/** make sure date is in YYYY-MM-DD format */
export function dateFormat(date: string) {
  return date.match(/^\d{4}-\d{2}-\d{2}$/) != null;
}

/** make sure date value is a date */
export function isDate(date: string) {
  return !isNaN(Date.parse(date)) && dateFormat(date);
}

/** make sure ISBN has 10 or 13 characters */
export function isIsbn(isbn: string) {
  return isbn.length === 10 || isbn.length === 13;
}

/** sort array of objects by `dateFinished` */
export function sortByDate(array: CleanBook[]): CleanBook[] {
  return array.sort((a, b) => {
    if (a.dateFinished && b.dateFinished) {
      return (
        new Date(a.dateFinished).valueOf() - new Date(b.dateFinished).valueOf()
      );
    } else return 0;
  });
}

/** remove wrapped quotes */
export function removeWrappedQuotes(str: string) {
  if (str.startsWith('"') && str.endsWith('"')) {
    return str.substring(1, str.length - 1);
  }
  if (str.startsWith('"') && str.endsWith('"--')) {
    return `${str.substring(1, str.length - 3)}…`;
  } else return str;
}

function localDate() {
  // "fr-ca" will result YYYY-MM-DD formatting
  const dateFormat = new Intl.DateTimeFormat("fr-ca", {
    dateStyle: "short",
    timeZone: getInput("time-zone"),
  });
  return dateFormat.format(new Date());
}

export function getBookStatus({
  date,
  bookStatus,
}: {
  date?: string;
  bookStatus?: BookStatus;
}): {
  "date-abandoned"?: string;
  "date-started"?: string;
  "date-finished"?: string;
  "date-added"?: string;
} {
  const dateValue = date ?? localDate();
  switch (bookStatus) {
    case "abandoned":
      return {
        "date-abandoned": dateValue,
      };
    case "started":
      return {
        "date-started": dateValue,
      };
    case "finished":
      return {
        "date-finished": dateValue,
      };
    case "want to read":
    default: {
      return {
        "date-added": dateValue,
      };
    }
  }
}

export function toArray(tags: string): BookParams["tags"] {
  return tags.split(",").map((f) => f.trim());
}

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
