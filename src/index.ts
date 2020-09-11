export type IteratorCallback = (value: any, index: number, arr: any[]) => any;

export const arrayify = <T>(value: any): T[] => {
  return toType(value) == "array" ? value : [value];
};

export const jsonSafeParse = (json: string): any => {
  try {
    return JSON.parse(json);
  } catch (ex) {}
  return {};
};

export function isNullish(obj: any): boolean {
  return typeof obj === "undefined" || obj === null;
}

export function isAsyncCallback(func: Function): boolean {
  return func.toString().indexOf("=> __awaiter(") > 0;
}

export function isArray(obj: any): boolean {
  return toType(obj) == "array";
}

export function toType(obj: any): string {
  if (typeof obj === "undefined") {
    return "undefined";
  } else if (obj === null) {
    return "null";
  } else if (obj === NaN) {
    return "nan";
  } else if (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function" &&
    typeof obj.catch === "function"
  ) {
    return "promise";
  } else if (obj && obj.constructor && obj.constructor.name) {
    return String(obj.constructor.name).toLocaleLowerCase();
  } else if (obj && obj.constructor && obj.constructor.toString) {
    let arr = obj.constructor.toString().match(/function\s*(\w+)/);
    if (arr && arr.length == 2) {
      return String(arr[1]).toLocaleLowerCase();
    }
  }
  // This confusing mess gets deep typeof
  const match: RegExpMatchArray | null = {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/);
  return match !== null ? String(match[1]).toLocaleLowerCase() : "";
}

export const unique = <T>(arr: any): T[] => {
  return [...new Set(arr)] as T[];
};

export function uniqueId(): string {
  return "_" + Math.random().toString(36).substr(2, 9);
}

export const wait = (callback: Function, delay: number = 1) => {
  setTimeout(callback, delay);
};

export const each = (
  array: any[],
  callback: IteratorCallback
): Promise<void> => {
  return new Promise((resolve) => {
    Promise.all(array.map(callback)).then(() => {
      resolve();
    });
  });
};

export const every = async (
  array: any[],
  callback: IteratorCallback
): Promise<boolean> => {
  return Promise.all(array.map(callback)).then((values) =>
    values.every((v) => v)
  );
};

export const filter = async <T>(
  array: any[],
  callback: IteratorCallback
): Promise<T[]> => {
  const results = await Promise.all(array.map(callback));
  return array.filter((_v, index) => results[index]);
};

export const map = async <T>(
  array: any[],
  callback: IteratorCallback
): Promise<T[]> => {
  return Promise.all(array.map(callback));
};

export const flatMap = async <T>(
  array: any[],
  callback: IteratorCallback
): Promise<T[]> => {
  const values = await map<T>(array, callback);
  return ([] as T[]).concat(...values);
};

export const mapToObject = async <T>(
  array: string[],
  callback: IteratorCallback
): Promise<{ [key: string]: T }> => {
  const results = await map(array, callback);
  return array.reduce((map, key, i) => {
    map[key] = results[i];
    return map;
  }, {});
};

export const none = async (
  array: any[],
  callback: IteratorCallback
): Promise<boolean> => {
  return Promise.all(array.map(callback)).then(
    (values) => !values.some((v) => v)
  );
};

export const some = async (
  array: any[],
  callback: IteratorCallback
): Promise<boolean> => {
  return Promise.all(array.map(callback)).then((values) =>
    values.some((v) => v)
  );
};

export const flatten = <T>(items: any[] | { [key: string]: any }): T[] => {
  return ([] as T[]).concat(...Object.values(items));
};

export const first = async <T>(
  array: any[],
  callback: IteratorCallback
): Promise<T | null> => {
  let output: T | null = null;
  array.some((value, i, arr) => {
    output = callback(value, i, arr) as T;
    return !!output;
  });
  return output;
};
