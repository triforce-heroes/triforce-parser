import { BufferConsumer } from "@triforce-heroes/triforce-core";

import { ParserError } from "./errors/ParserError.js";

export type ParserCallback<T = unknown> = ({
  consumer,
  consume,
  error,
}: {
  consumer: BufferConsumer;
  consume(name: string): unknown;
  error(message: string): void;
}) => T;

export class Parser {
  private parserMain: string | undefined;

  private readonly parsers = new Map<string, ParserCallback>();

  public parse(consumer: BufferConsumer, parserName?: string) {
    return this.consumeUsing(parserName ?? this.parserMain!, consumer);
  }

  public add(name: string, callback: ParserCallback) {
    this.parserMain ??= name;
    this.parsers.set(name, callback);
  }

  private consumeUsing(name: string, consumer: BufferConsumer): unknown {
    return this.parsers.get(name)!({
      consumer,
      consume: (parserName) => this.consumeUsing(parserName, consumer),
      error: (message) => {
        throw new ParserError(message);
      },
    });
  }
}
