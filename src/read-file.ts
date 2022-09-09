import { readFile } from "fs/promises";
import { CleanBook } from "./clean-book";

export default async function returnReadFile(
  fileName: string
): Promise<CleanBook[]> {
  try {
    const contents = await readFile(fileName, "utf-8");
    if (contents === "" || !contents) return [];
    return JSON.parse(contents);
  } catch (error) {
    throw new Error(error);
  }
}
