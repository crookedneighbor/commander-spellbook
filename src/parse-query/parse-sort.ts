import type { SearchParameters } from "../types";
import normalizeStringInput from "../normalize-string-input";

const SUPPORTED_OPERATORS = [":", "="];

export default function parseSort(
  params: SearchParameters,
  operator: string,
  value: string
): void {
  if (params.sort) {
    params.errors.push({
      key: "sort",
      value,
      message: `Sort option "${params.sort}" already chosen. Sorting by "${value}" will be ignored.`,
    });

    return;
  }

  if (!SUPPORTED_OPERATORS.includes(operator)) {
    params.errors.push({
      key: "sort",
      value,
      message: `Sort does not support the "${operator}" operator.`,
    });

    return;
  }

  value = normalizeStringInput(value);

  switch (value) {
    case "results":
    case "numberofresults":
      value = "number-of-results";
      break;
    case "steps":
    case "numberofsteps":
      value = "number-of-steps";
      break;
    case "prerequisites":
    case "numberofprerequisites":
      value = "number-of-prerequisites";
      break;
    case "cards":
    case "numberofcards":
      value = "number-of-cards";
      break;
    case "ci":
    case "coloridentity":
    case "color":
    case "colors":
      value = "colors";
      break;
    case "id":
      break;
    default:
      params.errors.push({
        key: "sort",
        value,
        message: `Unknown sort option "${value}".`,
      });
      return;
  }

  params.sort = value;
}
