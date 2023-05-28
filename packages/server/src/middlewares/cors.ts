import corsLib from "cors";

export { cors, corsOptions };

const corsOptions = {
  credentials: true,
  origin: getOrigins(),
};

const cors = corsLib(corsOptions);

function getOrigins() {
  if (process.env.NODE_ENV === "production") {
    return [/^https:\/\/app\.atelierogre\.org/];
  }
  if (process.env.NODE_ENV === "staging") {
    return [
      /^https:\/\/app-staging\.atelierogre\.org/,
      /^https:\/\/deploy-preview-\d+--atelierogre-staging\.netlify\.app/,
    ];
  }
  return "*";
}
