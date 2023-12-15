export class ValidationError extends Error {
}
export function validateKeys(data, keys) {
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
const typeofList = new Map([
    [null, ["null", (data) => data === null]],
    [String, ["string", (data) => typeof data === "string"]],
    [Number, ["number", (data) => typeof data === "number"]],
    [Boolean, ["boolean", (data) => typeof data === "boolean"]],
    [Array, ["array", Array.isArray]],
    [
        Object,
        [
            "object",
            (data) => data !== null && typeof data === "object" && !Array.isArray(data),
        ],
    ],
]);
export function validateTypeof(data, type) {
    const typeofRequested = typeofList.get(type);
    if (typeofRequested === undefined) {
        throw new ValidationError("type not supported");
    }
    const [name, validator] = typeofRequested;
    if (!validator(data)) {
        throw new ValidationError(`data is not of type ${name}`);
    }
}
