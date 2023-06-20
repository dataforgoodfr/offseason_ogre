import { ReactNode, useMemo, useState } from "react";
import { CustomTab, CustomTabs } from "./Tabs.styles";
import { Box } from "@mui/material";
import { Icon, IconName } from "../Icon";

export { Tabs };

function Tabs({
  tabs,
}: {
  tabs: { label: string; iconName?: IconName; component: ReactNode }[];
}) {
  const [selectedTabIdx, setSelectedTabIdx] = useState(0);

  const currentTab = useMemo(() => {
    return tabs?.[selectedTabIdx] || null;
  }, [selectedTabIdx, tabs]);

  return (
    <>
      <CustomTabs
        className="tabs__tabs-wrappers"
        value={selectedTabIdx}
        variant="scrollable"
        onChange={(_, tabIdx) => setSelectedTabIdx(tabIdx)}
      >
        {tabs.map((tab, index) => (
          <CustomTab
            className={`tabs__tab ${selectedTabIdx === index ? "active" : ""}`}
            key={tab.label}
            label={
              <Box display="flex" alignItems="center">
                {tab.iconName && (
                  <Icon name={tab.iconName} sx={{ height: "1rem" }} />
                )}
                {tab.label}
              </Box>
            }
          />
        ))}
      </CustomTabs>
      {currentTab?.component}
    </>
  );
}
