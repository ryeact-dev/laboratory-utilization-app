import BottomButtons from "@/common/buttons/BottomButtons";
import SelectItems from "@/common/select/SelectIems";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { Label } from "@/common/ui/label";
import { HOURS_12, TIME_SECONDS } from "@/globals/initialValues";
import { useUpdateUtilizationTimeAndUsage } from "@/hooks/utilizations.hook";
import { calculateUsageTime, getUsageTime } from "@/lib/helpers/dateTime";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function UpdateUtilizationUsageModalBody({
  extraObject: singleUsage,
  closeModal,
}) {
  const { mutate: updateUtilizationTimeAndUsageMutation, isPending } =
    useUpdateUtilizationTimeAndUsage(closeModal);

  const schedStartHour = format(new Date(singleUsage?.sched_start_time), "hh");
  const schedEndHour = format(new Date(singleUsage?.sched_end_time), "hh");

  const usageDate = format(new Date(singleUsage?.usage_date), "MMM dd, yyyy");

  const usageStartHour = format(new Date(singleUsage?.start_time), "hh");
  const usageEndHour = format(new Date(singleUsage?.end_time), "hh");

  const usageStartMinute = format(new Date(singleUsage?.start_time), "mm");
  const usageEndMinute = format(new Date(singleUsage?.end_time), "mm");

  const usageStartAMPM = format(new Date(singleUsage?.start_time), "a");
  const usageEndAMPM = format(new Date(singleUsage?.end_time), "a");

  const tempTotalUsageTime = getUsageTime(
    singleUsage?.start_time,
    singleUsage?.end_time,
  );

  const [totalUsageTime, setTotalUsageTime] = useState(tempTotalUsageTime);
  const [startTime, setStartTime] = useState({
    hr: usageStartHour,
    mins: usageStartMinute,
    ampm: usageStartAMPM,
  });

  const [endTime, setEndTime] = useState({
    hr: usageEndHour,
    mins: usageEndMinute,
    ampm: usageEndAMPM,
  });

  const onTimeChange = (value, field) => {
    switch (field) {
      case "start-hr":
        setStartTime((prev) => ({ ...prev, hr: value }));
        break;

      case "start-mins":
        setStartTime((prev) => ({ ...prev, mins: value }));
        break;

      case "end-hr":
        setEndTime((prev) => ({ ...prev, hr: value }));
        break;

      case "end-mins":
        setEndTime((prev) => ({ ...prev, mins: value }));
        break;

      default:
        break;
    }
  };

  const onSubmitHandle = (evt) => {
    evt.preventDefault();

    const scheduledUsageTime = getUsageTime(
      singleUsage?.sched_start_time,
      singleUsage?.sched_end_time,
    );

    if (totalUsageTime > scheduledUsageTime) {
      return ToastNotification(
        "error",
        "Usage time is more than the alloted scheduled time",
      );
    }

    if (totalUsageTime <= 15) {
      return ToastNotification("error", "Usage time is less than 15mins");
    }

    const usageStartTime = new Date(
      `${usageDate} ${startTime.hr}:${startTime.mins} ${startTime.ampm}`,
    );

    const usageEndTime = new Date(
      `${usageDate} ${endTime.hr}:${endTime.mins} ${endTime.ampm}`,
    );

    const forUpdatingData = {
      usageId: singleUsage?.id,
      usageStartTime,
      usageEndTime,
      totalUsageTime,
    };

    updateUtilizationTimeAndUsageMutation(forUpdatingData);
  };

  useEffect(() => {
    const usageStartTime = new Date(
      `${usageDate} ${startTime.hr}:${startTime.mins} ${startTime.ampm}`,
    );

    const usageEndTime = new Date(
      `${usageDate} ${endTime.hr}:${endTime.mins} ${endTime.ampm}`,
    );

    setTotalUsageTime(getUsageTime(usageStartTime, usageEndTime));
  }, [endTime, startTime, usageDate]);

  const filteredHours = HOURS_12.filter(
    (hour) =>
      Number(hour.value) >= Number(schedStartHour) &&
      Number(hour.value) <= Number(schedEndHour),
  );

  return (
    <form onSubmit={onSubmitHandle}>
      <div className="flex items-center justify-between gap-2">
        <div className="relative rounded-md border px-6 py-4">
          {/* Start Time */}
          <Label className="absolute -top-4 left-2 bg-background px-4 text-xl text-white">
            Start Time
          </Label>
          <div className="flex items-center gap-2">
            <div>
              <Label>Hours</Label>
              <SelectItems
                selectContentClassName="min-w-[1rem]"
                placeholderWidth={"w-16"}
                dataArray={filteredHours}
                value={startTime.hr}
                onValueChange={(value) => onTimeChange(value, "start-hr")}
              />
            </div>
            <div>
              <Label>Mins</Label>
              <SelectItems
                selectContentClassName="min-w-[1rem]"
                placeholderWidth={"w-16"}
                dataArray={TIME_SECONDS}
                value={startTime.mins}
                onValueChange={(value) => onTimeChange(value, "start-mins")}
              />
            </div>
            <Label className="mt-5 text-xl text-white">{startTime.ampm}</Label>
          </div>
        </div>
        <div className="relative rounded-md border px-6 py-4">
          {/* End Time */}
          <Label className="absolute -top-4 left-2 bg-background px-4 text-xl text-white">
            End Time
          </Label>
          <div className="flex items-center gap-2">
            <div>
              <Label>Hours</Label>
              <SelectItems
                selectContentClassName="min-w-[1rem]"
                placeholderWidth={"w-16"}
                dataArray={filteredHours}
                value={endTime.hr}
                onValueChange={(value) => onTimeChange(value, "end-hr")}
              />
            </div>
            <div>
              <Label>Mins</Label>
              <SelectItems
                selectContentClassName="min-w-[1rem]"
                placeholderWidth={"w-16"}
                dataArray={TIME_SECONDS}
                value={endTime.mins}
                onValueChange={(value) => onTimeChange(value, "end-mins")}
              />
            </div>
            <Label className="mt-5 text-xl text-white">{endTime.ampm}</Label>
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-700/10 p-2">
        <p className="text-center">
          Usage Time: {calculateUsageTime(totalUsageTime)}
        </p>
      </div>
      <BottomButtons
        isLoading={isPending}
        closeModal={closeModal}
        isPayload={true}
      />
    </form>
  );
}
