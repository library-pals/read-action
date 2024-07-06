import { exportVariable, setOutput } from "@actions/core";
import { BookParams } from ".";
import { getIsbn } from "./providers/isbn";
import { getLibby } from "./providers/libby";
import { getLibrofm } from "./providers/librofm";
import { getAppleBooks } from "./providers/apple-books";

export const providerAction = [
  {
    check: (url: string) => url.startsWith("https://share.libbyapp.com/"),
    action: getLibby,
  },
  {
    check: (url: string) => url.startsWith("https://libro.fm/audiobooks/"),
    action: getLibrofm,
  },
  {
    check: (url: string) => url.startsWith("https://books.apple.com/"),
    action: getAppleBooks,
  },
  {
    check: () => true, // Default strategy
    action: getIsbn,
  },
];

export type BookStatus = "want to read" | "started" | "finished" | "abandoned";

export type NewBook = {
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
    librofm?: string;
    apple?: string;
  };
  notes?: string;
  status: BookStatus;
  rating?: string;
  tags?: BookParams["tags"];
  image?: string;
};

export async function handleNewBook({
  bookParams,
  library,
  bookStatus,
  setImage,
}: {
  bookParams: BookParams;
  library: NewBook[];
  bookStatus: string;
  setImage: boolean;
}): Promise<void> {
  const newBook = await (providerAction
    .find(({ check }) => check(bookParams.inputIdentifier))
    ?.action(bookParams) as Promise<NewBook>);

  library.push(newBook);
  exportVariable(`BookTitle`, newBook.title);

  if (bookStatus === "started") {
    setOutput("nowReading", {
      title: newBook.title,
      authors: newBook.authors,
      description: newBook.description,
      identifier: newBook.identifier,
      thumbnail: newBook.thumbnail,
      ...(setImage && {
        image: newBook.image,
      }),
    });
  }

  if (newBook.thumbnail) {
    exportVariable(`BookThumbOutput`, newBook.image);
    exportVariable(`BookThumb`, encode(newBook.thumbnail));
  }
}

function encode(url: string): string {
  return encodeURI(url);
}
