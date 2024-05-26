import { readFile } from "fs/promises";
import { NewBook } from "./new-book";

export default async function returnReadFile(
  fileName: string
): Promise<NewBook[]> {
  try {
    const contents = await readFile(fileName, "utf-8");
    if (contents === "" || !contents) return [];
    return JSON.parse(contents);
  } catch (error) {
    throw new Error(error);
  }
}
