import {
  TABLE_HEADER_BADGE_CLASS,
  TEMPORARY_DEAN_UUID,
  USER_ONLY_FOR_VIEWING_AND_ACKNOWLEDGE,
} from "@/globals/initialValues";
import ReportsTable from "../reportsTable/ReportsTable";
import { useEffect, useState } from "react";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import { modalStore } from "@/store";
import { useGetUtilizationsWithDateRange } from "@/hooks/utilizations.hook";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import { Button } from "@/common/ui/button";
import { Checkbox } from "@/common/ui/checkbox";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ListOfSubmittedReports({
  page,
  setSearchParams,
  selectedTermAndSem,
  activeSchoolYear,
  submittedReports,
  isPlaceholderData,
  isLoading,
  wasAcknowledged,
  currentUser,
}) {
  const [selectReport, setSelectReport] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const openModal = modalStore((state) => state.openModal);

  const {
    isLoading: isLoadingUsage,
    data: listOfUsage = [],
    isError,
    error,
  } = useGetUtilizationsWithDateRange(
    undefined, // undefined if no subjectId
    undefined,
    activeSchoolYear,
    submittedReports?.reports[0]?.weekdates,
    selectedTermAndSem,
    true, // true if data needs to aggregate
  );
  isError && ToastNotification("error", error?.response.data);

  const onSelectAllChange = (value) => {
    if (submittedReports?.reports.length === 0)
      return ToastNotification("error", "No reports to be selected");

    const checkedValue = value;
    let reportIds = [];
    if (checkedValue) {
      if (
        currentUser.role === "Program Head" ||
        currentUser.role === "Faculty"
      ) {
        reportIds = submittedReports?.reports
          .map((report) => {
            if (currentUser.fullName === report.instructor) {
              return report.id;
            }
            return null;
          })
          .filter((report) => report !== null);
      }

      if (currentUser.role === "Dean") {
        reportIds = submittedReports?.reports
          .map((report) => {
            if (currentUser.fullName === report.dean) {
              return report.id;
            }
            return null;
          })
          .filter((report) => report !== null);
      }

      if (reportIds.length === 0)
        return ToastNotification("error", "No reports to be selected");

      setSelectAll(checkedValue);
      setSelectReport(reportIds);
    } else setSelectReport([]);
  };

  const onAcknowledgeAllCLick = () => {
    if (selectReport.length === 0)
      return ToastNotification(
        "error",
        "Please select atleast one report to acknowledge",
      );

    const forUpdatingData = {
      reportIds: [...selectReport],
      deanId: TEMPORARY_DEAN_UUID,
      isForAknowledgement: true,
    };

    const payload = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message: `Acknowledge selected report(s)?`,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.UPDATE_ALL_REPORTS_STATUS,
        forUpdatingData,
      },
    };

    openModal(payload);
  };

  const onPageClick = (pageNumber) => {
    setSearchParams((prev) => {
      prev.set("page", pageNumber);
      return prev;
    });
  };

  // TO WATCH IF THE SUBMITTED REPORTS HAVE DATA
  useEffect(() => {
    if (!isLoading && submittedReports?.reports?.length === 0) {
      setSelectReport([]);
      setSelectAll(false);
    }
  }, [isLoading, submittedReports?.reports]);

  const isAllowedToAcknowledgeReports =
    USER_ONLY_FOR_VIEWING_AND_ACKNOWLEDGE.slice(0, 4).includes(
      currentUser.role,
    );

  return (
    <>
      <div className="mb-4 flex items-center justify-end gap-2">
        {!wasAcknowledged && isAllowedToAcknowledgeReports && (
          <Button
            variant="acknowledge"
            disabled={selectReport.length === 0}
            onClick={onAcknowledgeAllCLick}
          >
            Acknowledge
          </Button>
        )}

        <div className="form-control"></div>
        <div className="flex items-center justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => {
              const oldPage = Math.max(Number(page) - 1, 0);
              onPageClick(oldPage);
            }}
            disabled={Number(page) <= 1}
          >
            <ChevronLeft size={20} strokeWidth={3} />
          </Button>
          <label className="w-4 text-center text-lg">{Number(page)}</label>
          <Button
            variant="outline"
            onClick={() => {
              if (!isPlaceholderData && submittedReports?.hasMore) {
                const nextPage = Number(page) + 1;
                onPageClick(nextPage);
              }
            }}
            disabled={isPlaceholderData || !submittedReports?.hasMore}
          >
            <ChevronRight size={20} strokeWidth={3} />
          </Button>
        </div>
      </div>

      {isLoading || isLoadingUsage ? (
        <div className="flex w-full items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : !isLoading && submittedReports?.reports?.length === 0 ? (
        <NoRecordsFound>No Records Found</NoRecordsFound>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className={`${TABLE_HEADER_BADGE_CLASS} flex items-center gap-4`}
              >
                <div className="flex items-center gap-4">
                  {!wasAcknowledged && isAllowedToAcknowledgeReports && (
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={onSelectAllChange}
                    />
                  )}

                  <p>Code & Title</p>
                </div>
              </TableHead>
              <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                Instructor
              </TableHead>
              {/* <TableHead className={TABLE_HEADER_BADGE_CLASS}>Time</TableHead> */}
              <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                Laboratory
              </TableHead>
              <TableHead className={`text-center ${TABLE_HEADER_BADGE_CLASS}`}>
                Week
              </TableHead>

              <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <ReportsTable
              reports={submittedReports?.reports || []}
              listOfUsage={listOfUsage}
              selectReport={selectReport}
              setSelectAll={setSelectAll}
              setSelectReport={setSelectReport}
              isPlaceholderData={isPlaceholderData}
              pageHasMore={submittedReports?.hasMore || false}
              wasAcknowledged={wasAcknowledged}
              currentUser={currentUser}
              activeSchoolYear={activeSchoolYear}
            />
          </TableBody>
        </Table>
      )}
    </>
  );
}
