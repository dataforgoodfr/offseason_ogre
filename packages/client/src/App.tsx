import { Box, Button } from "@mui/material";

function App() {
  return (
    <Box
      sx={{
        alignItems: "center",
        backgroundColor: (theme) => theme.palette.primary.main,
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Button color="secondary" variant="contained">
        Hello World!
      </Button>
    </Box>
  );
}

export default App;
