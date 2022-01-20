import toJson from "../to-json";
import { promises } from "fs";
import { setFailed } from "@actions/core";

jest.mock("@actions/core");

describe("toJson", () => {
  test("works", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValueOnce("- title: my title");
    expect(await toJson("myfile.yml")).toEqual([{ title: "my title" }]);
  });
  test("fails", async () => {
    jest
      .spyOn(promises, "readFile")
      .mockResolvedValueOnce("- title: my: title");
    await toJson("myfile.yml");
    expect(setFailed).toHaveBeenCalledWith(
      expect.stringContaining("bad indentation of a mapping entry")
    );
  });
});
