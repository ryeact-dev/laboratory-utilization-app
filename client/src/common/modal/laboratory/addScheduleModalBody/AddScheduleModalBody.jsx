import { useState } from "react";
import { INITIAL_SCHEDULE_OBJ } from "@/globals/initialValues";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import ScheduleFormDetails from "./components/ScheduleFormDetails";
import { useGetListOfHolidays } from "@/hooks/noClassDays.hook";
import { useAddSchedule } from "@/hooks/schedules.hook";

import BottomButtons from "@/common/buttons/BottomButtons";
import { addSchedule } from "@/lib/helpers/addSchedule";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scheduleSchema } from "@/schemas/zodSchema";
import { useGetCurrentUserData } from "@/hooks/users.hook";

const WEEKDAYS = ["MO", "TU", "WE", "TH", "FR", "SA"];

export default function AddScheduleModalBody({ closeModal, extraObject }) {
  const {
    currentUser,
    scheduleObj,
    laboratory,
    schedulerData,
    selectedTermAndSem,
  } = extraObject;

  const { activeSchoolYear, activeTermSem } = useGetCurrentUserData();

  const defaultSubject = {
    ...schedulerData,
    end_time: schedulerData?.subject_end_time,
    start_time: schedulerData?.subject_start_time,
  };

  const [date, setDate] = useState(new Date());
  const [fetchedSubject, setFetchedSubject] = useState(
    schedulerData ? defaultSubject : null,
  );
  const [isManualTime, setIsManualTime] = useState(false);
  const [selectedDays, setSelectedDays] = useState(WEEKDAYS);

  // FETCHING HOLIDAYS
  const { data: listOfHolidays } = useGetListOfHolidays(
    activeSchoolYear,
    activeTermSem,
  );

  const exludedDates = listOfHolidays?.map(
    (item) => new Date(item.no_class_date),
  );

  const { mutate: addScheduleMutation, isPending } = useAddSchedule(closeModal);

  const form = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues: schedulerData
      ? {
          ...schedulerData,
          end_time: schedulerData?.subject_end_time,
          start_time: schedulerData?.subject_start_time,
        }
      : INITIAL_SCHEDULE_OBJ,
  });

  const onSubmit = (subjectData) => {
    const { isScheduleAvailable, conflictMessage, scheduleData } = addSchedule(
      subjectData,
      selectedDays,
      fetchedSubject,
      date,
      scheduleObj,
      selectedTermAndSem,
      activeSchoolYear,
      laboratory,
      currentUser,
      isManualTime,
    );
    // console.log(scheduleData);

    // console.log(conflictMessage. === "");

    // YOU CAN'T DO A RESERVATION WITH THE SAME CLASS SCHEDULE AND THE SAME TIME
    if (!isScheduleAvailable) {
      ToastNotification("error", conflictMessage);
      return;
    }

    // console.log(scheduleData);

    addScheduleMutation({ scheduleData });
  };

  // RENDER SECTION
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="-mt-4">
      <ScheduleFormDetails
        form={form}
        currentUser={currentUser}
        isManualTime={isManualTime}
        setIsManualTime={setIsManualTime}
        exludedDates={exludedDates}
        date={date}
        setDate={setDate}
        setFetchedSubject={setFetchedSubject}
        fetchedSubject={fetchedSubject}
        selectedDays={selectedDays}
        setSelectedDays={setSelectedDays}
        selectedTermAndSem={selectedTermAndSem}
        activeSchoolYear={activeSchoolYear}
      />
      <div className="mt-4">
        <BottomButtons
          closeModal={closeModal}
          isLoading={isPending}
          isPayload={false}
        />
      </div>
    </form>
  );
}
