import returnReadFile from "../read-file";
import { promises } from "fs";

jest.mock("@actions/core");

describe("returnReadFile", () => {
  test("works", async () => {
    const readSpy = jest.spyOn(promises, "readFile").mockImplementation();
    await returnReadFile("my-file.yml");
    expect(readSpy.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "my-file.yml",
        "utf-8",
      ]
    `);
  });
  test("error", async () => {
    jest.spyOn(promises, "readFile").mockRejectedValue("Error");
    await expect(returnReadFile("my-file.yml")).rejects.toThrow("Error");
  });
});
