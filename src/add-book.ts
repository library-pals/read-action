import { exportVariable } from "@actions/core";
import cleanBook, { CleanBook } from "./clean-book";
import { sortByDate } from "./utils";
import toJson from "./to-json";
import { Book, BookOptions } from "./get-book";

export default async function addBook(
  options: BookOptions,
  book: Book,
  fileName: string
) {
  // convert yaml file to JSON
  const readListJson = (await toJson(fileName)) as CleanBook[];
  // clean up book data
  const newBook: CleanBook = cleanBook(options, book);
  // export book thumbnail to download later
  if (newBook.imageLinks && newBook.imageLinks.thumbnail) {
    exportVariable("BookThumbOutput", `book-${newBook.isbn}.png`);
    exportVariable("BookThumb", newBook.imageLinks.thumbnail);
  }
  // append new book
  readListJson.push(newBook);
  return sortByDate(readListJson);
}
