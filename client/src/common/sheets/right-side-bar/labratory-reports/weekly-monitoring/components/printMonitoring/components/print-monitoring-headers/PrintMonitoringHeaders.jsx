import workstationMonitoringForm from "@/assets/workstationMonitoringForm.webp";
import { format } from "date-fns";

export default function PrintMonitoringHeaders({
  weekNumber,
  listOfLabMonitoring,
  laboratory,
}) {
  return (
    <>
      {/* Background Image */}
      <header className="absolute left-0 top-0 -z-10">
        <img
          src={workstationMonitoringForm}
          alt="labMonitoringForm"
          className="w-full object-cover"
        />
      </header>

      {/* Sub Header */}
      <section className="w-full pt-40">
        <div className="-mt-1 flex w-full">
          <div className="flex-1">
            <p className="pl-2 text-center font-semibold">
              {`Week ${weekNumber}`}
            </p>
          </div>

          <div className="flex-1">
            <p className="ml-20 font-semibold">
              {format(
                new Date(listOfLabMonitoring[0]?.sched_start_time),
                "hh:mma",
              )}{" "}
              -
              {format(
                new Date(listOfLabMonitoring[0]?.sched_end_time),
                "hh:mma",
              )}
            </p>
          </div>

          <div className="flex-1">
            <p className="font-semibold">{laboratory}</p>
          </div>
        </div>

        <div className="flex w-full">
          <div className="flex-1">
            <p className="text-center font-semibold">
              {listOfLabMonitoring[0]?.code}
            </p>
          </div>

          <div className="flex-1">
            <p className="ml-20 font-semibold">
              {listOfLabMonitoring[0]?.title}
            </p>
          </div>

          <div className="flex-1">
            <p className="font-semibold">
              {listOfLabMonitoring[0]?.instructor}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
