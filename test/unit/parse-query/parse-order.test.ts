import parseOrder from "../../../src/parse-query/parse-order";
import { makeSearchParams } from "../helper";

import type { SearchParameters } from "../../../src/types";

describe("parseOrder", () => {
  let searchParams: SearchParameters;

  beforeEach(() => {
    searchParams = makeSearchParams();
  });

  it.each(["asc", "a-sce_nding", "ascending"])("suports %s", (kind) => {
    parseOrder(searchParams, kind);

    expect(searchParams.order).toEqual("ascending");
  });

  it.each(["desc", "de-sce_nding", "descending"])("suports %s", (kind) => {
    parseOrder(searchParams, kind);

    expect(searchParams.order).toEqual("descending");
  });

  it("provides error if invalid value is used for order", () => {
    parseOrder(searchParams, "foo");

    expect(searchParams.order).toBeFalsy();
    expect(searchParams.errors[0]).toEqual({
      key: "order",
      value: "foo",
      message: `Unknown order option "foo".`,
    });
  });

  it("provides error if order is already specified", () => {
    parseOrder(searchParams, "asc");

    parseOrder(searchParams, "desc");

    expect(searchParams.order).toEqual("ascending");
    expect(searchParams.errors[0]).toEqual({
      key: "order",
      value: "desc",
      message: `Order option "ascending" already chosen. Ordering by "desc" will be ignored.`,
    });
  });
});
