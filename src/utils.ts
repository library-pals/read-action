import { stringify } from "json-to-pretty-yaml";
import { CleanBook } from "./clean-book";

/** make sure ISBN has 10 or 13 characters */
export function isIsbn(isbn: string) {
  return isbn.length === 10 || isbn.length === 13;
}

/** convert json to pretty yaml */
export function toYaml(json: CleanBook[]) {
  return stringify(json);
}

/** sort array of objects by `dateFinished` */
export function sortByDate(array: { dateFinished: string }[]) {
  return array.sort(
    (a, b) =>
      new Date(a.dateFinished).valueOf() - new Date(b.dateFinished).valueOf()
  );
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
