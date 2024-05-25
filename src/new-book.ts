import { exportVariable, setOutput } from "@actions/core";
import getBook from "./get-book";
import { CleanBook } from "./clean-book";
import { BookParams } from ".";

export async function handleNewBook({
  bookParams,
  library,
  bookStatus,
  setImage,
}: {
  bookParams: BookParams;
  library: CleanBook[];
  bookStatus: string;
  setImage: boolean;
}): Promise<void> {
  const newBook = await getBook(bookParams);
  library.push(newBook);
  exportVariable(`BookTitle`, newBook.title);
  const image = `book-${newBook.identifier}.png`;

  if (bookStatus === "started") {
    setOutput("nowReading", {
      title: newBook.title,
      authors: newBook.authors,
      description: newBook.description,
      identifier: newBook.identifier,
      thumbnail: newBook.thumbnail,
      ...(setImage && {
        image,
      }),
    });
  }

  if (newBook.thumbnail) {
    exportVariable(`BookThumbOutput`, image);
    exportVariable(`BookThumb`, newBook.thumbnail);
  }
}
