import { BookParams, Dates } from ".";
import { getInput } from "@actions/core";
import { BookStatus } from "./clean-book";

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
    timeZone: getInput("timeZone"),
  });
  return dateFormat.format(new Date());
}

export function getBookStatus(
  dateStarted: Dates["dateStarted"],
  dateFinished: Dates["dateFinished"]
): BookStatus {
  // Set book status
  if (dateStarted && !dateFinished) return "started";
  if (dateFinished) return "finished";
  return "want to read";
}

export function getDates(
  bookStatus: BookStatus,
  dateStarted: Dates["dateStarted"],
  dateFinished: Dates["dateFinished"]
): {
  dateAdded: string | undefined;
  dateStarted: string | undefined;
  dateFinished: string | undefined;
} {
  return {
    dateAdded: bookStatus === "want to read" ? localDate() : undefined,
    dateStarted: dateStarted || undefined,
    dateFinished: dateFinished || undefined,
  };
}

export function toArray(tags: string): BookParams["tags"] {
  return tags.split(",").map((f) => f.trim());
}

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
