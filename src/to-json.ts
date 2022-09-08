import { setFailed } from "@actions/core";
import { load } from "js-yaml";
import { CleanBook } from "./clean-book";
import returnReadFile from "./read-file";

export default async function toJson(
  fileName: string
): Promise<CleanBook[] | undefined> {
  try {
    const contents = (await returnReadFile(fileName)) as string;
    return parseYaml(contents);
  } catch (error) {
    setFailed(error.message);
  }
}

function parseYaml(contents: string): CleanBook[] {
  // empty file
  if (!contents) return [];
  const json = load(contents) as CleanBook[];
  // unable to parse file
  if (!json) return [];
  return json;
}
