import { useState } from "react";
import { useGetListOfHolidays } from "@/hooks/noClassDays.hook";
import { INITIAL_RESERVATION_SCHEDULE_OBJ } from "@/globals/initialValues";
import BottomButtons from "@/common/buttons/BottomButtons";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { useAddSchedule } from "@/hooks/schedules.hook";
import { addSchedule } from "@/lib/helpers/addSchedule";
import { getWeekdayTruDate } from "@/lib/helpers/classSchedule";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reservationSchema } from "@/schemas/zodSchema";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import AddReservationInputs from "./components/add-reservation-inputs/AddReservationInputs";

export default function AddReservationModalBody({ closeModal, extraObject }) {
  const { currentUser, scheduleObj, schedulerData, laboratory } = extraObject;

  const {
    activeSchoolYear,
    activeTermSem,
    termSemStartingDate,
    termSemEndingDate,
  } = useGetCurrentUserData();

  const defaultSubject = {
    ...schedulerData,
    end_time: schedulerData?.subject_end_time,
    start_time: schedulerData?.subject_start_time,
  };

  const [date, setDate] = useState(new Date());
  const [fetchedSubject, setFetchedSubject] = useState(
    schedulerData ? defaultSubject : null,
  );

  // FETCHING HOLIDAYS
  const { data: listOfHolidays } = useGetListOfHolidays(
    activeSchoolYear,
    activeTermSem,
  );

  // const { isLoading, data: listOfDeanAndProgramHead } =
  //   useGetListOfProgramHeadAndDean();

  const exludedDates = listOfHolidays?.map(
    (item) => new Date(item.no_class_date),
  );

  const { mutate: addScheduleMutation, isPending } = useAddSchedule(closeModal);

  const form = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: schedulerData
      ? {
          ...schedulerData,
          end_time: schedulerData?.subject_end_time,
          start_time: schedulerData?.subject_start_time,
        }
      : INITIAL_RESERVATION_SCHEDULE_OBJ,
  });

  const onSubmit = (subjectData) => {
    const dateWeekday = getWeekdayTruDate(date);

    // TODO: FIND A WAY TO UPDATE THE SCHEDULE DATA
    // IF THE SCHEDULE IS ALREADY IN THE SCHEDULE
    const { isScheduleAvailable, conflictMessage, scheduleData } = addSchedule(
      subjectData,
      [dateWeekday], // selectedDays if Regular Class
      fetchedSubject,
      date,
      scheduleObj,
      activeTermSem,
      activeSchoolYear,
      laboratory,
      currentUser,
      true, // True if manual time schedule
      true, // True if the schedule is reserved class
    );

    // YOU CAN'T DO A RESERVATION WITH THE SAME CLASS SCHEDULE AND THE SAME TIME
    if (!isScheduleAvailable) {
      return ToastNotification("error", conflictMessage);
    }

    addScheduleMutation({ scheduleData });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="-mt-2">
      <AddReservationInputs
        form={form}
        currentUser={currentUser}
        date={date}
        setDate={setDate}
        exludedDates={exludedDates}
        setFetchedSubject={setFetchedSubject}
        fetchedSubject={fetchedSubject}
        termSemStartingDate={termSemStartingDate}
        termSemEndingDate={termSemEndingDate}
        // isLoading={isLoading}
        // listOfDeanAndProgramHead={listOfDeanAndProgramHead}
      />
      <BottomButtons
        closeModal={closeModal}
        isLoading={isPending}
        isPayload={false}
      />
    </form>
  );
}
