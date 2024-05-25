import ogs from "open-graph-scraper";
import { CleanBook } from "./clean-book";
import { BookParams } from ".";
import { formatDescription, getLibrofmId } from "./utils";
import { OgObject } from "open-graph-scraper/dist/lib/types";

export async function getLibrofm(
  options: BookParams
): Promise<CleanBook | undefined> {
  const {
    notes,
    inputIdentifier,
    dateType,
    bookStatus,
    rating,
    tags,
    setImage,
  } = options;
  try {
    const ogsOptions = {
      url: inputIdentifier,
    };
    const { result } = await ogs(ogsOptions);

    const librofmIdentifier = getLibrofmId(inputIdentifier);
    const parsedResultMetadata = parseResult(result);

    if (!parsedResultMetadata) {
      throw new Error("Failed to parse libro.fm page");
    }
    const { isbn, ...remainingMetadata } = parsedResultMetadata;

    return {
      identifier: librofmIdentifier,
      identifiers: {
        librofm: librofmIdentifier,
        ...(isbn && { isbn: isbn }),
      },
      ...dateType,
      status: bookStatus,
      ...(rating && { rating }),
      ...(notes && { notes }),
      ...(tags && { tags }),
      ...(setImage && {
        image: `book-${librofmIdentifier}.png`,
      }),
      link: inputIdentifier,
      ...remainingMetadata,
    };
  } catch (error) {
    throw new Error(`Failed to get book from Libby: ${error.result.error}`);
  }
}

function parseResult(result):
  | {
      format: string;
      title: string;
      description: string;
      isbn: string;
      image: string;
      authors: string[];
      publisher: string;
      publishedDate: string;
    }
  | undefined {
  if (!result.jsonLD || !result.jsonLD.length) {
    return;
  }

  const book = result.jsonLD[0];

  return {
    format: formatFormat(book.bookFormat),
    title: book.name,
    description: formatDescription(book.description),
    isbn: book.isbn,
    image: book.image,
    authors: book.author.map((author) => author.name),
    publisher: book.publisher,
    publishedDate: book.datePublished,
  };
}

function formatFormat(format: string) {
  if (format.includes("Audiobook")) {
    return "audiobook";
  }
  return format;
}
