import { writeFile } from "fs/promises";
import { setFailed } from "@actions/core";
import { toYaml } from "./utils";
import { CleanBook } from "./clean-book";

export default async function returnWriteFile(
  fileName: string,
  bookMetadata: CleanBook[]
) {
  try {
    const data = toYaml(bookMetadata);
    const promise = writeFile(fileName, data);
    await promise;
  } catch (error) {
    setFailed(error);
  }
}
