const fs = require("fs");
const core = require("@actions/core");
const yaml = require("js-yaml");
const YAML = require("json-to-pretty-yaml");
const isbn = require("node-isbn");

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

const removeWrappedQuotes = (str) => {
  if (str.startsWith('"') && str.endsWith('"')) {
    return str.substr(1, str.length - 2);
  }
  if (str.startsWith('"') && str.endsWith('"--')) {
    return `${str.substr(1, str.length - 4)}…`;
  } else return str;
};

const cleanBook = (options, book) => {
  const { date, body, bookIsbn } = options;
  return Object.keys(book).reduce(
    (obj, key) => {
      if (allowedFields.indexOf(key) > -1) {
        if (key === "description") obj[key] = removeWrappedQuotes(book[key]);
        else obj[key] = book[key];
      }
      return obj;
    },
    { isbn: bookIsbn, dateFinished: date, ...(body && { notes: body }) }
  );
};

const addBook = async (options, book, fileName) => {
  // convert yaml file to JSON
  const readListJson = (await toJson(fileName)) || [];
  // clean up book data
  const newBook = cleanBook(options, book);
  // append new book
  readListJson.push(newBook);
  return sortByDate(readListJson);
};

const toJson = async (fileName) => {
  try {
    const contents = await readFile(fileName);
    return yaml.load(contents);
  } catch (e) {
    core.setFailed(e);
  }
};

// make sure date is in YYYY-MM-DD format
const dateFormat = (date) => date.match(/^\d{4}-\d{2}-\d{2}$/) != null;
// make sure date value is a date
const isDate = (date) => !isNaN(Date.parse(date)) && dateFormat(date);
// make sure ISBN has 10 or 13 characters
const isIsbn = (isbn) => isbn.length === 10 || isbn.length === 13;

const titleParser = (title) => {
  const split = title.split(" ");
  const bookIsbn = isIsbn(split[0]) ? split[0] : undefined;
  if (!bookIsbn)
    core.setFailed(
      `ISBN must be 10 or 13 characters: ${bookIsbn} is ${
        bookIsbn ? `${bookIsbn.length} characters` : "undefined"
      }`
    );
  const date = isDate(split[1])
    ? split[1]
    : new Date().toISOString().slice(0, 10);
  core.exportVariable("DateRead", date);
  return {
    bookIsbn,
    date,
  };
};

const toYaml = (json) => YAML.stringify(json);

const sortByDate = (array) =>
  array.sort((a, b) => new Date(a.dateFinished) - new Date(b.dateFinished));

async function getBook(options, fileName) {
  const { bookIsbn, providers } = options;
  return isbn
    .provider(providers)
    .resolve(bookIsbn)
    .then(async (book) => {
      core.exportVariable("BookTitle", book.title);
      return await addBook(options, book, fileName);
    })
    .catch(async (err) => {
      core.setFailed(`Book (${bookIsbn}) not found: `, err);
    });
}

async function readFile(fileName) {
  try {
    return fs.readFileSync(fileName, "utf8");
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function writeFile(fileName, bookMetadata) {
  try {
    fs.writeFileSync(fileName, toYaml(bookMetadata), "utf-8");
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = {
  cleanBook,
  addBook,
  removeWrappedQuotes,
  titleParser,
  isIsbn,
  isDate,
  toYaml,
  sortByDate,
  getBook,
  writeFile,
  readFile,
};
