import { Box, List, ListItem } from "@mui/material";
import { emphasizeText as em } from "../../common/utils";

export { getOilgrePersonaDetails };

function getOilgrePersonaDetails(type: string) {
  if (type === "general") {
    return <GeneralPersonaDetails />;
  } else if (type === "transport") {
    return <TravelPersonaDetails />;
  } else if (type === "housing") {
    return <HousingPersonaDetails />;
  } else if (type === "food") {
    return <FoodPersonaDetails />;
  } else if (type === "numeric") {
    return <NumericPersonaDetails />;
  } else if (type === "habits") {
    return <HabitsPersonaDetails />;
  }
}

function GeneralPersonaDetails() {
  return (
    <>
      <Box mt={1}>Je suis un agent territorial un peu spécial.</Box>
      <Box mt={1}>
        Je vis en {em("couple")}, et j'ai {em("2 petits ogres")}.
      </Box>
      <Box mt={1}>
        Je suis installé dans {em("le nord de la France")} à la {em("campagne")}
        .
      </Box>
    </>
  );
}

function TravelPersonaDetails() {
  return (
    <>
      <Box mt={1}>
        Je travaille à {em("25km")} de chez moi et je fais le trajet{" "}
        {em("5 jours sur 7")}.
      </Box>
      <Box mt={1}>Mon véhicule consomme {em("7L/100km")}.</Box>
      <Box mt={1}>
        J'effectue aussi des trajets en {em("train")} de nuit (
        {em("2000km par an")}).
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
            {em("1 semaine")} par an à la {em("montagne")}.
          </ListItem>
          <ListItem>
            {em("2 semaines")} par an de vacances à {em("Nice")}.
          </ListItem>
          <ListItem>
            Pour voir de la famille dans un baraquement à {em("Toulouse")}.
          </ListItem>
          <ListItem>
            {em("1 semaine")} par an à {em("Marrakech")} pour passer les mauvais
            jours d'hiver.
          </ListItem>
        </List>
      </Box>
    </>
  );
}

function HousingPersonaDetails() {
  return (
    <>
      <Box mt={1}>Je vis dans une {em("maison individuelle de 100m2")}.</Box>
      <Box mt={1}>
        Mon logement est {em("chauffé au gaz")}, avec une température de confort
        de {em("21°C")}.
      </Box>
      <Box mt={1}>Ma maison a été {em("construite en 2002")}.</Box>
      <Box mt={1}>
        {em("Aucun travaux de rénovation")} n'ont été effectués depuis.
      </Box>
      <Box mt={1}>
        Je change mes {em("équipements électroménagers")} tous les{" "}
        {em("10 ans")}.
      </Box>
      <Box mt={1}>Je me douche {em("10 minutes par jour")}.</Box>
    </>
  );
}

function FoodPersonaDetails() {
  return (
    <>
      <Box mt={1}>
        Je {em("mange")} un peu de {em("tout")}.
      </Box>
      <Box mt={1}>
        Je ne {em("bois pas de canettes")}, je n'aime pas les sodas.
      </Box>
      <Box mt={1}>
        Je fais mes {em("courses à l'hypermarché")} le plus proche.
      </Box>
      <Box mt={1}>
        Je ne me {em("soucie pas")} de mes {em("emballages")}.
      </Box>
      <Box mt={1}>Je n'aime {"pas trier mes déchets"}.</Box>
    </>
  );
}

function NumericPersonaDetails() {
  return (
    <>
      <Box mt={1}>
        {em("Chaque membre de la famille")} a au moins{" "}
        {em("un ordinateur ou tablette")}, ainsi que {em("un smartphone")} pour
        jouer à Warcraft ou COD en famille.
      </Box>
      <Box mt={1}>
        J'aime {em("regarder des vidéos")} sur les différentes plateformes de{" "}
        {em("streaming")}.
      </Box>
      <Box mt={1}>
        Je laisse la {em("télé allumée en bruit de fond")} pour animer les
        soirées en famille.
      </Box>
    </>
  );
}

function HabitsPersonaDetails() {
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
          Je {em("change")} ma garde robe {em("tous les ans")}.
        </ListItem>
        <ListItem>
          Je {em("dépense")} plus de {em("600 euros par an")} en vêtements
          neufs.
        </ListItem>
      </List>
    </>
  );
}
