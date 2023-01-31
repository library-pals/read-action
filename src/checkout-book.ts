import { CleanBook } from "./clean-book";
import { BookParams } from ".";

export function checkOutBook(
  bookParams: BookParams,
  library: CleanBook[]
): boolean {
  const { bookIsbn } = bookParams;
  if (library === undefined || library.length === 0) return false;
  if (library.filter((f) => f.isbn === bookIsbn).length === 0) return false;
  else return true;
}
