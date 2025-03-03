import { modalStore } from "@/store";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { getWeekDatesExcludeSunday } from "@/lib/helpers/dateTime";
import TitleCard from "@/common/titleCard/TitleCard";
import UtilizationHeader from "@/common/utilizationHeader/UtilizationHeader";
import { useGetUtilizationRemarks } from "@/hooks/remarks.hook";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";
import { useGetCurrentUserData } from "@/hooks/users.hook";

const tableHeaderClass =
  "bg-accent text-grey-100 text-base px-4 py-2 font-semibold normal-case";

function ListOfLabMonitoringPage() {
  const { currentUser, activeSchoolYear } = useGetCurrentUserData();

  const openModal = modalStore((state) => state.openModal);

  const { weekDates, date, subjectId, laboratory, selectedTermAndSem } =
    useLocation().state;

  const { isLoading, data: listOfLabMonitoring } = useGetUtilizationRemarks(
    subjectId,
    laboratory,
    activeSchoolYear,
    weekDates,
    selectedTermAndSem,
  );

  // ON REMARKS CLICK
  const openRemarksModal = (usageId, laboratory) => {
    const payload = {
      title: `After usage remarks`,
      bodyType: MODAL_BODY_TYPES.AFTER_USAGE_REMARKS_OPEN,
      extraObject: { usageId, laboratory },
    };

    openModal(payload);
  };

  // ON DELETE REMARK CLICK
  const deleteRemark = (usageId) => {
    // const payload = {
    //   title: `Remove subject remark`,
    //   bodyType: MODAL_BODY_TYPES.AFTER_USAGE_REMARKS_OPEN,
    //   extraObject:  usageId,
    // };
    // openModal(payload);
  };

  const headerSection = (
    <article className="flex justify-between">
      <div className="leading-6">
        <p>Laboratory Monitoring for week</p>
        {getWeekDatesExcludeSunday(date).week}
      </div>
      <div className="text-right leading-6">
        <p>{selectedTermAndSem}</p>
        <p>{activeSchoolYear}</p>
      </div>
    </article>
  );

  const whatToDisplay =
    !isLoading && listOfLabMonitoring?.length > 0 ? "data" : null;

  // RENDER SECTION
  return (
    <TitleCard title={headerSection} topMargin="-mt-2">
      {whatToDisplay === null && (
        <p className="text-center text-base font-medium">
          No Data to be isplayed
        </p>
      )}
      {whatToDisplay === "data" && (
        <>
          <article className="-mt-2 mb-2 flex h-max items-start justify-between rounded-xl">
            <UtilizationHeader
              headerData={listOfLabMonitoring[0]}
              profClass={"my-1"}
            />
          </article>
          <article className="w-full gap-4 md:grid md:grid-cols-2">
            {listOfLabMonitoring?.map((usage, index) => (
              <div
                key={index}
                className={`border-grey-400 bg-base-100 w-full overflow-hidden rounded-xl border-[1px] p-2 transition duration-500 ease-in-out hover:shadow-lg`}
              >
                <div className="card-body flex-row items-start justify-between gap-2 p-2">
                  <div className="w-[30%] shrink-0">
                    <h2
                      className={`badge badge-sm mb-2 p-2.5 text-white ${
                        !usage.is_regular_class
                          ? `bg-accent-focus`
                          : "badge-primary"
                      }`}
                    >{`${
                      usage.is_regular_class
                        ? `Regular Class`
                        : `Reservation Class`
                    }`}</h2>
                    <h2 className="text-grey-700">Utilization Date</h2>
                    <p className="-mt-1 text-base font-medium">
                      {format(new Date(usage.usage_date), "MMM-dd-yyyy")}
                    </p>
                    <h2 className="text-grey-700">Schedule Time</h2>
                    <p className="-mt-1 mb-1 text-base font-medium">
                      {`${format(
                        new Date(usage.sched_start_time),
                        "hh:mma",
                      )} - ${format(new Date(usage.sched_end_time), "hh:mma")}`}
                    </p>
                    <h2 className="text-grey-700">Utilization Time</h2>
                    <p className="-mt-1 mb-1 text-base font-medium">
                      {`${format(
                        new Date(usage.start_time),
                        "hh:mma",
                      )} - ${format(new Date(usage.end_time), "hh:mma")}`}
                    </p>
                  </div>

                  <div className="w-full">
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="text-red text-start text-lg font-medium">
                        After Usage Remarks
                      </h2>
                      <div className="flex items-center gap-3">
                        {currentUser.role === "Admin" && (
                          <>
                            <button
                              className="btn btn-primary btn-sm font-semibold normal-case"
                              onClick={() => openRemarksModal(usage.id)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-outline btn-sm border-secondary font-normal normal-case text-secondary hover:border-secondary hover:bg-secondary hover:text-white"
                              onClick={() => deleteRemark(usage.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <table className="table-zebra table-sm table w-full">
                      <thead>
                        <tr>
                          <td className={`${tableHeaderClass} rounded-tl-lg`}>
                            Remark
                          </td>
                          <td className={tableHeaderClass}>PC No.</td>
                          <td className={`${tableHeaderClass} rounded-tr-lg`}>
                            Description
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        {listOfLabMonitoring[index].details.map(
                          (detail, detailIndex) => (
                            <tr key={detailIndex}>
                              <td className="min-w-[11rem] px-4">
                                {detail.remark}
                              </td>
                              <td className="min-w-[10px] px-4">
                                {detail.unit_number}
                              </td>
                              <td className="w-full px-4">
                                {detail.remark === "Internet Speed"
                                  ? `${detail.problem} MBPS`
                                  : detail.problem}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </article>
        </>
      )}
    </TitleCard>
  );
}

export default ListOfLabMonitoringPage;
