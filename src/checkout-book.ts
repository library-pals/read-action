import { CleanBook, BookStatus } from "./clean-book";
import returnReadFile from "./read-file";
import { exportVariable } from "@actions/core";
import { BookInputs, Dates } from ".";

export async function checkOutBook({
  fileName,
  bookIsbn,
  dates,
  notes,
  bookStatus,
  rating,
}: {
  fileName: string;
  bookIsbn: string;
  dates: Dates;
  notes?: string;
  bookStatus: BookStatus;
  rating: BookInputs["rating"];
}): Promise<false | CleanBook[]> {
  const currentBooks = await returnReadFile(fileName);
  if (currentBooks === undefined || currentBooks.length === 0) return false;
  if (currentBooks.filter((f) => f.isbn === bookIsbn).length === 0)
    return false;
  return updateBook({
    currentBooks,
    bookIsbn,
    dates,
    notes,
    bookStatus,
    rating,
  });
}

export async function updateBook({
  currentBooks,
  bookIsbn,
  dates,
  notes,
  bookStatus,
  rating,
}: {
  currentBooks: CleanBook[];
  bookIsbn: string;
  dates: Dates;
  notes?: string;
  bookStatus: BookStatus;
  rating: BookInputs["rating"];
}): Promise<CleanBook[]> {
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
      };
    }
    arr.push(book);
    return arr;
  }, []);
}

function addNotes(notes: string, bookNotes?: string) {
  return `${bookNotes ? `${bookNotes}\n\n` : ""}${notes}`;
}
