import { CleanBook } from "./clean-book";
import { BookParams } from ".";

export function checkOutBook(
  bookParams: BookParams,
  library: CleanBook[]
): boolean {
  const { bookIsbn } = bookParams;
  if (library === undefined || library.length === 0) return false;
  const hasLibbyIdentifier = bookIsbn.split("/").length > 1;
  if (
    library.filter(
      (f) =>
        f.isbn === bookIsbn ||
        f.identifier?.isbn === bookIsbn ||
        (hasLibbyIdentifier &&
          f.identifier?.libby === bookIsbn.split("/").pop())
    ).length === 0
  )
    return false;
  else return true;
}
