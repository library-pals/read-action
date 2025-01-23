import { BookParams } from "./index.js";
import { NewBook } from "./new-book.js";
import { lookUp } from "./utils.js";

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
