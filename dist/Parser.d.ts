import { BufferConsumer } from "@triforce-heroes/triforce-core";
type ParserCallback = ({ consumer, consume, error, }: {
    consumer: BufferConsumer;
    consume(name: string): unknown;
    error(message: string): void;
}) => unknown;
export declare class Parser {
    private parserMain;
    private readonly parsers;
    parse(consumer: BufferConsumer): unknown;
    add(name: string, callback: ParserCallback): void;
    private consumeUsing;
}
export {};
