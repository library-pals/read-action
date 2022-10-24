import { CleanBook } from "./clean-book";
import returnReadFile from "./read-file";
import { exportVariable } from "@actions/core";
import { BookParams } from ".";

export async function checkOutBook(
  bookParams: BookParams
): Promise<false | CleanBook[]> {
  const { fileName, bookIsbn } = bookParams;
  const currentBooks = await returnReadFile(fileName);
  if (currentBooks === undefined || currentBooks.length === 0) return false;
  if (currentBooks.filter((f) => f.isbn === bookIsbn).length === 0)
    return false;
  return updateBook(currentBooks, bookParams);
}

export async function updateBook(
  currentBooks: CleanBook[],
  bookParams: BookParams
): Promise<CleanBook[]> {
  const { bookIsbn, dates, bookStatus, notes, rating, tags } = bookParams;
  return currentBooks.reduce((arr: CleanBook[], book) => {
    if (book.isbn === bookIsbn) {
      exportVariable("BookTitle", book.title);
      book = {
        ...book,
        dateAdded: book.dateAdded || dates.dateAdded,
        dateStarted: book.dateStarted || dates.dateStarted,
        dateFinished: book.dateFinished || dates.dateFinished,
        status: bookStatus,
        ...(rating && { rating }),
        ...(notes && { notes: addNotes(notes, book.notes) }),
        ...(tags && { tags }),
      };
    }
    arr.push(book);
    return arr;
  }, []);
}

function addNotes(notes: string, bookNotes?: string) {
  return `${bookNotes ? `${bookNotes}\n\n` : ""}${notes}`;
}
