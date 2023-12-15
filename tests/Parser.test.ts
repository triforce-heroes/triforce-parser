import { BufferConsumer } from "@triforce-heroes/triforce-core";
import { describe, expect, it } from "vitest";

import { Parser } from "../src/Parser.js";

describe("parser", () => {
  it("simple sum", () => {
    const parser = new Parser();

    parser.add("operation", ({ consumer, consume }) => {
      const left = Number(consumer.readString(1));
      const operator = consumer.readString(1);
      const right =
        operator === "+"
          ? consume("operation")
          : Number(consumer.readString(1));

      return { left, operator, right };
    });

    expect(
      parser.parse(new BufferConsumer(Buffer.from("1+1=0"))),
    ).toStrictEqual({
      left: 1,
      operator: "+",
      right: {
        left: 1,
        operator: "=",
        right: 0,
      },
    });
  });

  it("array logic", () => {
    const parser = new Parser();

    parser.add("item", ({ consumer }) => consumer.readString(1));

    parser.add("array", ({ consumer, consume }) => {
      const count = Number(consumer.readString(1));

      consumer.atConsumable(":".codePointAt(0)!);

      const items: string[] = [];

      for (let i = 0; i < count; i++) {
        items.push(consume("item") as string);

        if (!consumer.isConsumed()) {
          consumer.atConsumable(",".codePointAt(0)!);
        }
      }

      return { items };
    });

    expect(
      parser.parse(new BufferConsumer(Buffer.from("5:a,b,c,d,e")), "array"),
    ).toStrictEqual({ items: ["a", "b", "c", "d", "e"] });
  });

  it("error logic", () => {
    const parser = new Parser();

    parser.add("error", ({ error }) => {
      error("test error");
    });

    expect(() => parser.parse(new BufferConsumer(Buffer.from("")))).toThrow(
      "test error",
    );
  });
});
