import { useState } from "react";
import { format } from "date-fns";
import { useAddNoClassDay } from "@/hooks/noClassDays.hook";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { TYPE_OF_NO_CLASS_DAY } from "@/globals/initialValues";
import { Label } from "@/common/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/ui/select";
import { Input } from "@/common/ui/input";
import { DatePicker } from "@/common/date-picker/DatePicker";
import BottomButtons from "@/common/buttons/BottomButtons";
import { useGetCurrentUserData } from "@/hooks/users.hook";

const currentDate = new Date();
const startingMonths = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() + 12,
  currentDate.getDate(),
);

const formattedDate = (date) => {
  return format(new Date(date), "MMM dd, yyyy");
};

// MAIN FUNCTION
export default function AddNoCLassBodyModal({ closeModal }) {
  const { activeSchoolYear, activeTermSem } = useGetCurrentUserData();

  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [schedule, setSchedule] = useState("");

  const { mutate: addNoClassDatesMutation, isPending } =
    useAddNoClassDay(closeModal);

  const onSubmitClick = (evt) => {
    evt.preventDefault();

    if (schedule.trim() === "") {
      ToastNotification("error", "Type of Schedule is required");
      return;
    }

    if (title.trim() === "") {
      ToastNotification("error", "Title is required");
      return;
    }

    const forAddingData = {
      activeSchoolYear,
      activeTermSem,
      schedule,
      title,
      noClassDate: date,
    };

    addNoClassDatesMutation(forAddingData);
  };

  // RENDER SECTION
  return (
    <form
      onSubmit={(evt) => onSubmitClick(evt)}
      className="min-h-full flex-col items-center md:flex"
    >
      <article className="mb-4 flex w-full items-start gap-3">
        <div className="flex-1">
          <Label className="font-normal">Select Date</Label>
          <DatePicker
            date={date}
            setDate={(date) => setDate(date)}
            minDate={new Date("2023-08-01")}
            maxDate={startingMonths}
            formattedDate={formattedDate}
          />
        </div>
        <div className="flex-[2]">
          <Label className="font-normal">Type of Schedule</Label>

          <Select onValueChange={(value) => setSchedule(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Schedule" />
            </SelectTrigger>
            <SelectContent>
              {/* {wasAcknowledged && <option value="">Select All Laboratories</option>} */}
              {TYPE_OF_NO_CLASS_DAY.map((type, k) => {
                return (
                  <SelectItem value={type} key={k}>
                    {type}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </article>
      <article className="w-full">
        <Label className="font-normal">Title</Label>
        <Input
          className="h-10"
          type="text"
          placeholder="Title goes here"
          onChange={(evt) => setTitle(evt.target.value)}
        />
      </article>
      <article className="mt-10 flex w-full justify-end space-x-2">
        <BottomButtons closeModal={closeModal} isLoading={isPending} />
      </article>
    </form>
  );
}
