import { Badge } from "@/common/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/common/ui/card";
import { Label } from "@/common/ui/label";
import { format } from "date-fns";
import {
  Calendar,
  CalendarClock,
  CircleUserRound,
  Clock,
  Presentation,
} from "lucide-react";
import { checkSubjectUsage } from "@/lib/helpers/checkSubjectUsage";
import { useGetListOfRemarks } from "@/hooks/remarks.hook";
import { modalStore } from "@/store";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import StartClassButton from "../laboratory-utilization-buttons/start-class-button/StartClassButton";
import EndClassButton from "../laboratory-utilization-buttons/end-class-button/EndClassButton";
import ClasslistButton from "../laboratory-utilization-buttons/classlist-button/ClasslistButton";
import AddUsageRemarkButton from "../laboratory-utilization-buttons/add-usage-remark-button/AddUsageRemarkButton";
import CancelClassButton from "../laboratory-utilization-buttons/cancel-class-button/CancelClassButton";

export default function LaboratoryUtilizationCard({
  schedule,
  weekdayDisplay,
  isOngoingClass,
  currentUser,
  listOfUsage,
  isLoadingUsage,
  laboratory,
  tab,
}) {
  const openModal = modalStore((state) => state.openModal);

  const { noUsage, usageId, usageStartTime, usageEndTime, usageDate } =
    checkSubjectUsage(
      schedule.id,
      schedule.is_regular_class,
      listOfUsage || [],
      tab,
    ) || {};

  // FETCH THE LIST OF SUBJECT REMARKS
  const { isLoading: isLoadingRemarks, data: listOfRemarks } =
    useGetListOfRemarks(usageId);

  return (
    <Card
      className={`flex w-full flex-col items-start justify-between overflow-hidden border-[1px] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-card to-background/50`}
    >
      <CardHeader>
        <header className="-mb-4 flex w-full justify-start gap-2">
          {schedule?.recurrence_rule?.split(",").map((weekday) => (
            <Badge
              className={`${weekdayDisplay(weekday)?.color} hover:${weekdayDisplay(weekday)?.color} font-normal`}
              key={weekday}
            >
              {weekdayDisplay(weekday)?.name}
            </Badge>
          ))}
          {!schedule?.is_regular_class && (
            <Badge
              variant={"secondaryFaded"}
            >{`${!schedule?.is_regular_class && "Make-up Class"}`}</Badge>
          )}
        </header>
      </CardHeader>
      <CardContent className="w-full">
        <Label
          style={{ fontFamily: "Roboto Mono" }}
          className="flex items-center gap-2 text-lg font-semibold uppercase text-secondary"
        >
          <Presentation size={18} strokeWidth={2} />{" "}
          {schedule.code
            ? `${schedule.code} - ${schedule.title.toUpperCase()}`
            : `${schedule.activity_title}`}
        </Label>
        <Label className="-mt-1 flex items-center gap-2 text-lg font-normal text-slate-300">
          <CircleUserRound size={18} />
          {schedule.instructor ? schedule.instructor : "Not a subject"}
        </Label>
        {tab === "2" && !isLoadingUsage ? (
          <Label className="-mt-0.5 flex items-center gap-2 text-base font-normal text-slate-300">
            <Calendar size={18} />
            {format(new Date(usageDate), "MMM dd, yyyy")}
          </Label>
        ) : null}
        <div className="mt-1 flex items-center rounded-lg border border-yellow-700 bg-yellow-700/10 p-2">
          <div className="flex-1">
            <Label className="flex items-center gap-2 text-sm font-normal text-secondary">
              <Clock size={16} />
              {format(new Date(schedule?.sched_start_time), "hh:mma")} -{" "}
              {format(new Date(schedule?.sched_end_time), "hh:mma")}
            </Label>
          </div>
          <div className="flex-1">
            <Label className="flex items-center gap-2 text-sm font-normal text-secondary">
              <CalendarClock size={16} />
              {isOngoingClass(schedule.id)}
            </Label>
          </div>
        </div>
      </CardContent>

      <CardFooter className="-mt-3 flex w-full flex-col items-center justify-center gap-2">
        {/* Start and End Class Buttons */}

        {isLoadingUsage ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="flex w-full flex-col gap-2 lg:flex-row">
              <StartClassButton
                tab={tab}
                currentUser={currentUser}
                noUsage={noUsage}
                schedule={schedule}
                openModal={openModal}
              />
              <EndClassButton
                currentUser={currentUser}
                schedule={schedule}
                openModal={openModal}
                usageId={usageId}
                usageEndTime={usageEndTime}
                usageStartTime={usageStartTime}
                usageDate={usageDate}
                listOfUsage={!isLoadingUsage ? listOfUsage : []}
                listOfRemarks={!isLoadingRemarks ? listOfRemarks : []}
                tab={tab}
              />
            </div>

            <div className="flex w-full flex-col gap-2 lg:flex-row">
              <ClasslistButton
                openModal={openModal}
                usageId={usageId}
                schedule={schedule}
                usageEndTime={usageEndTime}
                usageStartTime={usageStartTime}
                usageDate={usageDate}
              />

              <AddUsageRemarkButton
                openModal={openModal}
                usageId={usageId}
                usageEndTime={usageEndTime}
                usageStartTime={usageStartTime}
                usageDate={usageDate}
                laboratory={laboratory}
              />
            </div>
            <CancelClassButton
              currentUser={currentUser}
              laboratory={laboratory}
              schedule={schedule}
              usageId={usageId}
              usageEndTime={usageEndTime}
              usageStartTime={usageStartTime}
              openModal={openModal}
            />
          </>
        )}
      </CardFooter>
    </Card>
  );
}
