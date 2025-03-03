import { useEffect, useState } from "react";
import { modalStore } from "@/store";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import {
  TABLE_HEADER_BADGE_CLASS,
  TEMPORARY_DEAN_UUID,
} from "@/globals/initialValues";
import LaboratoryReportsTable from "../laboratoryReportsTable/LaboratoryReportsTable";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/ui/table";
import { Button } from "@/common/ui/button";
import { Checkbox } from "@/common/ui/checkbox";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ListOfLaboratoryReports({
  page,
  setSearchParams,
  selectedTermAndSem,
  activeSchoolYear,
  isLoading,
  laboratoryReports,
  isPlaceholderData,
  wasAcknowledged,
}) {
  const [selectReport, setSelectReport] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const openModal = modalStore((state) => state.openModal);

  const onSelectAllChange = (value) => {
    if (laboratoryReports?.reports.length === 0)
      return ToastNotification("error", "No reports to be selected");

    const checkedValue = value;
    setSelectAll(checkedValue);

    const reportIds = laboratoryReports?.reports.map((report) => report.id);
    if (checkedValue) {
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
    };

    const payload = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message: `Update selected report(s)?`,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.UPDATE_ALL_LABORATORY_REPORTS_STATUS,
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
    if (!isLoading && laboratoryReports?.reports?.length === 0) {
      setSelectReport([]);
      setSelectAll(false);
    }
  }, [isLoading, laboratoryReports?.reports]);

  return (
    <>
      <div className="mb-4 flex items-center justify-end gap-4">
        <Button
          variant="acknowledge"
          disabled={selectReport.length === 0}
          onClick={onAcknowledgeAllCLick}
        >
          Acknowledge
        </Button>

        {/* PAGINATION BUTTONS */}
        <div className="flex items-center gap-4">
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
          <label className="w-4 text-center">{Number(page)}</label>
          <Button
            variant="outline"
            onClick={() => {
              if (!isPlaceholderData && laboratoryReports?.hasMore) {
                const nextPage = Number(page) + 1;
                onPageClick(nextPage);
              }
            }}
            disabled={isPlaceholderData || !laboratoryReports?.hasMore}
          >
            <ChevronRight size={20} strokeWidth={3} />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex w-full items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : !isLoading && laboratoryReports?.reports?.length === 0 ? (
        <NoRecordsFound>No Records Found</NoRecordsFound>
      ) : (
        <>
          {/* TABLE DATA */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className={`${TABLE_HEADER_BADGE_CLASS} flex items-center gap-4`}
                >
                  <div className="flex items-center gap-4">
                    {!wasAcknowledged && (
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={onSelectAllChange}
                      />
                    )}

                    <p>Laboratory</p>
                  </div>
                </TableHead>
                <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                  Week No.
                </TableHead>
                <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                  Details
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <LaboratoryReportsTable
                reports={laboratoryReports?.reports || []}
                selectReport={selectReport}
                setSelectReport={setSelectReport}
                setSelectAll={setSelectAll}
                isPlaceholderData={isPlaceholderData}
                pageHasMore={laboratoryReports?.hasMore || false}
                wasAcknowledged={wasAcknowledged}
                selectedTermAndSem={selectedTermAndSem}
                activeSchoolYear={activeSchoolYear}
              />
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
}
