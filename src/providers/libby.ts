import ogs from "open-graph-scraper";
import { BookParams } from "../index.js";
import { parse, HTMLElement } from "node-html-parser";
import { getLibbyId, parseOgMetatagResult } from "../utils.js";
import { NewBook } from "../new-book.js";

interface Data {
  [key: string]: string;
}

export async function getLibby(
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
    duration,
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

    const libbyIdentifier = getLibbyId(inputIdentifier) as string;
    const parsedHtmlMetadata = parseLibbyPage(html);
    const parsedResultMetadata = parseOgMetatagResult(result);

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
      ...(duration && { duration: toIsoFormat(duration) }),
    };
  } catch (error) {
    throw new Error(`Failed to get book from Libby: ${error}`);
  }
}

function toIsoFormat(duration: string): string {
  // convert HH:MM to ISO 8601 duration format
  const [hours, minutes] = duration.split(":").map(Number);
  return `PT${hours}H${minutes}M`;
}

function handleFormat(shareCategory: string): string | undefined {
  const shareCategoryContent = shareCategory.toLowerCase();

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

  const root = parse(html);

  const format = handleFormat(
    root.querySelector(".share-category")?.text || ""
  );

  let htmlData;
  const table = root.querySelector(".share-table-1d");
  if (table) {
    const rows = table.querySelectorAll("tr");
    htmlData = rows.reduce((acc: Data, row: HTMLElement) => {
      const th = row.querySelector("th")?.text || "";
      const td = row.querySelector("td")?.text || "";
      if (th) {
        acc[th.toLowerCase()] = td;
      }
      return acc;
    }, {});
  }

  return {
    ...(htmlData?.publisher && { publisher: htmlData?.publisher }),
    ...(htmlData?.subjects && {
      categories: htmlData?.subjects?.split(",").map((f: string) => f.trim()),
    }),
    ...(format && { format }),
  };
}
