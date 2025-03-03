import Tabbing from '@/common/tabbing/Tabbing';

export default function BorrowerSlipTabs({ tab, setSearchParams }) {
  const onTabChange = (tabValue) => {
    setSearchParams((prev) => {
      prev.set('tab', tabValue);
      prev.set('page', 1);
      return prev;
    });
  };

  const tabData = [
    {
      title: 'Laboratory Subjects',
      data: '',
      indicator: false,
      badgeColor: 'badge-primary',
    },
    // { title: 'Non-Laboratory Subjects', data: '', indicator: false },
  ];

  return <Tabbing tab={tab} tabData={tabData} onTabChange={onTabChange} />;
}
