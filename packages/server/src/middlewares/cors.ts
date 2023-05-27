import corsLib from "cors";

export { cors };

const cors = corsLib({
  credentials: true,
  origin: getOrigins(),
});

function getOrigins() {
  if (process.env.NODE_ENV === "production") {
    return ["https://app.atelierogre.org"];
  }
  if (process.env.NODE_ENV === "staging") {
    return [
      "https://app-staging.atelierogre.org",
      /^https:\/\/deploy-preview-\d+--atelierogre-staging\.netlify\.app$/,
    ];
  }
  return "*";
}
