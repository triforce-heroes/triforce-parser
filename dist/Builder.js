import { BufferBuilder } from "@triforce-heroes/triforce-core";
import { BuilderError } from "./errors/BuilderError.js";
export class Builder {
    builderMain;
    builders = new Map();
    build(data, byteOrder = 0 /* ByteOrder.LITTLE_ENDIAN */) {
        const builder = new BufferBuilder(byteOrder);
        this.buildUsing(this.builderMain, builder, data);
        return builder.build();
    }
    add(name, callback) {
        this.builderMain ??= name;
        this.builders.set(name, callback);
    }
    buildUsing(name, builder, data) {
        return this.builders.get(name)(data, {
            builder,
            build: (builderName, builderData) => this.buildUsing(builderName, builder, builderData),
            error: (message) => {
                throw new BuilderError(message);
            },
        });
    }
}
