import SelectItems from "@/common/select/SelectIems";
import SearchSubjectInput from "./SearchSubjectInput";
import { SelectWeekdays } from "./SelectWeekdays";
import { Label } from "@/common/ui/label";
import ErrorText from "@/common/typography/ErrorText";
import {
  SCHEDULER_END_TIME,
  SCHEDULER_START_TIME,
} from "@/globals/initialValues";
import { Checkbox } from "@/common/ui/checkbox";

export default function ScheduleFormDetails({
  form,
  currentUser,
  date,
  setDate,
  exludedDates,
  setFetchedSubject,
  fetchedSubject,
  selectedDays,
  setSelectedDays,
  setIsManualTime,
  isManualTime,
  selectedTermAndSem,
  activeSchoolYear,
}) {
  const isFaculty =
    currentUser.role === "Program Head" ||
    currentUser.role === "Faculty" ||
    currentUser.role === "Dean";

  const {
    formState: { errors },
    setValue,
    watch,
  } = form;

  // RENDER SECTION
  return (
    <>
      <SearchSubjectInput
        form={form}
        date={date}
        setDate={setDate}
        exludedDates={exludedDates}
        setFetchedSubject={setFetchedSubject}
        fetchedSubject={fetchedSubject}
        selectedTermAndSem={selectedTermAndSem}
        activeSchoolYear={activeSchoolYear}
      />

      {/* SELECTE WEEK DAYS SCHEDULE */}
      <div className="mb-4 mt-3 w-full">
        <Label className="font-normal">Select Schedule</Label>
        <SelectWeekdays
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
          isDisabled={fetchedSubject === null}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="manual-time"
          checked={isManualTime}
          onCheckedChange={setIsManualTime}
        />
        <label
          htmlFor="manual-time"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Check this if you want to manually set the time
        </label>
      </div>

      {/* Manual Time */}
      <div className="mt-3 flex w-full items-start justify-between gap-3 rounded-lg border p-4">
        <div className="w-full">
          <Label className="font-normal">Start Time</Label>
          <SelectItems
            value={watch("start_time")}
            onValueChange={(value) => setValue("start_time", value)}
            dataArray={SCHEDULER_START_TIME}
            placeholder={"Start Time"}
            disabled={!isManualTime}
            placeholderWidth={"w-full"}
          />
          <ErrorText>
            {errors?.start_time ? errors?.start_time.message : ""}
          </ErrorText>
        </div>

        <div className="w-full">
          <Label className="font-normal">End Time</Label>
          <SelectItems
            value={watch("end_time")}
            onValueChange={(value) => setValue("end_time", value)}
            dataArray={SCHEDULER_END_TIME}
            placeholder={"End Time"}
            disabled={!isManualTime}
            placeholderWidth={"w-full"}
          />

          <ErrorText>
            {errors?.end_time ? errors?.end_time.message : ""}
          </ErrorText>
        </div>
      </div>
    </>
  );
}
