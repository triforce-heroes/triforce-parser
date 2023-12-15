import { BufferConsumer } from "@triforce-heroes/triforce-core";
export type ParserCallback<T = unknown> = ({ consumer, consume, error, }: {
    consumer: BufferConsumer;
    consume(name: string): unknown;
    error(message: string): void;
}) => T;
export declare class Parser {
    private parserMain;
    private readonly parsers;
    parse(consumer: BufferConsumer, parserName?: string): unknown;
    add(name: string, callback: ParserCallback): void;
    private consumeUsing;
}
