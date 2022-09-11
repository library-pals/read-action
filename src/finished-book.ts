import { CleanBook } from "./clean-book";
import returnReadFile from "./read-file";
import { setDateFinished } from "./utils";

export async function finishedBook({
  fileName,
  bookIsbn,
  dateFinished,
  notes,
}: {
  fileName: string;
  bookIsbn: string;
  dateFinished?: string | undefined;
  notes?: string;
}): Promise<false | CleanBook[]> {
  const currentBooks = await returnReadFile(fileName);
  if (currentBooks === undefined || currentBooks.length === 0) return false;
  if (currentBooks.filter((f) => f.isbn === bookIsbn).length === 0)
    return false;
  return updateBook({ currentBooks, bookIsbn, dateFinished, notes });
}

export async function updateBook({
  currentBooks,
  bookIsbn,
  dateFinished,
  notes,
}: {
  currentBooks: CleanBook[];
  bookIsbn: string;
  dateFinished: string | undefined;
  notes?: string;
}): Promise<CleanBook[]> {
  return currentBooks.reduce((arr: CleanBook[], book) => {
    if (book.isbn === bookIsbn) {
      book.dateFinished = setDateFinished(dateFinished, book.dateStarted);
      book.notes = notes;
    }
    arr.push(book);
    return arr;
  }, []);
}
