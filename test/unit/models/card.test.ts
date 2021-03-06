/* eslint-disable @typescript-eslint/no-non-null-assertion */
import scryfall from "scryfall-client";
import Card from "../../../src/models/card";

describe("Card", () => {
  it("has a name attribute", () => {
    const card = new Card("Sydri, Galvanic Genius");

    expect(card.name).toEqual("Sydri, Galvanic Genius");
  });

  describe("matchesName", () => {
    it("returns true when the input is the name", () => {
      const card = new Card("Sydri, Galvanic Genius");

      expect(card.matchesName("Sydri, Galvanic Genius")).toBe(true);
      expect(card.matchesName("Arjun, the Shifting Flame")).toBe(false);
    });

    it("returns true for partial matches", () => {
      const card = new Card("Sydri, Galvanic Genius");

      expect(card.matchesName("Sydri")).toBe(true);
      expect(card.matchesName("alv")).toBe(true);
      expect(card.matchesName("nius")).toBe(true);
    });

    it("disregards punctuation and casing", () => {
      const card = new Card("Sydri, Galvanic Genius");

      expect(card.matchesName("sYd~Ri G!alva??nIc GENIUS")).toBe(true);
    });
  });

  describe("matchesNameExactly", () => {
    it("returns true when the input is the name", () => {
      const card = new Card("Sydri, Galvanic Genius");

      expect(card.matchesNameExactly("Sydri, Galvanic Genius")).toBe(true);
      expect(card.matchesNameExactly("Arjun, the Shifting Flame")).toBe(false);
    });

    it("returns false for partial matches", () => {
      const card = new Card("Sydri, Galvanic Genius");

      expect(card.matchesNameExactly("Sydri")).toBe(false);
    });

    it("disregards punctuation and casing", () => {
      const card = new Card("Sydri, Galvanic Genius");

      expect(card.matchesNameExactly("sYd~Ri G!alva??nIc GENIUS")).toBe(true);
    });
  });

  describe("toString", () => {
    it("returns the raw name", () => {
      const card = new Card("Sydri, Galvanic Genius");

      expect(card.toString()).toEqual("Sydri, Galvanic Genius");
      expect(`text ${card} text`).toEqual("text Sydri, Galvanic Genius text");
    });
  });

  describe("getScryfallData", () => {
    it("calls out to scryfall.getCard", async () => {
      const payload = {};

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(scryfall, "getCard").mockResolvedValue(payload as any);

      const card = new Card("Sydri, Galvanic Genius");

      const scryfallResult = await card.getScryfallData();

      expect(scryfallResult).toBe(payload);
      expect(scryfall.getCard).toBeCalledTimes(1);
      expect(scryfall.getCard).toBeCalledWith(
        "Sydri, Galvanic Genius",
        "exactName"
      );
    });
  });

  describe("getScryfallImageUrl", () => {
    it("returns a url for the card image", () => {
      const card = new Card("Sydri, Galvanic Genius");

      expect(card.getScryfallImageUrl()).toBe(
        "https://api.scryfall.com/cards/named?format=image&exact=Sydri%2C%20Galvanic%20Genius"
      );
    });

    it("can pass a version string", () => {
      const card = new Card("Sydri, Galvanic Genius");

      expect(card.getScryfallImageUrl("art_crop")).toBe(
        "https://api.scryfall.com/cards/named?format=image&exact=Sydri%2C%20Galvanic%20Genius&version=art_crop"
      );
    });
  });

  describe("toString", () => {
    it("returns the raw name", () => {
      const card = new Card("Sydri, Galvanic Genius");

      expect(card.toString()).toEqual("Sydri, Galvanic Genius");
      expect(`text ${card} text`).toEqual("text Sydri, Galvanic Genius text");
    });
  });
});
