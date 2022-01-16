# read-action

![Test](https://github.com/katydecorah/read-action/workflows/Test/badge.svg?branch=main)

![.github/workflows/read.yml](https://github.com/katydecorah/read-action/workflows/.github/workflows/read.yml/badge.svg)

This GitHub action tracks the books that you've read by updating the `_data/read.yml` file in your repository.

Create a new issue with the book's ISBN in the title. The action will then fetch the book's metadata using [node-isbn](https://www.npmjs.com/package/node-isbn) and add it to `_data/read.yml` in your repository, always sorting by the date you finished the book.

## Set up

Create `.github/workflows/read.yml` file using the following template:

<!-- START GENERATED SETUP -->

```yml
on:
  issues:
    types: opened

jobs:
  update_library:
    runs-on: macOS-latest
    name: Read
    # only continue if issue has "read" label
    if: contains( github.event.issue.labels.*.name, 'read')
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Read
        uses: katydecorah/read-action@v3.0.0
      - name: Download the book thumbnail
        run: curl "${{ env.BookThumb }}" -o "img/staging/${{ env.BookThumbOutput }}"
      - name: Commit files
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A && git commit -m "Updated _data/read.yml"
          git push "https://${GITHUB_ACTOR}:${{secrets.GITHUB_TOKEN}}@github.com/${GITHUB_REPOSITORY}.git" HEAD:${GITHUB_REF}
      - name: Close issue
        uses: peter-evans/close-issue@v1
        with:
          issue-number: "${{ env.IssueNumber }}"
          comment: "📚 You read ${{ env.BookTitle }} on ${{env.DateRead}}."
```

<!-- END GENERATED SETUP -->

## Options

<!-- START GENERATED OPTIONS -->

- `readFileName`: The file where you want to save your books. Default: `_data/read.yml`.
- `providers`: Specify the [ISBN providers](https://github.com/palmerabollo/node-isbn#setting-backend-providers) that you want to use, in the order you need them to be invoked. If setting more than one provider, separate each with a comma.

<!-- END GENERATED OPTIONS -->

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
