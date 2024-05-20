import { exportVariable, getInput, setFailed, summary } from "@actions/core";
import * as github from "@actions/github";
import Isbn from "@library-pals/isbn";
import returnWriteFile from "./write-file";
import { getBookStatus, sortByDate, toArray } from "./utils";
import { checkOutBook } from "./checkout-book";
import { BookStatus } from "./clean-book";
import { summaryMarkdown } from "./summary";
import returnReadFile from "./read-file";
import { updateBook } from "./update-book";
import { validatePayload } from "./validate-payload";
import { handleNewBook } from "./new-book";

export type BookPayload = {
  date: string | undefined;
  "book-status": BookStatus;
  notes?: string;
  isbn: string;
  rating?: string;
  tags?: string;
};

export type ActionInputs = {
  filename: string;
  providers: string[];
  rating?: string;
  "time-zone": string;
  "thumbnail-width"?: number;
  "set-image": boolean;
};

export type BookParams = {
  filename: string;
  bookIsbn: BookPayload["isbn"];
  dateType: {
    dateAdded?: string;
    dateStarted?: string;
    dateFinished?: string;
    dateAbandoned?: string;
  };
  notes?: BookPayload["notes"];
  bookStatus: BookStatus;
  providers: ActionInputs["providers"];
  rating?: ActionInputs["rating"];
  tags?: string[];
  thumbnailWidth?: number;
  setImage: boolean;
};

export async function read() {
  try {
    // Get book payload
    const payload = github.context.payload.inputs as BookPayload;
    // Validate payload
    validatePayload(payload);
    const {
      isbn: bookIsbn,
      date,
      "book-status": bookStatus,
      notes,
      rating,
      tags,
    } = payload;
    // Set inputs
    const filename: ActionInputs["filename"] = getInput("filename");
    const setImage: ActionInputs["set-image"] =
      getInput("set-image") === "true";
    const providers: ActionInputs["providers"] = getInput("providers")
      ? getInput("providers").split(",")
      : new Isbn()._providers;
    const thumbnailWidth: ActionInputs["thumbnail-width"] = getInput(
      "thumbnail-width"
    )
      ? Number.parseInt(getInput("thumbnail-width"))
      : undefined;

    const dateType = getBookStatus({
      date,
      bookStatus,
    });
    exportVariable("BookStatus", bookStatus);

    let library = await returnReadFile(filename);

    const bookParams: BookParams = {
      filename,
      bookIsbn,
      dateType,
      notes,
      bookStatus,
      rating,
      providers,
      thumbnailWidth,
      setImage,
      ...(tags && { tags: toArray(tags) }),
    };

    const bookExists = checkOutBook(bookParams, library);

    if (bookExists) {
      library = await updateBook(bookParams, library);
    } else {
      await handleNewBook({ bookParams, library, bookStatus, setImage });
    }

    library = sortByDate(library);

    await returnWriteFile(filename, library);
    await summary.addRaw(summaryMarkdown(library, date, bookStatus)).write();
  } catch (error) {
    setFailed(error);
  }
}

export default read();
