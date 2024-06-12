/**
 * Make certain fields in a object type required
 *
 * @example
 * ```ts
 *     interface A {
 *         a?: string;
 *         b?: string;
 *         c?: string;
 *     }
 *     type B = RequireFields<A, "b" | "c">;
 *     const b: B = {
 *         b: "hehe",
 *         c: "hehe",
 *     }; //valid
 *     const b: B = { a: "hehe" }; //invalid
 *     const c: B = { a: "hehe", b: "hehe" }; //invalid
 * ```
 */
export type RequireFields<T, U extends keyof T> = T & Required<Pick<T, U>>;

/**
 * Make certain fields in a object type optional
 *
 * @example
 * ```ts
 *     interface A {
 *         a: string;
 *         b: string;
 *         c: string;
 *     }
 *     type B = Optional<A, "b" | "c">;
 *     const b: B = { a: "hehe" }; //valid
 *     const b: B = {}; //invalid
 * ```
 */
export type Optional<T, U extends keyof T> = Omit<T, U> & Partial<Pick<T, U>>;

export type Nullable<T extends object> = {
  [K in keyof T]: T[K] | undefined | null;
};

export type FunctionReturnType<T = void> =
  | { ok: false; error: string; status: number }
  | T extends void
  ? { ok: true }
  : { ok: true; data: T };
