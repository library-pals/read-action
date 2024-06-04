import { BookParams } from "..";
import { NewBook } from "../new-book";
import { getIsbn } from "./isbn";

export async function getLibrofm(
  options: BookParams
): Promise<NewBook | undefined> {
  try {
    const newOptions = {
      ...options,
      providers: ["librofm"],
    };
    const book = await getIsbn(newOptions);
    return book;
  } catch (error) {
    throw new Error(`Failed to get book from Libro.fm: ${error.message}`);
  }
}
