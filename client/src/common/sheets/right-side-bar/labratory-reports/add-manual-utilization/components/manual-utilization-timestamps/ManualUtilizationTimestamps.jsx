import SelectItems from "@/common/select/SelectIems";
import { Label } from "@/common/ui/label";
import { HOURS_12, TIME_SECONDS } from "@/globals/initialValues";
import { getUsageTime } from "@/lib/helpers/dateTime";

export default function ManualUtilizationTimestamps({
  setStartTime,
  setEndTime,
  startTime,
  endTime,
  usageStartHour,
  usageEndHour,
  setTotalUsageTime,
  formatUsageDateAndTime,
}) {
  const updateUsageTime = (startTime, endTime) => {
    const usageStartTime = formatUsageDateAndTime(startTime);
    const usageEndTime = formatUsageDateAndTime(endTime);

    setTotalUsageTime(getUsageTime(usageStartTime, usageEndTime));
  };

  const onTimeChange = (value, field) => {
    let updatedStartTime = startTime;
    let updatedEndTime = endTime;

    switch (field) {
      case "start-hr":
        setStartTime((prev) => ({ ...prev, hr: value }));
        updatedStartTime = { ...updatedStartTime, hr: value };
        updateUsageTime(updatedStartTime, updatedEndTime);
        break;

      case "start-mins":
        setStartTime((prev) => ({ ...prev, mins: value }));
        updatedStartTime = { ...updatedStartTime, mins: value };
        updateUsageTime(updatedStartTime, updatedEndTime);
        break;

      case "end-hr":
        setEndTime((prev) => ({ ...prev, hr: value }));
        updatedEndTime = { ...updatedEndTime, hr: value };
        updateUsageTime(updatedStartTime, updatedEndTime);
        break;

      case "end-mins":
        setEndTime((prev) => ({ ...prev, mins: value }));
        updatedEndTime = { ...updatedEndTime, mins: value };
        updateUsageTime(updatedStartTime, updatedEndTime);
        break;

      default:
        break;
    }
  };

  const filteredHours = HOURS_12.filter(
    (hour) => hour.value === usageStartHour || hour.value === usageEndHour,
  );

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <div className="relative flex-1 rounded-md border px-4 py-2">
        {/* Start Time */}
        <Label className="absolute -top-2 left-2 bg-background px-4 text-white">
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
      <div className="relative flex-1 rounded-md border px-4 py-2">
        {/* End Time */}
        <Label className="absolute -top-2 left-2 bg-background px-4 text-white">
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
  );
}
