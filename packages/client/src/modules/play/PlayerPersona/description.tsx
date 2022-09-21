import { Box, List, ListItem } from "@mui/material";
import { emphasizeText as s } from "../../common/utils";

export { getOilgrePersonaDetails };

function getOilgrePersonaDetails(type: string) {
  if (type === "general") {
    return (
      <>
        <Box mt={1}>Je suis un agent territorial un peu spécial.</Box>
        <Box mt={1}>
          Je vis en {s("couple")}, et j'ai {s("2 petits ogres")}.
        </Box>
        <Box mt={1}>
          Je suis installé dans {s("le nord de la France")} à la {s("campagne")}
          .
        </Box>
      </>
    );
  } else if (type === "travel") {
    return (
      <>
        <Box mt={1}>
          Je travaille à {s("25km")} de chez moi et je fais le trajet{" "}
          {s("5 jours sur 7")}.
        </Box>
        <Box mt={1}>Mon véhicule consomme {s("7L/100km")}.</Box>
        <Box mt={1}>
          J'effectue aussi des trajets en {s("train")} de nuit (
          {s("2000km par an")}).
        </Box>
        <Box mt={1}>
          Nous partons en famille
          <List
            sx={{
              listStyleType: "disc",
              pl: 4,
              "& .MuiListItem-root": {
                display: "list-item",
              },
            }}
          >
            <ListItem>
              {s("1 semaine")} par an à la {s("montagne")}.
            </ListItem>
            <ListItem>
              {s("2 semaines")} par an de vacances à {s("Nice")}.
            </ListItem>
            <ListItem>
              Pour voir de la famille dans un baraquement à {s("Toulouse")}.
            </ListItem>
            <ListItem>
              {s("1 semaine")} par an à {s("Marrakech")} pour passer les mauvais
              jours d'hiver.
            </ListItem>
          </List>
        </Box>
      </>
    );
  } else if (type === "housing") {
    return (
      <>
        <Box mt={1}>Je vis dans une {s("maison individuelle de 100m2")}.</Box>
        <Box mt={1}>
          Mon logement est {s("chauffé au gaz")}, avec une température de
          confort de {s("21°C")}.
        </Box>
        <Box mt={1}>Ma maison a été {s("construite en 2002")}.</Box>
        <Box mt={1}>
          {s("Aucun travaux de rénovation")} n'ont été effectués depuis.
        </Box>
        <Box mt={1}>
          Je change mes {s("équipements électroménagers")} tous les{" "}
          {s("10 ans")}.
        </Box>
        <Box mt={1}>Je me douche {s("10 minutes par jour")}.</Box>
      </>
    );
  } else if (type === "food") {
    return (
      <>
        <Box mt={1}>
          Je {s("mange")} un peu de {s("tout")}.
        </Box>
        <Box mt={1}>
          Je ne {s("bois pas de canettes")}, je n'aime pas les sodas.
        </Box>
        <Box mt={1}>
          Je fais mes {s("courses à l'hypermarché")} le plus proche.
        </Box>
        <Box mt={1}>
          Je ne me {s("soucie pas")} de mes {s("emballages")}.
        </Box>
        <Box mt={1}>Je n'aime {"pas trier mes déchets"}.</Box>
      </>
    );
  } else if (type === "numeric") {
    return (
      <>
        <Box mt={1}>
          {s("Chaque membre de la famille")} a au moins{" "}
          {s("un ordinateur ou tablette")}, ainsi que {s("un smartphone")} pour
          jouer à Warcraft ou COD en famille.
        </Box>
        <Box mt={1}>
          J'aime {s("regarder des vidéos")} sur les différentes plateformes de{" "}
          {s("streaming")}.
        </Box>
        <Box mt={1}>
          Je laisse la {s("télé allumée en bruit de fond")} pour animer les
          soirées en famille.
        </Box>
      </>
    );
  } else if (type === "clothing") {
    return (
      <>
        <Box mt={1}>J'aime être bien sapé et à la mode, et pour ça:</Box>
        <List
          sx={{
            listStyleType: "disc",
            pl: 4,
            "& .MuiListItem-root": {
              display: "list-item",
            },
          }}
        >
          <ListItem>
            Je {s("change")} ma garde robe {s("tous les ans")}.
          </ListItem>
          <ListItem>
            Je {s("dépense")} plus de {s("600 euros par an")} en vêtements
            neufs.
          </ListItem>
        </List>
      </>
    );
  }
}
