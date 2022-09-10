export { sortBy };

type OnlyNumberKeys<T> = keyof {
  [K in keyof T as T[K] extends number ? K : never]: T[K];
};

function sortBy<T>(key: OnlyNumberKeys<T>, order: "asc" | "desc" = "asc") {
  const orderFactor = order === "desc" ? -1 : 1;
  return (a: T, b: T) =>
    orderFactor *
    ((a[key] as unknown as number) - (b[key] as unknown as number));
}
