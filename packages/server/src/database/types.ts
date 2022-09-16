export { Seed };

type Seed<T> = {
  seeder: (datum: T) => Promise<unknown>;
  data: T[];
};
