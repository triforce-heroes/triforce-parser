import { describe, expect, it } from "vitest";

import { Builder } from "../src/Builder.js";
import { BuilderError } from "../src/errors/BuilderError.js";
import {
  ValidationError,
  validateKeys,
  validateTypeof,
} from "../src/utils/Validator.js";

describe("builder", () => {
  it("simple sum", () => {
    const builder = new Builder();

    builder.add("operation", (data, { builder: b, build }) => {
      validateKeys(data, { left: Number, operator: String });

      b.writeString(String(data.left));
      b.writeString(data.operator);

      if (data.operator === "=") {
        validateKeys(data, { right: String });

        b.writeString(String(data.right));
      } else {
        validateKeys(data, { right: Object });

        build("operation", data.right);
      }
    });

    expect(
      builder.build({
        left: 1,
        operator: "+",
        right: {
          left: 1,
          operator: "=",
          right: 0,
        },
      }),
    ).toStrictEqual(Buffer.from("1+1=0"));
  });

  it("array logic", () => {
    const builder = new Builder();

    builder.add("array", (data, { builder: b, build }) => {
      validateKeys(data, { items: Array });
      validateTypeof(data.items, Array);

      b.writeString(`${data.items.length}:`);

      for (let i = 0; i < data.items.length; i++) {
        build("item", data.items[i]!);

        if (i < data.items.length - 1) {
          b.writeString(",");
        }
      }
    });

    builder.add("item", (data, { builder: b }) => {
      validateTypeof(data, String);

      b.writeString(data);
    });

    expect(builder.build({ items: ["a", "b", "c", "d", "e"] })).toStrictEqual(
      Buffer.from("5:a,b,c,d,e"),
    );
  });

  it("error logic", () => {
    const builder = new Builder();

    builder.add("error", (_, { error }) => {
      error("test error");
    });

    expect(() => builder.build(undefined)).toThrow(
      new BuilderError("test error"),
    );
  });

  it("validation error", () => {
    const builder = new Builder();

    builder.add("error", (data) => {
      validateTypeof(data, String);
    });

    expect(() => builder.build(undefined)).toThrow(
      new ValidationError("data is not of type string"),
    );
  });
});
