export { fromEntries, ObjectBuilder };

const fromEntries = <TKey extends string | number | symbol, TValue>(
  arr: [TKey, TValue][]
): Record<TKey, TValue> => {
  return Object.fromEntries(arr) as Record<TKey, TValue>;
};

class ObjectBuilder<T extends Record<string | number, any>> {
  private obj: Partial<T> = {};

  public add<TKey extends keyof T>(key: TKey, value: T[TKey]) {
    if (value !== undefined) {
      this.obj[key] = value;
    }
    return this;
  }

  public get() {
    return this.obj;
  }
}
