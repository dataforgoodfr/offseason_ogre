import { Grid, Button } from "@mui/material";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { formatBooleanValue } from "../../../../utils/format";
import { Icon } from "../../../common/components/Icon";
import { fillPersonalization } from "../../../persona";
import { computeIntermediateValues } from "../../../persona/consumption/computing";
import { PersoForm } from "../../../play/Personalization/models/form";
import { VerificationContainer } from "./FormVerification.styles";
import { DataGridBox } from "./GameTeams.styles";
import { usePlayers } from "./services/queries";
import { useGameId } from "./utils";

export { FormVerification };

function FormVerification({
  openFormValidation,
  setOpenFormValidation,
}: {
  openFormValidation: boolean;
  setOpenFormValidation: (value: boolean) => void;
}): JSX.Element {
  const gameId = useGameId();
  const playersQuery = usePlayers(gameId);
  const players = playersQuery?.data?.data?.players ?? [];
  const queryClient = useQueryClient();

  const validateForms = useMutation<Response, { message: string }>(
    () => {
      return axios.get(`/api/games/${gameId}/validate`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`/api/games/${gameId}/players`);
      },
    }
  );

  const computeCoeff = (personalization: PersoForm) => {
    const formattedPersonalization = fillPersonalization(personalization);
    const intermediateValues = computeIntermediateValues(
      formattedPersonalization
    );
    return intermediateValues.heatingConsumptionInvoiceCoeff;
  };

  const rows = players
    .map(({ playedGames, ...player }) => {
      const currentGame = playedGames.find(
        ({ gameId: gId }: { gameId: number }) => gId === gameId
      );

      const personalization: PersoForm = currentGame?.profile?.personalization;
      const heatingConsumptionInvoiceCoeff = personalization
        ? computeCoeff(personalization)
        : 0;

      return {
        ...currentGame?.profile?.personalization,
        heatingConsumptionInvoiceCoeff,
        name: `${player.firstName} ${player.lastName}`,
        formStatus: currentGame?.profile?.status || "noProfile",
      };
    })
    .filter(({ formStatus }: { formStatus: string }) =>
      ["pendingValidation", "validated"].includes(formStatus)
    );
  return (
    <VerificationContainer show={openFormValidation}>
      <DataGridBox sx={{ backgroundColor: "white", color: "black" }}>
        <DataGrid
          sx={{ textAlign: "center" }}
          rows={rows}
          columns={buildColumns()}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </DataGridBox>
      <Grid
        container
        alignItems="center"
        sx={{ pb: 4, pt: 4, backgroundColor: "white" }}
      >
        <Button
          onClick={() => setOpenFormValidation(false)}
          variant="contained"
          sx={{ marginRight: "auto", marginLeft: "auto", height: "100%" }}
        >
          <Icon name="close" sx={{ mr: 2 }} /> Annuler
        </Button>
        <Button
          onClick={() => {
            validateForms.mutate();
            setOpenFormValidation(false);
          }}
          variant="contained"
          sx={{ marginRight: "auto", marginLeft: "auto", height: "100%" }}
        >
          <Icon name="check-circle" sx={{ mr: 2 }} /> Valider
        </Button>
      </Grid>
    </VerificationContainer>
  );
}

type Row = PersoForm & {
  id: number;
  firstName: string;
  lastName: string;
};

function buildColumns(): GridColumns<Row> {
  return [
    {
      field: "name",
      headerName: "Nom",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "numberAdults",
      headerName: "Nombre d'adultes",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "numberKids",
      headerName: "Nombre d'enfants",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "car",
      headerName: "Propriétaire voiture",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => formatBooleanValue(params.value),
    },
    {
      field: "carEnergy",
      headerName: "Energie voiture",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "carConsumption",
      headerName: "Consommation voiture (L/100km)",
      flex: 1,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "carDistanceAlone",
      headerName: "Kilomètres voiture seul",
      flex: 1,
      minWidth: 175,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "carDistanceHoushold",
      headerName: "Kilomètres voiture foyer",
      flex: 1,
      minWidth: 175,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "carAge",
      headerName: "Remplacement voiture",
      flex: 1,
      minWidth: 175,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "carDistanceCarsharing",
      headerName: "Kilomètres covoiturage",
      flex: 1,
      minWidth: 175,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "planeDistance",
      headerName: "Kilomètres avion",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "trainDistance",
      headerName: "Kilomètres train",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "houseType",
      headerName: "Type logement",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "houseSurface",
      headerName: "Surface logement (m²)",
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "heatingEnergy",
      headerName: "Energie chauffage",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "heatingConsumption",
      headerName: "Consommation chauffage (kWh)",
      flex: 1,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "heatingInvoice",
      headerName: "Facture chauffage (€)",
      flex: 1,
      minWidth: 175,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "heatingConsumptionInvoiceCoeff",
      headerName: "Consommation correspondante (kWh)",
      flex: 1,
      minWidth: 270,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "heatPump",
      headerName: "Pompe à chaleur",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => formatBooleanValue(params.value),
    },
    {
      field: "heatingTemperature",
      headerName: "Température >19°C",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => formatBooleanValue(params.value),
    },
    {
      field: "airConditionning",
      headerName: "Climatisation",
      flex: 1,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => formatBooleanValue(params.value),
    },
    {
      field: "aCRoomNb",
      headerName: "Nb pièce avec clim",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "aCDaysNb",
      headerName: "Durée clim (jours/an)",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "showerBath",
      headerName: "Bain/Douche",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "showerNumber",
      headerName: "Nb de douches",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "showerTime",
      headerName: "Durée douche",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "cookingKettle",
      headerName: "Bouilloire",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => formatBooleanValue(params.value),
    },
    {
      field: "cookingPlateTime",
      headerName: "Temps plaques (h)",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "cookingOvenTime",
      headerName: "Temps four (h)",
      flex: 1,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "cleaningWashingTime",
      headerName: "Temps lave-linge (h)",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "cleaningDryerTime",
      headerName: "Temps sèche-linge (h)",
      flex: 1,
      minWidth: 160,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "cleaningDishwasherTime",
      headerName: "Temps lave-vaisselle (h)",
      flex: 1,
      minWidth: 170,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "refrigeratorNumber",
      headerName: "Nb réfrigérateur",
      flex: 1,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "freezerNumber",
      headerName: "Nb congélateur",
      flex: 1,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lightingSystem",
      headerName: "Système éclairage",
      flex: 1,
      minWidth: 135,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "eatingVegan",
      headerName: "Végétalisme",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => formatBooleanValue(params.value),
    },
    {
      field: "eatingVegetables",
      headerName: "Fruits et légumes",
      flex: 1,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => formatBooleanValue(params.value),
    },
    {
      field: "eatingDairies",
      headerName: "Produits laitiers",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => formatBooleanValue(params.value),
    },
    {
      field: "eatingEggs",
      headerName: "Oeufs",
      flex: 1,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => formatBooleanValue(params.value),
    },
    {
      field: "eatingMeat",
      headerName: "Viande",
      flex: 1,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => formatBooleanValue(params.value),
    },
    {
      field: "eatingTinDrink",
      headerName: "Nb cannettes",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "eatingZeroWaste",
      headerName: "Zéro déchet",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => formatBooleanValue(params.value),
    },
    {
      field: "eatingLocal",
      headerName: "Local et de saison",
      flex: 1,
      minWidth: 135,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => formatBooleanValue(params.value),
    },
    {
      field: "eatingCatNumber",
      headerName: "Nb chats",
      flex: 1,
      minWidth: 90,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "eatingDogNumber",
      headerName: "Nb chiens",
      flex: 1,
      minWidth: 90,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "eatingHorse",
      headerName: "Cheval",
      flex: 1,
      minWidth: 90,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => formatBooleanValue(params.value),
    },
    {
      field: "numericEquipment",
      headerName: "Un équipement par personne",
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => formatBooleanValue(params.value),
    },
    {
      field: "numericWebTimeDay",
      headerName: "> 2h sur internet /jour",
      flex: 1,
      minWidth: 165,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => formatBooleanValue(params.value),
    },
    {
      field: "numericVideoTimeDay",
      headerName: "> 1h de vidéos /jour",
      flex: 1,
      minWidth: 165,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => formatBooleanValue(params.value),
    },
    {
      field: "clothingQuantity",
      headerName: "> 600€ vêtements /an",
      flex: 1,
      minWidth: 165,
      headerAlign: "center",
      align: "center",
      renderCell: (params: any) => formatBooleanValue(params.value),
    },
  ];
}
