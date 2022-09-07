import { readFile } from "fs/promises";

export default async function returnReadFile(
  fileName: string
): Promise<string> {
  try {
    const promise = readFile(fileName, "utf-8");
    return await promise;
  } catch (error) {
    throw new Error(error);
  }
}
