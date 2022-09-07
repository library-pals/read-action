import { setFailed } from "@actions/core";
import returnReadFile from "../read-file";
import toJson from "../to-json";

jest.mock("@actions/core");
jest.mock("../read-file");

describe("toJson", () => {
  test("works", async () => {
    returnReadFile.mockReturnValue(Promise.resolve("- title: Luster"));
    expect(await toJson("my-file.yml")).toEqual([{ title: "Luster" }]);
  });

  test("error", async () => {
    returnReadFile.mockReturnValue(Promise.reject(new Error("oops")));
    await toJson("my-file.yml");
    expect(setFailed).toHaveBeenCalledWith("oops");
  });

  test("can add book game to filled yaml file", async () => {
    returnReadFile.mockReturnValue(
      Promise.resolve(`- title: God Save the Child`)
    );
    expect(await toJson("my-file.yml")).toMatchInlineSnapshot(`
      [
        {
          "title": "God Save the Child",
        },
      ]
    `);
  });

  test("can add book to empty yaml file", async () => {
    returnReadFile.mockReturnValue(Promise.resolve(""));
    expect(await toJson("my-file.yml")).toMatchInlineSnapshot(`[]`);
  });

  test("can add book to yaml file with whitespace", async () => {
    returnReadFile.mockReturnValue(
      Promise.resolve(`
  `)
    );
    expect(await toJson("my-file.yml")).toMatchInlineSnapshot(`[]`);
  });
});
