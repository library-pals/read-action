import { removeWrappedQuotes } from "./utils";
import { Book } from "./get-book";
import { BookParams } from ".";
import { warning } from "@actions/core";

export type CleanBook = {
  dateAdded: string | undefined;
  dateStarted: string | undefined;
  dateFinished: string | undefined;
  title?: string;
  authors?: string[];
  publishedDate?: string;
  description?: string;
  categories?: string[];
  pageCount?: number;
  printType?: string;
  thumbnail?: string;
  language?: string;
  link?: string;
  isbn: string;
  notes?: string;
  status: BookStatus;
  rating?: string;
  tags?: BookParams["tags"];
};

export type BookStatus = "want to read" | "started" | "finished";

export default function cleanBook(options: BookParams, book: Book): CleanBook {
  const { notes, bookIsbn, dates, bookStatus, rating, tags } = options;
  if (!book.pageCount || book.pageCount === 0) {
    warning("Book does not have `pageCount`.");
  }
  return {
    isbn: bookIsbn,
    ...dates,
    status: bookStatus,
    ...(rating && { rating }),
    ...(notes && { notes }),
    ...(tags && { tags }),
    ...("title" in book && { title: book.title }),
    ...("authors" in book && {
      authors: book.authors,
    }),
    ...("publishedDate" in book && { publishedDate: book.publishedDate }),
    ...("description" in book && {
      description: removeWrappedQuotes(book.description),
    }),
    ...("pageCount" in book &&
      book.pageCount > 0 && { pageCount: book.pageCount }),
    ...("printType" in book && { printType: book.printType }),
    ...("categories" in book && { categories: book.categories }),
    ...("imageLinks" in book &&
      "thumbnail" in book.imageLinks && {
        thumbnail: book.imageLinks.thumbnail.replace("http:", "https:"),
      }),
    ...("language" in book && { language: book.language }),
    ...("canonicalVolumeLink" in book && {
      link: book.canonicalVolumeLink,
    }),
  };
}
