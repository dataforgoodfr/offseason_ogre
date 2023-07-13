import { Grid, Button, Typography, useTheme, Box } from "@mui/material";
import { DataGrid, GridCellParams, GridColumns } from "@mui/x-data-grid";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { formatBooleanValue } from "../../../../utils/format";
import { Icon } from "../../../common/components/Icon";
import { fillPersonalization } from "../../../persona";
import { computeIntermediateValues } from "../../../persona/consumption/computing";
import {
  carAges,
  carEnergies,
  cleaning,
  houseEnergies,
  houseTypes,
  lighting,
  PersoForm,
  showerTimes,
} from "../../../play/Personalization/models/form";
import { DataGridBox } from "./FormVerification.styles";
import { usePlayers } from "./services/queries";
import {
  formatValueOptions,
  getBooleanOptions,
  getCellCredibility,
  getDropdownOptions,
  numericParser,
  useGameId,
} from "./utils";
import { getNonNullValues } from "../../../play/Personalization/utils/formValidation";
import { ErrorAlert, SuccessAlert } from "../../../alert";
import { t } from "../../../translations";
import { kebabCase } from "lodash";
import { http } from "../../../../utils/request";

export { FormVerification };

function FormVerification(): JSX.Element {
  const [updatedRows, setUpdatedRows] = useState<FormattedRow[]>([]);
  const gameId = useGameId();
  const theme = useTheme();
  const playersQuery = usePlayers(gameId);
  const players = playersQuery?.data?.data?.players ?? [];
  const queryClient = useQueryClient();

  const validateForms = useMutation<Response, { message: string }>(
    () => {
      return http.get(`/api/games/${gameId}/validate`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`/api/games/${gameId}/players`);
      },
    }
  );

  const updatePersonalizations = useMutation<
    Response,
    { message: string },
    { draft: boolean }
  >(
    () => {
      const newRows = updatedRows.map(
        ({
          name,
          formStatus,
          heatingConsumptionInvoiceCoeff,
          ...personalization
        }: FormattedRow) => ({ ...getNonNullValues(personalization) })
      );
      return http.post(`/api/games/${gameId}/forms/update`, newRows);
    },
    {
      onSuccess: (response: any, variables: { draft: boolean }) => {
        if (!variables.draft) {
          validateForms.mutate();
        }
        setUpdatedRows([]);
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

      return {
        ...currentGame?.profile?.personalization,
        name: `${player.firstName} ${player.lastName}`,
        formStatus: currentGame?.profile?.status || "noProfile",
      };
    })
    .filter(({ formStatus }: { formStatus: string }) =>
      ["pendingValidation", "validated"].includes(formStatus)
    );

  const formattedRows = rows
    .map((row: FormattedRow): FormattedRow => {
      const newRow = updatedRows.find(
        (uRow: FormattedRow) => uRow.id === row.id
      );
      return newRow ? Object.assign(row, newRow) : row;
    })
    .map(({ name, formStatus, ...personalization }: FormattedRow) => {
      const heatingConsumptionInvoiceCoeff = personalization
        ? computeCoeff(personalization)
        : 0;

      return {
        ...personalization,
        name,
        heatingConsumptionInvoiceCoeff,
        formStatus,
      };
    });

  return (
    <Box>
      {updatePersonalizations.isError && (
        <ErrorAlert message={updatePersonalizations.error.message} />
      )}
      {updatePersonalizations.isSuccess && <SuccessAlert />}

      <Typography variant="h3" sx={{ mb: 2 }}>
        Vérification des formulaires
      </Typography>
      <DataGridBox sx={{ backgroundColor: "white", color: "black" }}>
        <DataGrid
          sx={{ textAlign: "center" }}
          rows={formattedRows}
          columns={buildColumns()}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          processRowUpdate={(newRow, oldRow) => {
            const updatedRowIndex = updatedRows.findIndex(
              (row: FormattedRow) => row.id === newRow.id
            );
            if (updatedRowIndex > -1) {
              setUpdatedRows([
                ...updatedRows.slice(0, updatedRowIndex),
                newRow,
                ...updatedRows.slice(updatedRowIndex + 1),
              ]);
            } else {
              setUpdatedRows([...updatedRows, newRow]);
            }
            return { ...newRow, isNew: false };
          }}
        />
      </DataGridBox>
      <Grid container alignItems="center" sx={{ pb: 4, pt: 4 }}>
        <Button
          onClick={() => {
            setUpdatedRows([]);
          }}
          variant="contained"
          sx={{ marginRight: "auto", marginLeft: "auto", height: "100%" }}
        >
          <Icon name="close" sx={{ mr: 2 }} /> Annuler
        </Button>
        <Button
          onClick={() => updatePersonalizations.mutate({ draft: true })}
          variant="contained"
          sx={{ marginRight: "auto", marginLeft: "auto", height: "100%" }}
        >
          <Icon name="settings" sx={{ mr: 2 }} /> Enregistrer les modifications
        </Button>
        <Button
          onClick={() => updatePersonalizations.mutate({ draft: false })}
          variant="contained"
          sx={{ marginRight: "auto", marginLeft: "auto", height: "100%" }}
        >
          <Icon name="check-circle" sx={{ mr: 2 }} /> Valider
        </Button>
      </Grid>
      <Grid
        container
        direction="column"
        alignItems="left"
        sx={{ mb: 4, mt: 4 }}
      >
        <Typography
          sx={{
            mb: 2,
            color: theme.palette.primary.main,
          }}
        >
          <Icon
            name="tips"
            sx={{ mr: 2, color: theme.palette.primary.contrastText }}
          />{" "}
          {t("form.validation.yellow")}
        </Typography>
        <Typography
          sx={{
            mb: 2,
            color: theme.palette.primary.main,
          }}
        >
          <Icon
            name="tips"
            sx={{ mr: 2, color: theme.palette.primary.contrastText }}
          />{" "}
          {t("form.validation.heating")}
        </Typography>
      </Grid>
    </Box>
  );
}

export type Row = PersoForm & {
  id: number;
  firstName: string;
  lastName: string;
};

export type FormattedRow = PersoForm & {
  id: number;
  name: string;
  formStatus: string;
  heatingConsumptionInvoiceCoeff?: number;
};

function buildColumns(): GridColumns<FormattedRow> {
  return [
    {
      editable: false,
      field: "formStatus",
      headerName: t("table.column.form-status.label.short"),
      cellClassName: (params: GridCellParams<string>) =>
        `form-${kebabCase(params.value)}`,
      renderCell: ({ value }) => (
        <Icon name={`form-${kebabCase(value)}` as any} sx={{ mr: 1 }} />
      ),
      flex: 1,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
    },
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
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Nombre d'adultes",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "numberKids",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Nombre d'enfants",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "car",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Propriétaire voiture",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      renderCell: (params: any) => formatBooleanValue(params.value),
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getBooleanOptions(),
    },
    {
      field: "carEnergy",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Energie voiture",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getDropdownOptions(Object.values(carEnergies)),
    },
    {
      field: "carConsumption",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Consommation voiture (L/100km)",
      flex: 1,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "carDistanceAlone",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Kilomètres voiture seul",
      flex: 1,
      minWidth: 175,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "carDistanceHoushold",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Kilomètres voiture foyer",
      flex: 1,
      minWidth: 175,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "carAge",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Remplacement voiture",
      flex: 1,
      minWidth: 175,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getDropdownOptions(Object.values(carAges)),
    },
    {
      field: "carDistanceCarsharing",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Kilomètres covoiturage",
      flex: 1,
      minWidth: 175,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "planeDistance",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Kilomètres avion",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "trainDistance",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Kilomètres train",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      type: "number",
      valueParser: (value: number) => numericParser(value),
      editable: true,
    },
    {
      field: "houseType",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Type logement",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getDropdownOptions(Object.values(houseTypes)),
    },
    {
      field: "houseSurface",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Surface logement (m²)",
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "heatingEnergy",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Energie chauffage",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getDropdownOptions(Object.values(houseEnergies)),
    },
    {
      field: "heatingConsumption",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Consommation chauffage (kWh)",
      flex: 1,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "heatingInvoice",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Facture chauffage (€)",
      flex: 1,
      minWidth: 175,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "heatingConsumptionInvoiceCoeff",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Consommation correspondante (kWh)",
      flex: 1,
      minWidth: 270,
      headerAlign: "center",
      align: "center",
      valueFormatter: ({ value }) => parseFloat(value.toFixed(2)) || 0,
      editable: false,
    },
    {
      field: "heatPump",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Pompe à chaleur",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      renderCell: (params: any) => formatBooleanValue(params.value),
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getBooleanOptions(),
    },
    {
      field: "heatingTemperature",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Température >19°C",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      renderCell: (params: any) => formatBooleanValue(params.value),
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getBooleanOptions(),
    },
    {
      field: "airConditionning",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Climatisation",
      flex: 1,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      renderCell: (params: any) => formatBooleanValue(params.value),
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getBooleanOptions(),
    },
    {
      field: "aCRoomNb",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Nb pièce avec clim",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "aCDaysNb",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Durée clim (jours/an)",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "showerBath",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Bain/Douche",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getDropdownOptions(Object.values(cleaning)),
    },
    {
      field: "showerNumber",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Nb de douches",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "showerTime",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Durée douche",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getDropdownOptions(Object.values(showerTimes)),
    },
    {
      field: "cookingKettle",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Bouilloire",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      renderCell: (params: any) => formatBooleanValue(params.value),
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getBooleanOptions(),
    },
    {
      field: "cookingPlateTime",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Temps plaques (h)",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "cookingOvenTime",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Temps four (h)",
      flex: 1,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "cleaningWashingTime",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Temps lave-linge (h)",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "cleaningDryerTime",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Temps sèche-linge (h)",
      flex: 1,
      minWidth: 160,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "cleaningDishwasherTime",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Temps lave-vaisselle (h)",
      flex: 1,
      minWidth: 170,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "refrigeratorNumber",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Nb réfrigérateur",
      flex: 1,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "freezerNumber",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Nb congélateur",
      flex: 1,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "lightingSystem",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Système éclairage",
      flex: 1,
      minWidth: 135,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getDropdownOptions(Object.values(lighting)),
    },
    {
      field: "eatingVegan",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Végétalisme",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      renderCell: (params: any) => formatBooleanValue(params.value),
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getBooleanOptions(),
    },
    {
      field: "eatingVegetables",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Fruits et légumes",
      flex: 1,
      minWidth: 130,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      renderCell: (params: any) => formatBooleanValue(params.value),
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getBooleanOptions(),
    },
    {
      field: "eatingDairies",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Produits laitiers",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      renderCell: (params: any) => formatBooleanValue(params.value),
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getBooleanOptions(),
    },
    {
      field: "eatingEggs",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Oeufs",
      flex: 1,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      renderCell: (params: any) => formatBooleanValue(params.value),
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getBooleanOptions(),
    },
    {
      field: "eatingMeat",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Viande",
      flex: 1,
      minWidth: 80,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      renderCell: (params: any) => formatBooleanValue(params.value),
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getBooleanOptions(),
    },
    {
      field: "eatingTinDrink",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Nb canettes",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "eatingZeroWaste",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Zéro déchet",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      renderCell: (params: any) => formatBooleanValue(params.value),
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getBooleanOptions(),
    },
    {
      field: "eatingLocal",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Local et de saison",
      flex: 1,
      minWidth: 135,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      renderCell: (params: any) => formatBooleanValue(params.value),
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getBooleanOptions(),
    },
    {
      field: "eatingCatNumber",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Nb chats",
      flex: 1,
      minWidth: 90,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "eatingDogNumber",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Nb chiens",
      flex: 1,
      minWidth: 90,
      headerAlign: "center",
      align: "center",
      type: "number",
      editable: true,
    },
    {
      field: "eatingHorse",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Cheval",
      flex: 1,
      minWidth: 90,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      renderCell: (params: any) => formatBooleanValue(params.value),
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getBooleanOptions(),
    },
    {
      field: "numericEquipment",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "Un équipement par personne",
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      renderCell: (params: any) => formatBooleanValue(params.value),
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getBooleanOptions(),
    },
    {
      field: "numericWebTimeDay",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "> 2h sur internet /jour",
      flex: 1,
      minWidth: 165,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      renderCell: (params: any) => formatBooleanValue(params.value),
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getBooleanOptions(),
    },
    {
      field: "numericVideoTimeDay",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "> 1h de vidéos /jour",
      flex: 1,
      minWidth: 165,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      renderCell: (params: any) => formatBooleanValue(params.value),
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getBooleanOptions(),
    },
    {
      field: "clothingQuantity",
      cellClassName: (params: GridCellParams<string>) =>
        getCellCredibility(params.field as keyof PersoForm, params.row),
      headerName: "> 600€ vêtements /an",
      flex: 1,
      minWidth: 165,
      headerAlign: "center",
      align: "center",
      editable: true,
      type: "singleSelect",
      renderCell: (params: any) => formatBooleanValue(params.value),
      valueFormatter: ({ value, field, api }) =>
        formatValueOptions({ value, field, api }),
      valueOptions: getBooleanOptions(),
    },
  ];
}
