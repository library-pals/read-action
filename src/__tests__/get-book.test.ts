import getBook from "../get-book";
import { promises, readFileSync } from "fs";
import book from "./fixture.json";
import Isbn from "@library-pals/isbn";
import * as core from "@actions/core";

const books = readFileSync("./_data/read.json", "utf-8");
const dateFinished = "2020-09-12";

jest.mock("@actions/core");

const defaultOptions = {
  filename: "_data/read.yml",
  "required-metadata": "title,pageCount,authors,description",
  "time-zone": "America/New_York",
};

describe("getBook", () => {
  let isbn;
  beforeEach(() => {
    isbn = new Isbn();
    jest
      .spyOn(core, "getInput")
      .mockImplementation((v) => defaultOptions[v] || undefined);
  });
  afterEach(() => {
    isbn = null;
  });

  test("works", async () => {
    jest.spyOn(isbn, "resolve").mockResolvedValueOnce(book);
    jest.spyOn(promises, "readFile").mockResolvedValueOnce(books);
    expect(
      await getBook({
        dateType: {
          dateFinished,
        },
        bookIsbn: "9780525658184",
        providers: ["google"],
        bookStatus: "finished",
        filename: "_data/read.yml",
      })
    ).toMatchInlineSnapshot(`
      {
        "authors": [
          "Yaa Gyasi",
        ],
        "categories": [
          "Fiction",
        ],
        "dateFinished": "2020-09-12",
        "description": "NEW YORK TIMES BEST SELLER • A TODAY SHOW #ReadWithJenna BOOK CLUB PICK! • Finalist for the WOMEN'S PRIZE Yaa Gyasi's stunning follow-up to her acclaimed national best seller Homegoing is a powerful, raw, intimate, deeply layered novel about a Ghanaian family in Alabama. Gifty is a sixth-year PhD candidate in neuroscience at the Stanford University School of Medicine studying reward-seeking behavior in mice and the neural circuits of depression and addiction. Her brother, Nana, was a gifted high school athlete who died of a heroin overdose after an ankle injury left him hooked on OxyContin. Her suicidal mother is living in her bed. Gifty is determined to discover the scientific basis for the suffering she sees all around her. But even as she turns to the hard sciences to unlock the mystery of her family's loss, she finds herself hungering for her childhood faith and grappling with the evangelical church in which she was raised, whose promise of salvation remains as tantalizing as it is elusive. Transcendent Kingdom is a deeply moving portrait of a family of Ghanaian immigrants ravaged by depression and addiction and grief—a novel about faith, science, religion, love. Exquisitely written, emotionally searing, this is an exceptionally powerful follow-up to Gyasi's phenomenal debut.",
        "isbn": "9780525658184",
        "link": "https://books.google.com/books/about/Transcendent_Kingdom.html?hl=&id=MvaNEAAAQBAJ",
        "pageCount": 0,
        "printType": "BOOK",
        "status": "finished",
        "thumbnail": "https://books.google.com/books?id=MvaNEAAAQBAJ&printsec=frontcover&img=1&zoom=6&edge=curl&source=gbs_api",
        "title": "Transcendent Kingdom",
      }
    `);
  });
});
