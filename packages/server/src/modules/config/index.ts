export { getApiOrigin, getFrontOrigin };

function getApiOrigin() {
  return getOrigin() || "http://localhost:8080";
}

function getFrontOrigin() {
  return getOrigin() || "http://localhost:3000";
}

function getOrigin(): string | undefined {
  if (process.env.ORIGIN) {
    return process.env.ORIGIN;
  }
  if (process.env.NODE_ENV === "production") {
    return "https://atelierogre.herokuapp.com";
  }
  if (process.env.NODE_ENV === "staging") {
    return "https://atelierogre-staging.herokuapp.com";
  }
  return undefined;
}
