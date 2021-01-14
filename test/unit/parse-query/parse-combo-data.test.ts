import parseComboData, {
  COMBO_DATA_TYPES,
} from "../../../src/parse-query/parse-combo-data";

import type { SearchParameters } from "../../../src/types";

describe("parseComboData", () => {
  let searchParams: SearchParameters;

  beforeEach(() => {
    searchParams = {
      cards: {
        sizeFilters: [],
        includeFilters: [],
        excludeFilters: [],
      },
      colorIdentity: {
        includeFilters: [],
        excludeFilters: [],
        sizeFilters: [],
      },
      prerequisites: {
        sizeFilters: [],
        includeFilters: [],
        excludeFilters: [],
      },
      steps: {
        sizeFilters: [],
        includeFilters: [],
        excludeFilters: [],
      },
      results: {
        sizeFilters: [],
        includeFilters: [],
        excludeFilters: [],
      },
      errors: [],
    };
  });

  it("ignores when a unsupported key is passed", () => {
    parseComboData(searchParams, "foo", ":", "data");

    expect(searchParams.cards.includeFilters.length).toBe(0);
    expect(searchParams.cards.excludeFilters.length).toBe(0);
    expect(searchParams.prerequisites.includeFilters.length).toBe(0);
    expect(searchParams.prerequisites.excludeFilters.length).toBe(0);
    expect(searchParams.steps.includeFilters.length).toBe(0);
    expect(searchParams.steps.excludeFilters.length).toBe(0);
    expect(searchParams.results.includeFilters.length).toBe(0);
    expect(searchParams.results.excludeFilters.length).toBe(0);
  });

  it("adds filters to multiple filter arrays when substring that matches multiples is used for key", () => {
    parseComboData(searchParams, "r", ":", "data");

    expect(searchParams.cards.includeFilters.length).toBe(1);
    expect(searchParams.cards.includeFilters[0]).toEqual({
      method: ":",
      value: "data",
    });
    expect(searchParams.cards.includeFilters.length).toBe(1);
    expect(searchParams.prerequisites.includeFilters[0]).toEqual({
      method: ":",
      value: "data",
    });
    expect(searchParams.prerequisites.excludeFilters.length).toBe(0);
    expect(searchParams.steps.includeFilters.length).toBe(0);
    expect(searchParams.steps.excludeFilters.length).toBe(0);
    expect(searchParams.results.includeFilters.length).toBe(1);
    expect(searchParams.results.includeFilters[0]).toEqual({
      method: ":",
      value: "data",
    });
    expect(searchParams.results.excludeFilters.length).toBe(0);
  });

  it("adds negative filters to multiple filter arrays when substring that matches multiples is used for key", () => {
    parseComboData(searchParams, "-r", ":", "data");

    expect(searchParams.cards.includeFilters.length).toBe(0);
    expect(searchParams.cards.excludeFilters.length).toBe(1);
    expect(searchParams.cards.excludeFilters[0]).toEqual({
      method: ":",
      value: "data",
    });
    expect(searchParams.prerequisites.includeFilters.length).toBe(0);
    expect(searchParams.prerequisites.excludeFilters.length).toBe(1);
    expect(searchParams.prerequisites.excludeFilters[0]).toEqual({
      method: ":",
      value: "data",
    });
    expect(searchParams.steps.includeFilters.length).toBe(0);
    expect(searchParams.steps.excludeFilters.length).toBe(0);
    expect(searchParams.results.includeFilters.length).toBe(0);
    expect(searchParams.results.excludeFilters.length).toBe(1);
    expect(searchParams.results.excludeFilters[0]).toEqual({
      method: ":",
      value: "data",
    });
  });

  describe.each(COMBO_DATA_TYPES)("%s", (dataType) => {
    it.each(["=", ":"])("supports %s operator for text values", (operator) => {
      parseComboData(
        searchParams,
        dataType,
        operator,
        "Rashmi, Eternities Crafter"
      );
      parseComboData(searchParams, `-${dataType}`, operator, "Infinite Mana");

      expect(searchParams).toEqual(
        expect.objectContaining({
          errors: [],
          [dataType]: {
            sizeFilters: [],
            excludeFilters: [
              {
                method: operator,
                value: "Infinite Mana",
              },
            ],
            includeFilters: [
              {
                method: operator,
                value: "Rashmi, Eternities Crafter",
              },
            ],
          },
        })
      );
    });

    it.each([">", ">=", "<", "<="])(
      "does not support %s operator for text values",
      (operator) => {
        parseComboData(searchParams, dataType, operator, "foo");

        expect(searchParams).toEqual(
          expect.objectContaining({
            errors: [
              {
                key: dataType,
                value: "foo",
                message: `Operator ${operator} is not compatible with key "${dataType}" and value "foo".`,
              },
            ],
            [dataType]: {
              includeFilters: [],
              excludeFilters: [],
              sizeFilters: [],
            },
          })
        );
      }
    );

    it.each([">", ">=", "=", "<", "<="])(
      "supports %s operator for number values in text params",
      (operator) => {
        parseComboData(searchParams, dataType, operator, "3");

        expect(searchParams).toEqual(
          expect.objectContaining({
            errors: [],
            [dataType]: {
              includeFilters: [],
              excludeFilters: [],
              sizeFilters: [
                {
                  method: operator,
                  value: 3,
                },
              ],
            },
          })
        );
      }
    );

    it("does not support : operator for number values in text params", () => {
      parseComboData(searchParams, dataType, ":", "3");

      expect(searchParams).toEqual(
        expect.objectContaining({
          errors: [],
          [dataType]: {
            includeFilters: [
              {
                method: ":",
                value: "3",
              },
            ],
            excludeFilters: [],
            sizeFilters: [],
          },
        })
      );
    });

    it.each(["=", ">", ">=", "<", "<="])(
      "does not support size operator %s for negative keys",
      (operator) => {
        parseComboData(searchParams, `-${dataType}`, operator, "3");

        expect(searchParams).toEqual(
          expect.objectContaining({
            errors: [
              {
                key: `-${dataType}`,
                value: "3",
                message: `The key "-${dataType}" does not support operator "${operator}".`,
              },
            ],
            [dataType]: {
              includeFilters: [],
              excludeFilters: [],
              sizeFilters: [],
            },
          })
        );
      }
    );
  });
});
