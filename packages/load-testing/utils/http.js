module.exports = {
  get,
  post,
};

async function get(url) {
  return http(url, { method: "GET" });
}

async function post(url, data, headers = {}) {
  return http(url, { method: "POST", data, headers });
}

async function http(url, { method, data, headers }) {
  const res = await fetch(url, {
    method,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
  });

  if (res.status >= 400) {
    throw new Error(await res.text());
  }

  return res.json();
}
