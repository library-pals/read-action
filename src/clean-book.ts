import { removeWrappedQuotes, setDateFinished } from "./utils";
import { BookOptions, Book } from "./get-book";

export type CleanBook = {
  dateFinished: string | undefined;
  dateStarted: string | undefined;
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
};

export default function cleanBook(options: BookOptions, book: Book): CleanBook {
  const { notes, bookIsbn, dateStarted, dateFinished } = options;
  return {
    isbn: bookIsbn,
    dateStarted: dateStarted || undefined,
    dateFinished: setDateFinished(dateFinished, dateStarted),
    ...(notes && { notes }),
    ...("title" in book && { title: book.title }),
    ...("authors" in book && {
      authors: book.authors,
    }),
    ...("publishedDate" in book && { publishedDate: book.publishedDate }),
    ...("description" in book && {
      description: removeWrappedQuotes(book.description),
    }),
    ...("pageCount" in book && { pageCount: book.pageCount }),
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
