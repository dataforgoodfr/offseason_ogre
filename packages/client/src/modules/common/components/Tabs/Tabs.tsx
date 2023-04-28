import React, { ReactNode, useMemo, useState } from "react";
import { CustomTab, CustomTabs } from "./Tabs.styles";

export { Tabs };

function Tabs({ tabs }: { tabs: { label: string; component: ReactNode }[] }) {
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
        {tabs.map((tab) => (
          <CustomTab className="tabs__tab" key={tab.label} label={tab.label} />
        ))}
      </CustomTabs>
      {currentTab?.component}
    </>
  );
}
