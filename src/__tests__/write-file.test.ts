import { promises, readFileSync } from "fs";
import returnWriteFile from "../write-file";
import { CleanBook } from "../clean-book";

const books = JSON.parse(
  readFileSync("./_data/read.json", "utf-8")
) as CleanBook[];

jest.mock("@actions/core");

describe("returnWriteFile", () => {
  test("works", async () => {
    jest.spyOn(promises, "writeFile").mockResolvedValueOnce();
    await returnWriteFile("myfile.json", books);
    expect(promises.writeFile).toHaveBeenCalled();
  });
  test("fails", async () => {
    jest.spyOn(promises, "writeFile").mockRejectedValue("Error");
    await expect(returnWriteFile("my-file.json", books)).rejects.toThrow(
      "Error"
    );
  });
});
