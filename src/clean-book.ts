import { removeWrappedQuotes } from "./utils";
import { BookOptions, Book } from "./get-book";

export type CleanBook = {
  dateFinished: string;
  title?: string;
  authors?: string[];
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: { type?: string; indentifier?: string }[];
  categories?: string[];
  pageCount?: number;
  printType?: string;
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
  };
  language?: string;
  canonicalVolumeLink?: string;
  isbn: string;
  notes?: string;
};

export default function cleanBook(options: BookOptions, book: Book): CleanBook {
  const { date, body, bookIsbn } = options;
  return {
    isbn: bookIsbn,
    dateFinished: date,
    ...(body && { notes: body }),
    ...("title" in book && { title: book.title }),
    ...("authors" in book && {
      authors: book.authors,
    }),
    ...("publishedDate" in book && { publishedDate: book.publishedDate }),
    ...("description" in book && {
      description: removeWrappedQuotes(book.description),
    }),
    ...("industryIdentifiers" in book && {
      industryIdentifiers: book.industryIdentifiers,
    }),
    ...("pageCount" in book && { pageCount: book.pageCount }),
    ...("printType" in book && { printType: book.printType }),
    ...("categories" in book && { categories: book.categories }),
    ...("imageLinks" in book && {
      imageLinks: {
        ...("smallThumbnail" in book.imageLinks && {
          smallThumbnail: book.imageLinks.smallThumbnail.replace(
            "http:",
            "https:"
          ),
        }),
        ...("thumbnail" in book.imageLinks && {
          thumbnail: book.imageLinks.thumbnail.replace("http:", "https:"),
        }),
      },
    }),
    ...("language" in book && { language: book.language }),
    ...("canonicalVolumeLink" in book && {
      canonicalVolumeLink: book.canonicalVolumeLink,
    }),
  };
}
