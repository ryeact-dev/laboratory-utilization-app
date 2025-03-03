import { TABLE_HEADER_BADGE_CLASS } from "@/globals/initialValues";
import { useEffect, useState } from "react";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";
import { modalStore } from "@/store";
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
import OrientationsTable from "./components/orientations-table/OrientationsTable";
import SheetContainer from "@/containers/SheetContainer";
import LaboratoryOrientationSheetBody from "@/common/sheets/right-side-bar/labratory-reports/laboratory-orientation/LaboratoryOrientationSheetBody";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ListOfOrientations({
  isLoading,
  isPlaceholderData,
  page,
  setSearchParams,
  selectedTermAndSem,
  activeSchoolYear,
  currentUser,
  listOfLabOrientation,
  statusSelection,
  tab,
}) {
  const isCustodian = currentUser.role === "Custodian";

  const openModal = modalStore((state) => state.openModal);

  const [selectOrientation, setSelectOrientation] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [dataObj, setDataObj] = useState({});

  const onCloseModal = () => {
    setIsSheetOpen(false);
  };

  const onSelectAllChange = (value) => {
    if (listOfLabOrientation?.orientations.length === 0)
      return ToastNotification("error", "No orientations to be selected");
    const checkedValue = value;
    setSelectAll(checkedValue);
    const orientationsIds = listOfLabOrientation?.orientations.map(
      (orientation) => orientation.id,
    );
    if (checkedValue) {
      setSelectOrientation(orientationsIds);
    } else setSelectOrientation([]);
  };

  const onAcknoledgeOrientation = (index, selectionType) => {
    let orientationData = [listOfLabOrientation?.orientations[index]];

    if (selectionType === "multiple") {
      if (selectOrientation.length === 0)
        return ToastNotification(
          "error",
          "Please select atleast one report to acknowledge",
        );

      orientationData = listOfLabOrientation?.orientations.filter(
        (orientation) => selectOrientation.includes(orientation.id),
      );
    }

    const payload = {
      title: "Laboratory Orientation(s)",
      bodyType: MODAL_BODY_TYPES.ACKNOWLEDGE_MANY_ORIENTATIONS,
      extraObject: { orientationData, isForAcknowledgement: true },
      size: "max-w-3xl",
    };
    openModal(payload);
  };

  const onOpenOrientationSheetContainer = (index) => {
    const orientationData = listOfLabOrientation?.orientations[index];

    const filteredScheduleData = {
      id: orientationData.schedule_id,
      instructor: orientationData.instructor,
      instructor_name: orientationData.instructor,
      code: orientationData.subject_code,
      title: orientationData.subject_title,
      sched_end_time: orientationData.sched_end_time,
      sched_start_time: orientationData.sched_start_time,
      is_regular_class: false, // use false to skip the wrong date format in the report header
      laboratory: orientationData.laboratory,
      isSemestral: orientationData.isSemestral,
    };

    const payload = {
      title: `Laboratory Orientation`,
      schedule: filteredScheduleData,
      selectedTermAndSem,
      className: "w-[700px]",
      dateConducted: orientationData?.date_conducted,
      isEditable: true,
    };
    setDataObj(payload);
    setIsSheetOpen(true);
  };

  const onPageClick = (pageNumber) => {
    setSearchParams((prev) => {
      prev.set("page", pageNumber);
      return prev;
    });
  };

  // TO WATCH IF THE SUBMITTED REPORTS HAVE DATA
  useEffect(() => {
    if (!isLoading && listOfLabOrientation?.orientations?.length === 0) {
      setSelectOrientation([]);
      setSelectAll(false);
    }
  }, [isLoading, listOfLabOrientation?.orientations]);

  return (
    <>
      <div className="mb-4 flex items-center justify-end gap-2">
        <div className="space-x-2">
          {isCustodian && tab === "1" && (
            <Button
              variant="acknowledge"
              disabled={selectOrientation.length === 0}
              onClick={() => onAcknoledgeOrientation(0, "multiple")}
            >
              Acknowledge
            </Button>
          )}
          {/* <Button onClick={onAcknowledgeAllCLick}>Reject</Button> */}
        </div>

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
              if (!isPlaceholderData && listOfLabOrientation?.hasMore) {
                const nextPage = Number(page) + 1;
                onPageClick(nextPage);
              }
            }}
            disabled={isPlaceholderData || !listOfLabOrientation?.hasMore}
          >
            <ChevronRight size={20} strokeWidth={3} />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex w-full items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : !isLoading && listOfLabOrientation?.reports?.length === 0 ? (
        <NoRecordsFound>No Records Found</NoRecordsFound>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={`${TABLE_HEADER_BADGE_CLASS} `}>
                <div className="flex items-center gap-4">
                  {statusSelection === 0 && isCustodian && (
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
              <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                Date Conducted
              </TableHead>

              <TableHead className={TABLE_HEADER_BADGE_CLASS}>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <OrientationsTable
              tab={tab}
              currentUser={currentUser}
              onAcknoledgeOrientation={onAcknoledgeOrientation}
              onOpenOrientationSheetContainer={onOpenOrientationSheetContainer}
              orientations={listOfLabOrientation?.orientations || []}
              selectOrientation={selectOrientation}
              setSelectOrientation={setSelectOrientation}
              setSelectAll={setSelectAll}
            />
          </TableBody>
        </Table>
      )}

      <SheetContainer
        dataObj={dataObj}
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        closeModal={onCloseModal}
      >
        <LaboratoryOrientationSheetBody dataObj={dataObj} />
      </SheetContainer>
    </>
  );
}
