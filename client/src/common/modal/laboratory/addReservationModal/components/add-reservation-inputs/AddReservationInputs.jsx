import {
  RESERVATION_PURPOSE,
  SCHEDULER_END_TIME,
  SCHEDULER_START_TIME,
} from "@/globals/initialValues";
import SearchSubjectInput from "@/common/modal/laboratory/addScheduleModalBody/components/SearchSubjectInput";
import { Label } from "@/common/ui/label";
import SelectItems from "@/common/select/SelectIems";
import ErrorText from "@/common/typography/ErrorText";
import { DatePicker } from "@/common/date-picker/DatePicker";
import { addWeeks, format } from "date-fns";

const formattedDate = (date) => {
  if (!date) return "No Selected Date";
  return format(new Date(date), "EEE, MMM dd yyyy");
};

export default function AddReservationInputs({
  form,
  date,
  setDate,
  exludedDates,
  setFetchedSubject,
  fetchedSubject,
  termSemStartingDate,
  termSemEndingDate,
  // isLoading,
  // listOfDeanAndProgramHead,
}) {
  const {
    formState: { errors },
    register,
    setValue,
    watch,
  } = form;

  // const deanList = listOfDeanAndProgramHead?.filter(
  //   (user) => user.role === "Dean",
  // );
  // const programHeadList = listOfDeanAndProgramHead?.filter(
  //   (user) => user.role === "Program Head",
  // );

  return (
    <>
      <div className="flex w-full items-start justify-between gap-3">
        <div className="w-full">
          <Label className="font-normal">Purpose</Label>
          <SelectItems
            value={watch("purpose")}
            onValueChange={(value) => setValue("purpose", value)}
            placeholderWidth={"w-full"}
            dataArray={RESERVATION_PURPOSE}
            placeholder={"Select Purpose"}
          />
          <ErrorText>
            {errors?.purpose ? errors?.purpose.message : ""}
          </ErrorText>
        </div>
        <div className="w-full">
          <Label className="font-normal">Date of use</Label>
          <DatePicker
            date={date}
            setDate={(date) => setDate(date)}
            minDate={new Date(termSemStartingDate)}
            maxDate={addWeeks(new Date(termSemEndingDate), 2)}
            formattedDate={formattedDate}
            excludeDates={exludedDates}
          />
        </div>
      </div>

      {/* Search Subject and Date Schedule */}
      <SearchSubjectInput
        form={form}
        setFetchedSubject={setFetchedSubject}
        fetchedSubject={fetchedSubject}
      />

      {/* Reservation Time */}
      <div className="mt-1 flex w-full items-start justify-between gap-3">
        <div className="w-full">
          <Label className="font-normal">Start Time</Label>
          <SelectItems
            value={watch("start_time")}
            onValueChange={(value) => setValue("start_time", value)}
            placeholderWidth={"w-full"}
            dataArray={SCHEDULER_START_TIME}
            placeholder={"Start Time"}
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
            placeholderWidth={"w-full"}
            dataArray={SCHEDULER_END_TIME}
            placeholder={"End Time"}
          />

          <ErrorText>
            {errors?.end_time ? errors?.end_time.message : ""}
          </ErrorText>
        </div>
      </div>

      {/* Program Head And Dean */}
      {/* <div className="mt-1 flex w-full items-start justify-between gap-3">
        <div className="w-full">
          <Label className="font-normal">Program Head</Label>
          <SelectItems
            value={watch("programhead_id")}
            onValueChange={(value) => setValue("programhead_id", value)}
            placeholderWidth={"w-full"}
            dataArray={programHeadList}
            placeholder={"Select Program Head"}
            needSubLabel={true}
          />
          <ErrorText>
            {errors?.programhead_id ? errors?.programhead_id.message : ""}
          </ErrorText>
        </div>

        <div className="w-full">
          <Label className="font-normal">Dean</Label>
          <SelectItems
            value={watch("dean_id")}
            onValueChange={(value) => setValue("dean_id", value)}
            placeholderWidth={"w-full"}
            dataArray={deanList}
            placeholder={"Select Dean"}
          />

          <ErrorText>
            {errors?.dean_id ? errors?.dean_id.message : ""}
          </ErrorText>
        </div>
      </div> */}

      {/* Topic Content */}
      {/* <div>
        <Label>Topic Content</Label>
        <Textarea
          {...register("topic_content")}
          rows="2"
          placeholder="Topic Content. . ."
          style={{ resize: "none" }}
          disabled={watch("purpose") !== "Make-up Class"}
          className="placeholder:font-thin placeholder:italic placeholder:text-primary-foreground/50"
        ></Textarea>

        <ErrorText>
          {errors?.topic_content ? errors?.topic_content.message : ""}
        </ErrorText>
      </div> */}

      {/* Reasons for Conducting Make-up class */}
      {/* <div>
        <Label>Make-up Reason</Label>
        <Textarea
          {...register("makeup_reason")}
          rows="2"
          placeholder="Make up reason. . ."
          style={{ resize: "none" }}
          disabled={watch("purpose") !== "Make-up Class"}
          className="placeholder:font-thin placeholder:italic placeholder:text-primary-foreground/50"
        ></Textarea>

        <ErrorText>
          {errors?.makeup_reason ? errors?.makeup_reason.message : ""}
        </ErrorText>
      </div> */}
    </>
  );
}
