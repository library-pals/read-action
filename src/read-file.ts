import { readFile } from "fs/promises";
import { setFailed } from "@actions/core";

export default async function returnReadFile(fileName: string) {
  try {
    const promise = readFile(fileName, "utf-8");
    return await promise;
  } catch (error) {
    setFailed(error);
  }
}
