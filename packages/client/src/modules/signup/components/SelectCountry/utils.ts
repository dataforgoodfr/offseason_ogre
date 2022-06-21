import countries, { CountryType } from "./countries";

export { getCountryByCode };

const getCountryByCode = (code?: string): CountryType | undefined => {
  return countries.find((country) => country.code === code);
};
