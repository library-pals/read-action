import { exportVariable } from "@actions/core";
import cleanBook, { CleanBook } from "./clean-book";
import { sortByDate } from "./utils";
import { Book, BookOptions } from "./get-book";
import returnReadFile from "./read-file";

export default async function addBook(
  options: BookOptions,
  book: Book,
  fileName: string
) {
  const readListJson = (await returnReadFile(fileName)) as CleanBook[];

  // clean up book data
  const newBook: CleanBook = cleanBook(options, book);
  // export book thumbnail to download later
  if (newBook.thumbnail) {
    exportVariable("BookThumbOutput", `book-${newBook.isbn}.png`);
    exportVariable("BookThumb", newBook.thumbnail);
  }
  // append new book
  readListJson.push(newBook);
  return sortByDate(readListJson);
}
