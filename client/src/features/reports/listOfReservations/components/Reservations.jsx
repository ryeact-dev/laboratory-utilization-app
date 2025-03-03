import { format } from "date-fns";
import { CalendarDays, CircleUserRound, Clock4 } from "lucide-react";

function Reservations({ reservationData }) {
  // RENDER SECTION
  return (
    <article className="grid w-full grid-cols-1 gap-4 py-2 md:grid-cols-2 lg:grid-cols-4">
      {reservationData.map((schedule, index) => (
        <div
          key={index}
          className={`card card-side border-grey-400 bg-base-100 flex items-center justify-between overflow-hidden border-[1px] px-4 py-2 shadow-xl`}
        >
          <div className="card-body w-full p-2">
            <div className="w-full">
              <p className="text-blue-eraser text-2xl font-semibold">
                {schedule.title
                  ? `${schedule.code}-${schedule.title?.toUpperCase()}`
                  : schedule.activity_title?.toUpperCase() || "No Title"}
              </p>
              <p className="mb-1 flex items-center gap-1 text-base font-medium">
                <CalendarDays size={20} className="text-accent" />
                {format(new Date(schedule.sched_end_time), "E MMM dd, yyyy")}
              </p>
              <p className="mb-1 flex items-center gap-1 text-base font-medium">
                <Clock4 size={20} className="text-accent" />
                {`${format(
                  new Date(schedule.sched_start_time),
                  "hh:mma",
                )}-${format(new Date(schedule.sched_end_time), "hh:mma")}`}
              </p>
              <p className="flex items-center gap-1 text-base font-medium">
                <CircleUserRound size={20} className="text-accent" />{" "}
                {/* {schedule.added_by} */}
                {schedule.instructor ? schedule.instructor : "N/A"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </article>
  );
}

export default Reservations;
