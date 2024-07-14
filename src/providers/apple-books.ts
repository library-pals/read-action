import ogs from "open-graph-scraper";
import { BookParams } from "..";
import { OgObject } from "open-graph-scraper/types/lib/types";
import {
  formatDescription,
  getAppleBooksId,
  parseOgMetatagResult,
} from "../utils";
import { NewBook } from "../new-book";
import { Audiobook } from "schema-dts";

export async function getAppleBooks(
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

    const appleBooksIdentifier = getAppleBooksId(inputIdentifier) as string;
    const parsedResultMetadata = parseResult(result);

    return {
      identifier: appleBooksIdentifier,
      identifiers: {
        apple: appleBooksIdentifier,
      },
      ...dateType,
      status: bookStatus,
      ...(rating && { rating }),
      ...(notes && { notes }),
      ...(tags && { tags }),
      ...(setImage && {
        image: `book-${appleBooksIdentifier}.png`,
      }),
      link: inputIdentifier,
      ...parsedResultMetadata,
    };
  } catch (error) {
    throw new Error(
      `Failed to get book from Apple Books: ${error.result.error}`
    );
  }
}

/* istanbul ignore next @preserve */
function parseResult(result: OgObject): Partial<NewBook> {
  if (!result.jsonLD) {
    return parseOgMetatagResult(result);
  }

  const schema = result.jsonLD[0] as Audiobook;
  const pageCount = parsePageCount(schema.numberOfPages);
  return {
    title: safeToString(schema.name),
    description: formatDescription(schema.description),
    authors: parseAuthors(schema.author),
    publishedDate: safeToString(schema.datePublished),
    thumbnail: safeToString(schema.image),
    categories: parseCategories(schema.genre),
    format: schema["@type"].toLocaleLowerCase(),
    ...(pageCount && { pageCount }),
    language: safeToString(schema.inLanguage),
  };
}

function safeToString(value): string | undefined {
  return value?.toString() ?? undefined;
}

function parseAuthors(author): string[] {
  if (!author) return [];
  if (author.includes("&amp;")) {
    return author.split("&amp;").map((a) => a.trim());
  }
  return [author.toString()];
}

function parseCategories(genre): string[] {
  if (!genre) return [];
  if (genre.includes("&amp;")) {
    return genre.split("&amp;").map((a) => a.trim());
  }
  return genre
    .toString()
    .split(",")
    .map((g) => g.trim())
    .filter((g) => g);
}

function parsePageCount(numberOfPages): number | undefined {
  const pageCount = Number(numberOfPages);
  return !isNaN(pageCount) ? pageCount : undefined;
}
