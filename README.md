# read-action

![Test](https://github.com/library-pals/read-action/workflows/Test/badge.svg?branch=main) [![Read](https://github.com/library-pals/read-action/actions/workflows/read.yml/badge.svg)](https://github.com/library-pals/read-action/actions/workflows/read.yml)

This GitHub action tracks the books that you read by updating a JSON file in your repository. Pair it with the [iOS Shortcut](shortcut/README.md) to automatically trigger the action or click **Run workflow** from the Actions tab to submit details about the book.

[Create a workflow dispatch event](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event) with information about the book.

The action will then fetch the book's metadata using and commit the change in your repository, always sorting by the date you finished the book.

## Data providers

Depending on the type of `identifier` you submit to the action, it will use the follow data provider.

| Identifier   | Data provider                                                          |
| ------------ | ---------------------------------------------------------------------- |
| ISBN         | [@library-pals/isbn](https://www.npmjs.com/package/@library-pals/isbn) |
| Libby URL    | [Libby](https://libbyapp.com) via metatag and HTML scraping            |
| Libro.fm URL | [Libro.fm](https://libro.fm) via metatag scraping                      |

## Book lifecycle

When you add or update a book, you can set it as: want to read, started, finished, or abandoned. This will set the value as `bookStatus` and will add an accompanying date for the status.

To update the book's status, trigger the action using the same identifier (ISBN or Libby share URL) that you used in the initial request.

<!-- START GENERATED DOCUMENTATION -->

## Set up the workflow

To use this action, create a new workflow in `.github/workflows` and modify it as needed:

```yml
name: read action
run-name: 📚 ${{ inputs['book-status'] }} book ${{ inputs.identifier }}

# Grant the action permission to write to the repository
permissions:
  contents: write

# Trigger the action
on:
  workflow_dispatch:
    inputs:
      identifier:
        description: The book's identifier. This is an ISBN, Libby or Libro.fm share URL. Required.
        # Example values:
        # 9780062315007
        # https://share.libbyapp.com/title/9575390
        # https://libro.fm/audiobooks/9781797176888-the-ministry-of-time
        required: true
        type: string
      book-status:
        description: What is the status of the book? Required.
        required: true
        type: choice
        default: "want to read"
        options:
          - "want to read"
          - "started"
          - "finished"
          - "abandoned"
      date:
        description: Date to record the status of the book (YYYY-MM-DD). Leave blank for today. Optional.
        type: string
      notes:
        description: Notes about the book. Optional.
        type: string
      # Adding a rating is optional.
      # You can change the options to whatever you want to use.
      # For example, you can use numbers, other emoji, or words.
      rating:
        description: Rate the book. Optional.
        type: choice
        default: "unrated"
        options:
          - "unrated"
          - ⭐️
          - ⭐️⭐️
          - ⭐️⭐️⭐️
          - ⭐️⭐️⭐️⭐️
          - ⭐️⭐️⭐️⭐️⭐️
      # Tags are optional.
      tags:
        description: Add tags to categorize the book. Separate each tag with a comma. Optional.
        type: string

# Set up the steps to run the action
jobs:
  update-library:
    runs-on: ubuntu-latest
    name: Read
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Read
        uses: library-pals/read-action@v8.1.0

      - name: Commit updated read file
        run: |
          git pull
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A && git commit -m "📚 “${{ env.BookTitle }}” (${{ env.BookStatus }})"
          git push
```

### Additional example workflows

<details>
<summary>When book is missing metadata, create a pull request</summary>

```yml
name: When book is missing metadata, create a pull request
run-name: 📚 ${{ inputs['book-status'] }} book ${{ inputs.identifier }}

# Grant the action permission to write to the repository
permissions:
  contents: write
  pull-requests: write

# Trigger the action
on:
  workflow_dispatch:
    inputs:
      book-status:
        description: What is the status of the book? Required.
        required: true
        type: choice
        default: "want to read"
        options:
          - "want to read"
          - "started"
          - "finished"
          - "abandoned"
      date:
        description: Date to record the status of the book (YYYY-MM-DD). Leave blank for today. Optional.
        type: string
      identifier:
        description: The book's identifier. This is an ISBN, Libby or Libro.fm share URL. Required.
        # Example values:
        # 9780062315007
        # https://share.libbyapp.com/title/9575390
        # https://libro.fm/audiobooks/9781797176888-the-ministry-of-time
        required: true
        type: string
      notes:
        description: Notes about the book. Optional.
        type: string
      # Adding a rating is optional.
      # You can change the options to whatever you want to use.
      # For example, you can use numbers, other emoji, or words.
      rating:
        description: Rate the book. Optional.
        type: choice
        default: "unrated"
        options:
          - "unrated"
          - ⭐️
          - ⭐️⭐️
          - ⭐️⭐️⭐️
          - ⭐️⭐️⭐️⭐️
          - ⭐️⭐️⭐️⭐️⭐️
      # Tags are optional.
      tags:
        description: Add tags to categorize the book. Separate each tag with a comma. Optional.
        type: string

# Set up the steps to run the action
jobs:
  update-library:
    runs-on: ubuntu-latest
    name: Read
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Read
        id: read_action
        with:
          set-image: true
        uses: library-pals/read-action@v8.1.0

      - name: Download the book thumbnail
        if: env.BookThumbOutput != ''
        run: curl "${{ env.BookThumb }}" -o "img/${{ env.BookThumbOutput }}"

      - name: Commit updated read file
        if: env.BookNeedsReview != 'true' # Do not commit book if it needs review
        run: |
          git pull
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A && git commit -m "📚 “${{ env.BookTitle }}” (${{ env.BookStatus }})"
          git push

      # Create pull request instead of directly committing if book is missing metadata
      # Occasionally, some books returned from @library-pals/isbn may be missing a few properties.
      # Add this step to your workflow if you want the ability to fix the missing data by making the action open a new pull request.
      # You can customize the properties that will trigger a pull request with the `required-metadata` input.
      - name: If book needs review, create a pull request to review book metadata
        if: env.BookNeedsReview == 'true'
        run: |
          git config pull.rebase true
          git fetch origin
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git checkout -b review-book-${{env.BookIsbn}}
          git remote set-url origin https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/${{ github.repository }}
          git add -A && git commit -m "📚 “${{ env.BookTitle }}” (${{ env.BookStatus }})" -m "“${{ env.BookTitle }}” is missing the following properties: ${{env.BookMissingMetadata}}. Edit this pull request to add them or merge it in."
          git push --set-upstream origin review-book-${{env.BookIsbn}}
          gh pr create -B main -H "review-book-${{env.BookIsbn}}" --fill
        env:
          GH_TOKEN: ${{ github.token }}

      - name: Now reading
        if: steps.read_action.outputs.nowReading != ''
        run: |
          echo "Now reading: ${{ steps.read_action.outputs.nowReading }}"
```

</details>

<details>
<summary>Download the book thumbnail</summary>

```yml
name: Download the book thumbnail
run-name: 📚 ${{ inputs['book-status'] }} book ${{ inputs.identifier }}

# Grant the action permission to write to the repository
permissions:
  contents: write

# Trigger the action
on:
  workflow_dispatch:
    inputs:
      identifier:
        description: The book's identifier. This is an ISBN, Libby or Libro.fm share URL. Required.
        # Example values:
        # 9780062315007
        # https://share.libbyapp.com/title/9575390
        # https://libro.fm/audiobooks/9781797176888-the-ministry-of-time
        required: true
        type: string
      book-status:
        description: What is the status of the book? Required.
        required: true
        type: choice
        default: "want to read"
        options:
          - "want to read"
          - "started"
          - "finished"
          - "abandoned"
      date:
        description: Date to record the status of the book (YYYY-MM-DD). Leave blank for today. Optional.
        type: string
      notes:
        description: Notes about the book. Optional.
        type: string
      # Adding a rating is optional.
      # You can change the options to whatever you want to use.
      # For example, you can use numbers, other emoji, or words.
      rating:
        description: Rate the book. Optional.
        type: choice
        default: "unrated"
        options:
          - "unrated"
          - ⭐️
          - ⭐️⭐️
          - ⭐️⭐️⭐️
          - ⭐️⭐️⭐️⭐️
          - ⭐️⭐️⭐️⭐️⭐️
      # Tags are optional.
      tags:
        description: Add tags to categorize the book. Separate each tag with a comma. Optional.
        type: string

# Set up the steps to run the action
jobs:
  update-library:
    runs-on: ubuntu-latest
    name: Read
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Read
        uses: library-pals/read-action@v8.1.0
        with:
          thumbnail-width: 1280
          set-image: true

      - name: Download the book thumbnail
        if: env.BookThumbOutput != ''
        run: curl "${{ env.BookThumb }}" -o "img/${{ env.BookThumbOutput }}"

      - name: Commit updated read file
        run: |
          git pull
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A && git commit -m "📚 “${{ env.BookTitle }}” (${{ env.BookStatus }})"
          git push
```

</details>

## Action options

- `filename`: The file where you want to save your books. Default: `_data/read.json`.

- `providers`: Specify the [ISBN providers](https://github.com/library-pals/isbn?tab=readme-ov-file#setting-backend-providers) that you want to use, in the order you need them to be invoked. If setting more than one provider, separate each with a comma.

- `time-zone`: Your time zone. Default: `America/New_York`.

- `required-metadata`: Required metadata properties. This can be used to make the action open a pull request if one of these values is missing data in the desired book instead of committing directly to a repository. Default: `title,pageCount,authors,description,thumbnail`.

- `set-image`: If true, the action will set the `image` for the book. This is helpful if you add an extra step to download this image.

- `thumbnail-width`: The width of the thumbnail image (for books sourced from Google Books). The default size is 128.

## Trigger the action

To trigger the action, [create a workflow dispatch event](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event) with the following body parameters:

```js
{
  "ref": "main", // Required. The git reference for the workflow, a branch or tag name.
  "inputs": {
    "identifier": "", // Required. The book's identifier. This is an ISBN, Libby or Libro.fm share URL. Required.
    "book-status": "", // Required. What is the status of the book? Required. Default: `want to read`.
    "date": "", // Date to record the status of the book (YYYY-MM-DD). Leave blank for today. Optional.
    "notes": "", // Notes about the book. Optional.
    "rating": "", // Rate the book. Optional. Default: `unrated`.
    "tags": "", // Add tags to categorize the book. Separate each tag with a comma. Optional.
  }
}
```



## Action outputs

- `nowReading`: When a new book is started this output will contain an object with the book's: title, description, thumbnail, authors, and isbn.
<!-- END GENERATED DOCUMENTATION -->
