import { readFile, writeFile } from "fs/promises";
import { exportVariable, setFailed } from "@actions/core";
import { load } from "js-yaml";
import { stringify } from "json-to-pretty-yaml";
import isbn from "node-isbn";

const allowedFields = [
  "title",
  "authors",
  "publishedDate",
  "description",
  "industryIdentifiers",
  "pageCount",
  "printType",
  "categories",
  "imageLinks",
  "language",
  "canonicalVolumeLink",
];

export const removeWrappedQuotes = (str) => {
  if (str.startsWith('"') && str.endsWith('"')) {
    return str.substr(1, str.length - 2);
  }
  if (str.startsWith('"') && str.endsWith('"--')) {
    return `${str.substr(1, str.length - 4)}…`;
  } else return str;
};

export const cleanBook = (options, book) => {
  const { date, body, bookIsbn } = options;
  return Object.keys(book).reduce(
    (obj, key) => {
      if (allowedFields.indexOf(key) > -1) {
        if (key === "description") obj[key] = removeWrappedQuotes(book[key]);
        if (key === "imageLinks") {
          // Use https
          obj[key] = {
            ...(book[key].smallThumbnail && {
              smallThumbnail: book[key].smallThumbnail.replace(
                "http:",
                "https:"
              ),
            }),
            ...(book[key].thumbnail && {
              thumbnail: book[key].thumbnail.replace("http:", "https:"),
            }),
          };
        } else obj[key] = book[key];
      }
      return obj;
    },
    { isbn: bookIsbn, dateFinished: date, ...(body && { notes: body }) }
  );
};

export const addBook = async (options, book, fileName) => {
  // convert yaml file to JSON
  const readListJson = await toJson(fileName);
  // clean up book data
  const newBook = cleanBook(options, book);
  // export book thumbnail to download later
  if (newBook.imageLinks && newBook.imageLinks.thumbnail) {
    exportVariable("BookThumbOutput", `book-${newBook.isbn}.png`);
    exportVariable("BookThumb", newBook.imageLinks.thumbnail);
  }
  // append new book
  readListJson.push(newBook);
  return sortByDate(readListJson);
};

export async function toJson(fileName) {
  try {
    const contents = await returnReadFile(fileName);
    return load(contents);
  } catch (error) {
    setFailed(error.message);
  }
}

// make sure date is in YYYY-MM-DD format
export const dateFormat = (date) => date.match(/^\d{4}-\d{2}-\d{2}$/) != null;
// make sure date value is a date
export const isDate = (date) => !isNaN(Date.parse(date)) && dateFormat(date);
// make sure ISBN has 10 or 13 characters
export const isIsbn = (isbn) => isbn.length === 10 || isbn.length === 13;

export const titleParser = (title) => {
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
};

export const toYaml = (json) => stringify(json);

export const sortByDate = (array) =>
  array.sort((a, b) => new Date(a.dateFinished) - new Date(b.dateFinished));

export async function getBook(options, fileName) {
  const { bookIsbn, providers } = options;
  return isbn
    .provider(providers)
    .resolve(bookIsbn)
    .then(async (book) => {
      exportVariable("BookTitle", book.title);
      return await addBook(options, book, fileName);
    })
    .catch((err) => {
      setFailed(`Book (${bookIsbn}) not found: ${err}`);
    });
}

export async function returnReadFile(fileName) {
  try {
    const controller = new AbortController();
    const { signal } = controller;
    const promise = readFile(fileName, { signal });
    controller.abort();
    return await promise;
  } catch (error) {
    setFailed(error);
  }
}

export async function returnWriteFile(fileName, bookMetadata) {
  try {
    const controller = new AbortController();
    const { signal } = controller;
    const data = toYaml(bookMetadata);
    const promise = writeFile(fileName, data, { signal });
    controller.abort();
    await promise;
  } catch (error) {
    setFailed(error);
  }
}
