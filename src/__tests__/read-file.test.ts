import { setFailed } from "@actions/core";
import { promises } from "fs";
import returnReadFile from "../read-file";

jest.mock("@actions/core");

describe("returnReadFile", () => {
  test("works", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValueOnce("Hello world");
    expect(await returnReadFile("myfile.yml")).toEqual("Hello world");
  });
  test("fails", async () => {
    jest.spyOn(promises, "readFile").mockRejectedValue("Error");
    await returnReadFile("myfile.yml");
    expect(setFailed).toHaveBeenCalledWith("Error");
  });
});
