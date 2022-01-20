import { setFailed } from "@actions/core";
import { promises, readFileSync } from "fs";
import returnWriteFile from "../write-file";
import { load } from "js-yaml";
import { CleanBook } from "../clean-book";

const books = load(readFileSync("./_data/read.yml", "utf-8")) as CleanBook[];

jest.mock("@actions/core");

describe("returnWriteFile", () => {
  test("works", async () => {
    jest.spyOn(promises, "writeFile").mockResolvedValueOnce();
    await returnWriteFile("myfile.yml", books);
    expect(promises.writeFile).toHaveBeenCalled();
  });
  test("fails", async () => {
    jest.spyOn(promises, "writeFile").mockRejectedValue("Error");
    await returnWriteFile("myfile.yml", books);
    expect(setFailed).toHaveBeenCalledWith("Error");
  });
});
