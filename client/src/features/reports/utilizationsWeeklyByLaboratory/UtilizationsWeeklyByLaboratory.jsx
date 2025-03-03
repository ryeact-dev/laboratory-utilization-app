import { useSearchParams } from "react-router-dom";
import TitleCard from "@/common/titleCard/TitleCard";
import SelectSchedule from "@/common/select/SelectSchedule";
import { useGetPaginatedLabReports } from "@/hooks/laboratoryWeeklyUsage.hook";
import { WEEKLY_USER_ROLE_STEP } from "@/globals/initialValues";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import ReportsTab from "@/common/tabbing/reports-tab/ReportsTab";
import SelectLaboratory from "@/common/select/SelectLaboratory";
import ActiveAcademicDuration from "@/common/active-academic-duration/ActiveAcademicDuration";
import { useCallback } from "react";
import ListOfLaboratoryReports from "./components/list-of-laboratory-reports/ListOfLaboratoryReports";

export default function UtilizationsWeeklyByLaboratory() {
  const { currentUser, activeSchoolYear, activeTermSem } =
    useGetCurrentUserData();

  const [searchParams, setSearchParams] = useSearchParams({
    termsem: activeTermSem,
    tab: "1",
    page: "1",
    q: "All Laboratories ",
  });

  const selectedTermAndSem = searchParams.get("termsem") || activeTermSem;
  const tab = searchParams.get("tab");
  const page = searchParams.get("page") || 1;
  const laboratory = searchParams.get("q") || "All Laboratories";

  const currentUseRoleStep = WEEKLY_USER_ROLE_STEP[currentUser.role];
  const currentUserRole = currentUser.role;

  const wasAcknowledged = Number(tab) === 1 ? false : true;

  const {
    isLoading,
    data: laboratoryReports,
    isPlaceholderData,
  } = useGetPaginatedLabReports({
    userRole: currentUserRole,
    selectedTermAndSem,
    page: Number(page - 1),
    reportCount: 25,
    wasAcknowledged,
    laboratory: laboratory === "All Laboratories" ? "" : laboratory,
  });

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
            laboratory={laboratory}
            onLaboratoryChange={onLaboratoryChange}
            currentUser={currentUser}
            wasAcknowledged={true}
            additionalItems={["All Laboratories"]}
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

  const forAcknowledgement = laboratoryReports?.reports?.filter(
    (reportStatus) => reportStatus.step === 1,
  );

  const tabData = [
    {
      title: "For Acknowledgement",
      data: forAcknowledgement,
      indicator: forAcknowledgement > 0 ? true : false,
      badgeColor: forAcknowledgement > 0 ? "badge-primary" : "bg-transparent",
    },
    {
      title: "Acknowledged",
      data: "",
      badgeColor: "bg-transparent",
      indicator: false,
    },
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
        <ListOfLaboratoryReports
          isLoading={isLoading}
          laboratoryReports={laboratoryReports}
          isPlaceholderData={isPlaceholderData}
          selectedTermAndSem={selectedTermAndSem}
          activeSchoolYear={activeSchoolYear}
          currentUser={currentUser}
          page={page}
          setSearchParams={setSearchParams}
          wasAcknowledged={wasAcknowledged}
        />
      </div>
    </TitleCard>
  );
}
