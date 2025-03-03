import Tabbing from "@/common/tabbing/Tabbing";
import {
  approachingObsolesence,
  forUpgrading,
} from "@/lib/helpers/calculateObsolescence";

export default function HardwareTabs({
  listOfSystemUnits,
  tab,
  setSearchParams,
  syEndingDate,
}) {
  const onTabChange = (tabValue) => {
    setSearchParams((prev) => {
      prev.set("tab", tabValue);
      return prev;
    });
  };

  const approachingObsolesenceList = approachingObsolesence(
    listOfSystemUnits,
    syEndingDate,
  );

  const forUpgradingList = forUpgrading(listOfSystemUnits);

  const tabData = [
    {
      title: "Hardware List",
      data: "",
      indicator: false,
      badgeColor: "bg-primary",
    },
    {
      title: "Approaching Obsolescence",
      data: approachingObsolesenceList.length,
      indicator: approachingObsolesenceList.length > 0 ? true : false,
      badgeColor: "bg-primary",
    },
    {
      title: "For Upgrading",
      data: forUpgradingList.length,
      indicator: forUpgradingList.length > 0 ? true : false,
      badgeColor: "bg-primary",
    },
  ];

  return <Tabbing tab={tab} tabData={tabData} onTabChange={onTabChange} />;
}
