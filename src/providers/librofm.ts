import ogs from "open-graph-scraper";
import { BookParams } from "..";
import { formatDescription, getLibrofmId } from "../utils";
import { NewBook } from "../new-book";

export async function getLibrofm(
  options: BookParams
): Promise<NewBook | undefined> {
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

export function parseResult(result): {
  format?: string;
  title: string;
  description: string;
  isbn?: string;
  thumbnail: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
} {
  if (result.jsonLD || result.jsonLD?.length) {
    const book = result.jsonLD[0];
    return {
      format: formatFormat(book.bookFormat),
      title: book.name,
      description: formatDescription(book.description),
      isbn: book.isbn,
      thumbnail: book.image,
      authors: book.author?.map((author) => author.name),
      publisher: book.publisher,
      publishedDate: book.datePublished,
    };
  }
  return {
    title: result.ogTitle,
    description: formatDescription(result.ogDescription),
    thumbnail: result?.ogImage?.[0]?.url ?? "",
    authors: undefined,
    publisher: undefined,
    publishedDate: undefined,
    isbn: undefined,
    format: undefined,
  };
}

function formatFormat(format: string) {
  if (format.includes("Audiobook")) {
    return "audiobook";
  }
  return format;
}
