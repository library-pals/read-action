import { formatDescription } from "./utils";
import { Book } from "@library-pals/isbn";
import { BookParams } from ".";
import { exportVariable, getInput, warning } from "@actions/core";

export type CleanBook = {
  dateAdded?: string | undefined;
  dateStarted?: string | undefined;
  dateFinished?: string | undefined;
  dateAbandoned?: string | undefined;
  title?: string;
  authors?: string[];
  publishedDate?: string;
  description?: string;
  categories?: string[];
  pageCount?: number;
  format?: string;
  thumbnail?: string;
  language?: string;
  link?: string;
  identifier: string;
  identifiers: {
    isbn?: string;
    libby?: string;
  };
  notes?: string;
  status: BookStatus;
  rating?: string;
  tags?: BookParams["tags"];
  image?: string;
};

export type BookStatus = "want to read" | "started" | "finished" | "abandoned";

export default function cleanBook(options: BookParams, book: Book): CleanBook {
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
  checkMetadata(book, inputIdentifier);
  const {
    title,
    authors,
    publishedDate,
    description,
    categories,
    pageCount,
    printType,
    thumbnail,
    language,
    link,
  } = book;

  return {
    identifier: inputIdentifier,
    identifiers: {
      isbn: inputIdentifier,
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
    ...(pageCount ? { pageCount } : { pageCount: 0 }),
    ...(printType && { format: printType.toLowerCase() }),
    ...(categories && { categories }),
    ...(thumbnail && {
      thumbnail: handleThumbnail(thumbnailWidth, thumbnail),
    }),
    ...(language && { language }),
    ...(link && {
      link,
    }),
    ...(setImage && {
      image: `book-${inputIdentifier}.png`,
    }),
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
