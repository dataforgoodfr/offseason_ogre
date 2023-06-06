module.exports = {
  onPreBuild: async ({ netlifyConfig, utils }) => {
    const envVarOverrides = {
      VITE_API_BASE_URL: `https://atelierogre-pr-${process.env.REVIEW_ID}.herokuapp.com`,
    };

    console.log(
      `Setting env vars for branch ${process.env.HEAD} (PR ${process.env.REVIEW_ID})`
    );

    try {
      for (const [key, value] of Object.entries(envVarOverrides)) {
        await overrideEnvVar(key, value, { netlifyConfig });
      }
    } catch (err) {
      utils.build.failPlugin(err.message, { error: err });
    }
  },
};

async function overrideEnvVar(key, value, { netlifyConfig }) {
  console.log(`Setting env var ${key}`);

  netlifyConfig.build.environment[key] = value;

  await fetch(
    `https://api.netlify.com/api/v1/accounts/${process.env.NETLIFY_ACCOUNT_ID}/env/${key}?site_id=${process.env.SITE_ID}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_API_TOKEN}`,
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        context: "branch",
        context_parameter: process.env.HEAD,
        value,
      }),
    }
  );
}
