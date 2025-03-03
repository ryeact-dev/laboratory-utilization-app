import { format } from "date-fns";
import {
  CalendarRange,
  CircleUserRound,
  Clock,
  Presentation,
} from "lucide-react";

export default function ReportHeader({
  schedule,
  weekNumber,
  isLabOrientation = false,
}) {
  const {
    instructor,
    instructor_name,
    code,
    title,
    sched_end_time,
    sched_start_time,
    subject_start_time,
    subject_end_time,
  } = schedule;

  return (
    <div className="my-2 flex w-full items-center rounded-md bg-secondary p-2 text-black">
      <div className="flex flex-1 flex-col items-start justify-center pl-4">
        <div className="flex items-center gap-1 font-bold">
          <Presentation size={16} strokeWidth={3} />
          <p>
            {code} - {title}
          </p>
        </div>
        <div className="flex items-center gap-1 font-bold leading-5">
          <CircleUserRound strokeWidth={3} size={16} />
          <p>
            {instructor_name
              ? instructor_name
              : instructor
                ? instructor
                : "No yet assigned"}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-start justify-center pl-4">
        <div className="flex items-center gap-1 font-bold">
          <Clock size={16} strokeWidth={3} />
          <p>
            {/* {format(
              new Date(
                subject_start_time
                  ? `2024-03-15T${subject_start_time}`
                  : sched_start_time,
              ),
              "hh:mm a",
            )}{" "}
            -{" "}
            {format(
              new Date(
                subject_start_time
                  ? `2024-03-15T${subject_end_time}`
                  : sched_end_time,
              ),
              "hh:mm a",
            )} */}
            {format(new Date(sched_start_time), "hh:mm a")} -{" "}
            {format(new Date(sched_end_time), "hh:mm a")}
          </p>
        </div>
        <div className="flex items-center gap-1 font-bold">
          <CalendarRange size={16} strokeWidth={3} />
          <p>{`Week No. ${!isLabOrientation ? weekNumber : "N/A"}`}</p>
        </div>
      </div>
    </div>
  );
}
