export {
  API_URL,
  ENERGY_SHIFT_TARGET_YEAR,
  TERMS_OF_USE_URL,
  MATERIALS_AND_METALS_INFO_CARD_URL,
  WEB_SOCKET_URL,
};

// TODO: use this constant where `2050` is hardcoded.
const ENERGY_SHIFT_TARGET_YEAR = 2050;
const TERMS_OF_USE_URL =
  "https://ogre-public.s3.eu-west-3.amazonaws.com/cgu-latest.pdf";

const MATERIALS_AND_METALS_INFO_CARD_URL =
  "https://drive.google.com/file/d/1mXoUrtdklLjW1p7RpjJfe_Sj141Z4QC-/view?usp=share_link";

const API_HOST = import.meta.env.VITE_API_HOST || "localhost:3000";
const API_URL = `http://${API_HOST}`;
const WEB_SOCKET_URL = `ws://${API_HOST}`;
