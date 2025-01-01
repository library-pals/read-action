import { read } from "../index";
import * as github from "@actions/github";
import * as core from "@actions/core";
import returnWriteFile from "../write-file";
import { promises } from "fs";
import books from "../../_data/read.json";

jest.mock("@actions/core", () => {
  return {
    ...jest.requireActual("@actions/core"),
    setFailed: jest.fn(),
    getInput: jest.fn(),
    warning: jest.fn(),
    summary: {
      addRaw: () => ({
        write: jest.fn(),
      }),
    },
  };
});

jest.mock("../write-file");

const defaultOptions = {
  filename: "my-library.json",
  "required-metadata": "title,pageCount,authors,description,thumbnail",
  "time-zone": "America/New_York",
  providers: "google",
  "thumbnail-width": "128",
  "set-image": "true",
};

describe("workflow", () => {
  beforeEach(() => {
    jest
      .spyOn(core, "getInput")
      .mockImplementation((v) => defaultOptions[v] || undefined);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("summary", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValue(JSON.stringify(books));
    const summarySpy = jest.spyOn(core.summary, "addRaw");
    jest.useFakeTimers().setSystemTime(new Date("2024-12-31T12:00:00"));
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            "book-status": "summary",
          },
        },
      },
    });
    await read();
    expect(setFailedSpy).not.toHaveBeenCalled();
    expect(summarySpy.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "# Reading summary


      ## 2024 reading summary

      - **Total books:** 3

      ## Year over year comparison

      | Year | Books read |
      | ---: | ---: |
      | 2024 | 3 |
      | 2023 | 1 |
      | 2022 | 7 |
      | 2021 | 2 |
      | 2020 | 2 |
      ",
      ]
    `);
    expect(returnWriteFile.mock.calls[0]).toMatchInlineSnapshot(`undefined`);
  });
});
