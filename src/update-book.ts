import { CleanBook } from "./clean-book";
import { exportVariable } from "@actions/core";
import { BookParams } from ".";

export async function updateBook(
  bookParams: BookParams,
  currentBooks: CleanBook[]
): Promise<CleanBook[]> {
  const { bookIsbn, dateType, bookStatus, notes, rating, tags } = bookParams;
  return currentBooks.reduce((arr: CleanBook[], book) => {
    if (book.isbn === bookIsbn) {
      exportVariable("BookTitle", book.title);
      book = {
        ...book,
        dateAdded: book.dateAdded || dateType?.dateAdded,
        dateStarted: book.dateStarted || dateType?.dateStarted,
        dateFinished: book.dateFinished || dateType?.dateFinished,
        dateAbandoned: book.dateAbandoned || dateType?.dateAbandoned,
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
