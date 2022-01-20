import { exportVariable, setFailed } from "@actions/core";
import { isIsbn, isDate } from "./utils";

export default function titleParser(title: string): {
  bookIsbn?: string;
  date: string;
} {
  const split = title.split(" ");
  const bookIsbn = isIsbn(split[0]) ? split[0] : undefined;
  if (!bookIsbn) setFailed(`ISBN is not valid: ${title}`);
  const date = isDate(split[1])
    ? split[1]
    : new Date().toISOString().slice(0, 10);
  exportVariable("DateRead", date);
  return {
    bookIsbn,
    date,
  };
}
