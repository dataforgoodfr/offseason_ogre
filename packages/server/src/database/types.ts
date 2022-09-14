export { Seed };

type Seed<T> = {
  seeder: (datum: T) => Promise<any>;
  data: T[];
};
