# read-action

![Test](https://github.com/katydecorah/read-action/workflows/Test/badge.svg?branch=main) [![Read](https://github.com/katydecorah/read-action/actions/workflows/read.yml/badge.svg)](https://github.com/katydecorah/read-action/actions/workflows/read.yml)

This GitHub action tracks the books that you read by updating a JSON file in your repository. Pair it with the [iOS Shortcut](shortcut/README.md) to automatically trigger the action or click **Run workflow** from the Actions tab to submit details about the book.

[Create a workflow dispatch event](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event) with information about the book. The action will then fetch the book's metadata using [node-isbn](https://www.npmjs.com/package/node-isbn) and commit the change in your repository, always sorting by the date you finished the book.

## Book status

There are three statuses a book can have:

1. `want to read` - to mark a book as one that you want to read, do not send a `dateStarted` or `dateFinished` in your payload.
2. `started` - to mark a book as started, add `dateStarted` in your payload.
3. `finished` - to mark a book as finished, add `dateFinished` in your payload.

If you mark a book as "want to read" you can update it to "started" by sending another payload with the same ISBN and `dateStarted`. Similarily, if you marked a book as "want to read" or "started", send a new payload with the same book ISBN and `dateFinished` to mark the book as finished.

<!-- START GENERATED DOCUMENTATION -->

## Set up the workflow

To use this action, create a new workflow in `.github/workflows` and modify it as needed:

```yml
name: Read
run-name: Book (${{ inputs.bookIsbn }})

on:
  workflow_dispatch:
    inputs:
      bookIsbn:
        description: The book's ISBN.
        required: true
        type: string
      notes:
        description: Notes about the book.
        type: string
      rating:
        description: Rating
        type: choice
        options:
          -
          - ⭐️
          - ⭐️⭐️
          - ⭐️⭐️⭐️
          - ⭐️⭐️⭐️⭐️
          - ⭐️⭐️⭐️⭐️⭐️
      # If you do not submit dateStarted or dateFinished, the book status will be set to "want to read"
      dateStarted:
        description: Date you started the book (YYYY-MM-DD).
        type: string
      dateFinished:
        description: Date you finished the book (YYYY-MM-DD).
        type: string

jobs:
  update_library:
    runs-on: macOS-latest
    name: Read
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Read
        uses: katydecorah/read-action@v6.1.0
      - name: Download the book thumbnail
        if: env.BookThumbOutput != ''
        run: curl "${{ env.BookThumb }}" -o "img/${{ env.BookThumbOutput }}"
      - name: Commit files
        run: |
          git pull
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A && git commit -m "📚 “${{ env.BookTitle }}” (${{ env.BookStatus }})"
          git push
```


## Action options

- `readFileName`: The file where you want to save your books. Default: `_data/read.json`.
- `providers`: Specify the [ISBN providers](https://github.com/palmerabollo/node-isbn#setting-backend-providers) that you want to use, in the order you need them to be invoked. If setting more than one provider, separate each with a comma.
- `timeZone`: Your timezone. Default: `America/New_York`.

## Trigger the action

To trigger the action, [create a workflow dispatch event](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event) with the following body parameters:

```js
{ 
  "ref": "main", // Required. The git reference for the workflow, a branch or tag name.
  "inputs": {
    "bookIsbn": "", // Required. The book's ISBN.
    "notes": "", // Notes about the book.
    "rating": "", // Rating
    "dateStarted": "", // Date you started the book (YYYY-MM-DD).
    "dateFinished": "", // Date you finished the book (YYYY-MM-DD).
  }
}
```
<!-- END GENERATED DOCUMENTATION -->
