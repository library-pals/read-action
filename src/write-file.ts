import { writeFile } from "fs/promises";
import { NewBook } from "./new-book.js";

export default async function returnWriteFile(
  fileName: string,
  bookMetadata: NewBook[]
) {
  try {
    const promise = writeFile(fileName, JSON.stringify(bookMetadata, null, 2));
    await promise;
  } catch (error) {
    throw new Error(error);
  }
}
