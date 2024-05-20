/* istanbul ignore file */

module.exports = {
  test(val: string | URL) {
    if (typeof val !== "string") {
      return false;
    }

    try {
      const url = new URL(val);
      return url.searchParams.has("id");
    } catch (err) {
      // If it's not a valid URL, it's not testable by this serializer
      return false;
    }
  },
  print(val: string | URL) {
    const url = new URL(val);
    url.searchParams.set("id", "CONSTANT_ID");
    return `"${url.toString()}"`;
  },
};
