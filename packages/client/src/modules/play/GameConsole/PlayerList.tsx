import { Box, Rating, Typography } from "@mui/material";
import { ITeamWithPlayers, IUser } from "../../../utils/types";
import { PlayBox } from "../Components";
import PaidIcon from "@mui/icons-material/Paid";
import CloudIcon from "@mui/icons-material/Cloud";
import StarIcon from "@mui/icons-material/Star";

export { PlayerList };

function PlayerList({ team }: { team: ITeamWithPlayers }) {
  return (
    <>
      {team.players.map((player) => {
        return (
          <PlayBox key={player.userId} mt={2}>
            <Typography variant="h5">{buildName(player.user)}</Typography>
            <Box display="flex" alignItems="center" mt={2}>
              <PaidIcon />
              <Typography ml={1}>Budget restant: 15€/j</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <CloudIcon />
              <Typography ml={1}>Bilan carbone: 11,9 kgCO2/an</Typography>
            </Box>
            <ActionPoints />
          </PlayBox>
        );
      })}
    </>
  );
}

function ActionPoints() {
  return (
    <Box mt={2}>
      <Typography>Point d'actions</Typography>
      <Rating
        emptyIcon={
          <StarIcon style={{ fill: "grey", opacity: 0.5 }} fontSize="inherit" />
        }
        max={10}
        name="action-points"
        readOnly
        value={7}
      />
    </Box>
  );
}

function buildName(user: IUser): string {
  return `${user.firstName} ${user.lastName}`;
}
