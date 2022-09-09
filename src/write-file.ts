import { writeFile } from "fs/promises";
import { CleanBook } from "./clean-book";

export default async function returnWriteFile(
  fileName: string,
  bookMetadata: CleanBook[]
) {
  try {
    const promise = writeFile(fileName, JSON.stringify(bookMetadata, null, 2));
    await promise;
  } catch (error) {
    throw new Error(error);
  }
}
