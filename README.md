# read-action

![Test](https://github.com/katydecorah/read-action/workflows/Test/badge.svg?branch=main) [![Read](https://github.com/katydecorah/read-action/actions/workflows/read.yml/badge.svg)](https://github.com/katydecorah/read-action/actions/workflows/read.yml)

This GitHub action tracks the books that you read by updating a YAML file in your repository. Pair it with the [iOS Shortcut](shortcut/README.md) to automatically trigger the action.

[Create a respository dispatch event](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event) with information about the book. The action will then fetch the book's metadata using [node-isbn](https://www.npmjs.com/package/node-isbn) and commit the change in your repository, always sorting by the date you finished the book.

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

## Send an event

To trigger the action, you will [create a respository dispatch event](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event) with information about the book.

The [iOS Shortcut](shortcut/README.md) helps format and send the event.

### Payload

```js
{
  "event_type": "read", // Optional. This helps you filter events in the workflow, in case you have more than one.
  "client_payload": {
    "bookIsbn": "", // Required. The book's ISBN.
    "date": "", // Optional. The date you finished the book in YYYY-MM-DD format. The default date is today.
    "notes": "" // Optional. Notes about the book.
  }
}
```
