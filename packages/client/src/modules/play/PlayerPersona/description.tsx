import { Box, List, ListItem } from "@mui/material";
import { emphasizeText as e } from "../../common/utils";

export { getOilgrePersonaDetails };

function getOilgrePersonaDetails(type: string) {
  if (type === "general") {
    return <GeneralPersonaDetails />;
  } else if (type === "travel") {
    return <TravelPersonaDetails />;
  } else if (type === "housing") {
    return <HousingPersonaDetails />;
  } else if (type === "food") {
    return <FoodPersonaDetails />;
  } else if (type === "numeric") {
    return <NumericPersonaDetails />;
  } else if (type === "clothing") {
    return <ClothingPersonaDetails />;
  }
}

function GeneralPersonaDetails() {
  return (
    <>
      <Box mt={1}>Je suis un agent territorial un peu spécial.</Box>
      <Box mt={1}>
        Je vis en {e("couple")}, et j'ai {e("2 petits ogres")}.
      </Box>
      <Box mt={1}>
        Je suis installé dans {e("le nord de la France")} à la {e("campagne")}.
      </Box>
    </>
  );
}

function TravelPersonaDetails() {
  return (
    <>
      <Box mt={1}>
        Je travaille à {e("25km")} de chez moi et je fais le trajet{" "}
        {e("5 jours sur 7")}.
      </Box>
      <Box mt={1}>Mon véhicule consomme {e("7L/100km")}.</Box>
      <Box mt={1}>
        J'effectue aussi des trajets en {e("train")} de nuit (
        {e("2000km par an")}).
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
            {e("1 semaine")} par an à la {e("montagne")}.
          </ListItem>
          <ListItem>
            {e("2 semaines")} par an de vacances à {e("Nice")}.
          </ListItem>
          <ListItem>
            Pour voir de la famille dans un baraquement à {e("Toulouse")}.
          </ListItem>
          <ListItem>
            {e("1 semaine")} par an à {e("Marrakech")} pour passer les mauvais
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
      <Box mt={1}>Je vis dans une {e("maison individuelle de 100m2")}.</Box>
      <Box mt={1}>
        Mon logement est {e("chauffé au gaz")}, avec une température de confort
        de {e("21°C")}.
      </Box>
      <Box mt={1}>Ma maison a été {e("construite en 2002")}.</Box>
      <Box mt={1}>
        {e("Aucun travaux de rénovation")} n'ont été effectués depuis.
      </Box>
      <Box mt={1}>
        Je change mes {e("équipements électroménagers")} tous les {e("10 ans")}.
      </Box>
      <Box mt={1}>Je me douche {e("10 minutes par jour")}.</Box>
    </>
  );
}

function FoodPersonaDetails() {
  return (
    <>
      <Box mt={1}>
        Je {e("mange")} un peu de {e("tout")}.
      </Box>
      <Box mt={1}>
        Je ne {e("bois pas de canettes")}, je n'aime pas les sodas.
      </Box>
      <Box mt={1}>
        Je fais mes {e("courses à l'hypermarché")} le plus proche.
      </Box>
      <Box mt={1}>
        Je ne me {e("soucie pas")} de mes {e("emballages")}.
      </Box>
      <Box mt={1}>Je n'aime {"pas trier mes déchets"}.</Box>
    </>
  );
}

function NumericPersonaDetails() {
  return (
    <>
      <Box mt={1}>
        {e("Chaque membre de la famille")} a au moins{" "}
        {e("un ordinateur ou tablette")}, ainsi que {e("un smartphone")} pour
        jouer à Warcraft ou COD en famille.
      </Box>
      <Box mt={1}>
        J'aime {e("regarder des vidéos")} sur les différentes plateformes de{" "}
        {e("streaming")}.
      </Box>
      <Box mt={1}>
        Je laisse la {e("télé allumée en bruit de fond")} pour animer les
        soirées en famille.
      </Box>
    </>
  );
}

function ClothingPersonaDetails() {
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
          Je {e("change")} ma garde robe {e("tous les ans")}.
        </ListItem>
        <ListItem>
          Je {e("dépense")} plus de {e("600 euros par an")} en vêtements neufs.
        </ListItem>
      </List>
    </>
  );
}
