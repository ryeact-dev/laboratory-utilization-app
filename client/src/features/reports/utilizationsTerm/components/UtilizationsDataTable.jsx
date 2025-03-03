import { useNavigate } from "react-router-dom";
import { calculateUsageTime } from "@/lib/helpers/dateTime";

function UtilizationDataTable({
  listOfSchedule,
  laboratory,
  selectedTermAndSem,
  activeSchoolYear,
  getClassLaboratoryUtilizations,
}) {
  const navigate = useNavigate();

  const onUtilizationDetailsClick = (subjectId) => {
    navigate(`/lumens/app/reports-utilizations-term/details/${subjectId}`, {
      state: { laboratory, selectedTermAndSem, subjectId, activeSchoolYear },
    });
  };

  return (
    <>
      <header
        htmlFor="weekly-summary-header"
        className="-mt-6 mb-2 rounded-lg bg-secondary text-left text-sm font-medium text-black"
      >
        <div className="flex items-center justify-between px-4 font-semibold">
          <div className="w-48 shrink-0 py-2 text-center text-base">
            <p> Code & Title</p>
          </div>
          <div className="w-48 shrink-0 py-2 text-center text-base">
            <p>Name of Instructor</p>
          </div>
          <div className="w-full py-2 text-center text-base">
            <h2 className="w-full">Accumulated Laboratory Utilization</h2>
            <div className="flex items-center justify-between text-sm">
              <p className="w-full">Current</p>
              <p className="w-full">Previous</p>
              <p className="w-full">Total</p>
              <p className="hidden w-full sm:block">Regular</p>
              <p className="hidden w-full sm:block">Make-up</p>
            </div>
          </div>
          {/* <div className='w-2/4 text-center text-base'>Usage Details</div> */}
        </div>
      </header>

      <div className="flex flex-row md:mt-4 md:flex-col">
        {listOfSchedule
          .sort((a, b) => a.Subject.localeCompare(b.Subject))
          .map((schedule, index) => (
            <div
              style={{ fontFamily: "Roboto Mono" }}
              key={index}
              className={`hover:bg-base-200 flex flex-col items-start justify-between rounded-lg px-4 py-1 md:flex-row ${
                index % 2 === 0 ? "bg-base-200/20" : ""
              } `}
            >
              <div className="my-auto w-48 shrink-0 text-center">
                <h2 className="text-base">{schedule.Subject}</h2>
              </div>

              <div className="my-auto w-48 shrink-0 p-0 text-center">
                <h2 className="text-base">{schedule.Description}</h2>
              </div>

              <div className="text-grey-800 my-auto flex w-full items-center justify-between">
                <h2 className="w-full text-center text-base">
                  {calculateUsageTime(
                    getClassLaboratoryUtilizations(schedule.SubjectId)
                      ?.current_usage,
                  )}
                </h2>
                <h2 className="w-full text-center text-base">
                  {calculateUsageTime(
                    getClassLaboratoryUtilizations(schedule.SubjectId)
                      ?.previous_usage,
                  )}
                </h2>
                <h2 className="w-full text-center text-base text-white">
                  {calculateUsageTime(
                    getClassLaboratoryUtilizations(schedule.SubjectId)?.total,
                  )}
                </h2>
                <h2 className="hidden w-full text-center text-base text-white sm:block">
                  {calculateUsageTime(
                    getClassLaboratoryUtilizations(schedule.SubjectId)
                      ?.regular_class_total,
                  )}
                </h2>
                <h2 className="hidden w-full text-center text-base text-white sm:block">
                  {calculateUsageTime(
                    getClassLaboratoryUtilizations(schedule.SubjectId)
                      ?.reservation_class_total,
                  )}
                </h2>
              </div>

              {/* <div className='w-2/4 flex justify-center'>
                <div
                  className='tooltip tooltip-primary'
                  data-tip='open details'
                >
                  <button
                    type='button'
                    onClick={() => onUtilizationDetailsClick(usage.subject_id)}
                    className='btn-ghost btn-sm btn hover:bg-transparent'
                  >
                    <LuCalendarRange
                      size={20}
                      className='hover:text-primary'
                      strokeWidth={1.5}
                    />
                  </button>
                </div>
              </div> */}
            </div>
          ))}
      </div>
    </>
  );
}

export default UtilizationDataTable;
