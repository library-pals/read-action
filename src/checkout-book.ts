import { CleanBook } from "./clean-book";
import { BookParams } from ".";
import { lookUp } from "./utils";

export function checkOutBook(
  bookParams: BookParams,
  library: CleanBook[]
): boolean {
  const { inputIdentifier } = bookParams;
  if (library === undefined || library.length === 0) return false;
  if (library.filter((book) => lookUp(book, inputIdentifier)).length === 0)
    return false;
  else return true;
}
