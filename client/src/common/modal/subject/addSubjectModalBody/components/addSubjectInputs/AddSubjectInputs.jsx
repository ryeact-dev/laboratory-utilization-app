import ErrorText from "@/common/typography/ErrorText";
import {
  SCHEDULER_START_TIME,
  PROGRAM,
  SCHEDULER_END_TIME,
} from "@/globals/initialValues";
import { Label } from "@/common/ui/label";
import { Input } from "@/common/ui/input";

import SelectWithSearch from "@/common/select/SelectWithSearch";
import SelectItems from "@/common/select/SelectIems";

function AddSubjectInputs({ form, timeError, teachers }) {
  const {
    formState: { errors },
    register,
    setValue,
    watch,
  } = form;

  const onSelectValueChange = (field, value) => {
    setValue(field, value);
  };

  return (
    <div>
      <div className="-mt-2 mb-2 flex gap-3">
        {/* Subject Code */}
        <div className="md:!w-40">
          <Label className="font-normal">Code</Label>
          <Input
            {...register("code")}
            placeholder="ie. 0000"
            className={`placeholder:text-xs`}
          />
          <ErrorText>{errors?.code ? errors?.code.message : ""}</ErrorText>
        </div>

        {/* Subject Name or Title */}
        <div className="w-full">
          <Label className="font-normal">Title</Label>
          <Input
            {...register("title")}
            placeholder="Subject title..."
            className={`placeholder:text-xs`}
          />
          <ErrorText>{errors?.title ? errors?.title.message : ""}</ErrorText>
        </div>
      </div>

      {/* Subject Instructor */}
      <div className="-mt-1 mb-2 flex items-start justify-between gap-4">
        <div className="w-full">
          <Label className="font-normal">Program</Label>

          <SelectWithSearch
            noResultText={"Program not found"}
            placeholder={"Search Program here..."}
            dataArray={PROGRAM}
            onSelectChange={onSelectValueChange}
            fieldName={"program"}
            fieldValue={watch("program")}
          />

          <ErrorText>
            {errors?.program ? errors?.program.message : ""}
          </ErrorText>
        </div>
      </div>

      <div className="-mt-1 mb-2 flex items-start justify-between gap-4">
        <div className="w-full">
          <Label className="font-normal">Instructor Name</Label>
          <SelectWithSearch
            noResultText={"Teacher not found"}
            placeholder={"Search Instructor here..."}
            dataArray={teachers}
            onSelectChange={onSelectValueChange}
            fieldName={"instructor_id"}
            fieldValue={watch("instructor_id")}
          />

          <ErrorText>
            {errors?.instructor_id ? errors?.instructor_id.message : ""}
          </ErrorText>
        </div>
      </div>

      {/* Subject Start and End time */}
      <article className="my-3 flex w-full items-start justify-between gap-3">
        <div className="-mt-1 w-full">
          <Label className="font-normal">Start Time</Label>
          <SelectItems
            value={watch("start_time")}
            onValueChange={(value) => onSelectValueChange("start_time", value)}
            placeholderWidth={"w-full"}
            dataArray={SCHEDULER_START_TIME}
            placeholder={"Start Time"}
          />
          <ErrorText>
            {errors?.start_time ? errors?.start_time.message : ""}
          </ErrorText>
        </div>

        <div className="-mt-1 w-full">
          <Label className="font-normal">End Time</Label>
          <SelectItems
            value={watch("end_time")}
            onValueChange={(value) => onSelectValueChange("end_time", value)}
            placeholderWidth={"w-full"}
            dataArray={SCHEDULER_END_TIME}
            placeholder={"End Time"}
          />

          <ErrorText>
            {errors?.end_time ? errors?.end_time.message : ""}
          </ErrorText>
        </div>
      </article>
      {timeError && (
        <ErrorText styleClass="mt-2 text-center">{timeError}</ErrorText>
      )}
    </div>
  );
}

export default AddSubjectInputs;
