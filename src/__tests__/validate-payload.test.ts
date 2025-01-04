import { validatePayload } from "../validate-payload";
import { BookPayload } from "../index";

describe("validatePayload", () => {
  it("should return success false and message 'Missing payload' when payload is undefined", () => {
    const result = validatePayload(undefined as unknown as BookPayload);
    expect(result).toEqual({ success: false, message: "Missing payload" });
  });

  it("should return success true and message 'Valid payload' when book-status is 'summary'", () => {
    const payload = { "book-status": "summary" } as BookPayload;
    const result = validatePayload(payload);
    expect(result).toEqual({ success: true, message: "Valid payload" });
  });

  it("should return success false and message 'Missing `identifier` in payload' when identifier is missing", () => {
    const payload = { "book-status": "started" } as BookPayload;
    const result = validatePayload(payload);
    expect(result).toEqual({
      success: false,
      message: "Missing `identifier` in payload",
    });
  });

  it("should return success false and message 'Invalid `identifier` in payload' when identifier is invalid", () => {
    const payload = {
      "book-status": "started",
      identifier: "invalid-identifier",
    } as BookPayload;
    const result = validatePayload(payload);
    expect(result).toEqual({
      success: false,
      message:
        "Invalid `identifier` in payload: invalid-identifier. Must be an ISBN or start with one of the following: https://share.libbyapp.com/, https://libro.fm/, https://books.apple.com/",
    });
  });

  it("should return success false and message 'Invalid `date` in payload' when date is invalid", () => {
    const payload = {
      "book-status": "started",
      identifier: "https://share.libbyapp.com/123",
      date: "invalid-date",
    } as BookPayload;
    const result = validatePayload(payload);
    expect(result).toEqual({
      success: false,
      message: "Invalid `date` in payload: invalid-date",
    });
  });

  it("should return success false and message 'Invalid `book-status` in payload' when book-status is invalid", () => {
    const payload = {
      "book-status": "invalid-status",
      identifier: "https://share.libbyapp.com/123",
    } as BookPayload;
    const result = validatePayload(payload);
    expect(result).toEqual({
      success: false,
      message:
        'Invalid `book-status` in payload: "invalid-status". Choose from: "want to read", "started", "finished", "abandoned"',
    });
  });

  it("should return success false and message 'Invalid `duration` in payload' when duration is invalid", () => {
    const payload = {
      "book-status": "started",
      identifier: "https://share.libbyapp.com/123",
      duration: "8H30M40S",
    } as BookPayload;
    const result = validatePayload(payload);
    expect(result).toEqual({
      success: false,
      message:
        'Invalid `duration` in payload: 8H30M40S. Must be in ISO 8601 format, example: "PT8H30M40S" is 8 hours, 30 minutes, and 40 seconds',
    });
  });

  it("should return success true and message 'Valid payload' when payload is valid", () => {
    const payload = {
      "book-status": "started",
      identifier: "https://share.libbyapp.com/123",
      date: "2023-01-01",
      duration: "PT8H30M40S",
    } as BookPayload;
    const result = validatePayload(payload);
    expect(result).toEqual({ success: true, message: "Valid payload" });
  });
});
