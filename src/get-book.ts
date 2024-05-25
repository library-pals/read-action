import Isbn from "@library-pals/isbn";
import { BookParams } from ".";
import cleanBook, { CleanBook } from "./clean-book";

export default async function getBook(options: BookParams): Promise<CleanBook> {
  const { inputIdentifier, providers } = options;
  let book;
  try {
    const isbn = new Isbn();
    isbn.provider(providers);
    book = await isbn.resolve(inputIdentifier);
  } catch (error) {
    throw new Error(`Book (${inputIdentifier}) not found. ${error.message}`);
  }
  const newBook: CleanBook = cleanBook(options, book);
  return newBook;
}
