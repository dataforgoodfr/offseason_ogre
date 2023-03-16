import { Box, Button, Card, useTheme } from "@mui/material";
import * as Sentry from "@sentry/react";
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "../common/components/Typography";

export { ErrorBoundary };

const SentryErrorBoundary =
  Sentry.ErrorBoundary as unknown as React.FC<Sentry.ErrorBoundaryProps>;

function ErrorBoundary({
  fallback = (props: any) => <ErrorBoundaryFallback {...(props as any)} />,
  children,
}: {
  fallback?:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Sentry.FallbackRender;
  children: ReactNode;
}) {
  return (
    <SentryErrorBoundary fallback={fallback}>{children}</SentryErrorBoundary>
  );
}

function ErrorBoundaryFallback({
  resetError,
}: {
  resetError: Parameters<Sentry.FallbackRender>[0]["resetError"];
}) {
  const theme = useTheme();
  const navigate = useNavigate();

  const onResetError = () => {
    resetError?.();
    navigate("/");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ backgroundColor: theme.palette.primary.main }}
    >
      <Card sx={{ padding: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Typography variant="h4">Une erreur inconnue est survenue</Typography>
          <Typography>
            Si l'erreur est survenue alors que vous étiez en atelier,
            rejoignez-le à nouveau
          </Typography>
          <Button color="secondary" variant="contained" onClick={onResetError}>
            Retourner à l'accueil
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
