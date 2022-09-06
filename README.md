# read-action

![Test](https://github.com/katydecorah/read-action/workflows/Test/badge.svg?branch=main)

![.github/workflows/read.yml](https://github.com/katydecorah/read-action/workflows/.github/workflows/read.yml/badge.svg)

This GitHub action tracks the books that you read by updating a YAML file in your repository. Pair it with the [iOS Shortcut](shortcut/README.md) to automatically trigger the action.

[Create a respository dispatch event](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event) with information about the book. The action will then fetch the book's metadata using [node-isbn](https://www.npmjs.com/package/node-isbn) and commit the change in your repository, always sorting by the date you finished the book.

## Payload

```json
{
  "event_type": "read", // Optional. This helps you filter events in the workflow, in case you have more than one.
  "client_payload": {
    "bookIsbn": "", // Required. The book's ISBN.
    "date": "", // Optional. The date you finished the book. The default date is today.
    "notes": "" // Optional. Notes about the book.
  }
}
```

<!-- START GENERATED DOCUMENTATION -->

## Set up the workflow

To use this action, create a new workflow in `.github/workflows` and modify it as needed:

```yml
name: Read

on:
  repository_dispatch:
    types: [read]

jobs:
  update_library:
    runs-on: macOS-latest
    name: Read
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Read
        uses: katydecorah/read-action@v3.0.1
      - name: Download the book thumbnail
        run: curl "${{ env.BookThumb }}" -o "img/${{ env.BookThumbOutput }}"
      - name: Commit files
        run: |
          git pull
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A && git commit -m "Add ${{ env.BookTitle }} to _data/read.yml"
          git push
```

## Action options

- `readFileName`: The file where you want to save your books. Default: `_data/read.yml`.

- `providers`: Specify the [ISBN providers](https://github.com/palmerabollo/node-isbn#setting-backend-providers) that you want to use, in the order you need them to be invoked. If setting more than one provider, separate each with a comma.

<!-- END GENERATED DOCUMENTATION -->

## Create an issue

The title of your issue must start with the ISBN of the book:

```
1234567890
```

The action will automatically set the date that you finished the book (`dateFinished`) to today. To specify a different date that you finished the book, add the date after the ISBN in `YYYY-MM-DD` format.

```
1234567890 2020-06-12
```

If you add content to the body of the comment, the action will add it as the value of `notes`.
