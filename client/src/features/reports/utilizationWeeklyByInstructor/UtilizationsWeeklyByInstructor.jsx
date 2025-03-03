import { useSearchParams } from "react-router-dom";
import TitleCard from "@/common/titleCard/TitleCard";
import SelectSchedule from "@/common/select/SelectSchedule";
import { useGetPaginatedReports } from "@/hooks/instructorWeeklyUsage.hook";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { WEEKLY_USER_ROLE_STEP } from "@/globals/initialValues";
import ActiveAcademicDuration from "@/common/active-academic-duration/ActiveAcademicDuration";
import { useCallback } from "react";
import SelectLaboratory from "@/common/select/SelectLaboratory";
import ReportsTab from "@/common/tabbing/reports-tab/ReportsTab";
import ListOfSubmittedReports from "./components/list-of-submitted-reports/ListOfSubmittedReports";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import NoRecordsFound from "@/common/typography/NoRecordsFound";

export default function UtilizationsWeeklyByInstructor({
  currentUser,
  activeSchoolYear,
  activeTermSem,
}) {
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

  const currentUseRoleStep = WEEKLY_USER_ROLE_STEP[currentUser.role];

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
          activeTermSem={activeTermSem}
        />
        {/* <p>{selectedTermAndSem}</p>
        <p>{activeSchoolYear}</p> */}
      </div>
    </article>
  );

  const wasAcknowledged = Number(tab) === 1 ? false : true;

  const {
    isLoading,
    data: submittedReports,
    error: reportError,
    isError: reprotIsError,
    isPlaceholderData,
  } = useGetPaginatedReports({
    page: Number(page - 1),
    reportCount: 25,
    userRole: currentUser.role,
    selectedTermAndSem,
    userRoleStep: currentUseRoleStep,
    wasAcknowledged,
    laboratory: laboratory === "All Laboratories" ? "" : laboratory,
  });
  reprotIsError && ToastNotification("error", reportError?.response.data);

  const tabData = [
    {
      title: "For Acknowledgement",
      data: submittedReports?.forAcknowledgement,
      indicator: true,
      badgeColor:
        submittedReports?.forAcknowledgement > 0
          ? "bg-primary"
          : "bg-transparent",
    },
    {
      title: "Acknowledged",
      data: "",
      badgeColor: "bg-transparent",
      indicator: false,
    },
  ];

  // TODO: SOME DATA ARE DUPLICATED IE. 3833 - CS 17/L

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
            tab={tab}
            setSearchParams={setSearchParams}
            tabData={tabData}
          />
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : !submittedReports ? (
          <NoRecordsFound className={"pt-12"}>No records found</NoRecordsFound>
        ) : (
          <ListOfSubmittedReports
            selectedTermAndSem={selectedTermAndSem}
            activeSchoolYear={activeSchoolYear}
            currentUser={currentUser}
            page={page}
            setSearchParams={setSearchParams}
            submittedReports={submittedReports}
            isPlaceholderData={isPlaceholderData}
            isLoading={isLoading}
            wasAcknowledged={wasAcknowledged}
          />
        )}
      </div>
    </TitleCard>
  );
}
