import CardGrouping from "../../../src/models/card-grouping";
import Card from "../../../src/models/card";

describe("CardGrouping", () => {
  it("has array methods", () => {
    expect.assertions(7);

    const group = CardGrouping.create();

    group.push(new Card("Card a"), new Card("Card b"), new Card("Card c"));

    expect(group.length).toBe(3);
    expect(group[0].name).toBe("Card a");
    expect(group[1].name).toBe("Card b");
    expect(group[2].name).toBe("Card c");
    group.forEach((item, index) => {
      expect(item).toBe(group[index]);
    });
  });

  describe("create", () => {
    it("makes a new card group from the strings", () => {
      const group = CardGrouping.create(["Card a", "Card b", "Card c"]);

      expect(group.length).toBe(3);
      expect(group[0].name).toBe("Card a");
      expect(group[1].name).toBe("Card b");
      expect(group[2].name).toBe("Card c");
    });
  });

  describe("size", () => {
    it("retuns the number of cards in grouping", () => {
      const group = CardGrouping.create(["Card a", "Card b", "Card c"]);

      expect(group.length).toBe(3);
      expect(group.size()).toBe(3);
    });
  });

  describe("includesValue", () => {
    it("returns true when card grouping contains a partial name", () => {
      const group = CardGrouping.create(["foo", "bar", "baz"]);

      expect(group.includesValue("fo")).toBe(true);
    });

    it("returns false when card grouping does not contain a partial name", () => {
      const group = CardGrouping.create(["foo", "bar", "baz"]);

      expect(group.includesValue("bo")).toBe(false);
    });
  });

  describe("includesValueExactly", () => {
    it("returns true when card grouping contains a partial name", () => {
      const group = CardGrouping.create(["foo", "bar", "baz"]);

      expect(group.includesValueExactly("bar")).toBe(true);
    });

    it("returns false when card grouping does not contain a partial name", () => {
      const group = CardGrouping.create(["foo", "bar", "baz"]);

      expect(group.includesValueExactly("fo")).toBe(false);
    });
  });

  describe("toString", () => {
    it("renders as the raw string passed in", () => {
      const group = CardGrouping.create(["Card a", "Card b", "Card c"]);

      expect(group.toString()).toBe("Card a | Card b | Card c");
      expect(`pre: ${group} - post`).toBe(
        "pre: Card a | Card b | Card c - post"
      );
    });
  });
});
