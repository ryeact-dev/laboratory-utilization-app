import {
  getSubmittedReports,
  submitReport,
  getReportStepStatus,
  updateManyReportsStepStatus,
  getSubmittedWeeklyReports,
  submitManyReports,
  deleteSubmittedReport,
} from "@/api/instructorWeeklyUsage.api";

import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { USER_ONLY_FOR_VIEWING_AND_ACKNOWLEDGE } from "@/globals/initialValues";
import { socket } from "@/lib/helpers/socketIo";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";

// ========= QUERIES ==========

// GET ALL SUBMITTED REPORTS BY USERID AND TERM
export function useGetPaginatedReports({
  page,
  reportCount,
  userRole,
  selectedTermAndSem,
  userRoleStep,
  wasAcknowledged,
  laboratory,
  tab,
}) {
  const forQueryData = {
    userRole,
    selectedTermAndSem,
    page,
    reportCount,
    userRoleStep,
    wasAcknowledged,
    laboratory,
  };
  const isAllowedToFetchReports =
    USER_ONLY_FOR_VIEWING_AND_ACKNOWLEDGE.includes(userRole);

  const query = useQuery({
    queryKey: [
      "list-of-submitted-reports",
      userRole,
      selectedTermAndSem,
      page,
      reportCount,
      userRoleStep,
      wasAcknowledged,
      laboratory,
    ],
    queryFn: () => getSubmittedReports({ forQueryData }),
    select: ({ data }) => {
      return data;
    },
    placeholderData: keepPreviousData,
    enabled: isAllowedToFetchReports,
    // refetchInterval: 3000,
  });

  useEffect(() => {
    // Guard clause - early return if not allowed
    if (!isAllowedToFetchReports) return;

    // Define the event handler separately for cleanup
    const handleUtilizationUpdate = () => {
      query.refetch();
    };

    // Add the event listener
    socket.on("report:subject-weekly-utilizations", handleUtilizationUpdate);

    // Cleanup function
    return () => {
      socket.off("report:subject-weekly-utilizations", handleUtilizationUpdate);
    };
  }, [query, isAllowedToFetchReports, socket]); // Include socket in dependencies

  return query;
}

// GET ALL SUBMITTED REPORTS BY SUBJECTID AND WEEKDATES
export function useGetSubmittedWeeklyReports({ subjectId, weekDates }) {
  const forQueryData = {
    subjectId,
    weekDates,
  };

  return useQuery({
    queryKey: ["single-weekly-report", subjectId, weekDates],
    queryFn: () => getSubmittedWeeklyReports({ forQueryData }),
    select: ({ data }) => {
      return data;
    },
    enabled: !!subjectId && !!weekDates,
  });
}

export function useGetReportStepStatus(subjectId, weekDates) {
  const forQueryData = {
    subjectId,
    weekDates,
  };

  return useQuery({
    queryKey: ["submitted-report-step", subjectId, weekDates],
    queryFn: () => getReportStepStatus({ forQueryData }),
    select: ({ data }) => {
      return data;
    },
    enabled: !!subjectId && !!weekDates,
  });
}

// ========= ADD/UPDATE MUTATIONS =========

// SUBMIT AND UPDATE REPORT
export function useSubmitReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitReport,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["list-of-submitted-reports"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-weekly-report"],
      });
      ToastNotification("success", data);
    },
  });
}

// SUBMIT AND UPDATE REPORT
export function useSubmitManyReports(closeModal) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitManyReports,
    onError: ({ response }) => {
      ToastNotification("error", response.data);
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["list-of-submitted-reports"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-weekly-report"],
      });
      ToastNotification("success", data);
      closeModal();
    },
  });
}

// UPDATE MANY REPORTS
export function useUpdateManyReports(closeModal, setIsLoading) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateManyReportsStepStatus,
    onMutate: () => setIsLoading(true),
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["list-of-submitted-reports"],
      });
      ToastNotification("success", data);
      setIsLoading(false);
      closeModal();
    },
  });
}

// UPDATE MANY REPORTS
export function useDeleteSubmittedReport(closeModal, setIsLoading) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubmittedReport,
    onMutate: () => setIsLoading(true),
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-of-submitted-reports"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-weekly-report"],
      });
      ToastNotification("success", "Report has been deleted successfully");
      setIsLoading(false);
      closeModal();
    },
  });
}
