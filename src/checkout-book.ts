import { CleanBook } from "./clean-book";
import { BookParams } from ".";

export function checkOutBook(
  bookParams: BookParams,
  library: CleanBook[]
): boolean {
  const { inputIdentifier } = bookParams;
  if (library === undefined || library.length === 0) return false;
  if (library.filter((f) => f.identifier === inputIdentifier).length === 0)
    return false;
  else return true;
}
