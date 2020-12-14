import parseColorIdentity from "./parse-color-identity";

import type { SearchParameters } from "../types";

const OPERATORS = [":", "=", ">=", "<=", "<", ">"];
const OPERATOR_REGEX = new RegExp(`(${OPERATORS.join("|")})`);

function collectKeywordedQueries(
  params: SearchParameters,
  query: string
): void {
  // captures keywords in the form key:value
  const simpleQueryGroups =
    query.match(/(-)?\b[\w_]+(:|=|>=|<=|<|>)[^'"\s]+\b/gi) || [];
  // captures keywords in the form key:"value inside double quotes'
  const queryGroupsWithDoubleQuotes =
    query.match(/(-)?\b[\w_]+(:|=|>=|<=|<|>)"[^"]+"/gi) || [];
  // captures keywords in the form key:'value inside single quotes'
  const queryGroupsWithSingleQuotes =
    query.match(/(-)?\b[\w_]+(:|=|>=|<=|<|>)'[^']+'/gi) || [];
  const queries = simpleQueryGroups
    .concat(queryGroupsWithDoubleQuotes)
    .concat(queryGroupsWithSingleQuotes);

  queries.forEach((group) => {
    const operator = (group.match(OPERATOR_REGEX) || [":"])[0];
    const pair = group.split(operator);
    const key = pair[0];
    let value = pair[1];

    if (value.length > 2) {
      const firstChar = value.charAt(0);
      const lastChar = value.charAt(value.length - 1);
      if (
        (firstChar === "'" && lastChar === "'") ||
        (firstChar === '"' && lastChar === '"')
      ) {
        value = value.substring(1, value.length - 1);
      }
    }

    switch (key) {
      case "id":
        params.id = value;
        break;
      case "ci":
      case "color_identity":
      case "coloridentity":
        if (Number(value) >= 0 && Number(value) < 6) {
          params.colorIdentity.sizeFilter.method = operator;
          params.colorIdentity.sizeFilter.value = Number(value);
        } else {
          params.colorIdentity.colorFilter.method = operator;
          params.colorIdentity.colorFilter.value = parseColorIdentity(value);
        }
        break;
      case "card":
        params.cards.include.push(value);
        break;
      case "-card":
        params.cards.exclude.push(value);
        break;
      case "pre":
      case "prerequisite":
      case "prerequisites":
        params.prerequisites.include.push(value);
        break;
      case "-pre":
      case "-prerequisite":
      case "-prerequisites":
        params.prerequisites.exclude.push(value);
        break;
      case "step":
      case "steps":
        params.steps.include.push(value);
        break;
      case "-step":
      case "-steps":
        params.steps.exclude.push(value);
        break;
      case "result":
      case "results":
        params.results.include.push(value);
        break;
      case "-result":
      case "-results":
        params.results.exclude.push(value);
        break;
      default:
        params.errors = params.errors || [];
        params.errors.push({
          key,
          value,
          message: `Could not parse keyword "${key}" with value "${value}"`,
        });
    }
  });
}

function collectPlainNameQueries(
  params: SearchParameters,
  query: string
): void {
  const simpleQueryGroups =
    query.match(
      // this is pretty complex, thanks to @NilsEnevoldsen for help with it
      // (?<=^|\s) - either starts at the beginning of the line or begins with a space
      // (?!:) - does not have a colon
      // (\w+) - any number of word characters
      // (?=$|\s) - ends the line or ends with a space
      // (?=([^"']*["'][^"']*["'])*[^"']*$) - does some lookaheads to avoid quotes
      /(?<=^|\s)(?!:)(\w+)(?=$|\s)(?=([^"']*["'][^"']*["'])*[^"']*$)/gi
    ) || [];
  const queries = simpleQueryGroups;

  queries.forEach((value) => {
    params.cards.include.push(value);
  });
}

export default function parseQuery(query: string): SearchParameters {
  const parameters = {
    cards: {
      include: [],
      exclude: [],
    },
    colorIdentity: {
      colorFilter: {
        method: "none",
        value: [],
      },
      sizeFilter: {
        method: "none",
        value: 5,
      },
    },
    prerequisites: {
      include: [],
      exclude: [],
    },
    steps: {
      include: [],
      exclude: [],
    },
    results: {
      include: [],
      exclude: [],
    },
    errors: [],
  } as SearchParameters;

  if (!query) {
    return parameters;
  }

  collectPlainNameQueries(parameters, query);
  collectKeywordedQueries(parameters, query);

  return parameters;
}
