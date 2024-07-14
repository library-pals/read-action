import { BookParams } from ".";
import { getInput } from "@actions/core";
import { BookStatus, NewBook } from "./new-book";
import { OgObject } from "open-graph-scraper/types/lib/types";

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
export function sortByDate(array: NewBook[]): NewBook[] {
  return array.sort((a, b) => {
    if (a.dateFinished && b.dateFinished) {
      return (
        new Date(a.dateFinished).valueOf() - new Date(b.dateFinished).valueOf()
      );
    } else return 0;
  });
}

export function formatDescription(str?) {
  if (!str) return "";

  // replace HTML entities
  str = str.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  str = str.replace(/&quot;/g, '"');
  str = str.replace(/&apos;/g, "'");

  // remove HTML tags
  str = str.replace(/<\/?[^>]+(>|$)/gm, " ");

  str = str
    .replace(/(\r\n|\n|\r)/gm, " ") // remove line breaks
    .replace(/\s+/g, " ") // remove extra spaces
    .trim();

  if (str.startsWith('"') && str.endsWith('"')) {
    return str.slice(1, -1);
  }

  if (str.startsWith('"') && str.endsWith('"--')) {
    return `${str.slice(1, -3)}…`;
  }

  // remove invisible characters
  str = str.replace(/\u200E/g, "");

  str = removeCommonPhrases(str);

  return str.trim();
}

function removeCommonPhrases(str: string): string {
  // Remove common phrases, case insensitive
  const phrases = [
    //"NEW YORK TIMES BESTSELLER",
    "A GOOD MORNING AMERICA BOOK CLUB PICK",
    "Winner of the \\d\\d\\d\\d Center for Fiction",
    "First Novel Prize Winner of the \\d\\d\\d National Book",
    "AN INSTANT NEW YORK TIMES BESTSELLER",
    "A New York Times Notable Book of the Year",
    "WINNER OF THE NEBULA AND LOCUS AWARDS FOR BEST NOVELLA",
  ];

  phrases.forEach((phrase) => {
    str = str?.replace(new RegExp(phrase, "gi"), "");
  });

  return str;
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
  dateAbandoned?: string;
  dateStarted?: string;
  dateFinished?: string;
  dateAdded?: string;
} {
  const dateValue = date ?? localDate();
  switch (bookStatus) {
    case "abandoned":
      return {
        dateAbandoned: dateValue,
      };
    case "started":
      return {
        dateStarted: dateValue,
      };
    case "finished":
      return {
        dateFinished: dateValue,
      };
    case "want to read":
    default: {
      return {
        dateAdded: dateValue,
      };
    }
  }
}

export function toArray(tags: string): BookParams["tags"] {
  return tags.split(",").map((f) => f.trim());
}

export function lookUp(
  book: NewBook,
  inputIdentifier: BookParams["inputIdentifier"]
): boolean {
  if (inputIdentifier.startsWith("https://share.libbyapp.com/")) {
    return book.identifier === getLibbyId(inputIdentifier);
  }
  if (inputIdentifier.startsWith("https://libro.fm/")) {
    return book.identifier === getLibrofmId(inputIdentifier);
  }
  return book.identifier === inputIdentifier;
}

export function getLibbyId(inputIdentifier: string): string {
  return inputIdentifier.split("/").pop() as string;
}

export function getAppleBooksId(inputIdentifier: string): string {
  return inputIdentifier.split("/").pop() as string;
}

export function getLibrofmId(inputIdentifier: string): string {
  const isbn = inputIdentifier.split("/").pop();
  if (!isbn) return inputIdentifier;
  return isbn?.split("-")[0];
}

function removeInvisibleCharacters(text): string {
  return text.replace(/\u200E/g, "");
}

export function parseOgMetatagResult(result: OgObject): {
  title?: string;
  description?: string;
  authors: string[];
  publishedDate?: string;
  thumbnail: string;
} {
  return {
    title: removeInvisibleCharacters(result.ogTitle),
    description: formatDescription(result.ogDescription),
    authors: formatAuthor(result),
    publishedDate: result.bookReleaseDate,
    thumbnail: result?.ogImage?.[0]?.url ?? "",
  };
}

function formatAuthor(result: OgObject): string[] {
  if (Array.isArray(result.customMetaTags?.authors)) {
    // Only get the first one as Libby includes narrator in this list
    return [result.customMetaTags.authors[0]];
  }

  if (result.bookAuthor) {
    return [result.bookAuthor];
  }

  return [];
}
