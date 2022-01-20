import { setFailed } from "@actions/core";
import { load } from "js-yaml";
import returnReadFile from "./read-file";

export default async function toJson(fileName: string) {
  try {
    const contents = (await returnReadFile(fileName)) as string;
    return load(contents) || [];
  } catch (error) {
    setFailed(error.message);
  }
}
