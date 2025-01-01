import { read } from "../index";
import * as github from "@actions/github";
import * as core from "@actions/core";
import returnWriteFile from "../write-file";
import { promises } from "fs";

const mockReadFile = JSON.stringify([
  {
    identifier: "9780525620792",
    dateStarted: "2021-09-26",
    title: "Mexican Gothic",
    authors: ["Silvia Moreno-Garcia"],
    publishedDate: "2020-06-30",
    description: "NEW YORK TIMES BESTSELLER",
    pageCount: 320,
    format: "BOOK",
    categories: ["Fiction"],
    thumbnail:
      "https://books.google.com/books/content?id=ksKyDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    language: "en",
    link: "https://play.google.com/store/books/details?id=ksKyDwAAQBAJ",
  },
]);

jest.mock("@actions/core", () => {
  return {
    setFailed: jest.fn(),
    exportVariable: jest.fn(),
    getInput: jest.fn(),
    warning: jest.fn(),
    setOutput: jest.fn(),
    summary: {
      addRaw: () => ({
        write: jest.fn(),
      }),
    },
  };
});
jest.mock("../write-file");

const defaultOptions = {
  filename: "my-library.json",
  "required-metadata": "title,pageCount,authors,description",
  "time-zone": "America/New_York",
  "set-image": "true",
};

describe("index", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(promises, "readFile").mockResolvedValue(mockReadFile);
    jest
      .spyOn(core, "getInput")
      .mockImplementation((v) => defaultOptions[v] || undefined);
  });

  test("works, started a new book", async () => {
    const exportVariableSpy = jest.spyOn(core, "exportVariable");
    const setFailedSpy = jest.spyOn(core, "setFailed");
    const setOutputSpy = jest.spyOn(core, "setOutput");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier: "9781760983215",
            "book-status": "started",
            date: "2022-01-02",
          },
        },
      },
    });
    await read();
    expect(exportVariableSpy.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "BookStatus",
          "started",
        ],
        [
          "BookTitle",
          "Luster",
        ],
        [
          "BookThumbOutput",
          "book-9781760983215.png",
        ],
        [
          "BookThumb",
          "https://books.google.com/books/publisher/content?id=CONSTANT_ID&printsec=frontcover&img=1&zoom=5&source=gbs_api",
        ],
      ]
    `);
    expect(setFailedSpy).not.toHaveBeenCalled();
    expect(setOutputSpy.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "nowReading",
        {
          "authors": [
            "Raven Leilani",
          ],
          "description": "'A taut, sharp, funny book about being young now. It's brutal-and brilliant.' Zadie Smith WINNER OF THE KIRKUS PRIZE FOR FICTION 2020 LONGLISTED FOR THE WOMEN'S PRIZE FOR FICTION 2021 Meet Edie. Edie is not okay. She's messing up in her dead-end admin job in her all white office, is sleeping with all the wrong men, and has failed at the only thing that meant anything to her, painting. No one seems to care that she doesn't really know what she's doing with her life beyond looking for her next hook-up. And then she meets Eric, a white, middle-aged archivist with a suburban family, including a wife who has sort-of-agreed to an open marriage and an adopted black daughter who doesn't have a single person in her life who can show her how to do her hair. As if navigating the constantly shifting landscape of sexual and racial politics as a young, black woman wasn't already hard enough, with nowhere else left to go, Edie finds herself falling headfirst into Eric's home and family. Razor sharp. provocatively page-turning and surprisingly tender, Luster is a painfully funny coming-of-age story told by a fresh new voice. ONE OF BARACK OBAMA'S FAVOURITE BOOKS OF 2020 PRAISE FOR LUSTER 'Remarkable, the most delicious novel I've read.' Candice Carty-Williams, bestselling author of Queenie 'Raven Leilani is a writer of unusual daring, with a voice that is unique and fully formed. There is humor, intelligence, emotion, and power in her work. I cannot think of a writer better suited to capture our contemporary moment.' Katie Kitamura, author of A Separation 'Among the most exciting releases of 2020-a lively, unforgettable coming-of-age story . . . Leilani brings painterly precision to each stunning sentence, making for an exacting, darkly comic story of a gifted yet wayward young woman learning to believe in her own talent.' Esquire 'Narrated with fresh and wry jadedness, Edie's every disappointment [is] rendered with a comic twist . . . Edie's life is a mess, her past is filled with sorrow, she's wasting her precious youth, and yet, reading about it all is a whole lot of fun.' Vogue 'Darkly funny with wicked insight . . . This keenly observed, dynamic debut is so cutting, it almost stings.' Elle 'I was blown away by this debut novel . . . It is exquisite.' Dolly Alderton, bestselling author of Everything I Know About Love 'Smart and satirical about everything from the gig economy to racism in publishing to the inner politics of families' Emma Donoghue, bestselling author of Room and The Pull of the Stars",
          "identifier": "9781760983215",
          "image": "book-9781760983215.png",
          "thumbnail": "https://books.google.com/books/publisher/content?id=CONSTANT_ID&printsec=frontcover&img=1&zoom=5&source=gbs_api",
          "title": "Luster",
        },
      ]
    `);
    expect(returnWriteFile.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "my-library.json",
        [
          {
            "authors": [
              "Silvia Moreno-Garcia",
            ],
            "categories": [
              "Fiction",
            ],
            "dateStarted": "2021-09-26",
            "description": "NEW YORK TIMES BESTSELLER",
            "format": "BOOK",
            "identifier": "9780525620792",
            "language": "en",
            "link": "https://play.google.com/store/books/details?id=CONSTANT_ID",
            "pageCount": 320,
            "publishedDate": "2020-06-30",
            "thumbnail": "https://books.google.com/books/content?id=CONSTANT_ID&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
            "title": "Mexican Gothic",
          },
          {
            "authors": [
              "Raven Leilani",
            ],
            "categories": [
              "Fiction",
              "Fiction / Literary",
              "Fiction / Cultural Heritage",
              "Fiction / African American & Black / General",
              "Fiction / Women",
              "Fiction / General",
            ],
            "dateStarted": "2022-01-02",
            "description": "'A taut, sharp, funny book about being young now. It's brutal-and brilliant.' Zadie Smith WINNER OF THE KIRKUS PRIZE FOR FICTION 2020 LONGLISTED FOR THE WOMEN'S PRIZE FOR FICTION 2021 Meet Edie. Edie is not okay. She's messing up in her dead-end admin job in her all white office, is sleeping with all the wrong men, and has failed at the only thing that meant anything to her, painting. No one seems to care that she doesn't really know what she's doing with her life beyond looking for her next hook-up. And then she meets Eric, a white, middle-aged archivist with a suburban family, including a wife who has sort-of-agreed to an open marriage and an adopted black daughter who doesn't have a single person in her life who can show her how to do her hair. As if navigating the constantly shifting landscape of sexual and racial politics as a young, black woman wasn't already hard enough, with nowhere else left to go, Edie finds herself falling headfirst into Eric's home and family. Razor sharp. provocatively page-turning and surprisingly tender, Luster is a painfully funny coming-of-age story told by a fresh new voice. ONE OF BARACK OBAMA'S FAVOURITE BOOKS OF 2020 PRAISE FOR LUSTER 'Remarkable, the most delicious novel I've read.' Candice Carty-Williams, bestselling author of Queenie 'Raven Leilani is a writer of unusual daring, with a voice that is unique and fully formed. There is humor, intelligence, emotion, and power in her work. I cannot think of a writer better suited to capture our contemporary moment.' Katie Kitamura, author of A Separation 'Among the most exciting releases of 2020-a lively, unforgettable coming-of-age story . . . Leilani brings painterly precision to each stunning sentence, making for an exacting, darkly comic story of a gifted yet wayward young woman learning to believe in her own talent.' Esquire 'Narrated with fresh and wry jadedness, Edie's every disappointment [is] rendered with a comic twist . . . Edie's life is a mess, her past is filled with sorrow, she's wasting her precious youth, and yet, reading about it all is a whole lot of fun.' Vogue 'Darkly funny with wicked insight . . . This keenly observed, dynamic debut is so cutting, it almost stings.' Elle 'I was blown away by this debut novel . . . It is exquisite.' Dolly Alderton, bestselling author of Everything I Know About Love 'Smart and satirical about everything from the gig economy to racism in publishing to the inner politics of families' Emma Donoghue, bestselling author of Room and The Pull of the Stars",
            "format": "book",
            "identifier": "9781760983215",
            "identifiers": {
              "isbn": "9781760983215",
            },
            "image": "book-9781760983215.png",
            "language": "en",
            "link": "https://books.google.com/books/about/Luster.html?hl=&id=CONSTANT_ID",
            "pageCount": 209,
            "publishedDate": "2020-11-13",
            "status": "started",
            "thumbnail": "https://books.google.com/books/publisher/content?id=CONSTANT_ID&printsec=frontcover&img=1&zoom=5&source=gbs_api",
            "title": "Luster",
          },
        ],
      ]
    `);
  });

  test("works, finished a previous book", async () => {
    const exportVariableSpy = jest.spyOn(core, "exportVariable");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier: "9780525620792",
            "book-status": "finished",
            date: "2021-09-30",
          },
        },
      },
    });
    await read();
    expect(exportVariableSpy.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "BookStatus",
          "finished",
        ],
        [
          "BookTitle",
          "Mexican Gothic",
        ],
      ]
    `);
    expect(returnWriteFile.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "my-library.json",
        [
          {
            "authors": [
              "Silvia Moreno-Garcia",
            ],
            "categories": [
              "Fiction",
            ],
            "dateAbandoned": undefined,
            "dateAdded": undefined,
            "dateFinished": "2021-09-30",
            "dateStarted": "2021-09-26",
            "description": "NEW YORK TIMES BESTSELLER",
            "format": "BOOK",
            "identifier": "9780525620792",
            "language": "en",
            "link": "https://play.google.com/store/books/details?id=CONSTANT_ID",
            "pageCount": 320,
            "publishedDate": "2020-06-30",
            "status": "finished",
            "thumbnail": "https://books.google.com/books/content?id=CONSTANT_ID&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
            "title": "Mexican Gothic",
          },
        ],
      ]
    `);
  });

  test("works, finished a book (new, not started)", async () => {
    const exportVariableSpy = jest.spyOn(core, "exportVariable");
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier: "9780525511342",
            "book-status": "finished",
            date: "2022-08-02",
          },
        },
      },
    });
    await read();
    expect(exportVariableSpy.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "BookStatus",
          "finished",
        ],
        [
          "BookTitle",
          "Woman of Light",
        ],
        [
          "BookThumbOutput",
          "book-9780525511342.png",
        ],
        [
          "BookThumb",
          "https://books.google.com/books/publisher/content?id=CONSTANT_ID&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
        ],
      ]
    `);
    expect(setFailedSpy).not.toHaveBeenCalled();
    expect(returnWriteFile.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "my-library.json",
        [
          {
            "authors": [
              "Silvia Moreno-Garcia",
            ],
            "categories": [
              "Fiction",
            ],
            "dateStarted": "2021-09-26",
            "description": "NEW YORK TIMES BESTSELLER",
            "format": "BOOK",
            "identifier": "9780525620792",
            "language": "en",
            "link": "https://play.google.com/store/books/details?id=CONSTANT_ID",
            "pageCount": 320,
            "publishedDate": "2020-06-30",
            "thumbnail": "https://books.google.com/books/content?id=CONSTANT_ID&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
            "title": "Mexican Gothic",
          },
          {
            "authors": [
              "Kali Fajardo-Anstine",
            ],
            "categories": [
              "Fiction",
              "Fiction / Literary",
              "Fiction / Hispanic & Latino",
              "Fiction / Historical / General",
            ],
            "dateFinished": "2022-08-02",
            "description": "NATIONAL BESTSELLER • A “dazzling, cinematic, intimate, lyrical” (Roxane Gay) epic of betrayal, love, and fate that spans five generations of an Indigenous Chicano family in the American West, from the author of the National Book Award finalist Sabrina & Corina “Sometimes you just step into a book and let it wash over you, like you’re swimming under a big, sparkling night sky.”—Celeste Ng, author of Little Fires Everywhere and Everything I Never Told You A PHENOMENAL BOOK CLUB PICK AND AN AUDACIOUS BOOK CLUB PICK • ONE OF THE BEST BOOKS OF THE YEAR: Book Riot There is one every generation, a seer who keeps the stories. Luz “Little Light” Lopez, a tea leaf reader and laundress, is left to fend for herself after her older brother, Diego, a snake charmer and factory worker, is run out of town by a violent white mob. As Luz navigates 1930s Denver, she begins to have visions that transport her to her Indigenous homeland in the nearby Lost Territory. Luz recollects her ancestors’ origins, how her family flourished, and how they were threatened. She bears witness to the sinister forces that have devastated her people and their homelands for generations. In the end, it is up to Luz to save her family stories from disappearing into oblivion. Written in Kali Fajardo-Anstine’s singular voice, the wildly entertaining and complex lives of the Lopez family fill the pages of this multigenerational western saga. Woman of Light is a transfixing novel about survival, family secrets, and love—filled with an unforgettable cast of characters, all of whom are just as special, memorable, and complicated as our beloved heroine, Luz. LONGLISTED FOR THE JOYCE CAROL OATES PRIZE • LONGLISTED FOR THE CAROL SHIELDS PRIZE FOR FICTION",
            "format": "book",
            "identifier": "9780525511342",
            "identifiers": {
              "isbn": "9780525511342",
            },
            "image": "book-9780525511342.png",
            "language": "en",
            "link": "https://play.google.com/store/books/details?id=CONSTANT_ID",
            "pageCount": 353,
            "publishedDate": "2022-06-07",
            "status": "finished",
            "summaryEndDate": "2022-08-02",
            "thumbnail": "https://books.google.com/books/publisher/content?id=CONSTANT_ID&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
            "title": "Woman of Light",
          },
        ],
      ]
    `);
  });

  test("works, want to read/queue", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2022-10-01T12:00:00"));

    const exportVariableSpy = jest.spyOn(core, "exportVariable");
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier: "9781760983215",
            "book-status": "want to read",
          },
        },
      },
    });
    await read();
    expect(exportVariableSpy.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "BookStatus",
          "want to read",
        ],
        [
          "BookTitle",
          "Luster",
        ],
        [
          "BookThumbOutput",
          "book-9781760983215.png",
        ],
        [
          "BookThumb",
          "https://books.google.com/books/publisher/content?id=CONSTANT_ID&printsec=frontcover&img=1&zoom=5&source=gbs_api",
        ],
      ]
    `);
    expect(setFailedSpy).not.toHaveBeenCalled();
    expect(returnWriteFile.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "my-library.json",
        [
          {
            "authors": [
              "Silvia Moreno-Garcia",
            ],
            "categories": [
              "Fiction",
            ],
            "dateStarted": "2021-09-26",
            "description": "NEW YORK TIMES BESTSELLER",
            "format": "BOOK",
            "identifier": "9780525620792",
            "language": "en",
            "link": "https://play.google.com/store/books/details?id=CONSTANT_ID",
            "pageCount": 320,
            "publishedDate": "2020-06-30",
            "thumbnail": "https://books.google.com/books/content?id=CONSTANT_ID&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
            "title": "Mexican Gothic",
          },
          {
            "authors": [
              "Raven Leilani",
            ],
            "categories": [
              "Fiction",
              "Fiction / Literary",
              "Fiction / Cultural Heritage",
              "Fiction / African American & Black / General",
              "Fiction / Women",
              "Fiction / General",
            ],
            "dateAdded": "2022-10-01",
            "description": "'A taut, sharp, funny book about being young now. It's brutal-and brilliant.' Zadie Smith WINNER OF THE KIRKUS PRIZE FOR FICTION 2020 LONGLISTED FOR THE WOMEN'S PRIZE FOR FICTION 2021 Meet Edie. Edie is not okay. She's messing up in her dead-end admin job in her all white office, is sleeping with all the wrong men, and has failed at the only thing that meant anything to her, painting. No one seems to care that she doesn't really know what she's doing with her life beyond looking for her next hook-up. And then she meets Eric, a white, middle-aged archivist with a suburban family, including a wife who has sort-of-agreed to an open marriage and an adopted black daughter who doesn't have a single person in her life who can show her how to do her hair. As if navigating the constantly shifting landscape of sexual and racial politics as a young, black woman wasn't already hard enough, with nowhere else left to go, Edie finds herself falling headfirst into Eric's home and family. Razor sharp. provocatively page-turning and surprisingly tender, Luster is a painfully funny coming-of-age story told by a fresh new voice. ONE OF BARACK OBAMA'S FAVOURITE BOOKS OF 2020 PRAISE FOR LUSTER 'Remarkable, the most delicious novel I've read.' Candice Carty-Williams, bestselling author of Queenie 'Raven Leilani is a writer of unusual daring, with a voice that is unique and fully formed. There is humor, intelligence, emotion, and power in her work. I cannot think of a writer better suited to capture our contemporary moment.' Katie Kitamura, author of A Separation 'Among the most exciting releases of 2020-a lively, unforgettable coming-of-age story . . . Leilani brings painterly precision to each stunning sentence, making for an exacting, darkly comic story of a gifted yet wayward young woman learning to believe in her own talent.' Esquire 'Narrated with fresh and wry jadedness, Edie's every disappointment [is] rendered with a comic twist . . . Edie's life is a mess, her past is filled with sorrow, she's wasting her precious youth, and yet, reading about it all is a whole lot of fun.' Vogue 'Darkly funny with wicked insight . . . This keenly observed, dynamic debut is so cutting, it almost stings.' Elle 'I was blown away by this debut novel . . . It is exquisite.' Dolly Alderton, bestselling author of Everything I Know About Love 'Smart and satirical about everything from the gig economy to racism in publishing to the inner politics of families' Emma Donoghue, bestselling author of Room and The Pull of the Stars",
            "format": "book",
            "identifier": "9781760983215",
            "identifiers": {
              "isbn": "9781760983215",
            },
            "image": "book-9781760983215.png",
            "language": "en",
            "link": "https://books.google.com/books/about/Luster.html?hl=&id=CONSTANT_ID",
            "pageCount": 209,
            "publishedDate": "2020-11-13",
            "status": "want to read",
            "thumbnail": "https://books.google.com/books/publisher/content?id=CONSTANT_ID&printsec=frontcover&img=1&zoom=5&source=gbs_api",
            "title": "Luster",
          },
        ],
      ]
    `);
  });

  test("error, no payload", async () => {
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {},
      },
    });

    await read();
    expect(setFailedSpy).toHaveBeenCalledWith("Missing payload");
  });

  test("error, missing identifier", async () => {
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            "book-status": "finished",
            date: "2021-09-26",
          },
        },
      },
    });
    await read();
    expect(setFailedSpy).toHaveBeenCalledWith(
      "Missing `identifier` in payload"
    );
  });

  test("error, missing bad identifier", async () => {
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier: "978",
            "book-status": "finished",
            date: "2021-09-26",
          },
        },
      },
    });
    await read();
    expect(setFailedSpy.mock.calls[0][0]).toMatchInlineSnapshot(
      `"Invalid \`identifier\` in payload: http://not-libby.com/yadda-yadda. Must be an ISBN or start with one of the following: https://share.libbyapp.com/, https://libro.fm/, https://books.apple.com/"`
    );
  });

  test("error, missing bad identifier url", async () => {
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier: "http://not-libby.com/yadda-yadda",
            "book-status": "finished",
            date: "2021-09-26",
          },
        },
      },
    });
    await read();
    expect(setFailedSpy.mock.calls[0][0]).toMatchInlineSnapshot(
      `"Invalid \`identifier\` in payload: http://not-libby.com/yadda-yadda. Must be an ISBN or start with one of the following: https://share.libbyapp.com/, https://libro.fm/, https://books.apple.com/"`
    );
  });

  test("error, setFailed", async () => {
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier: "9781760983215",
            "book-status": "want to read",
          },
        },
      },
    });
    jest.spyOn(core, "getInput").mockImplementation(() => {
      throw new Error("test error");
    });
    await read();
    expect(setFailedSpy.mock.calls[0][0]).toMatchInlineSnapshot(
      `[Error: test error]`
    );
  });

  test("tags", async () => {
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier: "9781760983215",
            tags: "new, recommend",
            "book-status": "want to read",
          },
        },
      },
    });
    await read();
    expect(returnWriteFile.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "my-library.json",
        [
          {
            "authors": [
              "Silvia Moreno-Garcia",
            ],
            "categories": [
              "Fiction",
            ],
            "dateStarted": "2021-09-26",
            "description": "NEW YORK TIMES BESTSELLER",
            "format": "BOOK",
            "identifier": "9780525620792",
            "language": "en",
            "link": "https://play.google.com/store/books/details?id=CONSTANT_ID",
            "pageCount": 320,
            "publishedDate": "2020-06-30",
            "thumbnail": "https://books.google.com/books/content?id=CONSTANT_ID&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
            "title": "Mexican Gothic",
          },
          {
            "authors": [
              "Raven Leilani",
            ],
            "categories": [
              "Fiction",
              "Fiction / Literary",
              "Fiction / Cultural Heritage",
              "Fiction / African American & Black / General",
              "Fiction / Women",
              "Fiction / General",
            ],
            "dateAdded": "2022-10-01",
            "description": "'A taut, sharp, funny book about being young now. It's brutal-and brilliant.' Zadie Smith WINNER OF THE KIRKUS PRIZE FOR FICTION 2020 LONGLISTED FOR THE WOMEN'S PRIZE FOR FICTION 2021 Meet Edie. Edie is not okay. She's messing up in her dead-end admin job in her all white office, is sleeping with all the wrong men, and has failed at the only thing that meant anything to her, painting. No one seems to care that she doesn't really know what she's doing with her life beyond looking for her next hook-up. And then she meets Eric, a white, middle-aged archivist with a suburban family, including a wife who has sort-of-agreed to an open marriage and an adopted black daughter who doesn't have a single person in her life who can show her how to do her hair. As if navigating the constantly shifting landscape of sexual and racial politics as a young, black woman wasn't already hard enough, with nowhere else left to go, Edie finds herself falling headfirst into Eric's home and family. Razor sharp. provocatively page-turning and surprisingly tender, Luster is a painfully funny coming-of-age story told by a fresh new voice. ONE OF BARACK OBAMA'S FAVOURITE BOOKS OF 2020 PRAISE FOR LUSTER 'Remarkable, the most delicious novel I've read.' Candice Carty-Williams, bestselling author of Queenie 'Raven Leilani is a writer of unusual daring, with a voice that is unique and fully formed. There is humor, intelligence, emotion, and power in her work. I cannot think of a writer better suited to capture our contemporary moment.' Katie Kitamura, author of A Separation 'Among the most exciting releases of 2020-a lively, unforgettable coming-of-age story . . . Leilani brings painterly precision to each stunning sentence, making for an exacting, darkly comic story of a gifted yet wayward young woman learning to believe in her own talent.' Esquire 'Narrated with fresh and wry jadedness, Edie's every disappointment [is] rendered with a comic twist . . . Edie's life is a mess, her past is filled with sorrow, she's wasting her precious youth, and yet, reading about it all is a whole lot of fun.' Vogue 'Darkly funny with wicked insight . . . This keenly observed, dynamic debut is so cutting, it almost stings.' Elle 'I was blown away by this debut novel . . . It is exquisite.' Dolly Alderton, bestselling author of Everything I Know About Love 'Smart and satirical about everything from the gig economy to racism in publishing to the inner politics of families' Emma Donoghue, bestselling author of Room and The Pull of the Stars",
            "format": "book",
            "identifier": "9781760983215",
            "identifiers": {
              "isbn": "9781760983215",
            },
            "image": "book-9781760983215.png",
            "language": "en",
            "link": "https://books.google.com/books/about/Luster.html?hl=&id=CONSTANT_ID",
            "pageCount": 209,
            "publishedDate": "2020-11-13",
            "status": "want to read",
            "tags": [
              "new",
              "recommend",
            ],
            "thumbnail": "https://books.google.com/books/publisher/content?id=CONSTANT_ID&printsec=frontcover&img=1&zoom=5&source=gbs_api",
            "title": "Luster",
          },
        ],
      ]
    `);
  });

  test("good date", async () => {
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier: "9781760983215",
            "book-status": "finished",
            date: "2022-02-02",
          },
        },
      },
    });
    await read();
    expect(setFailedSpy).not.toHaveBeenCalled();
  });

  test("error, bad date", async () => {
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier: "9781760983215",
            "book-status": "finished",
            date: "1234",
          },
        },
      },
    });
    await read();
    expect(setFailedSpy).toHaveBeenCalledWith(
      "Invalid `date` in payload: 1234"
    );
  });

  test("error, bad bookStatus", async () => {
    const setFailedSpy = jest.spyOn(core, "setFailed");
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            identifier: "9781760983215",
            "book-status": "did not finish",
          },
        },
      },
    });
    await read();
    expect(setFailedSpy).toHaveBeenCalledWith(
      'Invalid `book-status` in payload: "did not finish". Choose from: "want to read", "started", "finished", "abandoned"'
    );
  });
});
