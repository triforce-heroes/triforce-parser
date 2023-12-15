export declare class ValidationError extends Error {
}
type Constructor = ArrayConstructor | BooleanConstructor | NumberConstructor | ObjectConstructor | StringConstructor | null;
type ConstructorType<T> = T extends typeof Number ? number : T extends typeof String ? string : T extends typeof Boolean ? boolean : T extends typeof Array ? unknown[] : T extends typeof Object ? object : T extends null ? null : never;
type RecordTyped<T> = {
    [K in keyof T]: ConstructorType<T[K]>;
};
export declare function validateKeys<T extends Record<string, Constructor>>(data: unknown, keys: T): asserts data is RecordTyped<T>;
export declare function validateTypeof<T extends Constructor>(data: unknown, type: T): asserts data is ConstructorType<typeof type>;
export {};
