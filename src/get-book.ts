import isbn from "@library-pals/isbn";
import { BookParams } from ".";
import cleanBook, { CleanBook } from "./clean-book";

export type Book = {
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description?: string;
  industryIdentifiers: {
    type: string;
    identifier: string;
  }[];
  readingModes: {
    text: boolean;
    image: boolean;
  };
  pageCount: number;
  printType: string;
  categories: string[];
  averageRating: number;
  ratingsCount: number;
  maturityRating: string;
  allowAnonLogging: boolean;
  contentVersion: string;
  panelizationSummary: {
    containsEpubBubbles: boolean;
    containsImageBubbles: boolean;
  };
  imageLinks: {
    smallThumbnail?: string;
    thumbnail?: string;
  };
  language: string;
  previewLink: string;
  infoLink: string;
  canonicalVolumeLink: string;
};

export default async function getBook(options: BookParams): Promise<CleanBook> {
  const { bookIsbn, providers } = options;
  let book;
  try {
    book = await isbn.provider(providers).resolve(bookIsbn);
  } catch (error) {
    throw new Error(`Book (${bookIsbn}) not found. ${error.message}`);
  }
  const newBook: CleanBook = cleanBook(options, book);
  return newBook;
}
