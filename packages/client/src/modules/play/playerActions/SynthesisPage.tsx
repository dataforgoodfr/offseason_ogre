import { Box } from "@mui/material";
import { PlayBox } from "../Components";
import { SynthesisScenarioName } from "./SynthesisContent";
import { PlayerHeaderGrid } from "../PlayerPersona";
import { PlayerPageLayout } from "../PlayLayout";
import { Tabs } from "../../common/components/Tabs";
import { useTranslation } from "../../translations/useTranslation";
import { Icon } from "../../common/components/Icon";
import { SynthesisGeneralTab } from "./SynthesisGeneralTab";

export { SynthesisPage };

function SynthesisPage() {
  return <SynthesisLayout />;
}

function SynthesisLayout() {
  const { t } = useTranslation();

  return (
    <PlayerPageLayout
      header={<PlayerHeaderGrid />}
      body={
        <Box display="flex" flexDirection="column" gap={2}>
          <PlayBox display="flex" flexDirection="column" gap={4}>
            <SynthesisScenarioName />
          </PlayBox>
          <Box>
            <Tabs
              tabs={[
                {
                  label: t("synthesis.player.general-section.title"),
                  icon: <Icon name="chart-pie" />,
                  component: <SynthesisGeneralTab />,
                },
              ]}
            />
          </Box>
        </Box>
      }
    />
  );
}
