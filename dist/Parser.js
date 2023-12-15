import { ParserError } from "./errors/ParserError.js";
export class Parser {
    parserMain;
    parsers = new Map();
    parse(consumer) {
        return this.consumeUsing(this.parserMain, consumer);
    }
    add(name, callback) {
        this.parserMain ??= name;
        this.parsers.set(name, callback);
    }
    consumeUsing(name, consumer) {
        return this.parsers.get(name)({
            consumer,
            consume: (parserName) => this.consumeUsing(parserName, consumer),
            error: (message) => {
                throw new ParserError(message);
            },
        });
    }
}
