import Tabbing from "../Tabbing";

export default function ReportsTab({ tab, setSearchParams, tabData }) {
  const onTabChange = (tabValue) => {
    setSearchParams((prev) => {
      prev.set("tab", tabValue);
      prev.set("page", 1);
      return prev;
    });
  };

  return <Tabbing tab={tab} tabData={tabData} onTabChange={onTabChange} />;
}
