import { BookParams } from ".";
import { NewBook } from "./new-book";
import { lookUp } from "./utils";

export function checkOutBook(
  bookParams: BookParams,
  library: NewBook[]
): boolean {
  const { inputIdentifier } = bookParams;
  if (library === undefined || library.length === 0) return false;
  if (library.filter((book) => lookUp(book, inputIdentifier)).length === 0)
    return false;
  else return true;
}
