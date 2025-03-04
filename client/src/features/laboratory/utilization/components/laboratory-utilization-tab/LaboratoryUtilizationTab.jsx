import Tabbing from "@/common/tabbing/Tabbing";

export default function LaboratoryUtilizationTab({ tab, setSearchParams }) {
  const onTabChange = (tabValue) => {
    setSearchParams((prev) => {
      prev.set("tab", tabValue);
      return prev;
    });
  };

  const tabData = [
    {
      title: "Daily Utilization",
      data: "",
      indicator: false,
      badgeColor: "bg-primary",
    },
    {
      title: "On-going Utilization",
      data: "",
      indicator: false,
      badgeColor: "bg-primary",
    },
  ];

  return <Tabbing tab={tab} tabData={tabData} onTabChange={onTabChange} />;
}
