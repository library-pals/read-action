import { BookStatus } from "./clean-book";

import { capitalize } from "./utils";

export function summaryMarkdown(bookStatus: BookStatus): string {
  const { BookTitle } = process.env;
  return `# Updated library

${capitalize(`${bookStatus}`)}: “${BookTitle}”
`;
}
