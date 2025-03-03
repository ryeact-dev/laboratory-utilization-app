import {
  addSchedule,
  deleteSchedule,
  getReservationSchedules,
  getSchedulerSchedules,
  getSchedulesForToday,
  getUtilizationSchedules,
  transferSchedule,
} from "@/api/schedules.api";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isSameWeek } from "date-fns";

// *========= QUERIES ==========

// GET SCHEDULES FOR SCHEDULER
export function useGetSchedulerSchedules(
  laboratory,
  activeSchoolYear,
  activeTermSem,
  currentUser,
  isWeeklyUtilization,
  date,
) {
  return useQuery({
    queryKey: ["schedules", laboratory, activeSchoolYear, activeTermSem, date],
    queryFn: () =>
      getSchedulerSchedules({ laboratory, activeSchoolYear, activeTermSem }),
    select: ({ data }) => {
      if (!data || data.length === 0) {
        console.log("No data received or empty data array");
        return [];
      }

      // console.log("Original data:", data);

      try {
        let scheduleData = data.map((item, index) => ({
          Id: index + 1,
          ScheduleId: item.id,
          Subject: `${
            item.subject_id
              ? item.code + "-" + item.title?.toUpperCase()
              : item.activity_title
          }`,
          SubjectId: item.subject_id,
          StartTime: item.sched_start_time,
          EndTime: item.sched_end_time,
          Description: item.instructor_name
            ? item.instructor_name
            : item.instructor
              ? item.instructor
              : "No Instructor yet",
          RecurrenceRule:
            item.is_regular_class === true
              ? `FREQ=WEEKLY;BYDAY=${item.recurrence_rule};INTERVAL=1`
              : "",

          // RecurrenceRule: `FREQ=WEEKLY;BYDAY=${item.recurrence_rule};INTERVAL=1`,
          RegularClass: item.is_regular_class,
          ClassSchedule: item.class_schedule,
          ScheduleStatus: item.sched_status,
          ScheduleData: item,
        }));

        // console.log("Mapped scheduleData:", scheduleData);

        let filteredSchedules = [];
        if (isWeeklyUtilization) {
          filteredSchedules = scheduleData.filter(
            (schedule) =>
              isSameWeek(new Date(schedule.EndTime), date) ||
              schedule.RegularClass === true,
          );
          // console.log("Filtered schedules:", filteredSchedules);
        }

        return filteredSchedules.length > 0 ? filteredSchedules : scheduleData;
      } catch (error) {
        console.error("Error processing schedule data:", error);
        return [];
      }
    },
    enabled: !!activeSchoolYear && !!activeTermSem && !!laboratory,
    // refetchInterval: 3000, //refetch every 3 seconds
  });
}

// GET UTILIZATION SCHEDULES
export function useGetUtilizationSchedules(
  laboratory,
  activeSchoolYear,
  activeTermSem,
  utilizationType,
) {
  return useQuery({
    queryKey: [
      "schedules",
      laboratory,
      activeSchoolYear,
      activeTermSem,
      utilizationType,
    ],
    queryFn: () =>
      getUtilizationSchedules({
        laboratory,
        activeSchoolYear,
        activeTermSem,
        seletedClassSchedule: 0,
        utilizationType,
      }),
    enabled: !!activeSchoolYear && !!activeTermSem,
    select: ({ data }) => {
      // FILTER THE SCHEDULES THAT IS REGULAR AND RESERVED SCHEDULE
      // RESERVED SCHEDULE IN THE PAST WILL BE FILTERED OUT
      const filteredSchedules = data
        // ?.filter((schedule) => {
        //   if (schedule.is_regular_class === true) return true;

        //   const today = format(new Date(), "yyyy-MM-dd");
        //   const usageDate = schedule.sched_end_time.split("T")[0];
        //   return usageDate === today;
        // })
        // ?.sort(
        //   (a, b) =>
        //     new Date(`2024-01-01T${a.sched_start_time}`) -
        //     new Date(`2024-01-01T${b.sched_start_time}`),
        // );
        ?.sort((a, b) => a.code.toString().localeCompare(b.code.toString()));

      return filteredSchedules;
    },
  });
}

export function useGetSchedulesForToday(
  laboratory,
  activeSchoolYear,
  activeTermSem,
  seletedClassSchedule,
) {
  return useQuery({
    queryKey: [
      "schedules-today",
      laboratory,
      activeSchoolYear,
      activeTermSem,
      seletedClassSchedule,
    ],
    queryFn: () =>
      getSchedulesForToday({
        laboratory,
        activeSchoolYear,
        activeTermSem,
        seletedClassSchedule,
      }),
    enabled: !!activeSchoolYear && !!activeTermSem,
    select: ({ data }) => {
      return data;
    },
  });
}

// GET RESERVATION SCHEDULES
export function useGetReservationSchedules(
  activeSchoolYear,
  activeTermSem,
  currentUser,
) {
  return useQuery({
    queryKey: [
      "listOfReservations",
      activeSchoolYear,
      activeTermSem,
      currentUser,
    ],
    queryFn: () =>
      getReservationSchedules({
        activeSchoolYear,
        activeTermSem,
        currentUser,
      }),
    enabled: !!activeSchoolYear && !!activeTermSem && !!currentUser,
    select: ({ data }) => {
      const reservations = data.sort((a, b) => a.code - b.code);
      return reservations;
    },
  });
}

// *========= MUTATIONS =========

// ADD SCHEDULE
export function useAddSchedule(closeModal) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addSchedule,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      ToastNotification("success", "Schedule successfully added");
      closeModal();
    },
  });
}

// TRANSFER SCHEDULE
export function useTransferSchedule(closeModal) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transferSchedule,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      ToastNotification("success", "Schedule successfully transferred");
      closeModal();
    },
  });
}

// DELETE SCHEDULE
export function useDeleteSchedule(closeModal, setIsLoading) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSchedule,
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onMutate: () => setIsLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      ToastNotification("info", "Schedule successfully removed");
      setIsLoading(false);
      closeModal();
    },
  });
}
