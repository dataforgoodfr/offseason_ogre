import {
  Box,
  Grid,
  Typography,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import { Link } from "react-router-dom";
import { theme, blueTheme, yellowTheme } from "../../utils/theme";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import FactoryRoundedIcon from "@mui/icons-material/FactoryRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import WaterRoundedIcon from "@mui/icons-material/WaterRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import VideogameAssetRoundedIcon from "@mui/icons-material/VideogameAssetRounded";
import { useAuth } from "../auth/authProvider";

export { PlayerHeader };

function PlayerHeader(props: any) {
  const { user } = useAuth();
  const { game } = props;

  return (
    <Box>
      <Box
        sx={{
          mt: 2,
          pl: 2,
          pr: 2,
          border: "2px solid white",
          borderRadius: "10px",
          bgcolor: theme.palette.primary.main,
          color: "white",
        }}
      >
        <Grid
          container
          direction="row"
          alignItems="center"
          alignContent="center"
          sx={{ pt: 1, pb: 1 }}
        >
          <Grid
            item
            xs={6}
            sx={{
              pl: 2,
              pr: 2,
            }}
          >
            <Card>
              <CardActionArea
                component={Link}
                to={`/play/my-games/${game.gameId}/persona`}
              >
                <CardContent sx={{ p: 0 }}>
                  <img
                    style={{ border: "2px solid white", borderRadius: "10px" }}
                    src="/avatar.png"
                    alt="avatar"
                  />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography sx={{ fontSize: "12px", fontWeight: "400" }}>
              Equipe jaune
            </Typography>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            ml: "auto",
            mr: "auto",
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
            Etape nº XXX
          </Typography>
          <Typography> ------- </Typography>
          <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
            XXX <EmojiEventsRoundedIcon />
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            ml: "auto",
            mr: "auto",
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
            <FactoryRoundedIcon sx={{ mr: 1 }} /> XXX kWh
          </Typography>
          <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
            <ShoppingCartRoundedIcon sx={{ mr: 1 }} /> XXX kWh
          </Typography>
          <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
            <PaidRoundedIcon sx={{ mr: 1 }} /> XXX €/J
          </Typography>
          <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
            <WaterRoundedIcon sx={{ mr: 1 }} /> XXX T/an
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            ml: "auto",
            mr: "auto",
            textAlign: "center",
            mb: 2,
          }}
        >
          <ScoresLegendLayout>
            {
              <Box>
                <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
                  <FactoryRoundedIcon sx={{ mr: 1 }} />
                  <br />
                  Production en kiloWattheures
                </Typography>
                <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
                  <ShoppingCartRoundedIcon sx={{ mr: 1 }} />
                  <br />
                  Consommation en kiloWattheures
                </Typography>
                <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
                  <PaidRoundedIcon sx={{ mr: 1 }} />
                  <br />
                  Budget en euro à dépenser par jour
                </Typography>
                <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
                  <WaterRoundedIcon sx={{ mr: 1 }} />
                  <br />
                  CO2 produit en Tonnes par an
                </Typography>
              </Box>
            }
          </ScoresLegendLayout>
        </Grid>
      </Box>
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Button
          component={Link}
          to="/my-games"
          variant="contained"
          color="secondary"
          sx={{
            border: `2px solid ${blueTheme}`,
            width: "90%",
            borderRadius: "10px",
          }}
        >
          <BarChartRoundedIcon /> Statistiques
        </Button>
      </Box>
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Button
          component={Link}
          to="/my-games"
          variant="contained"
          color="primary"
          sx={{
            border: `2px solid ${yellowTheme}`,
            width: "90%",
            borderRadius: "10px",
          }}
        >
          <VideogameAssetRoundedIcon /> Actions
        </Button>
      </Box>
    </Box>
  );
}

function ScoresLegendLayout({ children }: { children: any }) {
  return (
    <Accordion
      sx={{
        mb: 2,
        boxShadow: "none",
      }}
    >
      <AccordionSummary
        expandIcon={<ArrowForwardIosIcon />}
        aria-controls="infobh-content"
        id="infobh-header"
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          "& .MuiAccordionSummary-expandIconWrapper": {
            color: "white",
            position: "absolute",
            ml: "auto",
            mr: "auto",
            transform: "rotate(90deg)",
          },
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "rotate(270deg)",
          },
        }}
      ></AccordionSummary>
      <AccordionDetails
        sx={{
          pt: 2,
          bgcolor: theme.palette.primary.main,
          color: "white",
          borderRadius: "5px",
          border: "2px solid white",
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
