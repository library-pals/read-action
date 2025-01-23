import { exportVariable, getInput, setFailed, summary } from "@actions/core";
import * as github from "@actions/github";
import Isbn from "@library-pals/isbn";
import returnWriteFile from "./write-file.js";
import { getBookStatus, sortByDate, toArray } from "./utils.js";
import { checkOutBook } from "./checkout-book.js";
import { BookStatus, handleNewBook } from "./new-book.js";
import { summaryMarkdown } from "./summary.js";
import returnReadFile from "./read-file.js";
import { updateBook } from "./update-book.js";
import { validatePayload } from "./validate-payload.js";

export type BookPayload = {
  date: string | undefined;
  "book-status": BookStatus;
  notes?: string;
  identifier: string;
  rating?: string;
  tags?: string;
  duration?: string;
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
  inputIdentifier: BookPayload["identifier"];
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
  duration?: string;
};

export async function read() {
  try {
    // Get book payload
    const payload = github.context.payload.inputs as BookPayload;
    // Validate payload
    const { success, message } = validatePayload(payload);
    if (!success) {
      setFailed(message);
      return;
    }
    const {
      identifier: inputIdentifier,
      date,
      "book-status": bookStatus,
      notes,
      rating,
      tags,
      duration,
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
      inputIdentifier,
      dateType,
      notes,
      bookStatus,
      rating,
      providers,
      thumbnailWidth,
      setImage,
      ...(tags && { tags: toArray(tags) }),
      ...(duration && { duration }),
    };

    if (bookStatus !== "summary") {
      const bookExists = checkOutBook(bookParams, library);

      if (bookExists) {
        library = await updateBook(bookParams, library);
      } else {
        await handleNewBook({ bookParams, library, bookStatus, setImage });
      }

      library = sortByDate(library);

      await returnWriteFile(filename, library);
    }

    await summary
      .addRaw(summaryMarkdown(library, dateType, bookStatus))
      .write();
  } catch (error) {
    setFailed(error);
  }
}

export default read();
