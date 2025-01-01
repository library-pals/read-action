import Isbn, { Book } from "@library-pals/isbn";
import { BookParams } from "..";
import { NewBook } from "../new-book";
import { formatDescription, getLibrofmId } from "../utils";
import { exportVariable, getInput, warning } from "@actions/core";

export async function getIsbn(
  options: BookParams,
  isLibrofm = false
): Promise<NewBook> {
  const { inputIdentifier, providers } = options;
  let book;
  const identifier = isLibrofm
    ? getLibrofmId(inputIdentifier)
    : inputIdentifier;
  try {
    const isbn = new Isbn();
    isbn.provider(providers);
    book = await isbn.resolve(identifier);
  } catch (error) {
    throw new Error(`Book (${identifier}) not found. ${error.message}`);
  }
  const newBook: NewBook = cleanBook(options, book);
  return newBook;
}

export function cleanBook(options: BookParams, book: Book): NewBook {
  const {
    notes,
    inputIdentifier,
    dateType,
    bookStatus,
    rating,
    tags,
    thumbnailWidth,
    setImage,
  } = options;
  const isLibrofm = book.bookProvider === "Libro.fm";
  checkMetadata(book, inputIdentifier);
  const {
    title,
    authors,
    publishedDate,
    description,
    categories,
    pageCount,
    format,
    thumbnail,
    language,
    link,
    duration,
  } = book;

  const identifier = isLibrofm
    ? getLibrofmId(inputIdentifier)
    : inputIdentifier;

  return {
    identifier,
    identifiers: {
      ...(isLibrofm && { librofm: identifier }),
      ...(book.isbn && { isbn: book.isbn }),
    },
    ...dateType,
    status: bookStatus,
    ...(rating && { rating }),
    ...(notes && { notes }),
    ...(tags && { tags }),
    ...(title && { title }),
    ...(authors && {
      authors: authors,
    }),
    ...(publishedDate && { publishedDate }),
    ...(description && {
      description: formatDescription(description),
    }),
    ...(pageCount && { pageCount }),
    ...(format && { format: format.toLowerCase() }),
    ...(categories && { categories }),
    ...(thumbnail && {
      thumbnail: handleThumbnail(thumbnailWidth, thumbnail),
    }),
    ...(language && { language }),
    ...(link && {
      link,
    }),
    ...(setImage && {
      image: `book-${identifier}.png`,
    }),
    ...(duration && { duration }),
  };
}

function handleThumbnail(
  thumbnailWidth: number | undefined,
  thumbnail: string
) {
  if (thumbnail.startsWith("http:")) {
    thumbnail = thumbnail.replace("http:", "https:");
  }
  const url = new URL(thumbnail);
  if (url.host === "books.google.com" && thumbnailWidth) {
    thumbnail = `${thumbnail}&w=${thumbnailWidth}`;
  }
  return thumbnail;
}

function checkMetadata(book: Book, inputIdentifier: string) {
  const missingMetadata: string[] = [];
  const requiredMetadata = getInput("required-metadata")
    .split(",")
    .map((s) => s.trim());
  if (!book.title && requiredMetadata.includes("title")) {
    missingMetadata.push("title");
  }
  if (
    book.format !== "audiobook" &&
    (!book.pageCount || book.pageCount === 0) &&
    requiredMetadata.includes("pageCount")
  ) {
    missingMetadata.push("pageCount");
  }
  if (
    (!book.authors || book.authors.length === 0) &&
    requiredMetadata.includes("authors")
  ) {
    missingMetadata.push("authors");
  }
  if (!book.description && requiredMetadata.includes("description")) {
    missingMetadata.push("description");
  }
  if (!book.thumbnail && requiredMetadata.includes("thumbnail")) {
    missingMetadata.push("thumbnail");
  }
  if (missingMetadata.length > 0) {
    warning(`Book does not have ${missingMetadata.join(", ")}`);
    exportVariable("BookNeedsReview", true);
    exportVariable("BookMissingMetadata", missingMetadata.join(", "));
    exportVariable("BookIdentifier", inputIdentifier);
  }
}
