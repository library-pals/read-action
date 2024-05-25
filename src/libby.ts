import ogs from "open-graph-scraper";
import { CleanBook } from "./clean-book";
import { BookParams } from ".";
import { JSDOM } from "jsdom";
import { OgObject } from "open-graph-scraper/dist/lib/types";
import { formatDescription } from "./utils";

interface Data {
  [key: string]: string;
}

export async function getMetadata(
  options: BookParams
): Promise<CleanBook | undefined> {
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
      customMetaTags: [
        {
          multiple: true,
          property: "book:author",
          fieldName: "authors",
        },
      ],
    };
    const { result, html } = await ogs(ogsOptions);

    const libbyIdentifier = inputIdentifier.split("/").pop() as string;
    const parsedHtmlMetadata = parseLibbyPage(html);
    const parsedResultMetadata = parseResult(result);

    return {
      identifier: libbyIdentifier,
      identifiers: {
        libby: libbyIdentifier,
        ...(result.bookIsbn && { isbn: result.bookIsbn }),
      },
      ...dateType,
      status: bookStatus,
      ...(rating && { rating }),
      ...(notes && { notes }),
      ...(tags && { tags }),
      ...(setImage && {
        image: `book-${libbyIdentifier}.png`,
      }),
      link: inputIdentifier,
      ...parsedResultMetadata,
      ...parsedHtmlMetadata,
    };
  } catch (error) {
    throw new Error(`Failed to get book from Libby: ${error.result.error}`);
  }
}

function parseResult(result: OgObject): {
  title?: string;
  description?: string;
  authors: string[];
  publishedDate?: string;
  thumbnail: string;
} {
  return {
    title: result.ogTitle,
    description: formatDescription(result.ogDescription),
    authors: Array.isArray(result.customMetaTags?.authors)
      ? result.customMetaTags?.authors
      : result.bookAuthor
        ? [result.bookAuthor]
        : [],
    publishedDate: result.bookReleaseDate,
    thumbnail: result?.ogImage?.[0]?.url ?? "",
  };
}

function handleFormat(shareCategory: Element | null): string | undefined {
  const shareCategoryContent = shareCategory?.textContent?.toLowerCase();

  if (shareCategoryContent) {
    if (shareCategoryContent.includes("audiobook")) {
      return "audiobook";
    }
    if (shareCategoryContent.includes("ebook")) {
      return "ebook";
    }
  }

  return;
}

export function parseLibbyPage(html: string | undefined): {
  publisher?: string;
  categories?: string[];
  format?: string;
} {
  if (!html) {
    return {};
  }

  const dom = new JSDOM(html);
  const document = dom.window.document;
  const format = handleFormat(document.querySelector(".share-category"));

  let htmlData;
  const table = document.querySelector(".share-table-1d");
  if (table) {
    const rows = Array.from(table.querySelectorAll("tr"));
    htmlData = rows.reduce(handleRows, {});
  }

  return {
    ...(htmlData?.publisher && { publisher: htmlData?.publisher }),
    ...(htmlData?.subjects && {
      categories: htmlData?.subjects?.split(",").map((f: string) => f.trim()),
    }),
    ...(format && { format }),
  };
}

function handleRows(acc: Data, row: HTMLTableRowElement) {
  const th = row.querySelector("th");
  const td = row.querySelector("td");
  if (th?.textContent) {
    acc[th.textContent.toLowerCase()] = td?.textContent ?? "";
  }
  return acc;
}
