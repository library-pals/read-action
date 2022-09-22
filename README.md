# read-action

![Test](https://github.com/katydecorah/read-action/workflows/Test/badge.svg?branch=main) [![Read](https://github.com/katydecorah/read-action/actions/workflows/read.yml/badge.svg)](https://github.com/katydecorah/read-action/actions/workflows/read.yml)

This GitHub action tracks the books that you read by updating a JSON file in your repository. Pair it with the [iOS Shortcut](shortcut/README.md) to automatically trigger the action or click **Run workflow** from the Actions tab to submit details about the book.

[Create a workflow dispatch event](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event) with information about the book. The action will then fetch the book's metadata using [node-isbn](https://www.npmjs.com/package/node-isbn) and commit the change in your repository, always sorting by the date you finished the book.

<!-- START GENERATED DOCUMENTATION -->

## Set up the workflow

To use this action, create a new workflow in `.github/workflows` and modify it as needed:

```yml
name: Read

on:
  workflow_dispatch:
    inputs:
      bookIsbn:
        description: ISBN
        required: true
        type: string
      notes:
        description: Notes
        type: string
      dateStarted:
        description: Date started
        type: string
      dateFinished:
        description: Date finished
        type: string

jobs:
  update_library:
    runs-on: macOS-latest
    name: Read
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Read
        uses: katydecorah/read-action@v5.0.0
      - name: Download the book thumbnail
        if: env.BookThumbOutput != ''
        run: curl "${{ env.BookThumb }}" -o "img/${{ env.BookThumbOutput }}"
      - name: Commit files
        run: |
          git pull
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A && git commit -m "📚 ${{ env.BookStatus }} ${{ env.BookTitle }}"
          git push
```

## Action options

- `readFileName`: The file where you want to save your books. Default: `_data/read.json`.

- `providers`: Specify the [ISBN providers](https://github.com/palmerabollo/node-isbn#setting-backend-providers) that you want to use, in the order you need them to be invoked. If setting more than one provider, separate each with a comma.

<!-- END GENERATED DOCUMENTATION -->

## Send an event

To trigger the action, you will [create a respository dispatch event](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event) with information about the book.

The [iOS Shortcut](shortcut/README.md) helps format and send the event.

### Payload

```js
{
  "ref": "main", // Required. The branch that you will send changes to.
  "inputs": {
    "bookIsbn": "", // Required. The book's ISBN.
    "dateFinished": "", // Optional. The date you finished the book in YYYY-MM-DD format. The default date is today (unless dateStarted is defined, then it is `undefined`).
    "dateStarted": "", // Optional. The date you started the book in YYYY-MM-DD format. The default date is `undefined`.
    "notes": "" // Optional. Notes about the book.
  }
}
```
