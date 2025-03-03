import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CircleUserRound, Clock, Presentation } from "lucide-react";

export default function UtilizationHeader({
  headerData,
  titleClass,
  titleIconSize = 20,
  profClass,
  profIconSize = 20,
  timeClass,
  timeIconSize = 20,
}) {
  const titleClassname = cn(
    "flex items-center gap-2 text-xl tracking-wide font-medium text-secondary uppercase",
    titleClass,
  );
  const profClassname = cn(
    "flex items-center gap-2 text-xl font-normal text-yellow-200",
    profClass,
  );
  const timeClassname = cn(
    "flex items-center gap-2 text-lg font-normal text-yellow-200",
    timeClass,
  );

  const {
    code,
    title,
    activity_title,
    instructor,
    instructor_name,
    sched_end_time,
    sched_start_time,
  } = headerData;

  return (
    <header className="flex flex-col">
      <h2 className={titleClassname}>
        <Presentation size={titleIconSize} /> {code || "N/A"} -{" "}
        {title || activity_title}
      </h2>
      <p className={profClassname}>
        <CircleUserRound size={profIconSize} />
        <span className="leading-5">
          {instructor_name ? instructor_name : instructor ? instructor : "N/A"}
        </span>
      </p>
      <p className={timeClassname}>
        <Clock size={timeIconSize} />
        {format(new Date(sched_start_time), "hh:mm a")} -{" "}
        {format(new Date(sched_end_time), "hh:mm a")}
      </p>
    </header>
  );
}
