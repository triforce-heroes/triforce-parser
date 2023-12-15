/// <reference types="node" resolution-mode="require"/>
import { BufferBuilder, ByteOrder } from "@triforce-heroes/triforce-core";
export type BuilderCallback<T = unknown> = (data: T, { builder, build, error, }: {
    builder: BufferBuilder;
    build(name: string, data: unknown): unknown;
    error(message: string): void;
}) => unknown;
export declare class Builder {
    private builderMain;
    private readonly builders;
    build(data: unknown, byteOrder?: ByteOrder): Buffer;
    add<T>(name: string, callback: BuilderCallback<T>): void;
    private buildUsing;
}
