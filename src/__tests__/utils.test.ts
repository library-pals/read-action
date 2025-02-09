import {
  formatDescription,
  isIsbn,
  sortByDate,
  isDate,
  getBookStatus,
  getLibrofmId,
  secondsToHms,
} from "../utils";

jest.mock("@actions/core");
jest.useFakeTimers().setSystemTime(new Date("2023-12-01T12:00:00"));

it("formatDescription", () => {
  expect(formatDescription("")).toBe("");
  expect(formatDescription("hello")).toBe("hello");
  expect(formatDescription('"hello"')).toBe("hello");
  expect(formatDescription('this says "hello".')).toBe('this says "hello".');
  expect(formatDescription('"this part will get cut off"--')).toBe(
    "this part will get cut off…"
  );
  expect(formatDescription("<p>hello</p>")).toBe("hello");
  expect(
    formatDescription(
      `<b><i>NEW YORK TIMES</i></b><b> BESTSELLER</b><br> <b>A GOOD MORNING AMERICA BOOK CLUB PICK</b><br> <br><b>“This summer’s hottest debut.” —<i>Cosmopolitan </i>• “Witty, sexy escapist fiction [that] packs a substantial punch...It’s a smart, gripping work that’s also a feast for the senses...Fresh and thrilling.” —<i>Los Angeles Times </i>• “Electric...I loved every second.” —Emily Henry</b><br> <br><b>“Utterly winning...Imagine if <i>The Time Traveler’s Wife </i>had an affair with <i>A Gentleman in Moscow</i>...Readers, I envy you: There’s a smart, witty novel in your future.” —Ron Charles, <i>The Washington Post</i></b><br> <br><b>A time travel romance, a spy thriller, a workplace comedy, and an ingenious exploration of the nature of power and the potential for love to change it all: Welcome to <i>The Ministry of Time</i>, the exhilarating debut novel by Kaliane Bradley.</b><br><br>In the near future, a civil servant is offered the salary of her dreams and is, shortly afterward, told what project she’ll be working on. A recently established government ministry is gathering “expats” from across history to establish whether time travel is feasible—for the body, but also for the fabric of space-time.<br> <br>She is tasked with working as a “bridge”: living with, assisting, and monitoring the expat known as “1847” or Commander Graham Gore. As far as history is concerned, Commander Gore died on Sir John Franklin’s doomed 1845 expedition to the Arctic, so he’s a little disoriented to be living with an unmarried woman who regularly shows her calves, surrounded by outlandish concepts such as “washing machines,” “Spotify,” and “the collapse of the British Empire.” But with an appetite for discovery, a seven-a-day cigarette habit, and the support of a charming and chaotic cast of fellow expats, he soon adjusts.<br> <br>Over the next year, what the bridge initially thought would be, at best, a horrifically uncomfortable roommate dynamic, evolves into something much deeper. By the time the true shape of the Ministry’s project comes to light, the bridge has fallen haphazardly, fervently in love, with consequences she never could have imagined. Forced to confront the choices that brought them together, the bridge must finally reckon with how—and whether she believes—what she does next can change the future.<br> <br>An exquisitely original and feverishly fun fusion of genres and ideas, <i>The Ministry of Time </i>asks: What does it mean to defy history, when history is living in your house? Kaliane Bradley’s answer is a blazing, unforgettable testament to what we owe each other in a changing world.`
    )
  ).toMatchInlineSnapshot(
    `"NEW YORK TIMES BESTSELLER  “This summer’s hottest debut.” — Cosmopolitan • “Witty, sexy escapist fiction [that] packs a substantial punch...It’s a smart, gripping work that’s also a feast for the senses...Fresh and thrilling.” — Los Angeles Times • “Electric...I loved every second.” —Emily Henry “Utterly winning...Imagine if The Time Traveler’s Wife had an affair with A Gentleman in Moscow ...Readers, I envy you: There’s a smart, witty novel in your future.” —Ron Charles, The Washington Post A time travel romance, a spy thriller, a workplace comedy, and an ingenious exploration of the nature of power and the potential for love to change it all: Welcome to The Ministry of Time , the exhilarating debut novel by Kaliane Bradley. In the near future, a civil servant is offered the salary of her dreams and is, shortly afterward, told what project she’ll be working on. A recently established government ministry is gathering “expats” from across history to establish whether time travel is feasible—for the body, but also for the fabric of space-time. She is tasked with working as a “bridge”: living with, assisting, and monitoring the expat known as “1847” or Commander Graham Gore. As far as history is concerned, Commander Gore died on Sir John Franklin’s doomed 1845 expedition to the Arctic, so he’s a little disoriented to be living with an unmarried woman who regularly shows her calves, surrounded by outlandish concepts such as “washing machines,” “Spotify,” and “the collapse of the British Empire.” But with an appetite for discovery, a seven-a-day cigarette habit, and the support of a charming and chaotic cast of fellow expats, he soon adjusts. Over the next year, what the bridge initially thought would be, at best, a horrifically uncomfortable roommate dynamic, evolves into something much deeper. By the time the true shape of the Ministry’s project comes to light, the bridge has fallen haphazardly, fervently in love, with consequences she never could have imagined. Forced to confront the choices that brought them together, the bridge must finally reckon with how—and whether she believes—what she does next can change the future. An exquisitely original and feverishly fun fusion of genres and ideas, The Ministry of Time asks: What does it mean to defy history, when history is living in your house? Kaliane Bradley’s answer is a blazing, unforgettable testament to what we owe each other in a changing world."`
  );
});

it("isIsbn", () => {
  expect(isIsbn("1234567890")).toEqual(true);
  expect(isIsbn("1234567890123")).toEqual(true);
  expect(isIsbn("123456789012")).toEqual(false);
  expect(isIsbn("12345678901234")).toEqual(false);
  expect(isIsbn("1")).toEqual(false);
});

it("isDate", () => {
  expect(isDate("abcde")).toEqual(false);
  expect(isDate("2020-09-12")).toEqual(true);
  expect(isDate("2020")).toEqual(false);
});

it("sortByDate", () => {
  expect(
    sortByDate([
      { dateFinished: "2020-01-01" },
      { dateFinished: "1900-01-01" },
      { dateFinished: "2020-11-01" },
    ])
  ).toEqual([
    { dateFinished: "1900-01-01" },
    { dateFinished: "2020-01-01" },
    { dateFinished: "2020-11-01" },
  ]);
});

it("getBookStatus", () => {
  expect(
    getBookStatus({
      date: "2020-01-01",
      bookStatus: "abandoned",
    })
  ).toMatchInlineSnapshot(`
    {
      "dateAbandoned": "2020-01-01",
    }
  `);
  expect(
    getBookStatus({
      date: "2020-01-01",
      bookStatus: "finished",
    })
  ).toMatchInlineSnapshot(`
    {
      "dateFinished": "2020-01-01",
      "summaryEndDate": "2020-01-01",
    }
  `);
  expect(
    getBookStatus({
      date: "2020-01-01",
      bookStatus: "started",
    })
  ).toMatchInlineSnapshot(`
    {
      "dateStarted": "2020-01-01",
    }
  `);
  expect(
    getBookStatus({
      date: "2020-01-01",
      bookStatus: "want to read",
    })
  ).toMatchInlineSnapshot(`
    {
      "dateAdded": "2020-01-01",
    }
  `);
  expect(
    getBookStatus({
      date: "2020-01-01",
    })
  ).toMatchInlineSnapshot(`
    {
      "dateAdded": "2020-01-01",
    }
  `);
  expect(getBookStatus({})).toMatchInlineSnapshot(`
    {
      "dateAdded": "2023-12-01",
    }
  `);
});

describe("getLibrofmId", () => {
  it("should return the input identifier when no ISBN is found", () => {
    const inputIdentifier = "";
    const result = getLibrofmId(inputIdentifier);
    expect(result).toBe(inputIdentifier);
  });
});

describe("secondsToHms", () => {
  it("should return an empty string for undefined input", () => {
    expect(secondsToHms(undefined)).toMatchInlineSnapshot(`""`);
  });

  it("should return the correct format for seconds only", () => {
    expect(secondsToHms(45)).toMatchInlineSnapshot(`"45 seconds"`);
  });

  it("should return the correct format for minutes and seconds", () => {
    expect(secondsToHms(125)).toMatchInlineSnapshot(`"2 minutes, 5 seconds"`);
  });

  it("should return the correct format for hours, minutes, and seconds", () => {
    expect(secondsToHms(3665)).toMatchInlineSnapshot(
      `"1 hour, 1 minute, 5 seconds"`
    );
  });

  it("should return the correct format for hours and minutes", () => {
    expect(secondsToHms(3600)).toMatchInlineSnapshot(`"1 hour"`);
    expect(secondsToHms(7200)).toMatchInlineSnapshot(`"2 hours"`);
    expect(secondsToHms(7260)).toMatchInlineSnapshot(`"2 hours, 1 minute"`);
  });

  it("should return an empty string for zero seconds", () => {
    expect(secondsToHms(0)).toMatchInlineSnapshot(`""`);
  });

  it("should return '1 second' for one second input", () => {
    expect(secondsToHms(1)).toMatchInlineSnapshot(`"1 second"`);
  });
});
