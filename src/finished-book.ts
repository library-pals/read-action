import { CleanBook, BookStatus } from "./clean-book";
import returnReadFile from "./read-file";
import { exportVariable } from "@actions/core";
import { Dates } from ".";

export async function finishedBook({
  fileName,
  bookIsbn,
  dates,
  notes,
  bookStatus,
}: {
  fileName: string;
  bookIsbn: string;
  dates: Dates;
  notes?: string;
  bookStatus: BookStatus;
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
  });
}

export async function updateBook({
  currentBooks,
  bookIsbn,
  dates,
  notes,
  bookStatus,
}: {
  currentBooks: CleanBook[];
  bookIsbn: string;
  dates: Dates;
  notes?: string;
  bookStatus: BookStatus;
}): Promise<CleanBook[]> {
  return currentBooks.reduce((arr: CleanBook[], book) => {
    if (book.isbn === bookIsbn) {
      exportVariable("BookTitle", book.title);
      book.dateFinished = dates.dateFinished;
      book.status = bookStatus;
      if (notes || book.notes) book.notes = notes || book.notes;
    }
    arr.push(book);
    return arr;
  }, []);
}
