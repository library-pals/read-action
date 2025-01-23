import { NewBook } from "./new-book.js";
import { exportVariable } from "@actions/core";
import { BookParams } from "./index.js";
import { lookUp } from "./utils.js";

export async function updateBook(
  bookParams: BookParams,
  currentBooks: NewBook[]
): Promise<NewBook[]> {
  const { inputIdentifier, dateType, bookStatus, notes, rating, tags } =
    bookParams;
  return currentBooks.reduce((arr: NewBook[], book) => {
    const thisBook = lookUp(book, inputIdentifier);
    if (thisBook) {
      exportVariable("BookTitle", book.title);
      book = {
        ...book,
        dateAdded: dateType?.dateAdded || book.dateAdded,
        dateStarted: dateType?.dateStarted || book.dateStarted,
        dateFinished: dateType?.dateFinished || book.dateFinished,
        dateAbandoned: dateType?.dateAbandoned || book.dateAbandoned,
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
