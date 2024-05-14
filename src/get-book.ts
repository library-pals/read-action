import Isbn from "@library-pals/isbn";
import { BookParams } from ".";
import cleanBook, { CleanBook } from "./clean-book";

export default async function getBook(options: BookParams): Promise<CleanBook> {
  const { bookIsbn, providers } = options;
  let book;
  try {
    const isbn = new Isbn();
    isbn.provider(providers);
    book = await isbn.resolve(bookIsbn);
  } catch (error) {
    throw new Error(`Book (${bookIsbn}) not found. ${error.message}`);
  }
  const newBook: CleanBook = cleanBook(options, book);
  return newBook;
}
