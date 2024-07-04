import ogs from "open-graph-scraper";
import { BookParams } from "..";
import * as cheerio from "cheerio";
import { OgObject } from "open-graph-scraper/types/lib/types";
import { formatDescription, getLibbyId } from "../utils";
import { NewBook } from "../new-book";

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
    authors: formatAuthor(result),
    publishedDate: result.bookReleaseDate,
    thumbnail: result?.ogImage?.[0]?.url ?? "",
  };
}

function formatAuthor(result: OgObject): string[] {
  if (Array.isArray(result.customMetaTags?.authors)) {
    // Only get the first one as Libby includes narrator in this list
    return [result.customMetaTags.authors[0]];
  }

  if (result.bookAuthor) {
    return [result.bookAuthor];
  }

  return [];
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

  const $ = cheerio.load(html);
  const format = handleFormat($(".share-category").text());

  let htmlData;
  const table = $(".share-table-1d");
  if (table.length) {
    const rows = table.find("tr").toArray();
    htmlData = rows.reduce((acc: Data, row: cheerio.Element) => {
      const th = $(row).find("th").text();
      const td = $(row).find("td").text();
      if (th) {
        acc[th.toLowerCase()] = td || "";
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
