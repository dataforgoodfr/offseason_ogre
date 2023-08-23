import { Box } from "@mui/material";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomTab, CustomTabs } from "./Tabs.styles";
import { Icon, IconName } from "../Icon";

export { Tabs };

function Tabs({
  tabs,
}: {
  tabs: {
    label: string;
    iconName?: IconName;
    /** If set, navigating tabs will update the url of the app. */
    path?: string;
    component: ReactNode;
  }[];
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [selectedTabIdx, setSelectedTabIdx] = useState(0);

  const currentTab = useMemo(() => {
    return tabs?.[selectedTabIdx] || null;
  }, [selectedTabIdx, tabs]);

  const selectTab = useCallback(
    (tabIdx: number) => {
      setSelectedTabIdx(tabIdx);
      if (tabs?.[tabIdx]?.path) {
        const basePath = pathname.split("/").slice(0, -1).join("/");
        navigate(`${basePath}/${tabs[tabIdx].path}`);
      }
    },
    [pathname, tabs, navigate, setSelectedTabIdx]
  );

  useEffect(() => {
    const lastPathChunk = pathname.split("/").at(-1);
    const targettedTabIdx = Math.max(
      tabs.findIndex((tab) => tab.path === lastPathChunk),
      0
    );
    setSelectedTabIdx(targettedTabIdx);
  }, [pathname, tabs, setSelectedTabIdx]);

  return (
    <>
      <CustomTabs
        className="tabs__tabs-wrappers"
        value={selectedTabIdx}
        variant="scrollable"
        onChange={(_, tabIdx) => selectTab(tabIdx)}
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
