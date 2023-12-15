import { BufferBuilder, ByteOrder } from "@triforce-heroes/triforce-core";

import { BuilderError } from "./errors/BuilderError.js";

type BuilderCallback<T = unknown> = (
  data: T,
  {
    builder,
    build,
    error,
  }: {
    builder: BufferBuilder;
    build(name: string, data: unknown): unknown;
    error(message: string): void;
  },
) => unknown;

export class Builder {
  private builderMain: string | undefined;

  private readonly builders = new Map<string, BuilderCallback>();

  public build(data: unknown, byteOrder = ByteOrder.LITTLE_ENDIAN) {
    const builder = new BufferBuilder(byteOrder);

    this.buildUsing(this.builderMain!, builder, data);

    return builder.build();
  }

  public add<T>(name: string, callback: BuilderCallback<T>) {
    this.builderMain ??= name;
    this.builders.set(name, callback as BuilderCallback);
  }

  private buildUsing(
    name: string,
    builder: BufferBuilder,
    data: unknown,
  ): unknown {
    return this.builders.get(name)!(data, {
      builder,
      build: (builderName, builderData: unknown) =>
        this.buildUsing(builderName, builder, builderData),
      error: (message) => {
        throw new BuilderError(message);
      },
    });
  }
}
