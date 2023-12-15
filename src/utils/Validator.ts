export class ValidationError extends Error {}

type Constructor =
  | ArrayConstructor
  | BooleanConstructor
  | NumberConstructor
  | ObjectConstructor
  | StringConstructor
  | null;

type ConstructorType<T> = T extends typeof Number
  ? number
  : T extends typeof String
    ? string
    : T extends typeof Boolean
      ? boolean
      : T extends typeof Array
        ? unknown[]
        : T extends typeof Object
          ? object
          : T extends null
            ? null
            : never;

type RecordTyped<T> = {
  [K in keyof T]: ConstructorType<T[K]>;
};

export function validateKeys<T extends Record<string, Constructor>>(
  data: unknown,
  keys: T,
): asserts data is RecordTyped<T> {
  if (data === null) {
    throw new ValidationError("data is null");
  }

  if (typeof data !== "object") {
    throw new ValidationError("data is not an object");
  }

  for (const key of Object.keys(keys)) {
    if (!(key in data)) {
      throw new ValidationError(`data[${key}] is missing`);
    }
  }
}

const typeofList = new Map<
  Constructor,
  [name: string, validator: (data: unknown) => boolean]
>([
  [null, ["null", (data) => data === null]],
  [String, ["string", (data) => typeof data === "string"]],
  [Number, ["number", (data) => typeof data === "number"]],
  [Boolean, ["boolean", (data) => typeof data === "boolean"]],
  [Array, ["array", Array.isArray]],
  [
    Object,
    [
      "object",
      (data) =>
        data !== null && typeof data === "object" && !Array.isArray(data),
    ],
  ],
]);

export function validateTypeof<T extends Constructor>(
  data: unknown,
  type: T,
): asserts data is ConstructorType<typeof type> {
  const typeofRequested = typeofList.get(type);

  if (typeofRequested === undefined) {
    throw new ValidationError("type not supported");
  }

  const [name, validator] = typeofRequested;

  if (!validator(data)) {
    throw new ValidationError(`data is not of type ${name}`);
  }
}
