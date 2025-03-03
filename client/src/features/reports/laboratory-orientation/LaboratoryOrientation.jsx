import { useSearchParams } from "react-router-dom";
import TitleCard from "@/common/titleCard/TitleCard";
import SelectSchedule from "@/common/select/SelectSchedule";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import ActiveAcademicDuration from "@/common/active-academic-duration/ActiveAcademicDuration";
import { useCallback } from "react";
import SelectLaboratory from "@/common/select/SelectLaboratory";
import { useGetLaboratoryOrientations } from "@/hooks/laboratoryOrientation.hook";
import ReportsTab from "@/common/tabbing/reports-tab/ReportsTab";
import ListOfOrientations from "./components/list-of-orientations/ListOfOrientations";

export default function LaboratoryOrientation() {
  const { currentUser, activeSchoolYear, activeTermSem } =
    useGetCurrentUserData();

  const [searchParams, setSearchParams] = useSearchParams({
    termsem: activeTermSem,
    tab: "1",
    page: "1",
    q: "All Laboratories",
  });

  const selectedTermAndSem = searchParams.get("termsem") || activeTermSem;
  const tab = searchParams.get("tab");
  const page = searchParams.get("page") || 1;
  const laboratory = searchParams.get("q") || "All Laboratories";

  const onLaboratoryChange = useCallback(
    (value) => {
      setSearchParams((prev) => {
        prev.set("q", value);
        return prev;
      });
    },
    [setSearchParams],
  );

  const headerSection = (
    <article className="flex w-full flex-col items-start justify-between gap-2 lg:flex-row">
      <div className="flex items-center gap-2">
        <div>
          <p className="mb-1 text-sm font-normal text-secondary">Laboratory</p>
          <SelectLaboratory
            additionalItems={["All Laboratories"]}
            laboratory={laboratory}
            onLaboratoryChange={onLaboratoryChange}
            currentUser={currentUser}
            wasAcknowledged={true}
          />
        </div>
        <div>
          <p className="mb-1 text-sm font-normal text-secondary">
            Term and Sem
          </p>
          <SelectSchedule
            selectedTermAndSem={selectedTermAndSem}
            setSearchParams={setSearchParams}
          />
        </div>
      </div>
      <div className="flex-1 text-center leading-6 lg:text-right">
        <ActiveAcademicDuration
          activeSchoolYear={activeSchoolYear}
          activeTermSem={selectedTermAndSem}
        />
        {/* <p>{selectedTermAndSem}</p>
        <p>{activeSchoolYear}</p> */}
      </div>
    </article>
  );

  let statusSelection = 0;

  if (Number(tab) === 2) {
    statusSelection = 1;
  }
  if (Number(tab) === 3) {
    statusSelection = 2;
  }

  // TODO: FIX THE PAGINATION FETCH, THERE ARE ITEMS THAT RETURNS THE SAME AS THE PREVIOUS PAGE
  const {
    data: listOfLabOrientation = {},
    isLoading,
    isPlaceholderData,
  } = useGetLaboratoryOrientations(
    Number(page - 1),
    50,
    laboratory === "All Laboratories" ? "" : laboratory,
    activeSchoolYear,
    selectedTermAndSem,
    currentUser.role,
    statusSelection,
  );

  const tabData = [
    {
      title: "For Acknowledgement",
      data: listOfLabOrientation?.forAcknowledgementCount,
      indicator: true,
      badgeColor:
        listOfLabOrientation?.forAcknowledgementCount > 0
          ? "bg-primary"
          : "bg-transparent",
    },
    {
      title: "Acknowledged",
      data: "",
      badgeColor: "bg-transparent",
      indicator: false,
    },
    // { title: "Rejected", data: "", indicator: false },
  ];

  // RENDER SECTION
  return (
    <TitleCard
      title={headerSection}
      topMargin="-mt-2"
      width="lg:min-w-[1000px] xl:min-w-[1200px]"
      minHeight="min-h-min"
    >
      <div className="relative -mt-6 mb-6">
        <div className="absolute left-0 top-0">
          <ReportsTab
            tabData={tabData}
            tab={tab}
            setSearchParams={setSearchParams}
          />
        </div>
        <ListOfOrientations
          tab={tab}
          statusSelection={statusSelection}
          selectedTermAndSem={selectedTermAndSem}
          activeSchoolYear={activeSchoolYear}
          currentUser={currentUser}
          page={page}
          setSearchParams={setSearchParams}
          listOfLabOrientation={listOfLabOrientation}
          isPlaceholderData={isPlaceholderData}
          isLoading={isLoading}
        />
      </div>
    </TitleCard>
  );
}
