const ENV_VAR_NAME = "VITE_API_BASE_URL";

module.exports = {
  onPreBuild: async ({ utils }) => {
    try {
      console.log(
        `Setting env var ${ENV_VAR_NAME} for branch ${process.env.HEAD} (PR ${process.env.REVIEW_ID})`
      );
      await fetch(
        `https://api.netlify.com/api/v1/accounts/${process.env.NETLIFY_ACCOUNT_ID}/env/${ENV_VAR_NAME}?site_id=${process.env.SITE_ID}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${process.env.NETLIFY_API_TOKEN}`,
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            context: "branch",
            context_parameter: process.env.HEAD,
            value: `https://atelierogre-pr-${process.env.REVIEW_ID}.herokuapp.com`,
          }),
        }
      ).then((res) => res.json());
    } catch (err) {
      utils.build.failPlugin(err.message, { error: err });
    }
  },
};
