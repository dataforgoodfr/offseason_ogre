export { Seed, Seeder };

type Seed<T> = {
  seeder: (datum: T) => Promise<unknown>;
  data: T[];
};

type Seeder<T> = Seed<T> | (() => Seed<T>) | (() => Promise<Seed<T>>);
