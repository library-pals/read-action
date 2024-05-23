import ogs from "open-graph-scraper";
import { CleanBook } from "./clean-book";
import { BookParams } from ".";
import { JSDOM } from "jsdom";

interface Data {
  [key: string]: string;
}

export async function getMetadata(
  options: BookParams
): Promise<CleanBook | undefined> {
  const { notes, bookIsbn, dateType, bookStatus, rating, tags, setImage } =
    options;
  try {
    const { result, html } = await ogs({
      url: bookIsbn,
      customMetaTags: [
        {
          multiple: true,
          property: "book:author",
          fieldName: "authors",
        },
      ],
    });

    const parsedIsbn = bookIsbn.split("/").pop();

    const { shareCategory, htmlData } = parseLibbyPage(html);

    const authors: string[] = Array.isArray(result.customMetaTags?.authors)
      ? result.customMetaTags.authors
      : [];

    return {
      identifier: {
        libby: parsedIsbn,
      },
      ...dateType,
      status: bookStatus,
      ...(rating && { rating }),
      ...(notes && { notes }),
      ...(tags && { tags }),
      title: result.ogTitle,
      description: result.ogDescription,
      authors,
      ...(setImage && {
        image: `book-${parsedIsbn}.png`,
      }),
      link: bookIsbn,
      thumbnail: result?.ogImage ? result.ogImage[0].url : "",
      publishedDate: result.bookReleaseDate,
      ...(htmlData?.publisher && { publisher: htmlData.publisher }),
      ...(htmlData?.subjects && {
        categories: htmlData.subjects.split(",").map((f: string) => f.trim()),
      }),
      format: handleFormat(result.ogType || "", shareCategory),
    };
  } catch (error) {
    throw new Error(`Failed to get book from Libby: ${error.result.error}`);
  }
}
function handleFormat(
  ogType: string,
  shareCategory: Element | undefined
): string | undefined {
  const shareCategoryContent = shareCategory?.textContent?.toLowerCase();

  if (shareCategoryContent) {
    if (shareCategoryContent.includes("audiobook")) {
      return "audiobook";
    }
    if (shareCategoryContent.includes("ebook")) {
      return "ebook";
    }
  }

  return ogType || undefined;
}

export function parseLibbyPage(html: string | undefined): {
  shareCategory: Element | undefined;
  htmlData: Data | undefined;
} {
  if (!html) {
    return {
      shareCategory: undefined,
      htmlData: undefined,
    };
  }
  let htmlData;
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const shareCategory = document.querySelector(".share-category") || undefined;

  const table = document.querySelector(".share-table-1d");
  if (table) {
    const rows = Array.from(table.querySelectorAll("tr"));

    htmlData = rows.reduce((acc: Data, row: HTMLTableRowElement) => {
      const th = row.querySelector("th");
      const td = row.querySelector("td");
      if (th && th.textContent) {
        acc[th.textContent?.toLowerCase()] = td?.textContent || "";
      }
      return acc;
    }, {});
  }
  return {
    shareCategory,
    htmlData,
  };
}
