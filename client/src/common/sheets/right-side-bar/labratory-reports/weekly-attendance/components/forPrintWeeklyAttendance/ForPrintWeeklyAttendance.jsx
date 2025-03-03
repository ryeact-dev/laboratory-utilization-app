import { useRef, useState } from "react";

import StudentAttendanceForPrint from "./components/StudentAttendanceForPrint";
import StudentAttendance from "./components/StudentAttendance";
import { useGetPaginatedClasslist } from "@/hooks/students.hook";
import { aggregateWeeklyAttendance } from "@/lib/helpers/aggregatedWeeklyAttendance";
import AttendanceHeader from "./components/AttendanceHeader";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import NoRecordsFound from "@/common/typography/NoRecordsFound";
import AttendanceHeaderAndDates from "./components/AttendanceHeaderAndDates";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";
import { modalStore } from "@/store";

function ForPrintWeeklyAttendance({
  listOfUsage,
  classlist,
  date,
  laboratory,
  currentUser,
}) {
  const componentToPrintRef = useRef();
  const openModal = modalStore((state) => state.openModal);

  const [page, setPage] = useState(0);

  let startCount;
  let endCount;

  if (page === 0) {
    startCount = 0;
    endCount = 25;
  } else if (page === 1) {
    startCount = 25;
    endCount = 50;
  }

  const {
    isLoading,
    data: paginatedClasslist,
    isPlaceholderData,
  } = useGetPaginatedClasslist(page, classlist, 25);

  const sortedListOfUsage = listOfUsage.sort(
    (a, b) => new Date(a.usage_date) - new Date(b.usage_date),
  );

  const listOfDates = sortedListOfUsage?.slice();
  const subjectClasslist =
    !isLoading && paginatedClasslist ? paginatedClasslist?.students : null;

  while (listOfDates?.length < 6) {
    listOfDates.push({ usage_date: null });
  }

  while (subjectClasslist?.length < 25) {
    subjectClasslist.push({ full_name: null });
  }

  const listOfAggregatedUsage = aggregateWeeklyAttendance(sortedListOfUsage);
  while (listOfAggregatedUsage[0]?.usage_details?.length < 6) {
    listOfAggregatedUsage[0]?.usage_details.push({
      students_attendance: [],
      students_time_log: [],
    });
  }

  const studentWorkstationNumber = (index) => {
    if (page === 0) {
      index = index <= 25 ? index++ : 25;
    } else if (page === 1) {
      index = index <= 50 ? 25 + index++ : 50;
    } else if (page === 2) {
      index = index <= 75 ? 50 + index++ : 75;
    }
    return index;
  };

  const onEditStudentsAttendance = (usage) => {
    const usageDetails = {
      usageDate: usage.date,
      subjectStartTime: usage.start_time,
    };

    const forUpdatingData = {
      usageDetails,
      classlist,
      usageId: usage.id,
      isEdit: true,
    };

    const payload = {
      title: "",
      bodyType: MODAL_BODY_TYPES.UTILIZATION_CLASSLIST_OPEN,
      extraObject: forUpdatingData,
      size: "max-w-4xl",
    };

    openModal(payload);
  };

  const whatToDisplay = !isLoading && subjectClasslist ? "data" : null;

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : whatToDisplay === null ? (
        <NoRecordsFound>No Records Found.</NoRecordsFound>
      ) : (
        <div className="-mt-2">
          <AttendanceHeader
            componentToPrintRef={componentToPrintRef}
            page={page}
            setPage={setPage}
            isLoading={isLoading}
            isPlaceholderData={isPlaceholderData}
            paginatedClasslist={paginatedClasslist}
          />

          {/* FOR PRINTING ATTENDANCE SECTIONS */}
          <article
            className="forPrint h-max p-2 text-gray-800"
            ref={componentToPrintRef}
          >
            {/* Header Section */}
            <AttendanceHeaderAndDates
              laboratory={laboratory}
              date={date}
              listOfUsage={listOfUsage}
              listOfDates={listOfDates}
            />

            {/* Student Attendance for Print*/}
            <StudentAttendanceForPrint
              subjectClasslist={subjectClasslist || []}
              page={page}
              listOfAggregatedUsage={listOfAggregatedUsage}
              studentWorkstationNumber={studentWorkstationNumber}
              // attendanceIndex={attendanceIndex}
              startCount={startCount}
              endCount={endCount}
            />

            <div className="mt-4 flex items-center justify-between font-serif text-sm">
              <p>F-13050-249/ Rev. #1/ Effectivity: October 4, 2023</p>
              <p>
                Page <span className="font-semibold">{`${page + 1} `} </span> of{" "}
                <span className="font-semibold">
                  {" "}
                  {paginatedClasslist.hasMore ? page + 1 : page + 2}
                </span>
              </p>
            </div>
          </article>

          {/* FOR WEB DISPLAY SECTIONS */}
          <StudentAttendance
            currentUser={currentUser}
            subjectClasslist={subjectClasslist || []}
            page={page}
            listOfDates={listOfDates}
            listOfAggregatedUsage={listOfAggregatedUsage}
            studentWorkstationNumber={studentWorkstationNumber}
            onEditStudentsAttendance={onEditStudentsAttendance}
            // attendanceIndex={attendanceIndex}
            startCount={startCount}
            endCount={endCount}
          />
        </div>
      )}
    </>
  );
}

export default ForPrintWeeklyAttendance;
