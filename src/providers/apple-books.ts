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
  return {
    title: schema.name?.toString(),
    description: formatDescription(schema.description),
    authors: schema.author?.toString() ? [schema.author.toString()] : [],
    publishedDate: schema.datePublished?.toString(),
    thumbnail: schema.image?.toString(),
    categories: schema.genre?.toString().split(",") || [],
    format: schema["@type"] === "Audiobook" ? "audiobook" : "ebook",
    ...(schema.numberOfPages && { pageCount: Number(schema.numberOfPages) }),
    language: schema.inLanguage?.toString(),
  };
}
