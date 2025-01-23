import { BookParams } from "../index.js";
import { NewBook } from "../new-book.js";
import { getIsbn } from "./isbn.js";

export async function getLibrofm(
  options: BookParams
): Promise<NewBook | undefined> {
  try {
    const newOptions = {
      ...options,
      providers: ["librofm"],
    };
    const book = await getIsbn(newOptions, true);
    return book;
  } catch (error) {
    throw new Error(`Failed to get book from Libro.fm: ${error.message}`);
  }
}
