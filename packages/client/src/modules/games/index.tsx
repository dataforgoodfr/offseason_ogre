import { Box, Typography } from "@mui/material";
import { Layout } from "../administration/Layout";

export { Games };

function Games(): JSX.Element {
  return (
    <Layout>
      <>
        <Typography variant="h3">Games</Typography>
        <Box sx={{ mt: 4 }}></Box>
      </>
    </Layout>
  );
}
