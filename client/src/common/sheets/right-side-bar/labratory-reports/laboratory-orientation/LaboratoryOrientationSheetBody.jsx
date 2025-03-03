import ReportHeader from "../report-header/ReportHeader";
import { useGetPaginatedClasslist } from "@/hooks/students.hook";
import { useGetSingleLaboratoryOrientation } from "@/hooks/laboratoryOrientation.hook";
import { useRef, useState } from "react";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import { Button } from "@/common/ui/button";
import { Label } from "@/common/ui/label";
import { format } from "date-fns";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import StudentAttendanceOrientation from "./components/student-attendance-orientation/StudentAttendanceOrientation";
import OrientationList from "./components/orientation-list/OrientationList";
import ReactToPrint from "react-to-print";
import PrintOrientationForm from "./components/print-orientation-form/PrintOrientationForm";
import Information from "@/common/information/Information";
import { ChevronLeft, ChevronRight, Printer } from "lucide-react";

const DEFAULT_SLICE_CLASSLIST = {
  start: 0,
  end: 25,
};

export default function LaboratoryOrientationSheetBody({ dataObj }) {
  const componentToPrintRef = useRef();

  const [sliceClasslist, setSliceClasslist] = useState(DEFAULT_SLICE_CLASSLIST);
  const [page, setPage] = useState(0);

  const {
    weekDates,
    date,
    subjectId,
    laboratory,
    selectedTermAndSem,
    schedule,
    dateConducted,
    weekNumber,
  } = dataObj;

  const forQueryData = {
    code: schedule?.code,
    title: schedule?.title,
    scheduleId: schedule.id,
    dateConducted,
    isSemestral: schedule.isSemestral,
    selectedTermAndSem,
  };

  const { data: laboratoryOrientation, isLoading: isLoadingSingleOrientation } =
    useGetSingleLaboratoryOrientation({ forQueryData });

  const { isLoading: isLoadingClasslist, data: classlist } =
    useGetPaginatedClasslist(0, laboratoryOrientation?.students || [], 50);

  const studentsCount = classlist?.students?.length;

  while (classlist?.students?.length < 51) {
    classlist.students.push({ id_number: null });
  }

  const onNextPage = () => {
    setPage((old) => old + 1);
    setSliceClasslist({ start: 25, end: 51 });
  };

  const onPreviousPage = () => {
    setPage((old) => Math.max(old - 1, 0));
    setSliceClasslist(DEFAULT_SLICE_CLASSLIST);
  };

  const printResultsBtn = (
    <Button type="button">
      <Printer size={18} strokeWidth={2.5} className="" />
      Print Orientation Form
    </Button>
  );

  const reactToPrintBtn = (
    <ReactToPrint
      trigger={() => printResultsBtn}
      content={() => componentToPrintRef.current}
    />
  );

  return (
    <form className="mb-6">
      <ReportHeader schedule={schedule} isLabOrientation={true} />

      {isLoadingSingleOrientation ? (
        <LoadingSpinner />
      ) : laboratoryOrientation?.date_conducted ? (
        <>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1 pt-3">
              <Label className="text-xs text-foreground">{`Date Conducted:`}</Label>
              <Label className="-mt-1.5 text-base">
                {laboratoryOrientation?.date_conducted &&
                  format(
                    new Date(laboratoryOrientation?.date_conducted),
                    "MMM dd, yyyy",
                  )}
              </Label>
            </div>

            <div className="flex flex-col gap-1 pt-3">
              <Label className="text-xs text-foreground">{`Submission Status:`}</Label>
              {/* <Label className="-mt-1.5 text-base">
                {laboratoryOrientation?.date_acknowledged
                  ? format(
                      new Date(laboratoryOrientation?.date_acknowledged),
                      "MMM dd, yyyy",
                    )
                  : "Not yet acknowledged"}
              </Label> */}

              <Label className="-mt-1.5 text-base">
                {laboratoryOrientation?.date_acknowledged
                  ? "Attested"
                  : "Not yet Attested"}
              </Label>
            </div>

            <div className="flex flex-col gap-1 pt-3">
              <Label className="text-xs text-foreground">{`Laboratory Custodian:`}</Label>
              <Label className="-mt-1.5 text-base">
                {` ${laboratoryOrientation?.custodian} `}
              </Label>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Label className="text-base">Student Attendance</Label>
            <div className="flex items-center justify-end gap-4">
              <Button
                variant="outline"
                className="px-2 hover:bg-accent"
                size="sm"
                type="button"
                onClick={onPreviousPage}
                disabled={page === 0}
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </Button>
              <div>
                <p className="text-gray-300">Page {page + 1}</p>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="px-2 hover:bg-accent"
                type="button"
                onClick={onNextPage}
                disabled={page > 0 || studentsCount < 26}
              >
                <ChevronRight size={20} strokeWidth={3} />
              </Button>
            </div>
          </div>

          {isLoadingClasslist ? (
            <LoadingSpinner />
          ) : (
            <StudentAttendanceOrientation
              sliceClasslist={sliceClasslist}
              classlist={classlist?.students}
              dateConducted={laboratoryOrientation?.date_conducted}
              studentAttendance={laboratoryOrientation?.students_attendance}
            />
          )}

          <OrientationList laboratoryOrientation={laboratoryOrientation} />

          <PrintOrientationForm
            componentToPrintRef={componentToPrintRef}
            laboratoryOrientation={laboratoryOrientation}
            schedule={schedule}
            students={classlist?.students}
          />

          <Information
            title="Print Info"
            message={
              "For better print result please set the ff. settings: Scaling: default, Papersize: A4, Orientation: Portrait"
            }
            className={"mt-3"}
          />
          <div className="my-4 flex items-center justify-end">
            {reactToPrintBtn}
          </div>
        </>
      ) : (
        <NoRecordsFound>No orientation submitted.</NoRecordsFound>
      )}
    </form>
  );
}
