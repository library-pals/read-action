# read-action

![Test](https://github.com/katydecorah/read-action/workflows/Test/badge.svg?branch=main)

![.github/workflows/read.yml](https://github.com/katydecorah/read-action/workflows/.github/workflows/read.yml/badge.svg)

This GitHub action tracks the books that you've read by updating the `_data/read.yml` file in your repository.

Create a new issue with the book's ISBN in the title. The action will then fetch the book's metadata using [node-isbn](https://www.npmjs.com/package/node-isbn) and add it to `_data/read.yml` in your repository, always sorting by the date you finished the book.

## Creating an issue

The title of your issue must start with the ISBN of the book:

```
1234567890
```

The action will automatically set the date that you finished the book (`dateFinished`) to today. To specify a different date that you finished the book, add the date after the ISBN in `YYYY-MM-DD` format.

```
1234567890 2020-06-12
```

If you add content to the body of the comment, the action will add it as the value of `notes`.

## Change the output file

If you'd like to save your books to another file, in the action's `with`, set `readFileName` to your desired path.

```yaml
with:
  readFileName: "archive/books.yml"
```

## Change node-isbn providers

You can specify the [ISBN providers](https://github.com/palmerabollo/node-isbn#setting-backend-providers) that you want to use, in the order you need them to be invoked. If setting more than one provider, separate each with a comma:

```yaml
with:
  providers: "openlibrary,google"
```
