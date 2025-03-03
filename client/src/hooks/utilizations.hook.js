import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addUtilization,
  cancelUtilization,
  endUtilization,
  getLaboratoryUtilizations,
  getLaboratoryWeeklyUtilizations,
  getPreviousUtilizations,
  getUtilizationsByTerm,
  getUtilizationScheduledClasslist,
  getUtilizationsList,
  getUtilizationsWithDates,
  updateStudentAttendance,
  updateUtilizationTimeAndUsage,
} from "@/api/utilizations.api";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { addWeeks, format, isSameWeek, subWeeks } from "date-fns";
import { getWeekDatesExcludeSunday } from "@/lib/helpers/dateTime";

const aggregatedData = (data, date) => {
  const selectedDate = new Date(date);
  const previousWeekStart = subWeeks(selectedDate, 1);

  return data.reduce((acc, utilization) => {
    const utilizationDate = new Date(utilization.usage_date);

    if (
      utilizationDate <= selectedDate &&
      !isSameWeek(utilizationDate, selectedDate)
    ) {
      const { subject_id, usage_hours, is_regular_class } = utilization;

      if (!acc[subject_id]) {
        acc[subject_id] = {
          ...utilization,
          current_usage: 0,
          previous_usage: 0,
          total: 0,
          regular_class_total: 0,
          reservation_class_total: 0,
        };
      }

      if (usage_hours) {
        const usageField = isSameWeek(utilizationDate, previousWeekStart)
          ? "current_usage"
          : "previous_usage";
        acc[subject_id][usageField] += usage_hours;
        acc[subject_id].total += usage_hours;

        // Aggregate usage hours for regular and reservation classes
        if (is_regular_class) {
          acc[subject_id].regular_class_total += usage_hours;
        } else {
          acc[subject_id].reservation_class_total += usage_hours;
        }
      }
    }

    return acc;
  }, {});
};

const aggregateBySubjectId = (data) => {
  return Object.values(
    data.reduce((acc, utilization) => {
      const { subject_id, usage_hours } = utilization;

      if (!acc[subject_id]) {
        acc[subject_id] = { ...utilization, usage_hours: 0 };
      }

      acc[subject_id].usage_hours += usage_hours || 0;
      return acc;
    }, {}),
  );
};

const aggregatedUtilizations = (data) => {
  let aggregatedUtilizations = {};

  // SORT THE UTILIZATIONS BY REGULAR CLASS (TRUE FIRST)
  data.sort((a, b) => b.is_regular_class - a.is_regular_class);
  // ITERATE OVER EACH UTILIZATION
  // IF THIS SUBJECT_ID IS ALREADY IN THE AGGREGATED UTILIZATIONS, ADD THE USAGE_HOURS AND IS_REGULAR_CLASS
  // OTHERWISE, ADD THIS UTILIZATION TO THE AGGREGATED UTILIZATIONS
  data.forEach((utilization) => {
    if (aggregatedUtilizations[utilization.subject_id]) {
      if (utilization.usage_hours) {
        aggregatedUtilizations[utilization.subject_id].usage_hours +=
          utilization.usage_hours;
      }
      // Add date to existing usage_dates array
      aggregatedUtilizations[utilization.subject_id].usage_dates.push(
        new Date(utilization.usage_date),
      );
    } else {
      const { students_attendance, students_time_log, ...rest } = utilization;

      aggregatedUtilizations[utilization.subject_id] = {
        ...rest,
        usage_dates: [new Date(utilization.usage_date)], // Initialize as array with first date
      };
    }
  });

  // CONVERT THE AGGREGATED UTIILIZATIONS OBJECT TO AN ARRAY
  return Object.values(aggregatedUtilizations);
};

// *========= QUERIES ==========

// GET ALL UTILIZATIONS
export function useGetAllUtilizations(
  laboratory,
  activeSchoolYear,
  selectedTermAndSem,
  subjectId,
  isAggregated,
  date,
) {
  const selectedDate = format(
    new Date(getWeekDatesExcludeSunday(date).weekDates[0]),
    "yyyy-MM-dd",
  );

  return useQuery({
    queryKey: ["utilizations-all", laboratory, selectedTermAndSem, date],
    queryFn: () =>
      getUtilizationsList({
        laboratory,
        activeSchoolYear,
        activeTermSem: selectedTermAndSem,
        subjectId,
        // Incase addtional features to select msat1 or msat2
        seletedClassSchedule: 0,
        selectedDate,
      }),
    enabled: !!laboratory && !!selectedTermAndSem && !!date,
    select: ({ data }) => {
      let result;
      result = data.sort(
        (a, b) => new Date(a.usage_date) - new Date(b.usage_date),
      );
      return result;
    },
  });
}

// GET LABORATORY WEEKLY USAGE
export function useGetLaboratoryWeeklyUtilizations(
  laboratory,
  activeSchoolYear,
  selectedTermAndSem,
  subjectId,
  date,
  listOfSchedule,
) {
  const selectedDate = format(date, "yyyy-MM-dd");
  const addedWeekDate = addWeeks(date, 1);

  return useQuery({
    queryKey: ["weekly-utilizations", laboratory, selectedTermAndSem, date],
    queryFn: () =>
      getLaboratoryWeeklyUtilizations({
        laboratory,
        activeSchoolYear,
        activeTermSem: selectedTermAndSem,
        subjectId,
        // Incase addtional features to select msat1 or msat2
        seletedClassSchedule: 0,
        selectedDate,
      }),
    enabled:
      !!laboratory &&
      !!selectedTermAndSem &&
      !!date &&
      listOfSchedule?.length > 0,
    select: ({ data }) => {
      const aggregated = aggregatedData(data, addedWeekDate);
      return aggregateBySubjectId(Object.values(aggregated));
    },
  });
}

// GET UTILIZATIONS WITH DATE RANGE
export function useGetUtilizationsWithDateRange(
  subjectId,
  laboratory,
  activeSchoolYear,
  weekDates = [],
  activeTermSem,
  isAggregated,
) {
  return useQuery({
    queryKey: [
      "utilizations-date-range",
      subjectId,
      laboratory,
      activeSchoolYear,
      weekDates,
      activeTermSem,
      isAggregated,
    ],
    queryFn: () =>
      getUtilizationsWithDates({
        subjectId,
        laboratory,
        activeSchoolYear,
        weekDates,
        activeTermSem,
      }),
    enabled: !!activeSchoolYear && !!activeTermSem && weekDates.length > 0,
    select: ({ data }) => {
      // console.log(data?.filter((item) => item.code === "1205"));
      const result = isAggregated ? aggregatedUtilizations(data) : data;
      return result;
    },
    // refetchInterval: 3000,
  });
}

// GET PREVIOUS UTILIZATIONS
export function useGetPreviousUtilizations(
  subjectCode,
  subjectTitle,
  activeSchoolYear,
  baseDate,
) {
  return useQuery({
    queryKey: ["previous-usage"],
    queryFn: () =>
      getPreviousUtilizations({
        subjectCode,
        subjectTitle,
        activeSchoolYear,
        baseDate,
      }),
    enabled: !!activeSchoolYear && !!subjectCode,
    select: ({ data }) => {
      return data;
    },
  });
}

// GET DASHBOARD SUBJECT UTILIZATIONS
export function useGetDashboardUtilizations(
  laboratory,
  activeSchoolYear,
  selectedTermAndSem,
  date,
) {
  const selectedDate = date && format(new Date(date), "yyyy-MM-dd");

  return useQuery({
    queryKey: [
      "dashboard-utilizations",
      laboratory,
      activeSchoolYear,
      selectedTermAndSem,
      selectedDate,
    ],
    queryFn: () =>
      getUtilizationsByTerm({
        laboratory,
        activeSchoolYear,
        selectedTermAndSem,
        selectedDate,
      }),
    select: ({ data }) => {
      return data;
    },
    enabled: !!date,
  });
}

// GET LABORATORY UTILIZATIONS
export function useGetLaboratoryUtilizations(
  laboratory,
  activeSchoolYear,
  activeTermSem,
  scheduledIds,
) {
  return useQuery({
    queryKey: [
      "utilizations-laboratory",
      laboratory,
      activeSchoolYear,
      activeTermSem,
      scheduledIds,
    ],
    queryFn: () =>
      getLaboratoryUtilizations({
        laboratory,
        seletedClassSchedule: 0,
        scheduledIds,
      }),
    enabled: !!scheduledIds?.length > 0,
    // Refetch every 3 seconds
    refetchInterval: 3000,
    // Only refetch when window is focused
    refetchIntervalInBackground: false,
    select: ({ data }) => {
      return data;
    },
  });
}

// GET UTILIZATION SCHEDULED CLASSLIST
export function useGetUtilizationScheduledClasslist(usageId, activeSchoolYear) {
  return useQuery({
    queryKey: ["subject-classlist", usageId, activeSchoolYear],
    queryFn: () =>
      getUtilizationScheduledClasslist({ usageId, activeSchoolYear }),
    enabled: !!activeSchoolYear && !!usageId,
    // Refetch every 3 seconds
    refetchInterval: 3000,
    // Only refetch when window is focused
    refetchIntervalInBackground: false,
  });
}

// *=========  MUTATIONS =========

// ADD UTILIZATION
export function useAddUtilization(closeModal, setIsLoading) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addUtilization,
    onMutate: () => setIsLoading(true),
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utilizations-laboratory"] });
      queryClient.invalidateQueries({ queryKey: ["utilizations-date-range"] });
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      ToastNotification("success", "Class time started");
      setIsLoading(false);
      closeModal();
    },
  });
}

// UPDATE STUDENT ATTENDANCE
export function useUpdateStudentAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStudentAttendance,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subject-classlist"] });
      queryClient.invalidateQueries({ queryKey: ["utilizations-date-range"] });
      ToastNotification("success", "Student Attendance Updated");
    },
  });
}

// UPDATE STUDENT ATTENDANCE
export function useUpdateUtilizationTimeAndUsage(closeModal) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUtilizationTimeAndUsage,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utilizations-laboratory"] });
      queryClient.invalidateQueries({ queryKey: ["utilizations-date-range"] });
      queryClient.invalidateQueries({ queryKey: ["previous-usage"] });
      ToastNotification("success", "Utilization Time and Usage Updated");
      closeModal();
    },
  });
}

// END CLASS UTILIZATION
export function useEndClassUtilization(closeModal, setIsLoading) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: endUtilization,
    onMutate: () => setIsLoading(true),
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utilizations-laboratory"] });
      queryClient.invalidateQueries({ queryKey: ["utilizations-date-range"] });
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      ToastNotification("success", "Class successfully end");
      setIsLoading(false);
      closeModal();
    },
  });
}

// CANCEL CLASS LABORATORY UTILIZATION
export function useCancelLaboratoryUtilization(closeModal, setIsLoading) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelUtilization,
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onMutate: () => setIsLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utilizations-laboratory"] });
      queryClient.invalidateQueries({ queryKey: ["utilizations-date-range"] });
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      ToastNotification("warning", "Class Cancelled");
      setIsLoading(false);
      closeModal();
    },
  });
}
